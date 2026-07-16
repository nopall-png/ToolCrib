"use client";

import React, { useState } from "react";
import { CriticalSpareResult } from "@/services/predictiveService";

interface CriticalSpareTabProps {
  criticalSpares: CriticalSpareResult[];
  loadingCritical: boolean;
}

export default function CriticalSpareTab({ criticalSpares, loadingCritical }: CriticalSpareTabProps) {
  const [search, setSearch] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("ALL");

  const filteredCriticalSpares = criticalSpares.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCriticality = criticalityFilter === "ALL" || item.criticalityClass === criticalityFilter;
    return matchesSearch && matchesCriticality;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#F4F7FE] border border-white p-4 rounded-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 flex items-center justify-center">
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
            placeholder="Search SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-white text-[#2B3674] rounded-lg border border-gray-100 focus:border-blue-500 focus:outline-none transition-colors text-xs font-mono placeholder-[#A3AED0]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#A3AED0] uppercase">Criticality:</span>
            <select
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              className="h-9 px-3 bg-white border border-gray-100 text-[#2B3674] text-xs font-mono rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="IMPORTANT">Important Only</option>
              <option value="STANDARD">Standard Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-[#A3AED0] font-mono bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
        <div>
          <strong className="text-[#2B3674]">Scoring Formula:</strong> Usage (35%) + Lead Time (25%) + Machine Downtime Impact (40%)
        </div>
        <div>
          <strong className="text-red-500">CRITICAL</strong> ≥ 70 | <strong className="text-yellow-500">IMPORTANT</strong> ≥ 40 | <strong className="text-green-500">STANDARD</strong> &lt; 40
        </div>
      </div>

      <div className="w-full bg-white border-none shadow-sm rounded-xl overflow-hidden relative min-h-[300px]">
        {loadingCritical ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 gap-4">
            <svg
              className="animate-spin text-orange-500"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-orange-500 font-mono text-[10px] uppercase font-bold tracking-widest">
              Analyzing Machine Criticality & Usage Patterns...
            </span>
          </div>
        ) : null}
        <div className="overflow-x-auto w-full text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#A3AED0] text-[10px] uppercase font-bold bg-[#F4F7FE]">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4 text-center">Usage Score</th>
                <th className="py-3 px-4 text-center">Lead Time Score</th>
                <th className="py-3 px-4 text-center">Machine Score</th>
                <th className="py-3 px-4 text-center">Composite Score</th>
                <th className="py-3 px-4 text-center">Classification</th>
              </tr>
            </thead>
            <tbody>
              {filteredCriticalSpares.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#A3AED0] text-[10px] uppercase font-mono tracking-widest">
                    No critical spares match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCriticalSpares.map((item) => {
                  const classColor =
                    item.criticalityClass === "CRITICAL"
                      ? "bg-red-50 text-red-500"
                      : item.criticalityClass === "IMPORTANT"
                      ? "bg-yellow-50 text-yellow-500"
                      : "bg-green-50 text-green-500";
                  return (
                    <tr
                      key={item.sku}
                      className="border-b border-gray-50 text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-[#2B3674] font-medium">{item.sku}</td>
                      <td className="py-3 px-4 font-sans font-bold text-[#2B3674]">{item.name}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.usageScore}%` }}></div>
                          </div>
                          <span className="text-[10px]">{item.usageScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.leadTimeScore}%` }}></div>
                          </div>
                          <span className="text-[10px]">{item.leadTimeScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.machineScore}%` }}></div>
                          </div>
                          <span className="text-[10px]">{item.machineScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#4318FF]">{item.compositeScore}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${classColor}`}>
                          {item.criticalityClass}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
