import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../UI/Modal';
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
  FaClock,
  FaIdCard,
} from 'react-icons/fa';

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Modal title={t('admin.userDetails')} onClose={onClose} isOpen={isOpen}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-20 w-20">
            {user.photoURL ? (
              <img className="h-20 w-20 rounded-full" src={user.photoURL} alt="" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-2xl font-medium">
                  {(user.firstName?.charAt(0) || user.displayName?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-6">
            <h3 className="text-xl font-bold text-gray-900">
              {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`}
            </h3>
            <p className="text-sm text-gray-500">
              <FaIdCard className="inline mr-1" /> {user.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {t('admin.personalInformation')}
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500 block">
                  <FaEnvelope className="inline mr-1" /> {t('admin.email')}
                </span>
                <span className="text-sm text-gray-900">{user.email || '-'}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block">
                  <FaPhone className="inline mr-1" /> {t('admin.phoneNumber')}
                </span>
                <span className="text-sm text-gray-900">{user.phoneNumber || '-'}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block">
                  <FaCalendarAlt className="inline mr-1" /> {t('admin.age')}
                </span>
                <span className="text-sm text-gray-900">{user.age || '-'}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 block">
                  <FaUser className="inline mr-1" /> {t('admin.role')}
                </span>
                <span className="text-sm text-gray-900">
                  {user.role ? t(`admin.${user.role}Role`) : '-'}
                </span>
              </div>
              
              {user.delegateType && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    <FaGlobe className="inline mr-1" /> {t('admin.delegateType')}
                  </span>
                  <span className="text-sm text-gray-900">
                    {t(`admin.${user.delegateType}`)}
                  </span>
                </div>
              )}
              
              {user.delegateType === 'international' && user.country && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    <FaGlobe className="inline mr-1" /> {t('admin.country')}
                  </span>
                  <span className="text-sm text-gray-900">{user.country}</span>
                </div>
              )}
              
              <div>
                <span className="text-sm font-medium text-gray-500 block">
                  <FaSchool className="inline mr-1" /> {t('admin.school')}
                </span>
                <span className="text-sm text-gray-900">{user.school || '-'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* MUN Experience Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">{t('admin.munExperience')}</h4>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FaHistory className="text-gray-400 mr-2" />
              <span className="font-medium">{t('admin.conferenceCount')}:</span>
              <span className="ml-2">{user.conferenceCount || '0'}</span>
            </div>
            
            {user.conferenceCount && user.conferenceCount !== '0' && user.conferencesList && (
              <div className="mb-3 pl-6">
                <p className="font-medium mb-1">{t('admin.conferencesList')}:</p>
                <p className="text-gray-600 whitespace-pre-line">{user.conferencesList}</p>
              </div>
            )}
            
            <div className="flex items-center mb-3">
              <FaTrophy className="text-gray-400 mr-2" />
              <span className="font-medium">{t('admin.hasAwards')}:</span>
              <span className="ml-2">{user.hasAwards === 'yes' ? t('admin.yes') : t('admin.no')}</span>
            </div>
            
            {user.hasAwards === 'yes' && user.awardsList && (
              <div className="pl-6">
                <p className="font-medium mb-1">{t('admin.awardsList')}:</p>
                <p className="text-gray-600 whitespace-pre-line">{user.awardsList}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Committee Priorities - Only for delegates */}
        {user.role === 'delegate' && user.committeePriorities && user.committeePriorities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">{t('admin.committeePriorities')}</h4>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="space-y-2">
                {user.committeePriorities.sort((a, b) => a.priority - b.priority).map((committee, index) => (
                  <li key={committee.id} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span>{committee.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        
        {/* Registration Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">{t('admin.registrationInformation')}</h4>
          P*
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">{t('admin.registrationDate')}</p>
                <p className="font-medium">
                  {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleString() : t('admin.unknown')}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">{t('admin.lastUpdated')}</p>
                <p className="font-medium">
                  {user.updatedAt ? new Date(user.updatedAt.toDate()).toLocaleString() : t('admin.unknown')}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">{t('admin.paymentStatus')}</p>
                <p className="font-medium flex items-center">
                  <FaMoneyBillWave className={`mr-1 ${user.hasPaid ? 'text-green-500' : 'text-red-500'}`} />
                  {user.hasPaid ? t('admin.paid') : t('admin.unpaid')}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">{t('admin.language')}</p>
                <p className="font-medium">
                  {user.language || t('admin.unknown')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('admin.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;