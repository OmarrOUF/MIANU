import { updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { toast } from "react-toastify";
import Modal from "../../UI/Modal";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaCalendarAlt,
  FaGlobe,
  FaHeartbeat,
  FaHistory,
  FaTrophy,
  FaMoneyBillWave,
} from "react-icons/fa";

const UserEditModal = ({ user, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    schoolName: user.schoolName || "",
    schoolYear: user.schoolYear || "",
    age: user.age || "",
    role: user.role || "delegate",
    delegateType: user.delegateType || "national",
    country: user.country || "",
    healthProblems: user.healthProblems || "",
    allergies: user.allergies || "",
    hasPaid: user.hasPaid || false,
    conferenceCount: user.conferenceCount || "0",
    conferencesList: user.conferencesList || "",
    hasAwards: user.hasAwards || "no",
    awardsList: user.awardsList || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleDelegateTypeChange = (delegateType) => {
    setFormData((prev) => ({
      ...prev,
      delegateType,
    }));
  };

  const handleHasAwardsChange = (hasAwards) => {
    setFormData((prev) => ({
      ...prev,
      hasAwards,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create updated user data
      const updatedUserData = {
        ...formData,
        displayName: `${formData.firstName} ${formData.lastName}`,
        updatedAt: serverTimestamp(),
      };

      // Remove country if not international
      if (
        formData.delegateType !== "international" &&
        (formData.role === "delegate" || formData.role === "advisor")
      ) {
        delete updatedUserData.country;
      }

      // Remove delegateType if not delegate or advisor
      if (formData.role !== "delegate" && formData.role !== "advisor") {
        delete updatedUserData.delegateType;
      }

      // Update user in Firestore
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updatedUserData);

      // Update local state
      onUpdate({
        ...user,
        ...updatedUserData,
      });

      toast.success(t("admin.userUpdated"), { position: "top-right" });
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(t("admin.errorUpdatingUser"), { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={t("admin.editUser")} onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.personalInformation")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaUser className="inline mr-1" /> {t("admin.firstName")}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaUser className="inline mr-1" /> {t("admin.lastName")}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <FaEnvelope className="inline mr-1" /> {t("admin.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaPhone className="inline mr-1" /> {t("admin.phoneNumber")}
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaCalendarAlt className="inline mr-1" /> {t("admin.age")}
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="10"
                  max="99"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.roleInformation")}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.userRole")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    formData.role === "delegate"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleChange("delegate")}
                >
                  {t("admin.delegateRole")}
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    formData.role === "advisor"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleChange("advisor")}
                >
                  {t("admin.advisorRole")}
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    formData.role === "observer"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleChange("observer")}
                >
                  {t("admin.observerRole")}
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    formData.role === "admin"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleChange("admin")}
                >
                  {t("admin.adminRole")}
                </button>
              </div>
            </div>

            {/* Only show delegate type for delegates and advisors */}
            {(formData.role === "delegate" || formData.role === "advisor") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaGlobe className="inline mr-1" /> {t("admin.delegateType")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      formData.delegateType === "national"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleDelegateTypeChange("national")}
                  >
                    {t("admin.national")}
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      formData.delegateType === "international"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleDelegateTypeChange("international")}
                  >
                    {t("admin.international")}
                  </button>
                </div>
              </div>
            )}

            {/* Show country field for international delegates and advisors */}
            {(formData.role === "delegate" || formData.role === "advisor") &&
              formData.delegateType === "international" && (
                <div className="mb-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaGlobe className="inline mr-1" /> {t("admin.country")}
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              )}

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasPaid"
                  checked={formData.hasPaid}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <FaMoneyBillWave className="inline mr-1" />{" "}
                  {t("admin.markAsPaid")}
                </span>
              </label>
            </div>
          </div>

          {/* School Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.schoolInformation")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="schoolName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaSchool className="inline mr-1" /> {t("admin.schoolName")}
                </label>
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.schoolName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="schoolYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaCalendarAlt className="inline mr-1" />{" "}
                  {t("admin.schoolYear")}
                </label>
                <input
                  id="schoolYear"
                  name="schoolYear"
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.schoolYear}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.healthInformation")}
            </h3>

            <div className="mb-4">
              <label
                htmlFor="healthProblems"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <FaHeartbeat className="inline mr-1" />{" "}
                {t("admin.healthProblems")}
              </label>
              <textarea
                id="healthProblems"
                name="healthProblems"
                rows="2"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.healthProblems}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <FaHeartbeat className="inline mr-1" /> {t("admin.allergies")}
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows="2"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.allergies}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* MUN Experience */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("admin.munExperience")}
            </h3>

            <div className="mb-4">
              <label
                htmlFor="conferenceCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <FaHistory className="inline mr-1" />{" "}
                {t("admin.conferenceCount")}
              </label>
              <select
                id="conferenceCount"
                name="conferenceCount"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.conferenceCount}
                onChange={handleChange}
              >
                <option value="0">{t("admin.noConferences")}</option>
                <option value="1-2">1-2</option>
                <option value="3-5">3-5</option>
                <option value="6+">6+</option>
              </select>
            </div>

            {formData.conferenceCount !== "0" && (
              <div className="mb-4">
                <label
                  htmlFor="conferencesList"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaHistory className="inline mr-1" />{" "}
                  {t("admin.conferencesList")}
                </label>
                <textarea
                  id="conferencesList"
                  name="conferencesList"
                  rows="3"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.conferencesList}
                  onChange={handleChange}
                ></textarea>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaTrophy className="inline mr-1" /> {t("admin.hasAwards")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    formData.hasAwards === "yes"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleHasAwardsChange("yes")}
                >
                  {t("admin.yes")}
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    formData.hasAwards === "no"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleHasAwardsChange("no")}
                >
                  {t("admin.no")}
                </button>
              </div>
            </div>

            {formData.hasAwards === "yes" && (
              <div className="mb-4">
                <label
                  htmlFor="awardsList"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaTrophy className="inline mr-1" /> {t("admin.awardsList")}
                </label>
                <textarea
                  id="awardsList"
                  name="awardsList"
                  rows="3"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formData.awardsList}
                  onChange={handleChange}
                ></textarea>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("admin.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("admin.saving")}
                </>
              ) : (
                t("admin.saveChanges")
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserEditModal;
