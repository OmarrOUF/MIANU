import { getAuth } from 'firebase/auth';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * Delete a user account from Firebase Authentication
 * Note: This is a client-side approach with limitations.
 * In a production environment, you should use Firebase Admin SDK via Cloud Functions.
 * 
 * @param {string} userId - The user ID to delete
 * @returns {Promise<void>}
 */
export const deleteUserAccount = async (userId) => {
  try {
    // First, check if we have Cloud Functions available
    try {
      const functions = getFunctions();
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      await deleteUserFunction({ userId });
      return;
    } catch (functionError) {
      console.log('Cloud function not available, falling back to client-side deletion');
      // If Cloud Functions aren't set up, fall back to client-side approach
    }
    
    // Client-side fallback (limited to current user only)
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    // Get the user document to check if it matches the current user
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    
    if (currentUser && userData && userData.email === currentUser.email) {
      // Can only delete the current user from client-side
      await currentUser.delete();
    } else {
      throw new Error('Cannot delete other users from client-side. Use Firebase Admin SDK.');
    }
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    throw error;
  }
};