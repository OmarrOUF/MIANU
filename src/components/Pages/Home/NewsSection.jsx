import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaBookOpen } from 'react-icons/fa';
// Import the news data from JSON file
import newsData from '../../../data/newsPages.json';


const NewsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [coffeeStains, setCoffeeStains] = useState([]);
  const newspaperRef = useRef(null);
  const [newsPages] = useState(newsData);
  
  useEffect(() => {
    // Generate random coffee stains for each page
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
    
    // Generate stains for each page
    for (let i = 0; i < newsPages.length; i++) {
      const pageStains = [];
      // Random number of stains (0-3)
      const numStains = Math.floor(Math.random() * 3);
      
      for (let j = 0; j < numStains; j++) {
        pageStains.push({
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
      
      stains.push(pageStains);
    }
    
    setCoffeeStains(stains);
  };

  // Handle page turning - simplified without animation
  const nextPage = () => {
    if (currentPage < newsPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Page flip variants - Define this before using it in the JSX
  const pageVariants = {
    enter: (direction) => ({
      rotateY: direction > 0 ? 90 : -90,
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      zIndex: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.8, ease: [0.645, 0.045, 0.355, 1.000] }
      }
    },
    exit: (direction) => ({
      rotateY: direction < 0 ? 90 : -90,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      zIndex: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.8, ease: [0.645, 0.045, 0.355, 1.000] }
      }
    })
  };

  // Render different layout styles
  const renderNewspaper = (page) => {
    switch (page.style) {
      case 2: // Photo-heavy layout
        return renderPhotoLayout(page);
      case 3: // Editorial layout
        return renderEditorialLayout(page);
      case 1: // Standard layout
      default:
        return renderStandardLayout(page);
    }
  };

  // Render coffee stains for current page using Tailwind classes
  const renderCoffeeStains = () => {
    if (!coffeeStains[currentPage]) return null;
    
    return coffeeStains[currentPage].map((stain, index) => (
      <div 
        key={`stain-${currentPage}-${index}`}
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

  // Standard layout (style 1)
  const renderStandardLayout = (page) => (
    <>
      <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-4 xs:mb-6 relative">
        <div className="text-xs xs:text-sm font-bold mb-1">{page.date}</div>
        <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">{page.title}</h1>
        <div className="italic text-xs xs:text-sm my-1">{page.subtitle}</div>
        <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">{page.price}</div>
        <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">{page.mianuBadge}</div>
      </div>
      
      <div className="flex flex-col gap-4 xs:gap-8">
        {/* Lead Article with large headline */}
        <div className="mb-4 xs:mb-8">
          <h2 className="font-playfair text-2xl xs:text-3xl sm:text-4xl font-black mb-1 xs:mb-2 leading-tight">{page.articles[0].headline}</h2>
          <h3 className="text-base xs:text-xl font-normal italic mt-0 mb-1 xs:mb-2">{page.articles[0].subheading}</h3>
          <div className="text-xs xs:text-sm mb-2 xs:mb-4">{page.articles[0].author}</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xs:gap-5">
            <div className="text-sm xs:text-base leading-relaxed">
              <p className="text-justify mt-0 indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
                {page.articles[0].content}
              </p>
            </div>
            
            <div className="text-center my-2 bg-transparent">
              <img 
                src={page.articles[0].image} 
                alt="Article illustration" 
                className="w-full h-auto filter grayscale p-1" 
              />
            </div>
            
            <div className="text-sm xs:text-base leading-relaxed">
              <p className="text-justify mt-0 indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
                {page.articles[0].continued}
              </p>
              <span className="italic text-xs xs:text-sm block text-right mt-2">PARAGRAPH ENTIER DANS Page A2</span>
            </div>
          </div>
        </div>
        
        <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
        
        {/* Secondary Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-8">
          <div className="border-r-0 md:border-r border-gray-300 pr-0 md:pr-4">
            <h2 className="font-playfair text-xl xs:text-2xl font-bold mb-1 xs:mb-2 leading-tight">{page.articles[1].headline}</h2>
            <h3 className="text-sm xs:text-base italic font-normal mt-0 mb-1 xs:mb-2">{page.articles[1].subheading}</h3>
            <div className="text-xs xs:text-sm mb-2 xs:mb-4">{page.articles[1].author}</div>
            <p className="text-justify mt-0 text-sm xs:text-base indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
              {page.articles[1].content}
            </p>
            <span className="italic text-xs xs:text-sm block text-right mt-2">PARAGRAPH ENTIER DANS Page B3</span>
          </div>
          
          <div className="pl-0 md:pl-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-300">
            <h2 className="font-playfair text-xl xs:text-2xl font-bold mb-1 xs:mb-2 leading-tight">{page.articles[2].headline}</h2>
            <h3 className="text-sm xs:text-base italic font-normal mt-0 mb-1 xs:mb-2">{page.articles[2].subheading}</h3>
            <div className="text-xs xs:text-sm mb-2 xs:mb-4">{page.articles[2].author}</div>
            <p className="text-justify mt-0 text-sm xs:text-base indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
              {page.articles[2].content}
            </p>
            <span className="italic text-xs xs:text-sm block text-right mt-2">PARAGRAPH ENTIER DANS Page C1</span>
          </div>
        </div>
      </div>
    </>
  );

  // Photo-heavy layout (style 2)
  const renderPhotoLayout = (page) => (
    <>
      <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-4 xs:mb-6 relative">
        <div className="text-xs xs:text-sm font-bold mb-1">{page.date}</div>
        <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">{page.title}</h1>
        <div className="italic text-xs xs:text-sm my-1">{page.subtitle}</div>
        <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">{page.price}</div>
        <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">{page.mianuBadge}</div>
      </div>
      
      <div className="flex flex-col gap-4 xs:gap-8">
        {/* Main Photo Feature */}
        <div className="mb-4 xs:mb-8">
          <h2 className="font-playfair text-2xl xs:text-3xl sm:text-4xl font-black mb-1 xs:mb-2 leading-tight">{page.articles[0].headline}</h2>
          <h3 className="text-base xs:text-xl font-normal italic mt-0 mb-1 xs:mb-2">{page.articles[0].subheading}</h3>
          <div className="text-xs xs:text-sm mb-2 xs:mb-4">{page.articles[0].author}</div>
          
          
          
          <p className="text-justify mt-0 text-sm xs:text-base indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none mb-4">
            {page.articles[0].content}
          </p>
          
          {/* Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            {page.articles[0].gallery.map((photo, index) => (
              <div key={index} className="relative bg-transparent">
                <img 
                  src={photo} 
                  alt={`Gallery photo ${index + 1}`} 
                  className="w-full h-auto filter grayscale border border-gray-900 p-1" 
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
        
        {/* Secondary Photo Feature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-8 items-center">
          <div>
            <h2 className="font-playfair text-xl xs:text-2xl font-bold mb-1 xs:mb-2 leading-tight">{page.articles[1].headline}</h2>
            <h3 className="text-sm xs:text-base italic font-normal mt-0 mb-1 xs:mb-2">{page.articles[1].subheading}</h3>
            <div className="text-xs xs:text-sm mb-2 xs:mb-4">{page.articles[1].author}</div>
            <p className="text-justify mt-0 text-sm xs:text-base indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
              {page.articles[1].content}
            </p>
          </div>
          
          <div className="bg-transparent">
            <img 
              src={page.articles[1].image} 
              alt="Secondary feature" 
              className="w-full h-auto filter grayscale border border-gray-900 p-1" 
            />
          </div>
        </div>
      </div>
    </>
  );

  // Editorial layout (style 3)
  const renderEditorialLayout = (page) => (
    <>
      <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-4 xs:mb-6 relative">
        <div className="text-xs xs:text-sm font-bold mb-1">{page.date}</div>
        <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">{page.title}</h1>
        <div className="italic text-xs xs:text-sm my-1">{page.subtitle}</div>
        <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">{page.price}</div>
        <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">{page.mianuBadge}</div>
      </div>
      
      <div className="flex flex-col gap-4 xs:gap-8">
        {/* Editorial */}
        <div className="mb-4 xs:mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="font-playfair text-2xl xs:text-3xl sm:text-4xl font-black mb-1 xs:mb-2 leading-tight">{page.articles[0].headline}</h2>
            <h3 className="text-base xs:text-xl font-normal italic mt-0 mb-1 xs:mb-2">{page.articles[0].subheading}</h3>
            <div className="text-xs xs:text-sm mb-2 xs:mb-4">{page.articles[0].author}</div>
            
            <div className="border-l-4 border-gray-800 pl-4 italic text-lg mb-4">
              "Un partenariat officiel aurait été noué avec GOOBA, entreprise spécialisée dans les services digitaux et les solutions créatives."
            </div>
            
            <p className="text-justify mt-0 text-sm xs:text-base indent-3 xs:indent-5 first-letter:text-xl xs:first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none mb-4">
              {page.articles[0].content}
            </p>
            
            <p className="text-justify mt-0 text-sm xs:text-base">
              {page.articles[0].continued}
            </p>
          </div>
          
          <div className="flex flex-col justify-between">
            <div className="bg-transparent">
              <img 
                src={page.articles[0].image} 
                alt="Editorial illustration" 
                className="w-full h-auto filter grayscale border border-gray-900 p-1" 
              />
            </div>
            
            <div className="bg-gray-100 p-4 border-l-4 border-gray-800 mt-4">
              <p className="italic text-base mb-2">"{page.quote.text}"</p>
              <p className="text-right text-sm">— {page.quote.author}</p>
            </div>
          </div>
        </div>
        
        <div className="h-0.5 bg-gray-900 my-3 xs:my-5"></div>
        
        {/* Letters to the Editor */}
       
      </div>
    </>
  );

  return (
    <section className="py-6 xs:py-10 relative overflow-hidden font-serif">
      {/* Page turning controls */}
      
          
      <div className="max-w-6xl mx-auto relative" ref={newspaperRef}>
        <div 
          className="p-4 xs:p-8 bg-[#f6f4f0] shadow-lg border border-gray-300 relative font-serif"
          style={{ 
            boxShadow: '0 5px 15px rgba(0,0,0,0.15)'
          }}
        >
          {/* Paper texture overlay - fixed implementation */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
               style={{ 
                 backgroundImage: "url('/paper-texture.jpg')",
                 backgroundRepeat: 'repeat',
                 backgroundSize: '500px'
               }}>
          </div>
          
          {/* Coffee stains */}
          {renderCoffeeStains()}
          
          {/* Newspaper content */}
          {renderNewspaper(newsPages[currentPage])}
          
          {/* Previous Page Button */}
          <div className="absolute bottom-4 left-4 z-10">
            <button 
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`bg-[#1282A2] text-white p-2 rounded-full shadow-lg hover:bg-[#034078] transition-all duration-300 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
              aria-label="Previous page"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          </div>
          
          {/* Next Page Button */}
          <div className="absolute bottom-4 right-4 z-10">
            <button 
              onClick={nextPage}
              disabled={currentPage === newsPages.length - 1}
              className={`bg-[#1282A2] text-white p-2 rounded-full shadow-lg hover:bg-[#034078] transition-all duration-300 ${currentPage === newsPages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
              aria-label="Next page"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#d9c8a1] shadow-md transform -translate-y-px translate-x-px"></div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;