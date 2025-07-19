import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaInstagram, FaGlobe } from "react-icons/fa6";
import Logo from "../../public/MIANULOGO.png";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav>
        <Navbar></Navbar>
      </nav>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Main Content */}
      <main
        className={`relative flex-1 z-10 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "blur-sm" : ""
        }`}
        style={{
          background: "#f6f4f0",
          position: "relative",
        }}
      >
        {/* Watermark */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10"
          style={{
            backgroundImage: `url(${Logo})`,
            zIndex: "-1",
          }}
        ></div>

        {/* Adjusted padding to account for fixed navbar */}
        <div className="pt-20 pb-0 relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Footer Section */}
      <footer>
        <div className="bg-[#001F3F] text-white py-9 flex flex-col items-center text-center relative">
          <div className="flex flex-col sm:flex-row justify-center items-center sm:space-y-0 sm:space-x-6 mb-10">
            <div></div>
            <div>
              <p
                className="text-xl"
                style={{ fontFamily: "Markazi Text, Serif" }}
              >
                {t('footer.address')}
              </p>
              <p
                className="text-xl"
                style={{ fontFamily: "Markazi Text, Serif" }}
              >
                equipemianu@gmail.com
              </p>
            </div>
          </div>

          <div
            className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center sm:mt-0"
            style={{ width: "100%" }}
          >
            <p
              className="text-xl"
              style={{ fontFamily: "Markazi Text, Serif" }}
            >
              {t('footer.followUs')}{" "}
              <a
                href="https://www.instagram.com/sm.mianu/"
                className="underline"
              >
                Instagram
              </a>{" "}
              {t('footer.and')}{" "}
              <a href="https://www.tiktok.com/@mianu.sm/" className="underline">
                Tiktok
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Business Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center h-full">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h3 className="text-2xl font-semibold">GOOBA</h3>
            <p className="text-sm mt-2">© 2025 GOOBA, All Rights Reserved.</p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://goobaeg.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-gray-300 transition-colors"
            >
              <FaGlobe />
            </a>
            <a
              href="https://www.instagram.com/gooba_eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-gray-300 transition-colors"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
