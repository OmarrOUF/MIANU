import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { getAuth } from 'firebase/auth';
import { httpsCallable, getFunctions } from 'firebase/functions';

/**
 * Deletes a user from both Firebase Authentication and Firestore
 * @param {string} userId - The ID of the user to delete
 * @returns {Promise<void>}
 */
export const deleteUserCompletely = async (userId) => {
  try {
    // 1. Delete user document from Firestore
    await deleteDoc(doc(db, 'users', userId));
    
    // 2. Delete user from Authentication (requires Cloud Functions)
    // Since client-side code can only delete the currently signed-in user,
    // we need to use a Cloud Function to delete other users
    const functions = getFunctions();
    const deleteUserAuth = httpsCallable(functions, 'deleteUser');
    await deleteUserAuth({ uid: userId });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete user'
    };
  }
};

/**
 * Deletes the currently signed-in user (can only be used for self-deletion)
 * @returns {Promise<void>}
 */
export const deleteSelfUser = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is signed in');
    }
    
    // 1. Delete user document from Firestore
    await deleteDoc(doc(db, 'users', user.uid));
    
    // 2. Delete user from Authentication
    await deleteUser(user);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting self:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete user'
    };
  }
};