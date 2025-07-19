import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserCog } from 'react-icons/fa';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import Modal from '../../UI/Modal';

const UserRoleModal = ({ user, isOpen, onClose, onRoleChange }) => {
  const { t } = useTranslation();
  const [newRole, setNewRole] = useState(user.role || 'delegate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(true);
  
  // Fetch available roles from Firestore
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setFetchingRoles(true);
        console.log("Attempting to fetch roles from Firestore...");
        
        // This is the correct path based on your Firestore structure
        const configRef = doc(db, 'config', 'roles');
        const configDoc = await getDoc(configRef);
        
        console.log("Roles document exists:", configDoc.exists());
        if (configDoc.exists()) {
          console.log("Roles document data:", configDoc.data());
          
          if (configDoc.data().roles) {
            console.log("Found roles array:", configDoc.data().roles);
            setAvailableRoles(configDoc.data().roles);
          } else {
            console.warn("Roles array not found in document, using fallback");
            setAvailableRoles(['delegate', 'president', 'admin']);
          }
        } else {
          console.warn("Roles document not found, using fallback");
          setAvailableRoles(['delegate', 'president', 'admin']);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        console.error("Error details:", err.code, err.message);
        // Fallback to default roles on error
        setAvailableRoles(['delegate', 'president', 'admin']);
      } finally {
        setFetchingRoles(false);
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);
  
  // Rest of the component remains the same
  const handleRoleChange = async () => {
    if (newRole === user.role) {
      onClose();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { role: newRole });
      
      // Return updated user object
      onRoleChange({ ...user, role: newRole });
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(t('admin.roleUpdateError'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('admin.changeUserRole')}
      icon={<FaUserCog className="h-6 w-6 text-blue-600" />}
      confirmText={t('admin.confirm')}
      cancelText={t('admin.cancel')}
      onConfirm={handleRoleChange}
      loading={loading}
      error={error}
    >
      <p className="text-sm text-gray-500 mb-4">
        {t('admin.changeRoleDescription', { user: user.displayName || user.email })}
      </p>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          {t('admin.selectRole')}
        </label>
        <select
          id="role"
          name="role"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          disabled={fetchingRoles}
        >
          {fetchingRoles ? (
            <option value="">{t('admin.loading')}</option>
          ) : (
            availableRoles.map(role => (
              <option key={role} value={role}>
                {t(`admin.role${role.charAt(0).toUpperCase() + role.slice(1)}`, { defaultValue: role })}
              </option>
            ))
          )}
        </select>
      </div>
    </Modal>
  );
};

export default UserRoleModal;