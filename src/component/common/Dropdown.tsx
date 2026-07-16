import React from "react";

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export default function Dropdown({ options, className = "", ...props }: DropdownProps) {
  return (
    <div className="relative inline-block select-none">
      <select
        className={`appearance-none bg-white text-[#2B3674] text-xs font-medium font-sans px-3.5 pr-8 py-1.5 rounded-[10px] border border-gray-100 focus:outline-none focus:border-[#4318FF] cursor-pointer transition-colors shadow-sm ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-[#2B3674] text-xs">
            {opt.label}
          </option>
        ))}
      </select>
      {/* Caret Down Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A3AED0] w-2.5 h-2.5 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
}
