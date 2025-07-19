
import { useTranslation } from 'react-i18next';
import { FaUserPlus, FaExternalLinkAlt, FaUsers, FaSchool, FaLanguage, FaBookOpen, FaQuoteLeft, FaArrowDown } from 'react-icons/fa';
import SEO from '../SEO/SEO';
import { useState, useEffect, useRef } from 'react';

const Inscription = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  // Animation state with enhanced interactivity
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const [coffeeStains, setCoffeeStains] = useState([]);
  const newspaperRef = useRef(null);
  
  // Generate random coffee stains
  useEffect(() => {
    const stains = [];
    const stainImages = [
      '/assets/coffee-stain-1.png', 
      '/assets/coffee-stain-2.png',
      '/assets/coffee-stain-3.png',
    ];
    
    // Random number of stains (1-3)
    const numStains = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numStains; j++) {
      stains.push({
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
    
    setCoffeeStains(stains);
  }, []);
  
  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Optimize animation by reducing update frequency and using requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastUpdate = 0;
    const updateInterval = 100; // ms between updates for better performance
    
    const animate = (timestamp) => {
      if (timestamp - lastUpdate > updateInterval) {
        setAnimationPosition({
          x: Math.sin(Date.now() / 5000) * 8 + (mousePosition.x * 0.3), 
          y: Math.cos(Date.now() / 5000) * 8 + (mousePosition.y * 0.3)
        });
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);
  
  // Google Form URLs - replace these with your actual Google Form links
  const formUrls = {
    delegateFr: "#",
    delegateEn: "#",
    viceFr: "https://docs.google.com/forms/d/e/1FAIpQLSfBGlsBQhYOPhxvq38gHfqCYaml-2EPzOL6oWgWFlVc8DeNkg/viewform?usp=dialog",
    viceEn: "https://docs.google.com/forms/d/e/1FAIpQLSfYu6fYIfQlwgB6_8M9UwBCnDA3cycqT6r3qbb0vn7BnoxgyQ/viewform",
    institution: "https://docs.google.com/forms/d/1vbFRygwulLgJKMLF5OPZJrFxkDAyqYvMgVUJyu9ZH-o/edit#responses"
  };
  
  // Function to handle redirection
  const redirectToForm = (formUrl) => {
    window.open(formUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Structured data for SEO
  const registrationStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": currentLanguage === 'fr' ? "Inscription à MIANU-SM III" : "Registration for MIANU-SM III",
    "description": currentLanguage === 'fr' 
      ? "Inscrivez-vous à la conférence MIANU-SM III qui se tiendra en octobre 2025."
      : "Register for the MIANU-SM III conference to be held in October 2025."
  };
  
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
  
  return (
    <div className="py-6 xs:py-10 relative overflow-hidden font-serif">
      {/* SEO Component */}
      <SEO 
        title={currentLanguage === 'fr' ? "Inscription | MIANU-SM III" : "Registration | MIANU-SM III"}
        description={currentLanguage === 'fr' 
          ? "Inscrivez-vous à la conférence MIANU-SM III qui se tiendra au Collège Saint-Marc à Alexandrie en octobre 2025."
          : "Register for the MIANU-SM III conference to be held at College Saint-Marc in Alexandria in October 2025."}
        structuredData={registrationStructuredData}
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
              {t('inscription.title')}
            </h1>
            <div className="italic text-xs xs:text-sm my-1">COLLÈGE SAINT-MARC, ALEXANDRIE</div>
            <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">ÉDITION SPÉCIALE</div>
            <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">MIANU-SM III</div>
          </div>
          
          {/* Main content */}
          <div id="registration-section" className="flex flex-col gap-4 xs:gap-8">
            {/* Lead Article */}
            <div className="mb-4 xs:mb-8">
              
              <div className="text-sm xs:text-base leading-relaxed">
                
                
                <div className="border-l-4 border-gray-800 pl-4 italic text-lg my-4">
                  <FaQuoteLeft className="text-gray-500 mb-2" />
                  "MIANU-SM III promet d'être une édition historique, avec des comités innovants et des débats passionnants sur les défis mondiaux les plus urgents."
                </div>
                
               
              </div>
            </div>
            
            <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
            
            {/* Registration Options */}
            <h3 className="font-playfair text-xl xs:text-2xl font-bold mb-4 text-center">OPTIONS D'INSCRIPTION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8">
              {/* Delegate Registration */}
              <div className="border-r-0 md:border-r border-gray-300 pr-0 md:pr-4">
                <h4 className="font-playfair text-xl font-bold mb-1 xs:mb-2 leading-tight flex items-center">
                  <FaUsers className="mr-3 text-[#3A6D8C]" />
                  {t('inscription.delegateTitle')}
                </h4>
                <p className="text-justify mt-0 text-sm xs:text-base mb-4">
                  {t('inscription.delegateDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    disabled
                    onClick={() => redirectToForm(formUrls.delegateFr)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#b8b8b8] hover:bg-[#c9c9c9] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FaLanguage className="mr-2" />
                    {t('inscription.frenchForm')}
                  </button>
                  
                  <button
                    disabled
                    onClick={() => redirectToForm(formUrls.delegateEn)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#b8b8b8] hover:bg-[#c9c9c9] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FaLanguage className="mr-2" />
                    {t('inscription.englishForm')}
                  </button>
                </div>
                
                <div className="text-xs italic text-center">Formulaires disponibles prochainement</div>
              </div>
              
              {/* Vice President Registration */}
              <div className="pl-0 md:pl-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-300">
                <h4 className="font-playfair text-xl font-bold mb-1 xs:mb-2 leading-tight flex items-center">
                  <FaUserPlus className="mr-3 text-green-600" />
                  {t('inscription.viceTitle')}
                </h4>
                <p className="text-justify mt-0 text-sm xs:text-base mb-4">
                  {t('inscription.viceDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={() => redirectToForm(formUrls.viceFr)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#18364e] hover:bg-[#35455a] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FaLanguage className="mr-2" />
                    {t('inscription.frenchForm')}
                  </button>
                  
                  <button
                    onClick={() => redirectToForm(formUrls.viceEn)}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#18364e] hover:bg-[#35455a] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FaLanguage className="mr-2" />
                    {t('inscription.englishForm')}
                  </button>
                </div>
                
                <div className="text-xs italic text-center">S'inscrivez maintenat!</div>
              </div>
            </div>
            
            <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
            
            <div className="bg-[#f8f4e5] p-6 border border-gray-300 shadow-md">
              <h4 className="font-playfair text-xl font-bold mb-3 text-center">
                {t('inscription.institutionTitle')}
              </h4>
              <p className=" text-center text-sm xs:text-base mb-4 max-w-2xl mx-auto">
                {t('inscription.institutionDescription')}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => redirectToForm(formUrls.institution)}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  {t('inscription.institutionButton')}
                </button>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
              <p>{t('inscription.additionalInfo.contact')}</p>
              <div className="flex justify-center items-center mt-2">
                <FaBookOpen className="text-[#3A6D8C] mr-2" />
                <span>MIANU-SM III | Octobre 2025</span>
              </div>
            </div>
          </div>
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#d9c8a1] shadow-md transform -translate-y-px translate-x-px"></div>
        </div>
      </div>
    </div>
  );
};

export default Inscription;