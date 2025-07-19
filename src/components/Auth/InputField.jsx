import React from "react";

const InputField = ({ id, label, value, onChange, icon, placeholder }) => {
  return (
    <div className="flex-1">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="bg-[#f8f4e5] appearance-none border border-gray-800 rounded w-full py-2 px-4 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputField;