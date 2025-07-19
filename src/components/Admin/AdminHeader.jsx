import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserShield } from 'react-icons/fa';

const AdminHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center border-b-2 border-gray-900 pb-3 xs:pb-4 mb-4 xs:mb-6 relative">
      <div className="text-xs xs:text-sm font-bold mb-1">ADMINISTRATION</div>
      <h1 className="font-playfair text-4xl xs:text-5xl sm:text-6xl font-black m-0 tracking-tighter uppercase">
        {t('admin.dashboard')}
      </h1>
      <div className="italic text-xs xs:text-sm my-1">MIANU-SM III CONTROL PANEL</div>
      <div className="absolute right-0 top-2 font-bold text-xs xs:text-sm border border-gray-900 px-1 xs:px-2 py-0.5 xs:py-1">RESTRICTED ACCESS</div>
      <div className="absolute left-0 top-2 bg-[#3A6D8C] text-white font-bold text-xs xs:text-sm px-1 xs:px-2 py-0.5 xs:py-1 transform -rotate-2">
        <FaUserShield className="inline-block mr-1" />
        ADMIN ONLY
      </div>
    </div>
  );
};

export default AdminHeader;