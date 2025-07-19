import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const LogTable = ({ logs }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? fr : enUS;

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Invalid date';
    return format(timestamp.toDate(), 'PPpp', { locale });
  };

  const formatDetails = (details) => {
    if (!details) return '';
    
    // Filter out sensitive information
    const safeDetails = { ...details };
    delete safeDetails.password;
    delete safeDetails.token;
    
    return JSON.stringify(safeDetails, null, 2);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.timestamp')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.action')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.module')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.user')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.details')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimestamp(log.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  log.action.includes('create') ? 'bg-green-100 text-green-800' :
                  log.action.includes('update') ? 'bg-blue-100 text-blue-800' :
                  log.action.includes('delete') ? 'bg-red-100 text-red-800' :
                  log.action.includes('login') ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {log.action}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.module}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.userEmail || log.userId || t('admin.system')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                  {formatDetails(log.details)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;