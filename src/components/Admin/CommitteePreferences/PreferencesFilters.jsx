import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaMedkit, FaFilter, FaLanguage, FaSchool, FaUserTie, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const PreferencesFilters = ({ filters, onFilterChange, committees }) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div className="relative">
        <label htmlFor="search-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaSearch className="inline mr-1" /> {t('admin.searchFilter')}
        </label>
        <input
          type="text"
          id="search-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder={t('admin.searchPlaceholder')}
        />
      </div>
      
      <div className="relative">
        <label htmlFor="committee-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaFilter className="inline mr-1" /> {t('admin.committeeFilter')}
        </label>
        <select
          id="committee-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.committee}
          onChange={(e) => onFilterChange('committee', e.target.value)}
        >
          <option value="all">{t('admin.allCommittees')}</option>
          {committees.map(committee => (
            <option key={committee.id} value={committee.id}>
              {committee.nameFr || committee.nameEn}
            </option>
          ))}
        </select>
      </div>
      
      <div className="relative">
        <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaFilter className="inline mr-1" /> {t('admin.priorityFilter')}
        </label>
        <select
          id="priority-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
        >
          <option value="all">{t('admin.allPriorities')}</option>
          <option value="0">{t('admin.firstChoice')}</option>
          <option value="1">{t('admin.secondChoice')}</option>
          <option value="2">{t('admin.thirdChoice')}</option>
        </select>
      </div>
      
      <div className="relative">
        <label htmlFor="delegate-type-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaUserTie className="inline mr-1" /> {t('admin.delegateTypeFilter')}
        </label>
        <select
          id="delegate-type-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.delegateType}
          onChange={(e) => onFilterChange('delegateType', e.target.value)}
        >
          <option value="all">{t('admin.allDelegateTypes')}</option>
          <option value="national">{t('admin.national')}</option>
          <option value="international">{t('admin.international')}</option>
        </select>
      </div>
      
      <div className="relative">
        <label htmlFor="language-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaLanguage className="inline mr-1" /> {t('admin.languageFilter')}
        </label>
        <select
          id="language-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.language}
          onChange={(e) => onFilterChange('language', e.target.value)}
        >
          <option value="all">{t('admin.allLanguages')}</option>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
      
      <div className="relative">
        <label htmlFor="health-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaMedkit className="inline mr-1" /> {t('admin.healthFilter')}
        </label>
        <select
          id="health-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.healthConcerns}
          onChange={(e) => onFilterChange('healthConcerns', e.target.value)}
        >
          <option value="all">{t('admin.allHealthStatuses')}</option>
          <option value="yes">{t('admin.hasHealthConcerns')}</option>
          <option value="no">{t('admin.noHealthConcerns')}</option>
        </select>
      </div>
      
      <div className="relative">
        <label htmlFor="school-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaSchool className="inline mr-1" /> {t('admin.schoolFilter')}
        </label>
        <input
          type="text"
          id="school-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.school || ''}
          onChange={(e) => onFilterChange('school', e.target.value)}
          placeholder={t('admin.filterBySchool')}
        />
      </div>
      
      <div className="relative">
        <label htmlFor="age-filter" className="block text-xs font-medium text-gray-700 mb-1">
          <FaCalendarAlt className="inline mr-1" /> {t('admin.ageFilter')}
        </label>
        <input
          type="text"
          id="age-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.age || ''}
          onChange={(e) => onFilterChange('age', e.target.value)}
          placeholder={t('admin.filterByAge')}
        />
      </div>
    </div>
  );
};

export default PreferencesFilters;