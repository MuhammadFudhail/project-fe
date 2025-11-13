import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropDown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black outline-none bg-white border border-slate-200 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <LuChevronDown
          className={`ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu absolute w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropDown;
