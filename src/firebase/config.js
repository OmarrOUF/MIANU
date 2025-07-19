import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  enableIndexedDbPersistence,
  serverTimestamp
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore using getFirestore instead of initializeFirestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);
auth.useDeviceLanguage(); // Set auth language to match browser

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Storage
const storage = getStorage(app);

// Configure persistence - wrapped in try/catch to prevent errors
const enablePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log("Firestore persistence enabled");
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence is not available in this browser');
    } else {
      console.error("Persistence error:", err);
    }
  }
};

// Only try to enable persistence in production to avoid development issues
if (import.meta.env.PROD) {
  enablePersistence().catch(console.error);
}

// Updated function to sign up users with additional fields and passport image
export const signUpUser = async (email, password, displayName, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Prepare user data for Firestore
    const userData = {
      email,
      displayName,
      role: additionalData.role || 'delegate', // Default to delegate if role is not provided
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      ...additionalData, // Include all additional data fields
    };

    // Create user document in Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userDocRef, userData);

    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Function to fetch a user role from Firestore
export const fetchUserRole = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.role;
    } else {
      console.warn('User document not found for ID:', userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

// Function to update a user's role in Firestore
export const updateUserRole = async (userId, role) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, { role });
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Helper function to log events
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

export { db, auth, analytics, storage };