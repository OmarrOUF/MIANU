import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaUserShield, 
  FaUserTie, 
  FaUser, 
  FaCheck, 
  FaTimes, 
  FaEdit, 
  FaTrash,
  FaUserCog
} from 'react-icons/fa';
import UserRoleModal from './UserRoleModal';
import UserDeleteModal from './UserDeleteModal';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const UsersList = ({ users, updateUser, removeUser }) => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Toggle user payment status
  const togglePaymentStatus = async (user) => {
    try {
      const userRef = doc(db, 'users', user.id);
      const newStatus = !user.hasPaid;
      
      await updateDoc(userRef, {
        hasPaid: newStatus
      });
      
      // Update local state
      updateUser({ ...user, hasPaid: newStatus });
    } catch (err) {
      console.error('Error updating payment status:', err);
      // You could add toast notification here
    }
  };
  
  // Open role change modal
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };
  
  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  // Get role icon based on user role
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-red-600" />;
      case 'organizer':
        return <FaUserTie className="text-blue-600" />;
      case 'delegate':
        return <FaUserCog className="text-green-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'organizer':
        return 'bg-blue-100 text-blue-800';
      case 'delegate':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t('admin.user')}
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t('admin.email')}
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t('admin.role')}
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t('admin.paymentStatus')}
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">
                  {t('admin.noUsersFound')}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.photoURL ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.photoURL}
                            alt={user.displayName || user.email}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                            {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.displayName || t('admin.noName')}
                        </div>
                        <div className="text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('admin.unknown')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{user.role || t('admin.defaultRole')}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => togglePaymentStatus(user)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.hasPaid 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {user.hasPaid ? (
                        <>
                          <FaCheck className="mr-1" />
                          {t('admin.paid')}
                        </>
                      ) : (
                        <>
                          <FaTimes className="mr-1" />
                          {t('admin.unpaid')}
                        </>
                      )}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openRoleModal(user)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaEdit className="mr-1" />
                        {t('admin.changeRole')}
                      </button>
                      
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={user.role === 'admin'} // Prevent deleting admins
                      >
                        <FaTrash className="mr-1" />
                        {t('admin.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Role Change Modal */}
      {isRoleModalOpen && selectedUser && (
        <UserRoleModal
          user={selectedUser}
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onRoleChange={(updatedUser) => {
            updateUser(updatedUser);
            setIsRoleModalOpen(false);
          }}
        />
      )}
      
      {/* Delete User Modal */}
      {isDeleteModalOpen && selectedUser && (
        <UserDeleteModal
          user={selectedUser}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={(userId) => {
            removeUser(userId);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default UsersList;