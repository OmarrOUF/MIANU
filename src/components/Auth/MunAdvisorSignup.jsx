import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserPlus,
  FaSchool,
  FaPhone,
  FaGlobe,
  FaCalendarAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { toast } from "react-toastify";
import SEO from "../SEO/SEO";

const MunAdvisorSignup = () => {
  const { t, i18n } = useTranslation();
  const { signup, currentUser, error: authError } = useAuth();
  const navigate = useNavigate();
  const analytics = useAnalytics();

  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [delegateType, setDelegateType] = useState("advisor"); // Changed default to advisor
  // Replace age with dateOfBirth
  const [dateOfBirth, setDateOfBirth] = useState("");
  // Use a single health concerns field instead of separate fields
  const [healthConcerns, setHealthConcerns] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coffeeStains, setCoffeeStains] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
    generateCoffeeStains();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (delegateType === "international") {
      navigate("/signup");
    }
    if (delegateType === "national") {
      navigate("/signup"); 
    }
  }, [delegateType, navigate]);

  const generateCoffeeStains = () => {
    const stains = [];
    const stainImages = [
      "/assets/coffee-stain-1.png",
      "/assets/coffee-stain-2.png",
      "/assets/coffee-stain-3.png",
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
        zIndex: Math.floor(Math.random() * 2),
      });
    }
    setCoffeeStains(stains);
  };

  const renderCoffeeStains = () => {
    return coffeeStains.map((stain, index) => (
      <div
        key={`stain-${index}`}
        className={`
          absolute pointer-events-none mix-blend-multiply
          ${stain.zIndex === 0 ? "z-0" : "z-10"}
          ${
            stain.opacity <= 0.15
              ? "opacity-10"
              : stain.opacity <= 0.25
              ? "opacity-20"
              : "opacity-30"
          }
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
    
    if (password !== passwordConfirm) {
      analytics.logFormSubmit("advisor_signup_form", false);
      const errorMsg = t("auth.passwordsDoNotMatch");
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (password.length < 6) {
      analytics.logFormSubmit("advisor_signup_form", false);
      const errorMsg = t("auth.passwordTooShort");
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (
      !firstName ||
      !lastName ||
      !email ||
      !schoolName ||
      !phoneNumber ||
      !dateOfBirth // Changed from age to dateOfBirth
    ) {
      analytics.logFormSubmit("advisor_signup_form", false);
      const errorMsg =
        t("auth.requiredFieldsMissing") || "Please fill in all required fields";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (delegateType === "international" && (!country)) {
      analytics.logFormSubmit("advisor_signup_form", false);
      const errorMsg =
        t("auth.internationalFieldsMissing") ||
        "Please fill in all required international fields";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      setError("");
      setLoading(true);
      const displayName = `${firstName} ${lastName}`;
      const additionalData = {
        firstName: firstName,
        lastName: lastName,
        schoolName: schoolName,
        phoneNumber: phoneNumber,
        role: "advisor", // Set role to advisor
        language: i18n.language,
        delegateType: delegateType,
        dateOfBirth: dateOfBirth, // Changed from age to dateOfBirth
        healthConcerns: healthConcerns || "", // Use single healthConcerns field
      };
      if (delegateType === "international") {
        additionalData.country = country;
      }
      await signup(
        email,
        password,
        displayName,
        additionalData,
      );
      analytics.logSignUp("email");
      analytics.logFormSubmit("advisor_signup_form", true);
      toast.success(t("auth.signupSuccess"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Force a re-render of the app before navigation
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      let errorMessage = t("auth.signupError");
      if (error.code === "auth/email-already-in-use") {
        errorMessage = t("auth.emailAlreadyInUse");
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("auth.invalidEmail");
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      analytics.logFormSubmit("advisor_signup_form", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title={t("auth.advisorSignup") || "MUN Advisor Signup"}
        description={t("auth.advisorSignupSubtitle") || "Register as a MUN Advisor"}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("auth.advisorSignup") || "MUN Advisor Signup",
          description: t("auth.advisorSignupSubtitle") || "Register as a MUN Advisor",
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://mianu-sm.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t("auth.advisorSignup") || "MUN Advisor Signup",
                item: "https://mianu-sm.com/advisor-signup",
              },
            ],
          },
        }}
      />

      <section className="py-20 xs:py-24 relative overflow-hidden font-serif">
        <div className="max-w-xl mx-auto relative">
          <div
            className="p-4 xs:p-8 bg-[#f6f4f0] shadow-lg border border-gray-300 relative font-serif"
            style={{
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: "url('/paper-texture.jpg')",
                backgroundRepeat: "repeat",
                backgroundSize: "500px",
              }}
            ></div>

            {renderCoffeeStains()}

            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#c0c0c0] shadow-md transform -translate-y-px translate-x-px"></div>

            <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-6 xs:mb-8 relative">
              <h1 className="font-playfair text-4xl xs:text-5xl font-black m-0 tracking-tighter uppercase">
                {t("auth.advisorSignup") || "MUN Advisor Signup"}
              </h1>
              <div className="italic text-xs xs:text-sm my-2">
                {t("auth.advisorSignupSubtitle") || "Register as a MUN Advisor"}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                <div className="text-center mt-4">
        <p className="text-sm">
          {t("auth.wantToSignupAsDelegate")}{" "}
          <Link
            to="/signup"
            className="text-[#1282A2] hover:text-[#034078] font-bold"
          >
            {t("auth.delegateSignupLink") || "Sign up as a delegate"}
          </Link>
        </p>
      </div>
                </label>
                
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    {t("auth.firstName")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t("auth.firstNamePlaceholder")}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lastName"
                  >
                    {t("auth.lastName")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t("auth.lastNamePlaceholder")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dateOfBirth"
                >
                  {t("auth.dateOfBirth") || "Date of Birth"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t("auth.dateOfBirthPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="schoolName"
                >
                  {t("auth.schoolName")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSchool className="text-gray-400" />
                  </div>
                  <input
                    id="schoolName"
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t("auth.schoolNamePlaceholder")}
                  />
                </div>
              </div>

              {/* Replace the separate health problems and allergies fields with a single health concerns field */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="healthConcerns"
                >
                  {t("auth.healthConcerns") || "Health Concerns & Allergies"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHeartbeat className="text-gray-400" />
                  </div>
                  <textarea
                    id="healthConcerns"
                    value={healthConcerns}
                    onChange={(e) => setHealthConcerns(e.target.value)}
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t("auth.healthConcernsPlaceholder") || "List any health concerns or allergies..."}
                    rows="3"
                  />
                </div>
              </div>

              {/* International-only fields */}
              {delegateType === "international" && (
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="country"
                  >
                    {t("auth.country")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobe className="text-gray-400" />
                    </div>
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={t("auth.countryPlaceholder")}
                    />
                  </div>
                </div>
              )}

              {/* Phone Number */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phoneNumber"
                >
                  {t("auth.phoneNumber")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t("auth.phoneNumberPlaceholder")}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  {t("auth.email")}
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
                    placeholder={t("auth.emailPlaceholder")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  {t("auth.password")}
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
                    placeholder={t("auth.passwordPlaceholder")}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="passwordConfirm"
                >
                  {t("auth.confirmPassword")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-[#1282A2] hover:bg-[#034078] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  <FaUserPlus className="mr-2" />
                  {loading ? t("auth.signingUp") : (t("auth.advisorSignupButton") || "Register as Advisor")}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <Link
                    to="/login"
                    className="text-[#1282A2] hover:text-[#034078] font-bold"
                  >
                    {t("auth.loginLink")}
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

export default MunAdvisorSignup;