import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  isRequired?: boolean;
}

export default function FormInput({
  label,
  icon,
  isRequired = false,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      <div className="flex items-center gap-1.5">
        {icon && <div className="text-[#A3AED0] flex items-center justify-center shrink-0">{icon}</div>}
        <span className="text-[#A3AED0] text-xs font-normal font-mono uppercase tracking-wide">
          {label}
        </span>
        {isRequired && <span className="text-red-500 text-xs font-normal">*</span>}
      </div>
      <input
        className={`w-full h-10 px-4 bg-white text-[#2B3674] rounded-[10px] border border-gray-100 focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF] focus:outline-none transition-all text-sm placeholder-[#A3AED0] shadow-sm ${className}`}
        {...props}
      />
    </div>
  );
}
