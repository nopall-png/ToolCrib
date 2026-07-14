"use client";

import React, { useState } from "react";
import { MachineryItem } from "@/types/database";

interface MachineTableProps {
  machineryItems: MachineryItem[];
  handleDeleteMachine?: (id: string) => void;
  readOnly?: boolean;
}

export default function MachineTable({ machineryItems, handleDeleteMachine, readOnly = false }: MachineTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredMachines = machineryItems.filter((m) => {
    const matchesSearch =
      m.machineName.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || m.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl">
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
            placeholder="Search Machine Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-zinc-950 text-white rounded-lg border border-zinc-800 focus:border-blue-500 focus:outline-none transition-colors text-xs font-mono placeholder-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="HEALTHY">Healthy</option>
            <option value="WARNING">Warning</option>
            <option value="DOWNTIME">Downtime</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto w-full text-xs font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
              <th className="pb-3 px-4">Machine / ID</th>
              <th className="pb-3 px-4">Required Spare Parts</th>
              <th className="pb-3 px-4">Last Maintenance</th>
              <th className="pb-3 px-4">Standard Schedule</th>
              <th className="pb-3 px-4">
                <span className="text-cyan-500">AI Prediction</span>
              </th>
              <th className="pb-3 px-4">Status</th>
              {!readOnly && <th className="pb-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredMachines.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 6 : 7} className="py-12 text-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
                  No machines match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredMachines.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-gray-300">
                    {m.machineName}
                    <br />
                    <span className="text-[9px] font-normal text-gray-500">{m.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {m.requiredParts.map((part, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 rounded text-[9px]"
                        >
                          {part}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 font-mono">{m.lastMaintenance}</td>
                  <td className="py-3.5 px-4 text-gray-450 font-mono">{m.standardSchedule}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-mono font-bold">{m.aiPrediction}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        m.status.toUpperCase() === "OPERATIONAL" || m.status.toUpperCase() === "HEALTHY"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : m.status.toUpperCase() === "WARNING"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMachine?.(m.id)}
                        className="text-neutral-600 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                        title="Remove machine register"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
