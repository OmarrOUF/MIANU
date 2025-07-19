import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { FaDownload, FaFilter, FaSync } from 'react-icons/fa';
import LoadingSpinner from '../../UI/LoadingSpinner';
import ErrorAlert from '../../UI/ErrorAlert';
import PreferencesTable from './PreferencesTable';
import PreferencesFilters from './PreferencesFilters';
import CommitteeSummary from './CommitteeSummary';
// Import committees data
import committeesData from '../../../data/committees.json';

const CommitteePreferences = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    committee: 'all',
    priority: 'all',
    delegateType: 'all',
    language: 'all',
    healthConcerns: 'all',
    school: '',
    search: '',
    age: ''
  });
  const [coffeeStains, setCoffeeStains] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  // Generate random coffee stains for newspaper effect
  useEffect(() => {
    generateCoffeeStains();
  }, []);
  
  const generateCoffeeStains = () => {
    const stains = [];
    const stainImages = [
      '/assets/coffee-stain-1.png', 
      '/assets/coffee-stain-2.png',
      '/assets/coffee-stain-3.png',
    ];
    
    // Generate 1-2 random stains
    const numStains = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numStains; i++) {
      stains.push({
        image: stainImages[Math.floor(Math.random() * stainImages.length)],
        position: {
          top: Math.random() * 80 + 10,
          left: Math.random() * 80 + 10,
        },
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.2 + 0.1,
        scale: Math.random() * 0.4 + 0.3,
        zIndex: 0
      });
    }
    
    setCoffeeStains(stains);
  };
  
  // Fetch users and committees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use committees from the JSON file instead of Firestore
        const committeesList = committeesData.committees.map(committee => ({
          ...committee,
          id: committee.id.toString() // Ensure ID is a string for consistent comparison
        }));
        
        console.log('Loaded committees from JSON:', committeesList); // Debug log
        setCommittees(committeesList);
        
        // Fetch users from Firestore
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => {
          const userData = doc.data();
          
          console.log('User data:', userData.displayName, 'Priorities:', userData.committeePriorities); // Debug log
          
          // Process committee preferences to include committee details
          const enhancedPreferences = [];
          
          if (userData.committeePriorities && userData.committeePriorities.length > 0) {
            // Convert each priority to string for comparison if needed
            userData.committeePriorities.forEach((pref, index) => {
              // Handle if pref is an object with binomial, color, etc.
              const prefId = typeof pref === 'object' ? pref.id.toString() : pref.toString();
              
              // Find matching committee
              const committee = committeesList.find(c => {
                const committeeId = c.id.toString();
                return committeeId === prefId;
              });
              
              console.log(`Looking for committee ID: ${prefId}, Found:`, committee); // Debug log
              
              if (committee) {
                enhancedPreferences.push({
                  id: committee.id,
                  name: committee.language === 'fr' ? committee.nameFr : committee.nameEn
                });
              }
            });
          }
          
          return {
            id: doc.id,
            ...userData,
            enhancedPreferences
          };
        });
        
        // Filter to only include delegates
        const delegateUsers = usersList.filter(user => user.role === 'delegate');
        
        console.log('Processed delegate users:', delegateUsers.length); // Debug log
        
        setUsers(delegateUsers);
        setFilteredUsers(delegateUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('admin.errorFetchingData'));
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  // Apply filters when they change
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(user => 
        (user.displayName && user.displayName.toLowerCase().includes(searchTerm)) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(searchTerm)) ||
        (user.schoolName && user.schoolName.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply committee filter
    if (filters.committee !== 'all') {
      result = result.filter(user => {
        if (!user.committeePriorities) return false;
        
        return user.committeePriorities.some(pref => {
          if (typeof pref === 'object' && pref.id) {
            return pref.id.toString() === filters.committee;
          }
          return pref.toString() === filters.committee;
        });
      });
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      const priorityIndex = parseInt(filters.priority);
      result = result.filter(user => {
        if (!user.committeePriorities || user.committeePriorities.length <= priorityIndex) {
          return false;
        }
        return !!user.committeePriorities[priorityIndex];
      });
    }
    
    // Apply delegate type filter
    if (filters.delegateType !== 'all') {
      result = result.filter(user => user.delegateType === filters.delegateType);
    }
    
    // Apply language filter
    if (filters.language !== 'all') {
      result = result.filter(user => user.language === filters.language);
    }
    
    // Apply health concerns filter
    if (filters.healthConcerns !== 'all') {
      if (filters.healthConcerns === 'yes') {
        result = result.filter(user => 
          (user.healthProblems && user.healthProblems.trim() !== '') || 
          (user.allergies && user.allergies.trim() !== '')
        );
      } else {
        result = result.filter(user => 
          (!user.healthProblems || user.healthProblems.trim() === '') && 
          (!user.allergies || user.allergies.trim() === '')
        );
      }
    }
    
    // Apply school filter
    if (filters.school) {
      const schoolTerm = filters.school.toLowerCase();
      result = result.filter(user => 
        user.schoolName && user.schoolName.toLowerCase().includes(schoolTerm)
      );
    }
    
    // Apply age filter
    if (filters.age) {
      result = result.filter(user => 
        user.age && user.age.toString() === filters.age
      );
    }
    
    setFilteredUsers(result);
  }, [filters, users]);
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };
  
  // Export data to CSV
  const exportToCSV = () => {
    // Headers for CSV
    const headers = [
      t('admin.name'),
      t('admin.email'),
      t('admin.phoneNumber'),
      t('admin.age'),
      t('admin.school'),
      t('admin.schoolYear'),
      t('admin.delegateType'),
      t('admin.language'),
      t('admin.firstChoice'),
      t('admin.secondChoice'),
      t('admin.thirdChoice'),
      t('admin.healthProblems'),
      t('admin.allergies')
    ];
    
    // Format user data for CSV
    const csvData = filteredUsers.map(user => {
      // Helper function to get committee name
      const getCommitteeName = (index) => {
        if (!user.committeePriorities || !user.committeePriorities[index]) return '';
        
        const pref = user.committeePriorities[index];
        if (typeof pref === 'object') {
          return pref.nameFr || pref.nameEn || '';
        }
        
        const committee = committees.find(c => c.id.toString() === pref.toString());
        return committee ? (committee.nameFr || committee.nameEn) : '';
      };
      
      return [
        user.displayName || `${user.firstName || ''} ${user.lastName || ''}`,
        user.email || '',
        user.phoneNumber || '',
        user.age || '',
        user.schoolName || '',
        user.schoolYear || '',
        user.delegateType || '',
        user.language === 'fr' ? 'Français' : 'English',
        getCommitteeName(0),
        getCommitteeName(1),
        getCommitteeName(2),
        user.healthProblems || '',
        user.allergies || ''
      ];
    });
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `committee_preferences_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Refresh data
  const refreshData = () => {
    setLoading(true);
    // Re-fetch data by triggering the useEffect
    setUsers([]);
    setCommittees([]);
    setFilteredUsers([]);
  };
  
  // Toggle summary view
  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };
  
  return (
    <div className="relative bg-gray-50 p-6 rounded-lg shadow-sm">
      {/* Coffee stains for newspaper effect */}
      {coffeeStains.map((stain, index) => (
        <div
          key={index}
          className="absolute pointer-events-none"
          style={{
            top: `${stain.position.top}%`,
            left: `${stain.position.left}%`,
            transform: `rotate(${stain.rotation}deg) scale(${stain.scale})`,
            opacity: stain.opacity,
            zIndex: stain.zIndex
          }}
        >
          <img src={stain.image} alt="" className="w-32 h-32" />
        </div>
      ))}
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('admin.committeePreferences')}</h2>
            <p className="text-sm text-gray-600">{t('admin.committeePreferencesDescription')}</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={toggleSummary}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showSummary ? t('admin.showTable') : t('admin.showSummary')}
            </button>
            
            <button
              onClick={refreshData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaSync className="mr-2" />
              {t('admin.refresh')}
            </button>
            
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaDownload className="mr-2" />
              {t('admin.export')}
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">{t('admin.filters')}</h3>
          <PreferencesFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            committees={committees}
          />
        </div>
        
        {/* Loading and error states */}
        {loading && (
          <div className="flex justify-center my-12">
            <LoadingSpinner />
          </div>
        )}
        
        {error && (
          <ErrorAlert message={error} />
        )}
        
        {/* Results */}
        {!loading && !error && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('admin.results')} ({filteredUsers.length})
              </h3>
            </div>
            
            {showSummary ? (
              <CommitteeSummary users={filteredUsers} committees={committees} />
            ) : (
              <PreferencesTable users={filteredUsers} committees={committees} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteePreferences;