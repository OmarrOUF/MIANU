import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext"; // Updated import path
import frFlag from "/assets/france.png";
import gbFlag from "/assets/united-kingdom.png";
import Logo from "/MIANULOGO.png"; // Import the logo
import {
  FaExclamationTriangle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaGripVertical,
  FaTachometerAlt,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaSchool,
  FaPhone,
  FaGlobe,
  FaCalendarAlt,
  FaHeartbeat,
  FaPassport,
  FaListOl,
  FaTrophy,
  FaHistory,
} from "react-icons/fa"; // Added FaUserShield and others for SignupSimulation

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [archiveDropdownOpen, setArchiveDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Add this line to define userMenuOpen state
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, userData } = useAuth(); // Add userData here
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin whenever userData changes
  useEffect(() => {
    if (userData && userData.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [userData]);

  // Add this useEffect to force a re-render when location changes or userData changes
  useEffect(() => {
    // This will cause a re-render when navigation occurs or userData changes
  }, [location, userData]);

  const navRefs = {
    "/": useRef(null),
    "/inscription": useRef(null),
    "/committees": useRef(null),
    "/equipe": useRef(null),
    "/archive": useRef(null),
    "/adopted": useRef(null),
    "/login": useRef(null),
    "/signup": useRef(null),
  };

  // Function to check if the navbar should switch to mobile mode
  const checkNavbarOverflow = () => {
    const navbar = document.querySelector("nav");
    const logo = document.querySelector(".logo-container");
    const menu = document.querySelector(".menu-container");

    if (navbar && logo && menu) {
      const navbarWidth = navbar.offsetWidth;
      const logoWidth = logo.offsetWidth;
      const menuWidth = menu.offsetWidth;

      if (logoWidth + menuWidth > navbarWidth) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    }
  };

  // Update indicator position when location changes
  useEffect(() => {
    const updateIndicator = () => {
      const currentPath = location.pathname;

      // Check if we're on an archive-related page
      const isArchivePage =
        currentPath.startsWith("/archive") ||
        currentPath.startsWith("/adopted");

      if (isArchivePage) {
        // Hide the indicator for archive pages
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      const activeRef =
        navRefs[currentPath === "/" ? "/" : `/${currentPath.split("/")[1]}`];

      if (activeRef && activeRef.current) {
        const element = activeRef.current;
        setIndicatorStyle({
          left: `${element.offsetLeft}px`,
          width: `${element.offsetWidth}px`,
          opacity: 1,
        });
      } else {
        setIndicatorStyle({ opacity: 0 });
      }
    };

    updateIndicator();
    checkNavbarOverflow();
    // Also update on window resize to ensure it stays aligned
    window.addEventListener("resize", updateIndicator);
    window.addEventListener("resize", checkNavbarOverflow);
    return () => {
      window.removeEventListener("resize", updateIndicator);
      window.removeEventListener("resize", checkNavbarOverflow);
    };
  }, [location, i18n.language]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setArchiveDropdownOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleArchiveDropdown = () => {
    setArchiveDropdownOpen(!archiveDropdownOpen);
  };

  const currentLanguage = i18n.language;
  const currentFlag = currentLanguage === "en" ? gbFlag : frFlag;
  const flagAlt =
    currentLanguage === "en" ? "Switch to French" : "Switch to English";

  return (
    <nav className="bg-[#001F3F] text-white fixed w-full z-50 shadow-md">
      <style>{`.glow-red {box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.8); animation: glowPulse 1.5s infinite alternate;} @keyframes glowPulse {0% {box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.8);} 100% {box-shadow: 0 0 20px 6px rgba(255, 0, 0, 1);}}`}</style>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex justify-between h-20">
        <div className="flex items-center logo-container">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img src={Logo} alt="MIANU Logo" className="h-16 w-auto" />
          </Link>
        </div>

        {/* Desktop menu */}
        <div
          className={`hidden lg:flex items-center space-x-4 relative menu-container ${
            isMenuOpen ? "hidden" : ""
          }`}
        >
          {/* Animated indicator for active link */}
          <div
            className="absolute bottom-4 h-1 bg-[#6A9AB0] transition-all duration-300 ease-in-out rounded-t-sm"
            style={indicatorStyle}
          ></div>

          <NavLink
            ref={navRefs["/"]}
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold px-3 py-2 transition-colors duration-300"
                : "text-white font-bold hover:text-gray-300 px-3 py-2 transition-colors duration-300"
            }
            end
          >
            {t("navbar.home")}
          </NavLink>
          <NavLink
            ref={navRefs["/inscription"]}
            to="/inscription"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold px-3 py-2 transition-colors duration-300"
                : "text-white font-bold hover:text-gray-300 px-3 py-2 transition-colors duration-300"
            }
          >
            {t("navbar.inscription")}
          </NavLink>
          <NavLink
            ref={navRefs["/committees"]}
            to="/committees"
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold px-3 py-2 transition-colors duration-300"
                : "text-white font-bold hover:text-gray-300 px-3 py-2 transition-colors duration-300"
            }
          >
            {t("navbar.committees")}
          </NavLink>

          {/* Archive dropdown */}
          <div className="relative group">
            <div
              ref={navRefs["/archive"]}
              className={`flex items-center text-white font-bold ${
                location.pathname.startsWith("/archive") ||
                location.pathname.startsWith("/adopted")
                  ? ""
                  : "hover:text-gray-300"
              } px-3 py-2 transition-colors duration-300 cursor-pointer`}
              onClick={toggleArchiveDropdown}
            >
              {t("navbar.archive")}
              <FaChevronDown
                className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                  (location.pathname.startsWith("/archive") ||
                    location.pathname.startsWith("/adopted")) &&
                  "transform rotate-180"
                }`}
              />
            </div>

            {/* Dropdown menu */}
            <div
              className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                archiveDropdownOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
            >
              <div className="py-1">
                <NavLink
                  to="/archive"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {t("navbar.archiveMain")}
                </NavLink>
                <NavLink
                  to="/adopted"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {t("navbar.adopted")}
                </NavLink>
              </div>
            </div>
          </div>

          {/* Auth buttons for desktop */}
          <div className="flex items-center ml-4 space-x-2">
            {currentUser ? (
              <div className="relative group">
                <button
                  className="flex items-center text-white hover:text-[#6A9AB0] px-3 py-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <FaUser className="mr-1" />
                  <span>
                    {currentUser.displayName ||
                      currentUser.email?.split("@")[0] ||
                      t("auth.profile")}
                  </span>
                  <FaChevronDown className="ml-1 h-4 w-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaTachometerAlt className="inline mr-2" />
                      {t("auth.profile")}
                    </Link>

                    {/* Show admin dashboard link only if user is admin */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUserShield className="inline mr-2" />
                        {t("admin.adminPanel")}
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      {t("auth.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Add login/signup buttons for desktop when not logged in */
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center text-white hover:text-[#6A9AB0] px-3 py-2"
                >
                  <FaSignInAlt className="mr-1" />
                  {t("auth.login")}
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center text-white hover:text-[#6A9AB0] px-3 py-2"
                >
                  <FaUserPlus className="mr-1" />
                  {t("auth.signup")}
                </Link>

                <Link
                  to="/signupsim"
                  className="flex items-center  max-h-18 justify-center bg-red-600 text-white px-3 py-2 rounded shadow-lg animate-pulse glow-red w-full"
                  onClick={closeMenu}
                >
                  <FaExclamationTriangle className="mr-1" /> {t("auth.signupsim")}
                </Link> 
              </div>
            )}
          </div>

          {/* Language toggle button */}
          <div className="flex items-center ml-4">
            <button
              onClick={toggleLanguage}
              className="w-8 h-6 rounded overflow-hidden transition-transform hover:scale-110 hover:cursor-pointer"
              title={flagAlt}
            >
              <img
                src={currentFlag}
                alt={flagAlt}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center space-x-2">
          {/* Language toggle for mobile */}
          <button
            onClick={toggleLanguage}
            className="w-7 h-5 rounded overflow-hidden transition-transform hover:scale-110 hover:cursor-pointer"
            title={flagAlt}
          >
            <img
              src={currentFlag}
              alt={flagAlt}
              className="w-full h-full object-cover"
            />
          </button>

          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-[#F6F4F0] hover:text-[#6A9AB0] focus:outline-none hover:cursor-pointer"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{t("navbar.openMenu")}</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
                }`}
              ></span>
              <span
                className={`absolute h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "w-0 opacity-0" : "w-6 opacity-100"
                }`}
              ></span>
              <span
                className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`transform transition-all duration-300 ease-in-out overflow-hidden lg:hidden bg-[#EAD8B1] ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-black font-bold border-l-4 border-[#6A9AB0] transition-all duration-200"
                : "block px-3 py-2 text-black font-bold hover:bg-[#d9c8a1] transition-all duration-200"
            }
            onClick={closeMenu}
            end
          >
            {t("navbar.home")}
          </NavLink>
          <NavLink
            to="/inscription"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-black font-bold border-l-4 border-black"
                : "block px-3 py-2 text-black font-bold hover:bg-[#d9c8a1]"
            }
            onClick={closeMenu}
          >
            {t("navbar.inscription")}
          </NavLink>
          <NavLink
            to="/committees"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-black font-bold border-l-4 border-black"
                : "block px-3 py-2 text-black font-bold hover:bg-[#d9c8a1]"
            }
            onClick={closeMenu}
          >
            {t("navbar.committees")}
          </NavLink>
          <NavLink
            to="/equipe"
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 text-black font-bold border-l-4 border-black"
                : "block px-3 py-2 text-black font-bold hover:bg-[#d9c8a1]"
            }
            onClick={closeMenu}
          >
            {t("navbar.equipe")}
          </NavLink>

          {/* Archive section in mobile menu */}
          <div className="block px-3 py-2 text-black font-bold hover:bg-[#d9c8a1]">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setArchiveDropdownOpen(!archiveDropdownOpen)}
            >
              <span>{t("navbar.archive")}</span>
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  archiveDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Archive dropdown items */}
            <div
              className={`pl-4 mt-2 space-y-1 overflow-hidden transition-all duration-200 ${
                archiveDropdownOpen
                  ? "max-h-20 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <NavLink
                to="/archive"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 text-black font-bold border-l-4 border-[#6A9AB0] pl-2"
                    : "block py-2 text-black font-bold hover:bg-[#d9c8a1] pl-2"
                }
                onClick={closeMenu}
              >
                {t("navbar.archiveMain")}
              </NavLink>
              <NavLink
                to="/adopted"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 text-black font-bold border-l-4 border-[#6A9AB0] pl-2"
                    : "block py-2 text-black font-bold hover:bg-[#d9c8a1] pl-2"
                }
                onClick={closeMenu}
              >
                {t("navbar.adopted")}
              </NavLink>
            </div>
          </div>

          {/* Auth links for mobile menu */}
          {currentUser ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-2 text-black font-bold border-l-4 border-[#6A9AB0] transition-all duration-200 flex items-center"
                    : "px-3 py-2 text-black font-bold hover:bg-[#d9c8a1] transition-all duration-200 flex items-center"
                }
                onClick={closeMenu}
              >
                <FaTachometerAlt className="mr-2" />
                {t("auth.dashboard")}
              </NavLink>

              {/* Admin panel link for mobile */}
              {userData && userData.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-black font-bold  hover:bg-gray-700 block px-3 py-2 rounded-md text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserShield className="inline mr-2" />
                  {t("admin.adminPanel")}
                </Link>
              )}

              {/* Logout button for mobile */}
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 text-black font-bold hover:bg-[#d9c8a1] transition-all duration-200 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-2 text-black font-bold border-l-4 border-[#6A9AB0] transition-all duration-200 flex items-center"
                    : "px-3 py-2 text-black font-bold hover:bg-[#d9c8a1] transition-all duration-200 flex items-center"
                }
                onClick={closeMenu}
              >
                <FaSignInAlt className="mr-2" />
                {t("auth.login")}
              </NavLink>

              {/* Signup link for mobile */}
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-2 text-black font-bold border-l-4 border-[#6A9AB0] transition-all duration-200 flex items-center"
                    : "px-3 py-2 text-black font-bold hover:bg-[#d9c8a1] transition-all duration-200 flex items-center"
                }
                onClick={closeMenu}
              >
                <FaUserPlus className="mr-2" />
                {t("auth.signup")}
              </NavLink>
              <Link
  to="/signupsim"
  className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded shadow-lg animate-pulse glow-red w-full"
  onClick={closeMenu}
>
  <FaExclamationTriangle className="mr-1" /> {t("auth.signupsim")}
</Link>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
