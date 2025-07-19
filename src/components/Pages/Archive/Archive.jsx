import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight, FaBookOpen, FaExternalLinkAlt, FaUsers, FaClipboardList } from 'react-icons/fa';
// Import the archive data from JSON file
import archiveData from '../../../data/archiveData.json';

const Archive = () => {
  const { t } = useTranslation();
  const [currentEdition, setCurrentEdition] = useState(0);
  const [coffeeStains, setCoffeeStains] = useState([]);
  const archiveRef = useRef(null);
  
  useEffect(() => {
    // Generate random coffee stains for each edition
    generateCoffeeStains();
  }, []);
  
  // Generate random coffee stains
  const generateCoffeeStains = () => {
    const stains = [];
    const stainImages = [
      '/assets/coffee-stain-1.png', 
      '/assets/coffee-stain-2.png',
      '/assets/coffee-stain-3.png',
    ];
    
    // Generate stains for each edition
    for (let i = 0; i < archiveData.length; i++) {
      const editionStains = [];
      // Random number of stains (0-3)
      const numStains = Math.floor(Math.random() * 3);
      
      for (let j = 0; j < numStains; j++) {
        editionStains.push({
          image: stainImages[Math.floor(Math.random() * stainImages.length)],
          position: {
            top: Math.random() * 80 + 10,
            left: Math.random() * 80 + 10,
          },
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.3 + 0.1,
          scale: Math.random() * 0.5 + 0.5,
          zIndex: Math.floor(Math.random() * 2) // 0 or 1
        });
      }
      
      stains.push(editionStains);
    }
    
    setCoffeeStains(stains);
  };

  // Handle edition navigation
  const nextEdition = () => {
    if (currentEdition < archiveData.length - 1) {
      setCurrentEdition(currentEdition + 1);
    }
  };

  const prevEdition = () => {
    if (currentEdition > 0) {
      setCurrentEdition(currentEdition - 1);
    }
  };

  // Render coffee stains for current edition
  const renderCoffeeStains = () => {
    if (!coffeeStains[currentEdition]) return null;
    
    return coffeeStains[currentEdition].map((stain, index) => (
      <div 
        key={`stain-${currentEdition}-${index}`}
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

  // Render archive content
  const renderArchiveContent = (edition) => {
    return (
      <>
        <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-4 xs:mb-6 relative">
          <div className="text-xs xs:text-sm font-bold mb-1">{edition.year}</div>
          <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">{edition.edition}</h1>
          <div className="italic text-xs xs:text-sm my-1">"{edition.slogan}"</div>
          <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">{t('archive.archives')}</div>
          <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">{t('archive.mianuArchives')}</div>
          
          {/* Edition navigation controls */}
          <div className="absolute bottom-2 right-0 z-10 flex space-x-2">
            <button 
              onClick={prevEdition}
              disabled={currentEdition === 0}
              className={`bg-[#1282A2] text-white p-2 rounded-full shadow-lg hover:bg-[#034078] transition-all duration-300 ${currentEdition === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
              aria-label={t('archive.previousEdition')}
            >
              <FaChevronLeft className="text-xl" />
            </button>
            
            <button 
              onClick={nextEdition}
              disabled={currentEdition === archiveData.length - 1}
              className={`bg-[#1282A2] text-white p-2 rounded-full shadow-lg hover:bg-[#034078] transition-all duration-300 ${currentEdition === archiveData.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
              aria-label={t('archive.nextEdition')}
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 xs:gap-8">
          {/* Description and Photos */}
          <div className="mb-4 xs:mb-8">
            <h2 className="font-playfair text-2xl xs:text-3xl sm:text-4xl font-black mb-1 xs:mb-2 leading-tight">
              {t('archive.theConference', { edition: edition.edition })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xs:gap-5">
              <div className="text-sm xs:text-base leading-relaxed md:col-span-1">
                <p className="text-justify mt-0 indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
                  {edition.description}
                </p>
                
                <div className="mt-4 bg-[#f8f4e5] p-3 border-l-4 border-gray-800">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <FaExternalLinkAlt className="mr-2" /> {t('archive.conferenceArchive')}
                  </h3>
                  <p className="mb-2">{t('archive.accessPhotos', { edition: edition.edition })}</p>
                  <a 
                    href={edition.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-[#3A6D8C] text-white px-3 py-1 rounded hover:bg-[#2c5269] transition-colors"
                  >
                    {t('archive.googleDriveArchive')}
                  </a>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  {edition.photos.map((photo, index) => (
                    <div key={index} className="relative bg-transparent">
                      <img 
                        src={photo} 
                        alt={`${edition.edition} photo ${index + 1}`} 
                        className="w-full h-auto filter grayscale border border-gray-900 p-1" 
                      />
                      <div className="text-xs italic mt-1 text-center">
                        {t('archive.photoCredit', { edition: edition.edition, year: edition.year })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
          
          {/* Committees */}
          <div className="mb-4 xs:mb-8">
            <h2 className="font-playfair text-2xl xs:text-3xl font-black mb-3 xs:mb-4 leading-tight flex items-center">
              <FaClipboardList className="mr-2" /> {t('archive.committees')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
              {edition.committees.map((committee, index) => (
                <div key={index} className="bg-[#f8f4e5] p-4 border-l-4 border-gray-800">
                  <h3 className="font-bold text-lg mb-2">{committee.name}</h3>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
          
          {/* Team */}
          <div>
            <h2 className="font-playfair text-2xl xs:text-3xl font-black mb-3 xs:mb-4 leading-tight flex items-center">
              <FaUsers className="mr-2" /> {t('archive.leadershipTeam')}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 xs:gap-4">
              {edition.team.map((member, index) => (
                <div key={index} className="text-center bg-[#f8f4e5] p-3 border border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-sm">{member.name}</h3>
                  <p className="text-xs italic">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="py-6 xs:py-10 relative overflow-hidden font-serif">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t('navbar.archive')}
        </h1>
        
        {/* Edition navigation controls */}
       
        {/* Edition indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-[#1282A2] text-white px-3 py-1 rounded-full shadow-lg flex items-center space-x-2">
          <FaBookOpen className="text-sm" />
          <span className="text-sm font-bold">
            {t('archive.editionCounter', { current: currentEdition + 1, total: archiveData.length })}
          </span>
        </div>
        
        {/* Archive container */}
        <div className="max-w-6xl mx-auto relative" ref={archiveRef}>
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
            
            {/* Archive content */}
            {renderArchiveContent(archiveData[currentEdition])}
            
            {/* Page corner fold effect */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#d9c8a1] shadow-md transform -translate-y-px translate-x-px"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Archive;