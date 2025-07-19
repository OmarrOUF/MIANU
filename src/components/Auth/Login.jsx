import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../SEO/SEO';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const { t } = useTranslation();
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [coffeeStains, setCoffeeStains] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      navigate('/');
    }
    
    // Generate random coffee stains
    generateCoffeeStains();
  }, [currentUser, navigate]);

  // Generate random coffee stains (similar to NewsSection)
  const generateCoffeeStains = () => {
    // Implementation remains the same
    const stains = [];
    const stainImages = [
      '/assets/coffee-stain-1.png', 
      '/assets/coffee-stain-2.png',
      '/assets/coffee-stain-3.png',
    ];
    
    const numStains = Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numStains; i++) {
      stains.push({
        image: stainImages[Math.floor(Math.random() * stainImages.length)],
        position: {
          top: Math.random() * 80 + 10,
          left: Math.random() * 80 + 10,
        },
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.2 + 0.1,
        scale: Math.random() * 0.4 + 0.4,
        zIndex: Math.floor(Math.random() * 2)
      });
    }
    
    setCoffeeStains(stains);
  };

  // Render coffee stains
  const renderCoffeeStains = () => {
    // Implementation remains the same
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

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      
      analytics.logLogin('email');
      analytics.logFormSubmit('login_form', true);
      
      toast.success(t('auth.loginSuccess'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Navigate directly without setTimeout
      navigate('/', { replace: true });
    } catch (error) {
      // Handle specific error types
      let errorMessage = t('auth.loginError');
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.userNotFound');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('auth.wrongPassword');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('auth.invalidEmail');
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = t('auth.tooManyRequests');
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = t('auth.userDisabled');
      }
      
      setError(errorMessage);
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      analytics.logFormSubmit('login_form', false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO 
        title={t('auth.login')}
        description={t('auth.loginSubtitle')}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t('auth.login'),
          "description": t('auth.loginSubtitle'),
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://mianu-sm.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": t('auth.login'),
                "item": "https://mianu-sm.com/login"
              }
            ]
          }
        }}
      />
      
      <section className="py-20 xs:py-24 relative overflow-hidden font-serif">
        {/* Component UI remains the same */}
        <div className="max-w-md mx-auto relative">
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
              <h1 className="font-playfair text-4xl xs:text-5xl font-black m-0 tracking-tighter uppercase">
                {t('auth.login')}
              </h1>
              <div className="italic text-xs xs:text-sm my-2">{t('auth.loginSubtitle')}</div>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              {/* Form fields remain the same */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-[#1282A2] hover:text-[#034078]">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-[#1282A2] hover:bg-[#034078] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  <FaSignInAlt className="mr-2" />
                  {loading ? t('auth.loggingIn') : t('auth.loginButton')}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm">
                  {t('auth.noAccount')}{' '}
                  <Link to="/signup" className="text-[#1282A2] hover:text-[#034078] font-bold">
                    {t('auth.signupLink')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;