"use client";

import React from "react";
import { UserPersonnel } from "@/types/user-panel";

interface PersonnelTableProps {
  filteredPersonnel: UserPersonnel[];
  handleDeleteUser: (empId: string, name: string) => void;
}

export default function PersonnelTable({
  filteredPersonnel,
  handleDeleteUser,
}: PersonnelTableProps) {
  return (
    <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 min-h-[300px]">
      <div className="overflow-x-auto w-full text-xs font-mono">
        {filteredPersonnel.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 uppercase tracking-widest text-[10px]">
            No personnel matching search filter.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                <th className="pb-3.5 px-4">EMP-ID</th>
                <th className="pb-3.5 px-4">Operator</th>
                <th className="pb-3.5 px-4">Security Role</th>
                <th className="pb-3.5 px-4">Department / Shift</th>
                <th className="pb-3.5 px-4">Network Status</th>
                <th className="pb-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonnel.map((p) => {
                const initials = p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2);

                return (
                  <tr
                    key={p.empId}
                    className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-gray-400">{p.empId}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-zinc-850 flex items-center justify-center text-[10px] text-gray-400 font-sans font-bold">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-sans text-gray-200 font-semibold leading-5 text-[13px]">
                            {p.name}
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            {p.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-sm text-[9px] font-bold border inline-flex items-center gap-1 ${
                          p.role === "MANAGER"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : p.role === "PROCUREMENT"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-zinc-800/40 text-gray-300 border-zinc-800"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                        {p.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-sans">
                      <span className="text-gray-300 font-medium text-[13px]">{p.department}</span>
                      <br />
                      <span className="text-gray-500 font-mono text-[10px]">{p.shift}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {p.status === "ACTIVE" && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              p.status === "ACTIVE" ? "bg-green-500" : "bg-gray-600"
                            }`}
                          ></span>
                        </span>
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-bold ${p.status === "ACTIVE" ? "text-gray-200" : "text-gray-500"}`}>
                            {p.status}
                          </span>
                          <span className="text-[9px] text-gray-600 font-normal leading-3">{p.lastActive}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {p.empId !== "EMP-000" ? (
                        <button
                          onClick={() => handleDeleteUser(p.empId, p.name)}
                          className="text-neutral-600 hover:text-red-500 p-1.5 rounded hover:bg-red-950/20 transition-all cursor-pointer"
                          title="Remove personnel"
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
                      ) : (
                        <span className="text-[9px] text-gray-600 px-1 font-mono uppercase select-none">System</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
