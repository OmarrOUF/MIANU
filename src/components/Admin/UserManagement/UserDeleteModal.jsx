import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle } from 'react-icons/fa';
import { doc, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser as deleteAuthUser } from 'firebase/auth';
import { db } from '../../../firebase/config';
import { deleteUserAccount } from '../../../firebase/adminUtils';
import Modal from '../../UI/Modal';

const UserDeleteModal = ({ user, isOpen, onClose, onDelete }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete user from Firestore
      await deleteDoc(doc(db, 'users', user.id));
      
      // Try to delete from Authentication
      // Note: This is a simplified approach. In a real app, you'd use Firebase Admin SDK
      // through a secure server-side function
      try {
        await deleteUserAccount(user.id);
      } catch (authError) {
        console.error('Error deleting auth user:', authError);
        // Continue with the process even if auth deletion fails
      }
      
      onDelete(user.id);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(t('admin.deleteUserError'));
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('admin.deleteUser')}
      icon={<FaExclamationTriangle className="h-6 w-6 text-red-600" />}
      confirmText={t('admin.delete')}
      cancelText={t('admin.cancel')}
      onConfirm={handleDeleteUser}
      loading={loading}
      error={error}
      confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
    >
      <p className="text-sm text-gray-500 mb-2">
        {t('admin.deleteUserWarning', { user: user.displayName || user.email })}
      </p>
      <p className="text-sm text-red-500 mt-2 font-bold">
        {t('admin.deleteUserConfirmation')}
      </p>
    </Modal>
  );
};

export default UserDeleteModal;