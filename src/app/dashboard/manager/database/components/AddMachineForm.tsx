"use client";

import React from "react";
import FormInput from "@/component/common/FormInput";

interface AddMachineFormProps {
  machineName: string;
  setMachineName: (val: string) => void;
  lastMaintDate: string;
  setLastMaintDate: (val: string) => void;
  spareParts: string;
  setSpareParts: (val: string) => void;
  handleAddMachine: (e: React.FormEvent) => void;
}

export default function AddMachineForm({
  machineName,
  setMachineName,
  lastMaintDate,
  setLastMaintDate,
  spareParts,
  setSpareParts,
  handleAddMachine,
}: AddMachineFormProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 text-blue-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold font-sans">
            Machinery & Maintenance
          </h2>
        </div>
        <p className="text-neutral-500 text-xs font-mono font-normal">
          Register machinery, track required parts, and monitor AI predictive maintenance schedules.
        </p>
      </div>

      <form
        onSubmit={handleAddMachine}
        className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Machine Name */}
          <div>
            <FormInput
              label="Machine Name / ID"
              placeholder="e.g. CNC Milling Unit 01"
              isRequired
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
            />
          </div>

          {/* Last Maintenance Date */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                Last Maintenance Date
              </span>
              <span className="text-red-500 text-xs font-normal">*</span>
            </div>
            <input
              type="date"
              required
              value={lastMaintDate}
              onChange={(e) => setLastMaintDate(e.target.value)}
              className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-sm font-mono cursor-pointer"
            />
          </div>

          {/* Required Spare Parts */}
          <div>
            <FormInput
              label="Required Spare Parts"
              placeholder="e.g. Valve, Filter, Rim (comma-separated)"
              value={spareParts}
              onChange={(e) => setSpareParts(e.target.value)}
            />
          </div>
        </div>

        {/* Action button right-aligned */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold font-mono rounded-[10px] shadow-[0px_0px_15px_0px_rgba(59,130,246,0.20)] flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Register Machine</span>
          </button>
        </div>
      </form>
    </div>
  );
}
