import React, { useEffect } from 'react'; // Ensure useEffect is imported
import { Link } from 'react-router-dom';
import { FaHardHat, FaTools, FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';

const NotFound = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // Set 404 status code (client-side workaround)
  useEffect(() => {
    document.title = currentLanguage === 'fr' ? "Page en construction | MIANU-SM III" : "Page Under Construction | MIANU-SM III";
    document.head.querySelector('meta[name="robots"]').content = 'noindex, follow';
    // Client-side workaround for 404 status
    if (window.history.state) {
      window.history.replaceState({ ...window.history.state, status: 404 }, '');
    }
  }, [currentLanguage]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      {/* SEO Component */}
      <SEO 
        title={currentLanguage === 'fr' ? "Page en construction | MIANU-SM III" : "Page Under Construction | MIANU-SM III"}
        description={currentLanguage === 'fr' 
          ? "Cette page est en cours de construction. Revenez bientôt pour plus d'informations sur MIANU-SM III."
          : "This page is under construction. Check back soon for more information about MIANU-SM III."}
        type="website"
      />
      
      {/* Construction Tape Header */}
      <div className="w-full max-w-3xl overflow-hidden mb-8 transform -rotate-3">
        <div className="bg-yellow-400 text-black font-bold py-3 px-6 flex items-center justify-center transform rotate-3 shadow-lg" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, #000000 10px, #000000 20px)',
               color: 'white',
               textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
             }}>
          <span className="text-2xl md:text-3xl tracking-wider">{t('notFound.underConstruction')}</span>
        </div>
      </div>
      
      {/* Hard Hat Icon */}
      <div className="mb-6 relative">
        <FaHardHat className="text-8xl md:text-9xl text-yellow-500 animate-bounce" />
        <FaExclamationTriangle className="text-3xl text-red-500 absolute -top-2 -right-2 animate-pulse" />
      </div>
      
      {/* Message */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
        {t('notFound.title')}
      </h1>
      
      <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-600">
        {t('notFound.message')}
      </p>
      
      {/* Tools Animation */}
      <div className="flex justify-center mb-8">
        <div className="mx-2 animate-spin-slow">
          <FaTools className="text-4xl text-gray-700" />
        </div>
      </div>
      
      {/* Return Home Button */}
      <Link to="/" className="bg-[#3A6D8C] hover:bg-[#001F3F] text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all transform hover:scale-105 shadow-lg">
        <FaHome className="mr-2" />
        {t('notFound.returnHome')}
      </Link>
      
      {/* Construction Tape Footer */}
      <div className="w-full max-w-3xl overflow-hidden mt-12 transform rotate-2">
        <div className="bg-yellow-400 text-black font-bold py-2 px-6 flex items-center justify-center transform -rotate-2 shadow-lg" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, #000000 10px, #000000 20px)',
             }}>
        </div>
      </div>
    </div>
  );
};

export default NotFound;