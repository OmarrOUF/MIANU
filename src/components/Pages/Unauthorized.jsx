import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLock, FaHome } from 'react-icons/fa';
import SEO from '../SEO/SEO';

const Unauthorized = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <section className="py-6 xs:py-10 relative overflow-hidden font-serif">
      <SEO 
        title={`${t('unauthorized.title')} | MIANU-SM III`}
        description={t('unauthorized.description')}
        noindex={true}
      />
      
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
          
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <FaLock className="text-red-600 text-4xl" />
              </div>
            </div>
            
            <h1 className="font-playfair text-4xl xs:text-5xl font-black mb-4 tracking-tighter">
              {t('unauthorized.title')}
            </h1>
            
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {t('unauthorized.message')}
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#3A6D8C] hover:bg-[#2A5D7C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A6D8C]"
            >
              <FaHome className="mr-2" />
              {t('unauthorized.returnHome')}
            </button>
          </div>
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#c0c0c0] shadow-md transform -translate-y-px translate-x-px"></div>
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;