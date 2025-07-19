import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
// Import the Spinner component
import Spinner from '../Spinner'; // Adjust the path if necessary

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, userData, loading } = useAuth();
  const [coffeeStains, setCoffeeStains] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    generateCoffeeStains();
    
    // Add a check to set local loading state based on userData
    if (userData) {
      setLocalLoading(false);
    }
  }, [userData]);

  const generateCoffeeStains = () => {
    const stains = [];
    const stainImages = [
      '/assets/coffee-stain-1.png', 
      '/assets/coffee-stain-2.png',
      '/assets/coffee-stain-3.png',
    ];
    const numStains = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numStains; i++) {
      stains.push({
        image: stainImages[Math.floor(Math.random() * stainImages.length)],
        position: {
          top: Math.random() * 80 + 10,
          left: Math.random() * 80 + 10,
        },
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.3 + 0.1,
        scale: Math.random() * 0.5 + 0.5,
        zIndex: Math.floor(Math.random() * 2)
      });
    }
    setCoffeeStains(stains);
  };

  const renderCoffeeStains = () => {
    return coffeeStains.map((stain, index) => (
      <div 
        key={`stain-${index}`}
        className={`
          absolute pointer-events-none mix-blend-multiply
          ${stain.zIndex === 0 ? 'z-0' : 'z-10'}
          ${stain.opacity <= 0.15 ? 'opacity-10' : stain.opacity <= 0.25 ? 'opacity-20' : 'opacity-30'}
        `}
        style={{
          top: `${stain.position.top}%`,
          left: `${stain.position.left}%`,
          transform: `rotate(${stain.rotation}deg) scale(${stain.scale})`,
        }}
      >
        <img 
          src={stain.image} 
          alt="" 
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
        />
      </div>
    ));
  };

  // Helper function to safely format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return t('auth.notAvailable');
    
    try {
      // Handle both Firestore timestamps and ISO strings
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      } else if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString();
      }
      return t('auth.notAvailable');
    } catch (error) {
      console.log('Error formatting date:', error);
      return t('auth.notAvailable');
    }
  };

  // Helper function to calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return t('auth.notAvailable');
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if the current month is before the birth month or it's the birth month but the day hasn't passed
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading || localLoading || !userData) {
    return <Spinner />;
  }

  // Add a safety check to ensure userData exists
  if (!userData) {
    return (
      <div className="text-center py-10">
        <p>{t('auth.noUserData')}</p>
      </div>
    );
  }

  return (
    <section className="py-6 xs:py-10 relative overflow-hidden font-serif">
      <div className="max-w-6xl mx-auto relative">
        <div 
          className="p-4 xs:p-8 bg-[#f6f4f0] shadow-lg border border-gray-300 relative font-serif"
          style={{ 
            boxShadow: '0 5px 15px rgba(0,0,0,0.15)'
          }}
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
               style={{ 
                 backgroundImage: "url('/paper-texture.jpg')",
                 backgroundRepeat: 'repeat',
                 backgroundSize: '500px'
               }}>
          </div>
          
          {/* Coffee stains */}
          {renderCoffeeStains()}

          {/* Header */}
          <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-6 xs:mb-8 relative">
            <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">
              {t('auth.dashboard')}
            </h1>
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <h2 className="font-playfair text-2xl xs:text-3xl font-black mb-6 border-b-2 border-gray-900 pb-2">
              {t('auth.profile')}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <p><strong>{t('auth.email')}:</strong> {currentUser.email}</p>
              <p><strong>{t('auth.firstName')}:</strong> {userData.firstName}</p>
              <p><strong>{t('auth.lastName')}:</strong> {userData.lastName}</p>
              <p><strong>{t('auth.schoolName')}:</strong> {userData.schoolName}</p>
              <p><strong>{t('auth.schoolYear')}:</strong> {userData.schoolYear}</p>
              <p><strong>{t('auth.phoneNumber')}:</strong> {userData.phoneNumber}</p>
              <p><strong>{t('auth.delegateType')}:</strong> {userData.delegateType}</p>
              <p><strong>{t('auth.role')}:</strong> {userData.role}</p>
              <p><strong>{t('auth.healthConcerns')}:</strong> {userData.healthConcerns || t('auth.noHealthConcerns')}</p>
            </div>
          </div>

          {/* Committee Priorities Section */}
          <div className="mb-6">
            <h2 className="font-playfair text-2xl xs:text-3xl font-black mb-6 border-b-2 border-gray-900 pb-2">
              {t('auth.committeePriorities')}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow">
              {userData.committeePriorities && userData.committeePriorities.length > 0 ? (
                userData.committeePriorities.map((priority, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>{t('auth.priority')} {index + 1}:</strong> {i18n.language === 'fr' ? priority.nameFr : priority.nameEn}</p>
                  </div>
                ))
              ) : (
                <p>{t('auth.noCommittees')}</p>
              )}
            </div>
          </div>
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#c0c0c0] shadow-md transform -translate-y-px translate-x-px"></div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;