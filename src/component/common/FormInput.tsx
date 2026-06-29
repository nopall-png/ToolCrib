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
        {icon && <div className="text-gray-500 flex items-center justify-center shrink-0">{icon}</div>}
        <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
          {label}
        </span>
        {isRequired && <span className="text-red-500 text-xs font-normal">*</span>}
      </div>
      <input
        className={`w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all text-sm placeholder-neutral-600 ${className}`}
        {...props}
      />
    </div>
  );
}
