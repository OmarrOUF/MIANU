import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';

const LogFilters = ({ filters, onFilterChange, onApply, onCancel }) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleChange = (field, value) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.module')}
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={localFilters.module || ''}
            onChange={(e) => handleChange('module', e.target.value)}
            placeholder={t('admin.filterByModule')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.userId')}
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={localFilters.userId || ''}
            onChange={(e) => handleChange('userId', e.target.value)}
            placeholder={t('admin.filterByUserId')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.limit')}
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={localFilters.limit}
            onChange={(e) => handleChange('limit', Number(e.target.value))}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.startDate')}
          </label>
          <div className="relative">
            <DatePicker
              selected={localFilters.startDate}
              onChange={(date) => handleChange('startDate', date)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholderText={t('admin.selectStartDate')}
              dateFormat="dd/MM/yyyy"
              isClearable
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.endDate')}
          </label>
          <div className="relative">
            <DatePicker
              selected={localFilters.endDate}
              onChange={(date) => handleChange('endDate', date)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholderText={t('admin.selectEndDate')}
              dateFormat="dd/MM/yyyy"
              isClearable
              minDate={localFilters.startDate}
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          {t('admin.cancel')}
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('admin.applyFilters')}
        </button>
      </div>
    </div>
  );
};

export default LogFilters;