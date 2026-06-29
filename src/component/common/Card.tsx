import React from "react";

interface CardProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, actions, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-neutral-900 border border-zinc-800 rounded-[20px] p-6 flex flex-col overflow-hidden shadow-xl ${className}`}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center pb-6 min-h-[56px] select-none">
        <h3 className="text-white text-base font-semibold font-sans leading-6">
          {title}
        </h3>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 min-h-0 w-full relative">
        {children}
      </div>
    </div>
  );
}
