import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FaSpinner className="animate-spin text-4xl text-[#3A6D8C] mb-4" />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;