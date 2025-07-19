import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaCheck, FaExclamationTriangle, FaStar } from 'react-icons/fa';

const CommitteeSummary = ({ users, committees }) => {
  const { t } = useTranslation();
  
  // Calculate committee statistics
  const calculateCommitteeStats = () => {
    const stats = committees.map(committee => {
      // Count first, second, and third preferences for this committee
      const firstPreferences = users.filter(user => 
        user.enhancedPreferences[0]?.id === committee.id
      ).length;
      
      const secondPreferences = users.filter(user => 
        user.enhancedPreferences[1]?.id === committee.id
      ).length;
      
      const thirdPreferences = users.filter(user => 
        user.enhancedPreferences[2]?.id === committee.id
      ).length;
      
      // Count assigned users
      const assignedUsers = users.filter(user => 
        user.assignedCommittee === committee.id
      ).length;
      
      // Calculate capacity and remaining spots
      const capacity = committee.capacity || 20; // Default capacity
      const remaining = capacity - assignedUsers;
      
      // Calculate popularity score (weighted sum of preferences)
      const popularityScore = (firstPreferences * 3) + (secondPreferences * 2) + thirdPreferences;
      
      // Count language preferences for this committee
      const frenchSpeakers = users.filter(user => 
        user.language === 'fr' && 
        (user.enhancedPreferences[0]?.id === committee.id || 
         user.enhancedPreferences[1]?.id === committee.id || 
         user.enhancedPreferences[2]?.id === committee.id)
      ).length;
      
      const englishSpeakers = users.filter(user => 
        user.language === 'en' && 
        (user.enhancedPreferences[0]?.id === committee.id || 
         user.enhancedPreferences[1]?.id === committee.id || 
         user.enhancedPreferences[2]?.id === committee.id)
      ).length;
      
      // Check if committee language matches user preferences
      const languageMatch = committee.language === 'fr' ? frenchSpeakers : englishSpeakers;
      const languageMismatch = committee.language === 'fr' ? englishSpeakers : frenchSpeakers;
      
      return {
        id: committee.id,
        name: committee.nameFr || committee.nameEn,
        language: committee.language,
        firstPreferences,
        secondPreferences,
        thirdPreferences,
        totalPreferences: firstPreferences + secondPreferences + thirdPreferences,
        assignedUsers,
        capacity,
        remaining,
        popularityScore,
        fillPercentage: Math.round((assignedUsers / capacity) * 100),
      };
    });
    
    // Sort by popularity score (descending)
    return stats.sort((a, b) => b.popularityScore - a.popularityScore);
  };
  
  const committeeStats = calculateCommitteeStats();
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {t('admin.committeeSummary')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {committeeStats.map(committee => (
          <div 
            key={committee.id} 
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <h4 className="font-medium text-gray-800 mb-2 truncate">{committee.name}</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.capacity')}:</span>
                <span className="text-sm font-medium">{committee.capacity}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.assigned')}:</span>
                <span className="text-sm font-medium">{committee.assignedUsers}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.remaining')}:</span>
                <span className={`text-sm font-medium ${
                  committee.remaining <= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {committee.remaining}
                </span>
              </div>
              
              {/* Progress bar for capacity */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    committee.fillPercentage >= 100 ? 'bg-red-600' :
                    committee.fillPercentage >= 80 ? 'bg-yellow-500' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(committee.fillPercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.language')}:</span>
                <span className="text-sm font-medium">
                  {committee.language === 'fr' ? 'Français' : 'English'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.popularity')}:</span>
                <div className="flex items-center">
                  {Array.from({ length: Math.min(Math.ceil(committee.popularityScore / 10), 5) }).map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="mt-2 flex items-center">
                {committee.remaining <= 0 ? (
                  <div className="flex items-center text-red-600 text-sm">
                    <FaExclamationTriangle className="mr-1" />
                    {t('admin.committeeAtCapacity')}
                  </div>
                ) : committee.assignedUsers === 0 ? (
                  <div className="flex items-center text-yellow-600 text-sm">
                    <FaUsers className="mr-1" />
                    {t('admin.committeeEmpty')}
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 text-sm">
                    <FaCheck className="mr-1" />
                    {t('admin.committeeHasSpace')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-2">{t('admin.preparationNotes')}</h4>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>{t('admin.prepareCommitteeMaterials')}</li>
            <li>{t('admin.ensureLanguageSupport')}</li>
            <li>{t('admin.checkSpecialRequirements')}</li>
            <li>{t('admin.prepareNameTags')}</li>
            <li>{t('admin.organizeSeatingArrangements')}</li>
            <li>{t('admin.reviewHealthConcerns')}</li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>{t('admin.tip')}:</strong> {t('admin.committeeTip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeSummary;