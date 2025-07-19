import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import logService from '../../../firebase/logService';
import { FaSearch, FaFilter, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import LogFilters from './LogFilters';
import LogTable from './LogTable';

const SystemLogs = () => {
  const { t, i18n } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    module: '',
    userId: '',
    startDate: null,
    endDate: null,
    limit: 100
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const logsData = await logService.getLogs(filters);
      setLogs(logsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(t('admin.errorFetchingLogs'));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const applyFilters = () => {
    fetchLogs();
    setShowFilters(false);
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;

    const locale = i18n.language === 'fr' ? fr : enUS;
    
    // Prepare CSV content
    const headers = [
      t('admin.timestamp'), 
      t('admin.action'), 
      t('admin.module'), 
      t('admin.user'), 
      t('admin.details')
    ].join(',');
    
    const rows = logs.map(log => [
      format(log.timestamp.toDate(), 'PPpp', { locale }),
      log.action,
      log.module,
      log.userEmail,
      JSON.stringify(log.details).replace(/,/g, ';')
    ].join(','));
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `system_logs_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-800">
          {t('admin.systemLogs')}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            <FaFilter className="mr-2" />
            {t('admin.filter')}
          </button>
          
          <button
            onClick={exportToCSV}
            disabled={logs.length === 0}
            className={`flex items-center px-3 py-2 rounded text-sm ${
              logs.length === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-green-100 hover:bg-green-200 text-green-800'
            }`}
          >
            <FaDownload className="mr-2" />
            {t('admin.export')}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <LogFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onApply={applyFilters} 
          onCancel={() => setShowFilters(false)}
        />
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2">{t('admin.loadingLogs')}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('admin.noLogsFound')}
        </div>
      ) : (
        <LogTable logs={logs} />
      )}
    </div>
  );
};

export default SystemLogs;