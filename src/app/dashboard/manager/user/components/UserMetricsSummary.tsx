"use client";

import React from "react";

interface UserMetricsSummaryProps {
  totalPersonnel: number;
  activeSessions: number;
  systemAdmins: number;
}

export default function UserMetricsSummary({
  totalPersonnel,
  activeSessions,
  systemAdmins,
}: UserMetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Total Personnel */}
      <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center h-24 shadow-lg">
        <div className="flex flex-col z-10">
          <span className="text-gray-500 text-[10px] font-normal font-mono uppercase tracking-wider">
            Total Personnel
          </span>
          <span className="text-white text-3xl font-bold font-mono mt-1">{totalPersonnel}</span>
        </div>
        <div className="w-12 h-12 bg-neutral-900 border border-zinc-800 rounded-full flex justify-center items-center shrink-0 text-neutral-400 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-800/10 pointer-events-none"></div>
      </div>

      {/* Card 2: Active Sessions */}
      <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center h-24 shadow-lg">
        <div className="flex flex-col z-10">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-gray-500 text-[10px] font-normal font-mono uppercase tracking-wider">
              Active Sessions
            </span>
          </div>
          <span className="text-white text-3xl font-bold font-mono mt-1">{activeSessions}</span>
        </div>
        <div className="w-12 h-12 bg-neutral-900 border border-zinc-800 rounded-full flex justify-center items-center shrink-0 text-green-500 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-950/5 pointer-events-none"></div>
      </div>

      {/* Card 3: Managers count */}
      <div className="bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex justify-between items-center h-24 shadow-lg">
        <div className="flex flex-col z-10">
          <span className="text-gray-500 text-[10px] font-normal font-mono uppercase tracking-wider">
            Managers
          </span>
          <span className="text-white text-3xl font-bold font-mono mt-1">{systemAdmins}</span>
        </div>
        <div className="w-12 h-12 bg-neutral-900 border border-zinc-800 rounded-full flex justify-center items-center shrink-0 text-red-500 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-950/5 pointer-events-none"></div>
      </div>
    </div>
  );
}
