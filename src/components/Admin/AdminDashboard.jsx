import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserShield, FaBookOpen, FaClipboardList, FaUsers, FaChartBar, FaHistory, FaUniversity } from 'react-icons/fa';
import SEO from '../SEO/SEO';
import UserManagement from './UserManagement/UserManagement';
import AdminHeader from './AdminHeader';
import AdminStats from './AdminStats';
import SystemLogs from './SystemLogs/SystemLogs';
import CommitteePreferences from './CommitteePreferences/CommitteePreferences';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Spinner from '../Spinner'; // Import Spinner component

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, userData, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  
  // Check if user is admin
  if (loading) {
    return <Spinner />;
  }
  
  // Updated check to use userData instead of currentUser.role
  if (!currentUser || !userData || userData.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <section className="py-6 xs:py-10 relative overflow-hidden font-serif">
      <SEO 
        title={`${t('admin.dashboard')} | MIANU-SM III`}
        description={t('admin.dashboardDescription')}
        noindex={true} // Don't index admin pages
      />
      
      {/* Newspaper container */}
      <div className="max-w-6xl mx-auto relative">
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
          
          {/* Admin Dashboard Header */}
          <AdminHeader />
          
          {/* Admin Navigation Tabs */}
          <div className="border-b border-gray-300 mb-6">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === 'users'
                    ? 'border-[#3A6D8C] text-[#3A6D8C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUsers className="mr-2" />
                {t('admin.userManagement')}
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === 'stats'
                    ? 'border-[#3A6D8C] text-[#3A6D8C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaChartBar className="mr-2" />
                {t('admin.statistics')}
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === 'logs'
                    ? 'border-[#3A6D8C] text-[#3A6D8C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaHistory className="mr-2" />
                {t('admin.systemLogs')}
              </button>
              <button
                onClick={() => setActiveTab('committees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === 'committees'
                    ? 'border-[#3A6D8C] text-[#3A6D8C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUniversity className="mr-2" />
                {t('admin.committeePreferences')}
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'stats' && <AdminStats />}
            {activeTab === 'logs' && <SystemLogs />}
            {activeTab === 'committees' && <CommitteePreferences />}
          </div>
          
          {/* Page footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
            <div className="flex justify-center items-center">
              <FaBookOpen className="text-[#3A6D8C] mr-2" />
              <span>MIANU-SM III | {t('admin.adminPanel')}</span>
            </div>
          </div>
          
          {/* Page corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[15px] border-t-transparent border-r-[#c0c0c0] shadow-md transform -translate-y-px translate-x-px"></div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;