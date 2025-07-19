import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { FaMagic, FaSave, FaRandom, FaUserCheck } from 'react-icons/fa';
import LoadingSpinner from '../../UI/LoadingSpinner';

const CommitteeAssignment = ({ users, committees, onAssignmentChange }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  // Auto-assign committees based on preferences
  const autoAssignCommittees = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Create a copy of users to work with
      const usersCopy = [...users];
      
      // Create a map of committee capacities
      const committeeCapacity = {};
      committees.forEach(committee => {
        committeeCapacity[committee.id] = committee.capacity || 20; // Default capacity of 20
      });
      
      // Sort users by those who have paid first
      usersCopy.sort((a, b) => {
        if (a.hasPaid && !b.hasPaid) return -1;
        if (!a.hasPaid && b.hasPaid) return 1;
        return 0;
      });
      
      // First pass: Try to assign first preferences
      usersCopy.forEach(user => {
        if (user.assignedCommittee) return; // Skip already assigned users
        
        const firstChoice = user.enhancedPreferences[0]?.id;
        if (firstChoice && committeeCapacity[firstChoice] > 0) {
          user.assignedCommittee = firstChoice;
          committeeCapacity[firstChoice]--;
        }
      });
      
      // Second pass: Try to assign second preferences
      usersCopy.forEach(user => {
        if (user.assignedCommittee) return; // Skip already assigned users
        
        const secondChoice = user.enhancedPreferences[1]?.id;
        if (secondChoice && committeeCapacity[secondChoice] > 0) {
          user.assignedCommittee = secondChoice;
          committeeCapacity[secondChoice]--;
        }
      });
      
      // Third pass: Try to assign third preferences
      usersCopy.forEach(user => {
        if (user.assignedCommittee) return; // Skip already assigned users
        
        const thirdChoice = user.enhancedPreferences[2]?.id;
        if (thirdChoice && committeeCapacity[thirdChoice] > 0) {
          user.assignedCommittee = thirdChoice;
          committeeCapacity[thirdChoice]--;
        }
      });
      
      // Final pass: Assign any remaining committee with capacity
      usersCopy.forEach(user => {
        if (user.assignedCommittee) return; // Skip already assigned users
        
        // Find any committee with capacity
        for (const [committeeId, capacity] of Object.entries(committeeCapacity)) {
          if (capacity > 0) {
            user.assignedCommittee = committeeId;
            committeeCapacity[committeeId]--;
            break;
          }
        }
      });
      
      // Update the state with new assignments
      onAssignmentChange(usersCopy);
      
      setSuccess(t('admin.autoAssignSuccess'));
    } catch (err) {
      console.error('Error auto-assigning committees:', err);
      setError(t('admin.autoAssignError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Randomly assign committees without considering preferences
  const randomAssignCommittees = () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Create a copy of users to work with
      const usersCopy = [...users];
      
      // Create a map of committee capacities
      const committeeCapacity = {};
      committees.forEach(committee => {
        committeeCapacity[committee.id] = committee.capacity || 20; // Default capacity of 20
      });
      
      // Create an array of committee IDs
      const committeeIds = Object.keys(committeeCapacity).filter(id => committeeCapacity[id] > 0);
      
      // Shuffle the array of users to ensure randomness
      const shuffledUsers = [...usersCopy].sort(() => Math.random() - 0.5);
      
      // Assign committees randomly
      shuffledUsers.forEach(user => {
        if (user.assignedCommittee) return; // Skip already assigned users
        
        // Find a random committee with capacity
        if (committeeIds.length > 0) {
          // Get a random committee
          const randomIndex = Math.floor(Math.random() * committeeIds.length);
          const randomCommitteeId = committeeIds[randomIndex];
          
          user.assignedCommittee = randomCommitteeId;
          committeeCapacity[randomCommitteeId]--;
          
          // If committee is at capacity, remove it from the list
          if (committeeCapacity[randomCommitteeId] <= 0) {
            committeeIds.splice(randomIndex, 1);
          }
        }
      });
      
      // Update the state with new assignments
      onAssignmentChange(usersCopy);
      
      setSuccess(t('admin.randomAssignSuccess'));
    } catch (err) {
      console.error('Error randomly assigning committees:', err);
      setError(t('admin.randomAssignError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Save assignments to Firestore
  const saveAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Use a batch to update all users at once
      const batch = writeBatch(db);
      
      users.forEach(user => {
        if (user.assignedCommittee) {
          const userRef = doc(db, 'users', user.id);
          batch.update(userRef, { assignedCommittee: user.assignedCommittee });
        }
      });
      
      await batch.commit();
      
      setSuccess(t('admin.saveAssignmentsSuccess'));
    } catch (err) {
      console.error('Error saving committee assignments:', err);
      setError(t('admin.saveAssignmentsError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate assignment statistics
  const calculateStats = () => {
    const total = users.length;
    const assigned = users.filter(user => user.assignedCommittee).length;
    const unassigned = total - assigned;
    
    // Calculate preference matches
    const firstChoiceMatches = users.filter(user => 
      user.assignedCommittee && user.enhancedPreferences[0]?.id === user.assignedCommittee
    ).length;
    
    const secondChoiceMatches = users.filter(user => 
      user.assignedCommittee && user.enhancedPreferences[1]?.id === user.assignedCommittee
    ).length;
    
    const thirdChoiceMatches = users.filter(user => 
      user.assignedCommittee && user.enhancedPreferences[2]?.id === user.assignedCommittee
    ).length;
    
    const noPreferenceMatches = assigned - firstChoiceMatches - secondChoiceMatches - thirdChoiceMatches;
    
    // Calculate delegate types
    const nationalDelegates = users.filter(user => user.delegateType === 'national').length;
    const internationalDelegates = users.filter(user => user.delegateType === 'international').length;
    
    // Calculate language preferences
    const frenchSpeakers = users.filter(user => user.language === 'fr').length;
    const englishSpeakers = users.filter(user => user.language === 'en').length;
    
    return {
      total,
      assigned,
      unassigned,
      firstChoiceMatches,
      secondChoiceMatches,
      thirdChoiceMatches,
      noPreferenceMatches,
      firstChoicePercent: total > 0 ? Math.round((firstChoiceMatches / total) * 100) : 0,
      secondChoicePercent: total > 0 ? Math.round((secondChoiceMatches / total) * 100) : 0,
      thirdChoicePercent: total > 0 ? Math.round((thirdChoiceMatches / total) * 100) : 0,
      noPreferencePercent: total > 0 ? Math.round((noPreferenceMatches / total) * 100) : 0,
      assignedPercent: total > 0 ? Math.round((assigned / total) * 100) : 0,
      nationalDelegates,
      internationalDelegates,
      frenchSpeakers,
      englishSpeakers
    };
  };
  
  const stats = calculateStats();
  
  // Handle user selection for detailed view
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };
  
  // Close user details modal
  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };
  
  // Render user details modal
  const renderUserDetailsModal = () => {
    if (!selectedUser || !showUserDetails) return null;
    
    const getCommitteeName = (committeeId) => {
      const committee = committees.find(c => c.id === committeeId);
      return committee ? committee.name : t('admin.unknownCommittee');
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUser.displayName || `${selectedUser.firstName} ${selectedUser.lastName}`}
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
                <h4 className="font-medium text-gray-700 mb-2">{t('admin.personalInfo')}</h4>
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
                <h4 className="font-medium text-gray-700 mb-2">{t('admin.schoolInfo')}</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.schoolName')}:</span>
                    <p className="text-sm">{selectedUser.schoolName || t('admin.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('admin.schoolYear')}:</span>
                    <p className="text-sm">{selectedUser.schoolYear || t('admin.notProvided')}</p>
                  </div>
                  {selectedUser.delegateType === 'international' && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">{t('admin.country')}:</span>
                      <p className="text-sm">{selectedUser.country || t('admin.notProvided')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{t('admin.healthInfo')}</h4>
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
              <h4 className="font-medium text-gray-700 mb-2">{t('admin.committeePreferences')}</h4>
              <div className="space-y-2">
                {selectedUser.enhancedPreferences && selectedUser.enhancedPreferences.length > 0 ? (
                  selectedUser.enhancedPreferences.map((pref, index) => (
                    <div key={index}>
                      <span className="text-sm font-medium text-gray-500">
                        {t(`admin.priority${index + 1}`)}:
                      </span>
                      <p className="text-sm">{pref.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">{t('admin.noPreferencesSelected')}</p>
                )}
                
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-500">{t('admin.assignedCommittee')}:</span>
                  {selectedUser.assignedCommittee ? (
                    <p className="text-sm font-medium text-green-600">
                      {getCommitteeName(selectedUser.assignedCommittee)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">{t('admin.notAssignedYet')}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t('admin.registeredOn')}: {selectedUser.createdAt?.toDate().toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  {t('admin.lastLogin')}: {selectedUser.lastLoginAt?.toDate().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {t('admin.committeeAssignmentTool')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">{t('admin.assignmentStats')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.totalDelegates')}:</span>
              <span className="text-sm font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.assignedDelegates')}:</span>
              <span className="text-sm font-medium">{stats.assigned} ({stats.assignedPercent}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.unassignedDelegates')}:</span>
              <span className="text-sm font-medium">{stats.unassigned}</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.firstChoiceMatches')}:</span>
              <span className="text-sm font-medium text-green-600">{stats.firstChoiceMatches} ({stats.firstChoicePercent}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.secondChoiceMatches')}:</span>
              <span className="text-sm font-medium text-blue-600">{stats.secondChoiceMatches} ({stats.secondChoicePercent}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.thirdChoiceMatches')}:</span>
              <span className="text-sm font-medium text-yellow-600">{stats.thirdChoiceMatches} ({stats.thirdChoicePercent}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.noPreferenceMatches')}:</span>
              <span className="text-sm font-medium text-red-600">{stats.noPreferenceMatches} ({stats.noPreferencePercent}%)</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.nationalDelegates')}:</span>
              <span className="text-sm font-medium">{stats.nationalDelegates}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.internationalDelegates')}:</span>
              <span className="text-sm font-medium">{stats.internationalDelegates}</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.frenchSpeakers')}:</span>
              <span className="text-sm font-medium">{stats.frenchSpeakers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('admin.englishSpeakers')}:</span>
              <span className="text-sm font-medium">{stats.englishSpeakers}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">{t('admin.assignmentActions')}</h4>
          <div className="space-y-3">
            <button
              onClick={autoAssignCommittees}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <FaMagic className="mr-2" />
              {t('admin.autoAssign')}
            </button>
            
            <button
              onClick={randomAssignCommittees}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <FaRandom className="mr-2" />
              {t('admin.randomAssign')}
            </button>
            
            <button
              onClick={saveAssignments}
              disabled={loading || stats.assigned === 0}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {t('admin.saveAssignments')}
            </button>
            
            {loading && (
              <div className="text-center">
                <LoadingSpinner size="small" />
              </div>
            )}
            
            {error && (
              <div className="text-sm text-red-600 mt-2">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-sm text-green-600 mt-2">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium text-gray-800 mb-2">{t('admin.delegateDetails')}</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.name')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.school')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.delegateType')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.language')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.firstChoice')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.displayName || `${user.firstName} ${user.lastName}`}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.schoolName || t('admin.notProvided')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.delegateType === 'international' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.delegateType === 'international' 
                        ? t('admin.international') 
                        : t('admin.national')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.language === 'fr' ? 'Français' : 'English'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {user.enhancedPreferences && user.enhancedPreferences[0]
                      ? user.enhancedPreferences[0].name
                      : t('admin.noPreference')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <FaUserCheck className="mr-1" />
                      {t('admin.viewDetails')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 italic mt-4">
        {t('admin.assignmentNote')}
      </div>
      
      {/* User details modal */}
      {renderUserDetailsModal()}
    </div>
  );
};

export default CommitteeAssignment;