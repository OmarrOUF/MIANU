import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaSearch,
  FaDownload,
  FaUserTie,
  FaEye,
  FaUser,
  FaCheck,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";
import UserDetailsModal from "./UserDetailsModal";
import UserEditModal from "./UserEditModal";
import UserDeleteModal from "./UserDeleteModal";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorAlert from "../../UI/ErrorAlert";

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    delegateType: "all",
    paymentStatus: "all",
    hasAwards: "all",
    conferenceCount: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const isValidDate = (input) => {
    const date = new Date(input);
    return !isNaN(date.getTime());
  };
  

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create a query with ordering
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, orderBy("createdAt", "desc"));
        const userSnapshot = await getDocs(userQuery);

        const usersList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Ensure dates are properly formatted
          createdAt: isValidDate(doc.data().createdAt)
            ? new Date(doc.data().createdAt).toISOString()
            : new Date().toISOString(),

          lastLoginAt: isValidDate(doc.data().lastLoginAt)
            ? new Date(doc.data().lastLoginAt).toISOString()
            : null,
        }));

        console.log("Fetched users:", usersList.length);
        setUsers(usersList);
        setFilteredUsers(usersList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(t("admin.errorFetchingUsers"));
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          (user.displayName && user.displayName.toLowerCase().includes(term)) ||
          (user.firstName && user.firstName.toLowerCase().includes(term)) ||
          (user.lastName && user.lastName.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.schoolName && user.schoolName.toLowerCase().includes(term))
      );
    }

    // Apply role filter
    if (filters.role !== "all") {
      result = result.filter((user) => user.role === filters.role);
    }

    // Apply delegate type filter
    if (filters.delegateType !== "all") {
      result = result.filter(
        (user) => user.delegateType === filters.delegateType
      );
    }

    // Apply payment status filter
    if (filters.paymentStatus !== "all") {
      const isPaid = filters.paymentStatus === "paid";
      result = result.filter((user) => user.hasPaid === isPaid);
    }

    // Apply awards filter
    if (filters.hasAwards !== "all") {
      result = result.filter((user) => user.hasAwards === filters.hasAwards);
    }

    // Apply conference count filter
    if (filters.conferenceCount !== "all") {
      result = result.filter(
        (user) => user.conferenceCount === filters.conferenceCount
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;

        const aValue =
          typeof a[sortConfig.key] === "string"
            ? a[sortConfig.key].toLowerCase()
            : a[sortConfig.key];
        const bValue =
          typeof b[sortConfig.key] === "string"
            ? b[sortConfig.key].toLowerCase()
            : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
  }, [users, searchTerm, filters, sortConfig]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Toggle payment status
  const togglePaymentStatus = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        hasPaid: !currentStatus,
      });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, hasPaid: !currentStatus } : user
        )
      );

      toast.success(
        currentStatus
          ? t("admin.paymentStatusMarkedUnpaid")
          : t("admin.paymentStatusMarkedPaid"),
        { position: "top-right" }
      );
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error(t("admin.errorUpdatingPaymentStatus"), {
        position: "top-right",
      });
    }
  };

  // Delete user
  const deleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteDoc(doc(db, "users", selectedUser.id));

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );

      setShowDeleteModal(false);
      setSelectedUser(null);

      toast.success(t("admin.userDeleted"), { position: "top-right" });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(t("admin.errorDeletingUser"), { position: "top-right" });
    }
  };

  // Update user
  const updateUser = async (updatedUserData) => {
    try {
      const userRef = doc(db, "users", updatedUserData.id);
      await updateDoc(userRef, updatedUserData);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUserData.id
            ? { ...user, ...updatedUserData }
            : user
        )
      );

      setShowEditModal(false);
      setSelectedUser(null);

      toast.success(t("admin.userUpdated"), { position: "top-right" });
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(t("admin.errorUpdatingUser"), { position: "top-right" });
    }
  };

  // Export users to CSV
  const exportToCSV = () => {
    // Headers for CSV
    const headers = [
      t("admin.name"),
      t("admin.email"),
      t("admin.role"),
      t("admin.delegateType"),
      t("admin.school"),
      t("admin.phoneNumber"),
      t("admin.dateOfBirth"),
      t("admin.paymentStatus"),
      t("admin.conferenceCount"),
      t("admin.hasAwards"),
      t("admin.createdAt"),
      t("admin.lastLoginAt"),
    ];

    // Format user data for CSV
    const csvData = filteredUsers.map((user) => [
      user.displayName || `${user.firstName || ""} ${user.lastName || ""}`,
      user.email || "",
      user.role || "",
      user.delegateType || "",
      user.schoolName || "",
      user.phoneNumber || "",
      user.dateOfBirth || "",
      user.hasPaid ? t("admin.paid") : t("admin.unpaid"),
      user.conferenceCount || "0",
      user.hasAwards === "yes" ? t("admin.yes") : t("admin.no"),
      user.createdAt ? new Date(user.createdAt).toLocaleString() : "",
      user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "",
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(t("admin.exportSuccess"), { position: "top-right" });
  };

  // View user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Edit user
  const editUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Confirm delete user
  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Render role badge
  const renderRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            {t("admin.adminRole")}
          </span>
        );
      case "delegate":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            <FaUser className="inline mr-1" />
            {t("admin.delegateRole")}
          </span>
        );
      case "advisor":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            <FaUserTie className="inline mr-1" />
            {t("admin.advisorRole")}
          </span>
        );
      case "observer":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            <FaEye className="inline mr-1" />
            {t("admin.observerRole")}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {role || t("admin.unknownRole")}
          </span>
        );
    }
  };

  // Render delegate type badge
  const renderDelegateTypeBadge = (delegateType) => {
    if (!delegateType) return null;

    return delegateType === "international" ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        <FaGlobe className="inline mr-1" />
        {t("admin.international")}
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
        {t("admin.national")}
      </span>
    );
  };

  // Render payment status badge
  const renderPaymentStatusBadge = (hasPaid) => {
    return hasPaid ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        <FaCheck className="inline mr-1" />
        {t("admin.paid")}
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        <FaTimes className="inline mr-1" />
        {t("admin.unpaid")}
      </span>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {t("admin.userManagement")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("admin.userManagementDescription")}
          </p>
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaDownload className="mr-2" />
            {t("admin.export")}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={t("admin.searchUsers")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="inline-block">
              <label htmlFor="roleFilter" className="sr-only">
                {t("admin.filterByRole")}
              </label>
              <select
                id="roleFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="all">{t("admin.allRoles")}</option>
                <option value="delegate">{t("admin.delegateRole")}</option>
                <option value="advisor">{t("admin.advisorRole")}</option>
                <option value="observer">{t("admin.observerRole")}</option>
                <option value="admin">{t("admin.adminRole")}</option>
              </select>
            </div>

            <div className="inline-block">
              <label htmlFor="delegateTypeFilter" className="sr-only">
                {t("admin.filterByDelegateType")}
              </label>
              <select
                id="delegateTypeFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filters.delegateType}
                onChange={(e) =>
                  handleFilterChange("delegateType", e.target.value)
                }
              >
                <option value="all">{t("admin.allDelegateTypes")}</option>
                <option value="national">{t("admin.national")}</option>
                <option value="international">
                  {t("admin.international")}
                </option>
              </select>
            </div>

            <div className="inline-block">
              <label htmlFor="paymentStatusFilter" className="sr-only">
                {t("admin.filterByPaymentStatus")}
              </label>
              <select
                id="paymentStatusFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange("paymentStatus", e.target.value)
                }
              >
                <option value="all">{t("admin.allPaymentStatuses")}</option>
                <option value="paid">{t("admin.paid")}</option>
                <option value="unpaid">{t("admin.unpaid")}</option>
              </select>
            </div>

            <div className="inline-block">
              <label htmlFor="hasAwardsFilter" className="sr-only">
                {t("admin.filterByAwards")}
              </label>
              <select
                id="hasAwardsFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filters.hasAwards}
                onChange={(e) =>
                  handleFilterChange("hasAwards", e.target.value)
                }
              >
                <option value="all">{t("admin.allAwardsStatuses")}</option>
                <option value="yes">{t("admin.hasAwards")}</option>
                <option value="no">{t("admin.noAwards")}</option>
              </select>
            </div>

            <div className="inline-block">
              <label htmlFor="conferenceCountFilter" className="sr-only">
                {t("admin.filterByConferenceCount")}
              </label>
              <select
                id="conferenceCountFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filters.conferenceCount}
                onChange={(e) =>
                  handleFilterChange("conferenceCount", e.target.value)
                }
              >
                <option value="all">{t("admin.allConferenceCounts")}</option>
                <option value="0">{t("admin.noConferences")}</option>
                <option value="1-2">1-2 {t("admin.conferences")}</option>
                <option value="3-5">3-5 {t("admin.conferences")}</option>
                <option value="6+">6+ {t("admin.conferences")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center my-12">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorAlert message={error} />}

      {/* Users Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.name")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.email")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.role")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.school")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.experience")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.paymentStatus")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {t("admin.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {t("admin.noUsersFound")}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName ||
                                  `${user.firstName || ""} ${
                                    user.lastName || ""
                                  }`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            {renderRoleBadge(user.role)}
                            {renderDelegateTypeBadge(user.delegateType)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.schoolName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.schoolYear}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            {user.conferenceCount &&
                              user.conferenceCount !== "0" && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  <FaHistory className="inline mr-1" />
                                  {user.conferenceCount}{" "}
                                  {t("admin.conferences")}
                                </span>
                              )}
                            {user.hasAwards === "yes" && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                <FaTrophy className="inline mr-1" />
                                {t("admin.hasAwards")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              togglePaymentStatus(user.id, user.hasPaid)
                            }
                            className="focus:outline-none"
                          >
                            {renderPaymentStatusBadge(user.hasPaid)}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewUserDetails(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title={t("admin.viewDetails")}
                            >
                              <FaSearch />
                            </button>
                            <button
                              onClick={() => editUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title={t("admin.edit")}
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => confirmDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
                              title={t("admin.delete")}
                            >
                              <FaTrash />
                            </button>
                            <button
                              onClick={() =>
                                togglePaymentStatus(user.id, user.hasPaid)
                              }
                              className={`${
                                user.hasPaid
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                              title={
                                user.hasPaid
                                  ? t("admin.markAsUnpaid")
                                  : t("admin.markAsPaid")
                              }
                            >
                              <FaMoneyBillWave />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* User Edit Modal */}
      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={updateUser}
        />
      )}

      {/* User Delete Modal */}
      {showDeleteModal && selectedUser && (
        <UserDeleteModal
          user={selectedUser}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={deleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
