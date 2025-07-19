import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineTeam } from "react-icons/ai";
import { 
  FaUsers, 
  FaChevronDown, 
  FaChevronUp, 
  FaLanguage, 
  FaUserTie, 
  FaFileAlt, 
  FaExternalLinkAlt,
  FaInfoCircle,
  FaBookOpen,
  FaQuoteLeft,
  FaGavel,
  FaGlobe,
  FaHandshake,
  FaBalanceScale,
  FaRocket,
  FaShieldAlt,
  FaUniversity,
  FaLandmark
} from 'react-icons/fa';
import SEO from '../SEO/SEO';
import committeesData from '../../data/committees.json';

const Committees = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [expandedCommittee, setExpandedCommittee] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });
  const [expandedTopics, setExpandedTopics] = useState({});
  const [coffeeStains, setCoffeeStains] = useState([]); // Remove this line
  const newspaperRef = useRef(null);
  
  // Map committee IDs to appropriate icons
  const committeeIcons = {
    1: <FaGavel className="text-xl" />, // DISEC
    2: <FaUsers className="text-xl" />, // SOCHUM
    3: <FaShieldAlt className="text-xl" />, // Security Council
    4: <FaBalanceScale className="text-xl" />, // Human Rights Council
    5: <FaExternalLinkAlt className="text-xl" />, // Crisis Committee
    6: <FaLandmark className="text-xl" />, // ICJ
    7: <FaRocket className="text-xl" />, // COPUOS
    8: <FaHandshake className="text-xl" />, // ECOSOC
    default: <FaGlobe className="text-xl" /> // Default icon
  };
  
  const committees = useMemo(() => committeesData.committees.map(committee => ({
    id: committee.id,
    name: currentLanguage === 'fr' ? committee.nameFr : committee.nameEn,
    description: currentLanguage === 'fr' ? committee.descriptionFr : committee.descriptionEn,
    topics: currentLanguage === 'fr' ? committee.topicsFr : committee.topicsEn,
    color: committee.color,
    language: committee.language,
    bilingual: committee.bilingual || false,
    binomial: committee.binomial || false,
    president: committee.president || { name: "À annoncer", gender: "male" },
    vicePresident: committee.vicePresident || { name: "À annoncer", gender: "male" }
  })), [currentLanguage]);
  
  // Generate random coffee stains
  // Remove the useEffect that generates coffee stains
  // useEffect(() => {
  //   const stains = [];
  //   const stainImages = [
  //     '/assets/coffee-stain-1.png', 
  //     '/assets/coffee-stain-2.png',
  //     '/assets/coffee-stain-3.png',
  //   ];
  
  //   // Random number of stains (1-3)
  //   const numStains = Math.floor(Math.random() * 3) + 1;
  
  //   for (let j = 0; j < numStains; j++) {
  //     stains.push({
  //       image: stainImages[Math.floor(Math.random() * stainImages.length)],
  //       position: {
  //         top: Math.random() * 80 + 10,
  //         left: Math.random() * 80 + 10,
  //       },
  //       rotation: Math.random() * 360,
  //       opacity: Math.random() * 0.3 + 0.1,
  //       scale: Math.random() * 0.5 + 0.5,
  //       zIndex: Math.floor(Math.random() * 2) // 0 or 1
  //     });
  //   }
  
  //   setCoffeeStains(stains);
  // }, []);
  
  // Remove the renderCoffeeStains function
  // const renderCoffeeStains = () => {
  //   return coffeeStains.map((stain, index) => (
  //     <div 
  //       key={`stain-${index}`}
  //       className={`
  //         absolute pointer-events-none mix-blend-multiply
  //         ${stain.zIndex === 0 ? 'z-0' : 'z-10'}
  //         ${stain.opacity <= 0.15 ? 'opacity-10' : stain.opacity <= 0.25 ? 'opacity-20' : 'opacity-30'}
  //       `}
  //       style={{
  //         top: `${stain.position.top}%`,
  //         left: `${stain.position.left}%`,
  //         transform: `rotate(${stain.rotation}deg) scale(${stain.scale})`,
  //       }}
  //     >
  //       <img 
  //         src={stain.image} 
  //         alt="" 
  //         className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
  //       />
  //     </div>
  //   ));
  // };
  
  // Throttle mouse move handler to reduce updates
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    
    // Only update if position changed significantly (by at least 1px)
    if (Math.abs(x - mousePosition.x) > 1 || Math.abs(y - mousePosition.y) > 1) {
      setMousePosition({ x, y });
    }
  }, [mousePosition]);
  
  // Throttled mouse move event with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    
    const onMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [handleMouseMove]);
  
  // Optimize animation by reducing update frequency
  useEffect(() => {
    let animationFrameId;
    let lastUpdate = 0;
    const updateInterval = 150; // Increased interval for better performance
    
    const animate = (timestamp) => {
      if (timestamp - lastUpdate > updateInterval) {
        // Simplified calculation with fewer operations
        const xOffset = Math.sin(Date.now() / 6000) * 6 + (mousePosition.x * 0.2);
        const yOffset = Math.cos(Date.now() / 6000) * 6 + (mousePosition.y * 0.2);
        
        setAnimationPosition({ x: xOffset, y: yOffset });
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);
  
  // Toggle committee expansion with scroll into view
  const toggleCommittee = useCallback((index) => {
    setExpandedCommittee(prev => {
      const newValue = prev === index ? null : index;
      
      // If expanding a committee, scroll it into view after animation
      if (newValue !== null) {
        setTimeout(() => {
          const element = document.getElementById(`committee-${index}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      
      return newValue;
    });
  }, []);
  
  // Toggle topic description expansion
  const toggleTopicDescription = useCallback((committeeId, topicIndex) => {
    const key = `${committeeId}-${topicIndex}`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);
  
  // Get gender-specific title - memoized
  const getTitle = useCallback((role, gender, language) => {
    if (language === 'fr') {
      if (role === 'president') {
        return gender === 'female' ? 'Présidente' : 'Président';
      } else {
        return gender === 'female' ? 'Vice-Présidente' : 'Vice-Président';
      }
    } else {
      if (role === 'president') {
        return 'President';
      } else {
        return 'Vice-President';
      }
    }
  }, []);
  
  // Render committee indicators
  const renderCommitteeIndicators = useCallback((committee) => {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {/* Language indicator */}
        {committee.bilingual ? (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FaLanguage className="mr-1" />
            Bilingual / Bilingue
          </div>
        ) : (
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            committee.language === 'fr' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            <FaLanguage className="mr-1" />
            {committee.language === 'fr' ? 'Français' : 'English'}
          </div>
        )}
  
        {/* Binomial indicator as a tag */}
        {committee.binomial && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <AiOutlineTeam className="mr-1" />
            {currentLanguage === 'fr' ? 'BINÔME' : 'BINOMIAL'}
          </div>
        )}
      </div>
    );
  }, [currentLanguage]);
  
  // Render coffee stains
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
  
  // Structured data for SEO
  const committeesStructuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": currentLanguage === 'fr' ? "Comités de MIANU-SM III" : "MIANU-SM III Committees",
    "description": t('committees.pageDescription')
  }), [currentLanguage, t]);
  
  // Get committee icon
  const getCommitteeIcon = (committeeId) => {
    return committeeIcons[committeeId] || committeeIcons.default;
  };

  return (
    <section className="py-6 xs:py-10 relative overflow-hidden font-serif">
      {/* SEO Component */}
      <SEO 
        title={`${t('committees.pageTitle')} | MIANU-SM III`}
        description={t('committees.pageDescription')}
        structuredData={committeesStructuredData}
      />
      
      {/* Newspaper container */}
      <div className="max-w-6xl mx-auto relative" ref={newspaperRef}>
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
          
          {/* Newspaper header */}
          <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-4 xs:mb-6 relative">
            <div className="text-xs xs:text-sm font-bold mb-1">OCTOBRE 2025</div>
            <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">
              {t('committees.pageTitle')}
            </h1>
            <div className="italic text-xs xs:text-sm my-1">COLLÈGE SAINT-MARC, ALEXANDRIE</div>
            <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">ÉDITION SPÉCIALE</div>
            <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">MIANU-SM III</div>
          </div>
          
          {/* Introduction paragraph */}
          <div className="mb-8">
           
            
            <div className="border-l-4 border-gray-800 pl-4 italic text-lg my-4">
              <FaQuoteLeft className="text-gray-500 mb-2" />
              "Les comités de MIANU-SM III représentent l'excellence diplomatique et la diversité des enjeux mondiaux actuels."
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-bold mr-2">{t('committees.languageLegend')}:</span>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  <FaLanguage className="mr-1" />
                  Français
                </div>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                  <FaLanguage className="mr-1" />
                  English
                </div>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <FaLanguage className="mr-1" />
                  Bilingual
                </div>
              </div>
            </div>
          </div>
          
          {/* Committees */}
          <div className="space-y-8">
            {committees.map((committee, index) => (
              <article 
                key={committee.id}
                id={`committee-${index}`}
                className="border-b border-gray-300 pb-8 last:border-b-0 last:pb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <div 
                      className={`flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out rounded-md p-4 hover:bg-opacity-10`}
                      style={{ 
                        backgroundColor: `${committee.color}10`,
                        borderLeft: `4px solid ${committee.color}`,
                        borderBottom: `1px solid ${committee.color}`
                      }}
                      onClick={() => toggleCommittee(index)}
                    >
                      <div className="flex items-center flex-wrap">
                        <div 
                          className="mr-3 p-2 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: committee.color,
                            color: '#fff'
                          }}
                        >
                          {getCommitteeIcon(committee.id)}
                        </div>
                        <h2 className="font-playfair text-2xl xs:text-3xl font-black mb-0 leading-tight">
                          {committee.name}
                        </h2>
                        {/* Committee indicators */}
                        <div className="flex flex-wrap gap-2 ml-2">
                          {renderCommitteeIndicators(committee)}
                        </div>
                      </div>
                      <button 
                        className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                        aria-label={expandedCommittee === index ? "Collapse committee" : "Expand committee"}
                        style={{ color: committee.color }}
                      >
                        {expandedCommittee === index ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Committee content - only shown when expanded */}
                  <div 
                    className={`md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedCommittee === index 
                        ? 'max-h-[2000px] opacity-100 transform translate-y-0' 
                        : 'max-h-0 opacity-0 transform -translate-y-4'
                    }`}
                  >
                    {/* Committee description */}
                    <div className="md:col-span-2">
                      <div className="text-sm xs:text-base leading-relaxed">
                        <p className="text-justify mt-0 indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
                          {committee.description}
                        </p>
                      </div>
                      
                 
                      
                      
                 
                      
                    </div>
                    
                    {/* Committee sidebar */}
                    <div className="md:col-span-1">
                      <div 
                        className="p-4 rounded-md border border-gray-200"
                        style={{ backgroundColor: `${committee.color}05` }}
                      >
                        {/* Committee image or logo */}
                        <div className="text-center mb-4">
                          <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
                            style={{ 
                              backgroundColor: committee.color,
                              color: '#fff'
                            }}
                          >
                            {getCommitteeIcon(committee.id)}
                          </div>
                          
                        </div>
                        
                        
                        
                        {/* Committee SDGs */}
                        
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Page footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
            <div className="flex justify-center items-center">
              <FaBookOpen className="text-[#3A6D8C] mr-2" />
              <span>MIANU-SM III | Octobre 2025</span>
            </div>
          </div>
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#c0c0c0] shadow-md transform -translate-y-px translate-x-px"></div>
        </div>
      </div>
    </section>
  );
};

export default Committees;
