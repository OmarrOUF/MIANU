import { useTranslation } from "react-i18next";
import { FaRegClock, FaMapMarkerAlt, FaNewspaper, FaArrowDown } from "react-icons/fa";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import SEO from "../../SEO/SEO"; 
import NewsSection from "./NewsSection"; // Make sure this import is present

// Import banner image - you need to add this import
const banner = "https://i.postimg.cc/yY8gYMJZ/Banner.jpg"; // Update with your actual banner path

// Preload banner image
const preloadedBanner = new Image();
preloadedBanner.src = banner;

// Lazy load the CountdownTimer component
const CountdownTimer = lazy(() => import("../countDown/CountDownTimer"));

const targetDate = new Date("2025-10-17T08:30:00"); // Event date

const AnimatedText = ({ text, className, delay = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const intervalRef = useRef(null);
  const cursorTimerRef = useRef(null);
  const textRef = useRef(text);
  const indexRef = useRef(0);
  
  // Reset and restart animation when text changes (e.g., language switch)
  useEffect(() => {
    // Update the text reference
    textRef.current = text;
    
    // Reset animation state
    setDisplayedText("");
    indexRef.current = 0;
    setShowCursor(true);
    
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (cursorTimerRef.current) {
      clearTimeout(cursorTimerRef.current);
    }
    
    // Only start if we have text
    if (!text) return;
    
    // Start a new animation
    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        const nextChar = text[indexRef.current];
        if (nextChar !== undefined) {
          setDisplayedText(prev => prev + nextChar);
        }
        indexRef.current += 1;
      } else {
        // Animation complete
        clearInterval(intervalRef.current);
        
        // Keep cursor blinking for 2 seconds, then hide it
        cursorTimerRef.current = setTimeout(() => {
          setShowCursor(false);
        }, 2000);
      }
    }, delay);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    };
  }, [text, delay]);
  
  // Cursor style with inline animation
  const cursorStyle = {
    display: 'inline-block',
    width: '2px',
    height: '0.9em',
    backgroundColor: 'white',
    marginLeft: '1px',
    verticalAlign: 'middle',
    animation: 'blink-animation 1s step-end infinite',
    position: 'relative', // Add positioning
    top: '0.05em' // Slight adjustment to align with text
  };
  
  // Add the keyframe animation to the document if it doesn't exist yet
  useEffect(() => {
    if (!document.getElementById('blink-animation-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'blink-animation-style';
      styleElement.textContent = `
        @keyframes blink-animation {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(styleElement);
      
      // Clean up on unmount
      return () => {
        const styleToRemove = document.getElementById('blink-animation-style');
        if (styleToRemove) {
          document.head.removeChild(styleToRemove);
        }
      };
    }
  }, []);
  
  return (
    <span className={className} style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
      {displayedText || ""}
      {showCursor && <span style={cursorStyle}></span>}
    </span>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const currentLanguage = i18n.language;
  const newsSectionRef = useRef(null);
  
  // Create structured data for the event
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": currentLanguage === 'fr' ? "MIANU-SM III" : "MIANU-SM III",
    "startDate": "2025-10-17T08:30:00",
    "endDate": "2025-10-19T18:00:00", // Adjust end date as needed
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Collège Saint-Marc",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "El Shatby",
        "addressLocality": "Alexandria",
        "addressCountry": "EG"
      }
    },
    "image": [
      "https://mianu-sm.com/MIANULOGO.png"
    ],
    "description": currentLanguage === 'fr' 
      ? "MIANU-SM III est une conférence Modèle des Nations Unies qui se tiendra au Collège Saint-Marc à Alexandrie."
      : "MIANU-SM III is a Model United Nations conference that will be held at College Saint-Marc in Alexandria.",
    "offers": {
      "@type": "Offer",
      "url": "https://mianu-sm.com/inscription",
      "price": "100",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01T00:00:00Z"
    },
    "organizer": {
      "@type": "Organization",
      "name": "MIANU-SM",
      "url": "https://mianu-sm.com"
    },
    // --- Add performer field below ---
    "performer": {
      "@type": "Organization",
      "name": "MIANU-SM",
      "url": "https://mianu-sm.com"
    }
  };
  
  // Improved image loading with caching
  useEffect(() => {
    if (preloadedBanner.complete) {
      setImageLoaded(true);
    } else {
      preloadedBanner.onload = () => setImageLoaded(true);
      
      // Fallback in case image takes too long
      const timeout = setTimeout(() => {
        if (!imageLoaded) setImageLoaded(true);
      }, 1000); // Reduced timeout
      
      return () => clearTimeout(timeout);
    }
  }, []);

  // Scroll to news section function
  const scrollToNewsSection = () => {
    if (newsSectionRef.current) {
      newsSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Button animation effect
  useEffect(() => {
    const buttonPulse = setInterval(() => {
      if (!isButtonHovered) {
        setShowScrollButton(prev => !prev);
        setTimeout(() => setShowScrollButton(true), 300);
      }
    }, 5000);
    
    return () => clearInterval(buttonPulse);
  }, [isButtonHovered]);

  return (
    <div className="w-full">
      {/* SEO Component */}
      <SEO 
        title={currentLanguage === 'fr' ? "Accueil | MIANU-SM III " : "Home | MIANU-SM III"}
        description={currentLanguage === 'fr' 
          ? "MIANU-SM III se tiendra en octobre 2025 au Collège Saint-Marc, Alexandrie. Rejoignez cette conférence Modèle des Nations Unies."
          : "MIANU-SM III will be held in October 2025 at College Saint-Marc, Alexandria. Join this Model United Nations conference."}
        structuredData={eventStructuredData}
      />
      
      {/* Banner Section */}
      <div className="relative w-full h-[350px] xs:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Image with optimized loading */}
        <div 
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "opacity" // Hint to browser for optimization
          }}
          aria-label={t('home.banner.backgroundAlt') || "MIANU-SM III conference banner"}
        ></div>
        
        {/* Blue Overlay at 60% opacity */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: "rgba(11, 32, 42, 0.6)"
          }}
        ></div>
        
        {/* Gradient Overlay - Positioned in the middle vertically */}
        <div 
          className="absolute left-0 right-0 h-[80%] xs:h-[70%] sm:h-[60%] sm:w-[90%] md:w-[85%] lg:w-[80%] sm:left-0 sm:right-auto my-auto top-0 bottom-0 flex items-center"
          style={{
            background: "linear-gradient(to right, rgba(27, 46, 55, 1), rgba(27, 46, 55, 0))"
          }}
        >
          {/* Content Container */}
          <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-center h-full w-full px-2 xs:px-4 sm:px-8 md:px-16 relative py-4 xs:py-6 sm:py-0">
            {/* Right Side - OCTOBER 2025 (now on the left) */}
            <div className="text-white z-10 flex flex-col items-center sm:ml-4 md:ml-8 lg:ml-12 mb-4 xs:mb-6 sm:mb-0 mt-2 sm:mt-0">
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <FaRegClock className="text-4xl xs:text-6xl sm:text-5xl md:text-7xl lg:text-8xl stroke-[0.2] transform translate-y-[-2px]" style={{ strokeWidth: '0.2px' }} />
                </div>
                <AnimatedText 
                  text={t('home.banner.month')} 
                  className="text-3xl xs:text-5xl sm:text-4xl md:text-6xl lg:text-7xl font-thin"
                  delay={150}
                />
              </div>
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl ml-auto">{t('home.banner.year')}</div>
            </div>
            
            {/* Line - vertical on row layout, horizontal on column layout */}
            <div className="relative z-10 flex justify-center w-full sm:w-auto sm:h-[70%]">
              {/* Vertical line for sm+ screens */}
              <div className="hidden sm:block h-full mx-4 sm:mx-6 md:mx-12 lg:mx-16">
                <div className="h-full w-0.5 md:w-1 bg-white rounded-full relative"></div>
              </div>
              
              {/* Horizontal line for mobile */}
              <div className="w-[70%] h-px bg-white rounded-full relative z-10 my-3 xs:my-6 sm:hidden"></div>
            </div>
            
            {/* Left Side - MIANU-SM III (now on the right) */}
            <div className="text-white z-10 text-center sm:text-left flex-1 mb-2 sm:mb-0">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[3.75rem] lg:text-[4.5rem] font-extrabold tracking-tight whitespace-normal xs:whitespace-nowrap">
                <AnimatedText 
                  text={t('home.banner.title')} 
                  delay={180}
                />
              </h1>
              <div className="flex items-center justify-center sm:justify-start mt-1 xs:mt-2 md:mt-4">
                <FaMapMarkerAlt className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl mr-1 xs:mr-2 flex-shrink-0" />
                <span className="text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl truncate max-w-[280px] xs:max-w-[350px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-full">
                  {t('home.banner.location')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of the home page content */}
      <section className="py-6 xs:py-10 flex justify-center bg-[#f6f4f0]">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <CountdownTimer targetDate={targetDate} />
        </Suspense>
      </section>
      
      {/* News Section with styling matching CountdownTimer */}
      <section ref={newsSectionRef} className="py-12 xs:py-16 bg-[#f6f4f0] relative">
        {/* Decorative paper edge effect */}
        <div className="absolute top-0 left-0 w-full h-4 bg-[#f6f4f0]" 
             style={{ 
               backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0, 0, 0, 0.05) 5px, rgba(0, 0, 0, 0.05) 10px)" 
             }}>
        </div>
        
        {/* Section title with vintage styling */}
        <div className="max-w-6xl mx-auto mb-8 xs:mb-12 px-4">
          <div className="text-center">
            <div className="inline-block border-b-2 border-t-2 border-black px-8 py-2">
              <h2 className="text-3xl xs:text-4xl md:text-5xl font-playfair text-black font-bold tracking-wide"
                  style={{ fontFamily: "Markazi Text, Serif" }}>
                  {t('news.title')}
                  </h2>
            </div>
            <p className="text-center text-gray-700 mt-3 italic font-serif">
            {t('news.subtitle')}
            </p>
          </div>
        </div>
        
        {/* NewsSection component */}
        <Suspense fallback={<div className="p-4 text-black text-center">Loading newspaper...</div>}>
          <NewsSection/>
        </Suspense>
        
        {/* Vintage typographic ornaments */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <div className="text-gray-700 opacity-80 text-2xl">
            ❧ ❧ ❧
          </div>
        </div>
      </section>
      
      {/* Floating News Button */}
      <button
        onClick={scrollToNewsSection}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-center justify-center bg-[#3A6D8C] hover:bg-[#1282A2] text-white rounded-full shadow-lg transition-all duration-300 ${
          showScrollButton ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
        }`}
        style={{
          width: '70px',
          height: '70px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          transform: isButtonHovered ? 'translateY(-5px)' : 'translateY(0)',
        }}
        aria-label={t('news.buttonAriaLabel')}
      >
        <FaNewspaper className="text-2xl mb-1" />
        <FaArrowDown className={`text-sm ${isButtonHovered ? 'animate-bounce' : ''}`} />
        
      </button>
    </div>
  );
};

export default Home;