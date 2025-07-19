import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signUpUser } from '../firebase/config';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import logService from '../firebase/logService';

export const AuthContext = createContext();

// Add the useAuth hook directly in the AuthContext file
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Modified signup function to use the updated signUpUser from config.js
  async function signup(email, password, displayName, additionalData) {
    try {
      // Validate that phone number exists
      if (!additionalData.phoneNumber) {
        throw new Error('Phone number is required');
      }
      
      // Ensure committee priorities are included only if the role is not advisor
      if (additionalData.role !== 'advisor' && 
          (!additionalData.committeePriorities || additionalData.committeePriorities.length === 0)) {
        throw new Error('Committee priorities are required');
      }
  
      // Pass the new fields to signUpUser
      const userCredential = await signUpUser(email, password, displayName, additionalData);
      
      // Set the current user and user data after successful signup
      setCurrentUser(userCredential.user);
      
      // Create a user data object from the additional data
      const newUserData = {
        ...additionalData,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        uid: userCredential.user.uid // Ensure UID is included for admin operations
      };
      
      // Set the user data in state
      setUserData(newUserData);
      
      // Log the signup action
      await logService.logAction(
        'user_signup',
        'authentication',
        { 
          userEmail: email,
          role: additionalData.role,
          delegateType: additionalData.delegateType
        },
        userCredential.user.uid
      );
      
      return userCredential.user;
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data immediately after login
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Set userData immediately
        setUserData(userDoc.data());
      }
      
      // Update last login timestamp
      await setDoc(doc(db, "users", userCredential.user.uid), {
        lastLoginAt: new Date().toISOString()
      }, { merge: true });
      
      // Log the login action
      await logService.logAction(
        'user_login',
        'authentication',
        { 
          userEmail: email,
          method: 'email_password'
        },
        userCredential.user.uid
      );
      
      toast.success(t('auth.loginSuccess'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      return userCredential;
    } catch (error) {
      // Log the failed login attempt
      await logService.logAction(
        'login_failed',
        'authentication',
        { 
          userEmail: email,
          errorCode: error.code,
          errorMessage: error.message
        },
        'system'
      );
      
      let errorMessage = t('auth.loginError');
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.userNotFound');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('auth.wrongPassword');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('auth.invalidEmail');
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = t('auth.tooManyRequests');
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = t('auth.userDisabled');
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      throw error;
    }
  }

  async function logout() {
    try {
      // Get the current user ID before logging out
      const userId = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email;
      
      await firebaseSignOut(auth);
      
      // Log the logout action
      if (userId) {
        await logService.logAction(
          'user_logout',
          'authentication',
          { userEmail },
          userId
        );
      }
      
      toast.success(t('auth.logoutSuccess'), {
        // Toast configuration...
      });
    } catch (error) {
      // Log the error
      await logService.logAction(
        'logout_error',
        'authentication',
        { 
          errorCode: error.code,
          errorMessage: error.message 
        },
        auth.currentUser?.uid || 'system'
      );
      
      toast.error(t('auth.logoutError'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      throw error;
    }
  }

  function resetPassword(email) {
    try {
      const result = sendPasswordResetEmail(auth, email);
      toast.success(t('auth.resetPasswordSuccess'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return result;
    } catch (error) {
      let errorMessage = t('auth.resetPasswordError');
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.userNotFound');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('auth.invalidEmail');
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      throw error;
    }
  }

  // Add this function to ensure user document exists
  async function ensureUserDocument(firebaseUser) {
    if (!firebaseUser) return null;
    
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const docSnapshot = await getDoc(userDocRef);
    
    if (docSnapshot.exists()) {
      // If the document exists but has old fields, update it
      const userData = docSnapshot.data();
      
      // Check if we need to migrate from old fields to new combined field
      if ((userData.healthProblems !== undefined || userData.allergies !== undefined) && 
          userData.healthConcerns === undefined) {
        
        const healthConcerns = [
          userData.healthProblems ? `Health issues: ${userData.healthProblems}` : '',
          userData.allergies ? `Allergies: ${userData.allergies}` : ''
        ].filter(Boolean).join('\n');
        
        await updateDoc(userDocRef, {
          healthConcerns: healthConcerns || '',
          // Don't delete old fields yet for backward compatibility
        });
      }
      
      // Update userData state
      setUserData(userData);
      return docSnapshot;
    } else {
      // Document doesn't exist, create it with basic info
      const userData = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      };
      
      await setDoc(userDocRef, userData);
      setUserData(userData);
      
      // Get the updated document
      return await getDoc(userDocRef);
    }
  }

  // Add this useEffect to the AuthProvider component
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        try {
          // Ensure the user document exists and set userData
          await ensureUserDocument(user);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error in auth state change:", error);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      
      setLoading(false);
      setInitialLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    signup,
    logout,
    resetPassword,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
}