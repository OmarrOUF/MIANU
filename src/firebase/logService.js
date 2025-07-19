import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, where } from 'firebase/firestore';
import { db } from './config';

/**
 * Service for logging actions to Firebase
 */
const logService = {
  /**
   * Log an action to Firestore
   * @param {string} action - The action performed
   * @param {string} module - The module where the action occurred
   * @param {object} details - Additional details about the action
   * @param {string} userId - The ID of the user who performed the action
   * @returns {Promise<object>} - The created log document reference
   */
  async logAction(action, module, details, userId) {
    try {
      const logData = {
        action,
        module,
        details,
        userId,
        userEmail: details.userEmail || 'system',
        timestamp: Timestamp.now(),
        ip: details.ip || 'unknown'
      };
      
      const docRef = await addDoc(collection(db, "system_logs"), logData);
      return docRef;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get logs with optional filtering
   * @param {object} options - Query options
   * @param {number} options.limit - Maximum number of logs to retrieve
   * @param {string} options.module - Filter by module
   * @param {string} options.userId - Filter by user ID
   * @param {Date} options.startDate - Filter by start date
   * @param {Date} options.endDate - Filter by end date
   * @returns {Promise<Array>} - Array of log documents
   */
  async getLogs(options = {}) {
    try {
      const logsRef = collection(db, "system_logs");
      let q = query(logsRef, orderBy("timestamp", "desc"));
      
      // Apply filters if provided
      if (options.module) {
        q = query(q, where("module", "==", options.module));
      }
      
      if (options.userId) {
        q = query(q, where("userId", "==", options.userId));
      }
      
      if (options.startDate) {
        const startTimestamp = Timestamp.fromDate(options.startDate);
        q = query(q, where("timestamp", ">=", startTimestamp));
      }
      
      if (options.endDate) {
        const endTimestamp = Timestamp.fromDate(options.endDate);
        q = query(q, where("timestamp", "<=", endTimestamp));
      }
      
      // Apply limit if provided
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      
      const querySnapshot = await getDocs(q);
      const logs = [];
      
      querySnapshot.forEach((doc) => {
        logs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return logs;
    } catch (error) {
      throw error;
    }
  }
};

export default logService;