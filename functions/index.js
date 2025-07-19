const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud Function to delete a user from Firebase Authentication
exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an authenticated admin user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }
  
  try {
    // Get the caller's user data from Firestore
    const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admin users can delete other users.'
      );
    }
    
    // Get the user ID to delete
    const uid = data.uid;
    if (!uid) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a valid user ID.'
      );
    }
    
    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);
    
    // Log the deletion
    await admin.firestore().collection('logs').add({
      action: 'user_deleted',
      module: 'user_management',
      details: {
        deletedUserId: uid,
        deletedBy: context.auth.uid
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to delete user'
    );
  }
});