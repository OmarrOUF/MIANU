import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFilter } from 'react-icons/fa';

const UserFilters = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="relative flex-1">
        <label htmlFor="role-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaFilter className="inline mr-1" /> {t('admin.roleFilter')}
        </label>
        <select
          id="role-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.role}
          onChange={(e) => onFilterChange('role', e.target.value)}
        >
          <option value="all">{t('admin.allRoles')}</option>
          <option value="admin">{t('admin.roleAdmin')}</option>
          <option value="organizer">{t('admin.rolePresident')}</option>
          <option value="delegate">{t('admin.roleDelegate')}</option>
        </select>
      </div>
      
      <div className="relative flex-1">
        <label htmlFor="payment-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaFilter className="inline mr-1" /> {t('admin.paymentFilter')}
        </label>
        <select
          id="payment-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.paymentStatus}
          onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
        >
          <option value="all">{t('admin.allPaymentStatuses')}</option>
          <option value="paid">{t('admin.paid')}</option>
          <option value="unpaid">{t('admin.unpaid')}</option>
        </select>
      </div>
    </div>
  );
};

export default UserFilters;