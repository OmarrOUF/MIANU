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
  FaPassport,
  FaListOl,
  FaChevronDown,
  FaChevronUp,
  FaGripVertical,
  FaTrophy,
  FaHistory,
} from "react-icons/fa";
import { toast } from "react-toastify";
import SEO from "../SEO/SEO";
import committeesDataSIM from "../../data/committeesDataSIM.json";
import CommitteePriority from "./CommitteePriority"; // Import the CommitteePriority component

const SignupSimulation = () => {
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
  const [delegateType, setDelegateType] = useState("national");
  const [schoolYear, setSchoolYear] = useState("");
  // Combined health issues and allergies
  const [healthConcerns, setHealthConcerns] = useState("");
  const [country, setCountry] = useState("");
  
  // New fields for delegates
  const [munsAttended, setMunsAttended] = useState("");
  const [munsList, setMunsList] = useState("");
  const [hasAwards, setHasAwards] = useState(false);
  const [awardsList, setAwardsList] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coffeeStains, setCoffeeStains] = useState([]);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
    generateCoffeeStains();
  }, [currentUser, navigate]);

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

  // const handlePassportImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPassportImage(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPassportPreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  // };

  const [committeePriority, setCommitteePriority] = useState(committeesDataSIM.committees);

  const handlePriorityChange = (newPriority) => {
    setCommitteePriority(newPriority);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!committeePriority || committeePriority.length === 0) {
      const errorMsg = t("auth.firstPriorityCommitteeRequired") || "First priority committee is required";
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
    
    if (password !== passwordConfirm) {
      analytics.logFormSubmit("signup_form", false);
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
      analytics.logFormSubmit("signup_form", false);
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
      !schoolYear
    ) {
      analytics.logFormSubmit("signup_form", false);
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
    
    try {
      setError("");
      setLoading(true);
      const displayName = `${firstName} ${lastName}`;
      const additionalData = {
        firstName: firstName,
        lastName: lastName,
        schoolName: schoolName,
        phoneNumber: phoneNumber,
        role: "delegate",
        language: i18n.language,
        delegateType: delegateType,
        schoolYear: schoolYear,
        healthConcerns: healthConcerns || "", // Combined field
        committeePriorities: committeePriority, // Pass the full committee objects
        // Add new fields
        munsAttended: munsAttended || "0",
        hasAwards: hasAwards,
        awardsList: awardsList || "",
        SimulationAccount: true
      };
     
      await signup(
        email,
        password,
        displayName,
        additionalData,
      );
      analytics.logSignUp("email");
      analytics.logFormSubmit("signup_form", true);
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
      analytics.logFormSubmit("signup_form", false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title={t("auth.signupsim")}
        description={t("auth.signupsimSubtitle")}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("auth.signupsim"),
          description: t("auth.signupsimSubtitle"),
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
                name: t("auth.signupsim"),
                item: "https://mianu-sm.com/signupsim",
              },
            ],
          },
        }}
      />

      <section className="py-20 xs:py-24 relative overflow-hidden font-serif">
        <div className="max-w-xl mx-auto relative"> {/* Changed max-w-md to max-w-xl */}
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
                {t("auth.signupsim")}
              </h1>
              <div className="italic text-xs xs:text-sm my-2">
                {t("auth.signupsimSubtitle")}
              </div>
              <div className="italic text-xs xs:text-sm my-2">
                {t("auth.signupsimPrice")}
              </div>
            </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}

            <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
              <div className="mb-4">
              
                
                
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

              <div className="flex flex-col sm:flex-row gap-4">
                

               

                <div className="flex-1">
  <label
    className="block text-gray-700 text-sm font-bold mb-2"
    htmlFor="schoolYear"
  >
    {t("auth.schoolYear")}
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaSchool className="text-gray-400" />
    </div>
    <select
      id="schoolYear"
      value={schoolYear}
      onChange={(e) => setSchoolYear(e.target.value)}
      required
      className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="" disabled>
        {t("auth.schoolYearPlaceholder")}
      </option>
      <option value="3eme preparatoire">3ème préparatoire</option>
      <option value="1ere secondaire">1ère secondaire</option>
      <option value="2eme secondaire">2ème secondaire</option>
      <option value="3eme secondaire">3ème secondaire</option>

    </select>
  </div>
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

              {/* Combined Health Concerns (Problems + Allergies) */}
                

              
  
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

                {/* Number of MUNs Attended */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="munsAttended"
          >
            {t("auth.munsAttended") || "How many MUNs have you participated in?"}
          </label>
          <input
            id="munsAttended"
            type="number"
            value={munsAttended}
            onChange={(e) => setMunsAttended(e.target.value)}
            className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder={t("auth.munsAttendedPlaceholder") || "Enter number of MUNs"}
          />
        </div>

        {/* Awards Won */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("auth.hasAwards") || "Have you won any awards in MUN?"}
          </label>
          <div className="flex items-center">
            <input
              id="hasAwardsYes"
              type="radio"
              value="yes"
              checked={hasAwards === true}
              onChange={() => setHasAwards(true)}
              className="h-4 w-4 text-[#1282A2] focus:ring-[#1282A2]"
            />
            <label htmlFor="hasAwardsYes" className="ml-2 block text-sm text-gray-700">
              {t("auth.yes") || "Yes"}
            </label>
            <input
              id="hasAwardsNo"
              type="radio"
              value="no"
              checked={hasAwards === false}
              onChange={() => setHasAwards(false)}
              className="ml-4 h-4 w-4 text-[#1282A2] focus:ring-[#1282A2]"
            />
            <label htmlFor="hasAwardsNo" className="ml-2 block text-sm text-gray-700">
              {t("auth.no") || "No"}
            </label>
          </div>
        </div>

        {/* List of Awards */}
        {hasAwards && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="awardsList"
            >
              {t("auth.awardsList") || "What awards have you won?"}
            </label>
            <textarea
              id="awardsList"
              value={awardsList}
              onChange={(e) => setAwardsList(e.target.value)}
              className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={t("auth.awardsListPlaceholder") || "List your awards"}
              rows="3"
            />
          </div>
        )}
  
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
                <CommitteePriority
                  committees={committeePriority}
                  onChange={handlePriorityChange}
                />

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center bg-[#1282A2] hover:bg-[#034078] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                  >
                    <FaUserPlus className="mr-2" />
                    {loading ? t("auth.signingUpsim") : t("auth.signupsimButton")}
                  </button>
                </div>
  
                
              </form>
            </div>
          </div>
        </section>
      </>
    );
  };

  export default SignupSimulation;