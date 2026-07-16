"use client";

import React from "react";
import Dropdown from "@/component/common/Dropdown";

interface UserControlsPanelProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (val: string) => void;
  handleExportCSV: () => void;
}

export default function UserControlsPanel({
  searchQuery,
  setSearchQuery,
  selectedRoleFilter,
  setSelectedRoleFilter,
  handleExportCSV,
}: UserControlsPanelProps) {
  return (
    <div className="p-4 bg-white border border-gray-100 rounded-2xl inline-flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0] w-4 h-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or EMP-ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 bg-white text-[#2B3674] rounded-[10px] border border-gray-100 focus:border-[#4318FF] focus:outline-none transition-colors text-xs font-mono placeholder-[#A3AED0]"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#A3AED0] uppercase">Role:</span>
          <Dropdown
            options={[
              { value: "ALL", label: "All Roles" },
              { value: "ENGINEER", label: "Engineer" },
              { value: "PROCUREMENT", label: "Procurement" },
              { value: "MANAGER", label: "Manager" },
            ]}
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="h-9 border-gray-100 py-1"
          />
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-[#4318FF] text-xs font-mono rounded-[10px] border border-gray-100 transition-colors cursor-pointer font-bold"
        >
          EXPORT CSV
        </button>
      </div>
    </div>
  );
}
