"use client";

import React from "react";

export default function ProcurementApprovalsHeader() {
  return (
    <div className="w-full bg-white border-none rounded-2xl p-6 relative overflow-hidden shadow-sm">
      <div className="size-64 absolute -right-24 -top-24 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex justify-center items-center shrink-0 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-[#2B3674] text-2xl font-bold font-sans">
            Procurement Approvals
          </h2>
          <p className="text-[#A3AED0] text-xs font-mono font-normal leading-relaxed">
            Review and approve sparepart requests from mechanics.
          </p>
        </div>
      </div>
    </div>
  );
}
