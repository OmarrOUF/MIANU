import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaUsers, FaUserCheck, FaUserTimes, FaUserShield, FaDownload } from 'react-icons/fa';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorAlert from '../UI/ErrorAlert';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminStats = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    paidUsers: 0,
    unpaidUsers: 0,
    adminUsers: 0,
    roleDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUsers(usersList);
        
        // Calculate stats
        const totalUsers = usersList.length;
        const paidUsers = usersList.filter(user => user.hasPaid).length;
        const unpaidUsers = totalUsers - paidUsers;
        const adminUsers = usersList.filter(user => user.role === 'admin').length;
        
        // Calculate role distribution
        const roleDistribution = {};
        usersList.forEach(user => {
          const role = user.role || 'user';
          roleDistribution[role] = (roleDistribution[role] || 0) + 1;
        });
        
        setStats({
          totalUsers,
          paidUsers,
          unpaidUsers,
          adminUsers,
          roleDistribution
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(t('admin.errorFetchingStats'));
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [t]);
  
  // Prepare chart data
  const chartData = {
    labels: Object.keys(stats.roleDistribution).map(role => 
      role === 'admin' ? t('admin.roleAdmin') :
      role === 'organizer' ? t('admin.roleOrganizer') :
      role === 'delegate' ? t('admin.roleDelegate') :
      t('admin.roleUser')
    ),
    datasets: [
      {
        data: Object.values(stats.roleDistribution),
        backgroundColor: [
          '#4B5563', // admin - gray
          '#3B82F6', // organizer - blue
          '#10B981', // delegate - green
          '#F59E0B', // user - yellow
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Export stats to CSV
  const exportStatsToCSV = () => {
    if (users.length === 0) return;
    
    // Define CSV headers
    const headers = [
      'ID',
      t('admin.email'),
      t('admin.displayName'),
      t('admin.role'),
      t('admin.paymentStatus'),
      t('auth.phoneNumber'),
      t('auth.schoolName'),
      t('auth.createdAt'),
      t('auth.lastLoginAt'),
      t('auth.committeePriorities')
    ].join(',');
    
    // Convert user data to CSV rows
    const rows = users.map(user => {
      // Format committee priorities if they exist
      let committeePriorities = '';
      if (user.committeePriorities && Array.isArray(user.committeePriorities)) {
        committeePriorities = user.committeePriorities.join('; ');
      }
      
      return [
        user.id || '',
        user.email || '',
        user.displayName || '',
        user.role || t('admin.defaultRole'),
        user.hasPaid ? t('admin.paid') : t('admin.unpaid'),
        user.phoneNumber || '',
        user.schoolName || '',
        user.createdAt || '',
        user.lastLoginAt || '',
        committeePriorities
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mianu_stats_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner message={t('admin.loadingStats')} />;
  }
  
  if (error) {
    return <ErrorAlert message={error} />;
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={exportStatsToCSV}
          disabled={users.length === 0}
          className={`flex items-center px-3 py-2 rounded text-sm ${
            users.length === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-green-100 hover:bg-green-200 text-green-800'
          }`}
        >
          <FaDownload className="mr-2" />
          {t('admin.export')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users Card */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-800">
              <FaUsers className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">{t('admin.totalUsers')}</p>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        {/* Paid Users Card */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <FaUserCheck className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">{t('admin.paidUsers')}</p>
              <p className="text-2xl font-semibold">{stats.paidUsers}</p>
            </div>
          </div>
        </div>
        
        {/* Unpaid Users Card */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-800">
              <FaUserTimes className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">{t('admin.unpaidUsers')}</p>
              <p className="text-2xl font-semibold">{stats.unpaidUsers}</p>
            </div>
          </div>
        </div>
        
        {/* Admin Users Card */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <FaUserShield className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">{t('admin.adminUsers')}</p>
              <p className="text-2xl font-semibold">{stats.adminUsers}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Role Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.userRolesDistribution')}</h3>
        <div className="h-64">
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default AdminStats;