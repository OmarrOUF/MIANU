import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes, FaStar, FaUserCircle, FaSchool, FaPhone, FaEnvelope, FaLanguage, FaAllergies, FaMedkit } from 'react-icons/fa';

const PreferencesTable = ({ users, committees }) => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const getCommitteeName = (committeeId) => {
    const committee = committees.find(c => c.id === committeeId || c.id === String(committeeId));
    return committee ? (committee.nameFr || committee.nameEn) : t('admin.unknownCommittee');
  };

  // Helper function to get committee name from committee object or ID
  const getCommitteeDisplayName = (committee) => {
    if (!committee) return '-';
    
    // If committee is an object with nameEn/nameFr properties
    if (typeof committee === 'object' && (committee.nameFr || committee.nameEn)) {
      return committee.nameFr || committee.nameEn;
    }
    
    // If committee is an object with id property
    if (typeof committee === 'object' && committee.id) {
      return getCommitteeName(committee.id);
    }
    
    // If committee is a direct ID
    return getCommitteeName(committee);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  // Helper function to safely format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return t('admin.notProvided');
    
    // Check if timestamp is a Firestore Timestamp object
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Check if timestamp is a JavaScript Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    
    // Check if timestamp is a number (seconds or milliseconds)
    if (typeof timestamp === 'number') {
      return new Date(timestamp * (timestamp < 10000000000 ? 1000 : 1)).toLocaleDateString();
    }
    
    // If it's a string that represents a date
    if (typeof timestamp === 'string') {
      try {
        return new Date(timestamp).toLocaleDateString();
      } catch (e) {
        return timestamp;
      }
    }
    
    // If all else fails, return the original value or a fallback
    return String(timestamp);
  };

  const renderUserDetailsModal = () => {
    if (!selectedUser || !showUserDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mt-32">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUser.displayName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`}
              </h3>
              <button 
                onClick={closeUserDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FaUserCircle className="mr-2" />
                  {t('admin.personalInfo')}
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.email')}:</span>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.phoneNumber')}:</span>
                    <p className="text-sm">{selectedUser.phoneNumber || t('admin.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.age')}:</span>
                    <p className="text-sm">{selectedUser.age || t('admin.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.delegateType')}:</span>
                    <p className="text-sm capitalize">{selectedUser.delegateType || t('admin.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.language')}:</span>
                    <p className="text-sm">{selectedUser.language === 'fr' ? 'Français' : 'English'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FaSchool className="mr-2" />
                  {t('admin.schoolInfo')}
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.schoolName')}:</span>
                    <p className="text-sm">{selectedUser.schoolName || t('admin.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.schoolYear')}:</span>
                    <p className="text-sm">{selectedUser.schoolYear || t('admin.notProvided')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaMedkit className="mr-2" />
                {t('admin.healthInfo')}
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">{t('admin.healthProblems')}:</span>
                  <p className="text-sm">{selectedUser.healthProblems || t('admin.none')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">{t('admin.allergies')}:</span>
                  <p className="text-sm">{selectedUser.allergies || t('admin.none')}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaLanguage className="mr-2" />
                {t('admin.committeePreferences')}
              </h4>
              <div className="space-y-2">
                {selectedUser.committeePriorities && selectedUser.committeePriorities.length > 0 ? (
                  selectedUser.committeePriorities.map((pref, index) => (
                    <div key={index}>
                      <span className="text-sm font-medium text-gray-500">
                        {t(`admin.priority${index + 1}`)}:
                      </span>
                      <p className="text-sm">
                        {typeof pref === 'object' ? 
                          (pref.nameFr || pref.nameEn || getCommitteeName(pref.id)) : 
                          getCommitteeName(pref)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">{t('admin.noPreferencesSelected')}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t('admin.registeredOn')}: {formatDate(selectedUser.createdAt)}
                </span>
                <span className="text-sm text-gray-500">
                  {t('admin.lastLogin')}: {formatDate(selectedUser.lastLoginAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.delegate')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.school')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.firstChoice')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.secondChoice')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.thirdChoice')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.healthNotes')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            // Check if user has health concerns or allergies
            const hasHealthConcerns = user.healthProblems || user.allergies;
            
            return (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaEnvelope className="mr-1" size={10} />
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaPhone className="mr-1" size={10} />
                        {user.phoneNumber || t('admin.noPhone')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    {user.schoolName || t('admin.notProvided')}
                    {user.schoolYear && (
                      <div className="text-xs text-gray-400">{user.schoolYear}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.committeePriorities && user.committeePriorities[0] ? 
                    getCommitteeDisplayName(user.committeePriorities[0]) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.committeePriorities && user.committeePriorities[1] ? 
                    getCommitteeDisplayName(user.committeePriorities[1]) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.committeePriorities && user.committeePriorities[2] ? 
                    getCommitteeDisplayName(user.committeePriorities[2]) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {hasHealthConcerns ? (
                    <div className="flex items-center text-amber-600">
                      <FaAllergies className="mr-1" />
                      {t('admin.hasHealthConcerns')}
                    </div>
                  ) : (
                    <span className="text-green-600">
                      {t('admin.noHealthConcerns')}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* User details modal */}
      {renderUserDetailsModal()}
    </div>
  );
};

export default PreferencesTable;