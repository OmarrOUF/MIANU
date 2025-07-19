import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLock, FaQuestionCircle, FaGlobe } from 'react-icons/fa';

const EquipeSection = () => {
  const { t } = useTranslation();
  const [coffeeStains, setCoffeeStains] = useState([]);
  const [redactedLines, setRedactedLines] = useState([]);

  useEffect(() => {
    generateCoffeeStains();
    generateRedactedLines();
  }, []);

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

  const generateRedactedLines = () => {
    const lines = [];
    const numLines = Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < numLines; i++) {
      lines.push({
        width: Math.random() * 60 + 40,
        top: Math.random() * 90 + 5,
        left: Math.random() * 20,
        height: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.3 + 0.7,
      });
    }
    setRedactedLines(lines);
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

  const renderRedactedLines = () => {
    return redactedLines.map((line, index) => (
      <div 
        key={`redacted-${index}`}
        className="absolute bg-black rounded-sm"
        style={{
          width: `${line.width}%`,
          height: `${line.height}em`,
          top: `${line.top}%`,
          left: `${line.left}%`,
          opacity: line.opacity,
        }}
      />
    ));
  };

  const renderTeamCategory = (category) => {
    const categoryData = t(`equipe.teamMembers.${category}`, { returnObjects: true });
    if (!categoryData) return null;

    return (
      <div className="mb-12">
        <h2 className="font-playfair text-2xl xs:text-3xl font-black mb-6 border-b-2 border-gray-900 pb-2">
          {t(`equipe.${category}`)}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.map(member => (
            <div 
              key={member.id} 
              className={`bg-[#f8f4e5] border border-gray-800 p-4 shadow-md relative overflow-hidden ${
                member.mysterious ? 'border-red-800 border-2' : ''
              }`}
            >
              {/* Classified stamp overlay */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] opacity-20 z-10">
                <div className={`border-4 ${member.mysterious ? 'border-red-900 text-red-900' : 'border-red-700 text-red-700'} font-bold text-3xl px-4 py-2 uppercase`}>
                  {t('equipe.comingSoon')}
                </div>
              </div>
              
              {/* Extra mysterious elements for cultural visits role */}
              {member.mysterious && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {renderRedactedLines()}
                  <div className="absolute top-2 right-2 bg-red-800 text-white px-2 py-1 text-xs font-bold rounded">
                    TOP SECRET
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded">
                    <FaLock />
                    <span>CLASSIFIED</span>
                  </div>
                  <div className="absolute top-1/3 right-1/3 opacity-30">
                    <FaGlobe className="text-5xl text-red-800 animate-pulse" />
                  </div>
                </div>
              )}
              
              <div className="relative z-0">
                <div className="aspect-w-3 aspect-h-4 mb-4 bg-gray-200 overflow-hidden">
                  {/* <img 
                    src={member.image} 
                    alt={t(`equipe.roles.${member.role}`)} 
                    className={`w-full h-full object-cover filter ${member.mysterious ? 'grayscale blur-sm' : 'grayscale'}`}
                  /> */}
                  
                  {member.mysterious && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaQuestionCircle className="text-6xl text-red-800 opacity-70" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="font-playfair text-xl font-bold mb-1">{member.name}</h3>
                  <p className={`text-sm font-bold uppercase mb-2 ${member.mysterious ? 'text-red-800' : 'text-gray-700'}`}>
                    {t(`equipe.roles.${member.role}`)}
                  </p>
                  <p className="text-sm italic">
                    {member.mysterious ? t('equipe.culturalMystery') : member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#c0c0c0] shadow-md transform -translate-y-px translate-x-px"></div>
          
          {/* Header */}
          <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-6 xs:mb-8 relative">
            <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">
              {t('equipe.pageTitle')}
            </h1>
            <div className="italic text-xs xs:text-sm my-2">{t('equipe.subtitle')}</div>
            
            {/* Mystery message */}
            <div className="my-6 bg-[#f8f4e5] border-l-4 border-gray-800 p-4 text-left">
              <p className="text-sm xs:text-base italic">
                {t('equipe.mysteryMessage')}
              </p>
            </div>
          </div>
          
          {/* Team sections */}
          {renderTeamCategory('secretariat')}
          {renderTeamCategory('leadership')}
          {renderTeamCategory('organization')}
          {renderTeamCategory('specialTeams')}
          
          {/* Quote */}
          <div className="mt-8 bg-gray-100 p-6 border-l-4 border-gray-800">
            <p className="italic text-lg mb-2">"{t('equipe.quote.text')}"</p>
            <p className="text-right text-sm">— {t('equipe.quote.author')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipeSection;