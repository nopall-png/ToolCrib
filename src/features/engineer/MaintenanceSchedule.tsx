"use client";

import React, { useState, useEffect } from "react";
import { databaseService } from "@/services/databaseService";

export default function MaintenanceSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const machines = await databaseService.getMachineryItems();
      
      const mappedSchedules = machines.map((m) => {
        let status = "SCHEDULED";
        let statusClass = "text-blue-400 border-blue-400/20 bg-blue-400/10";

        if (m.status === "Maintenance Required") {
          status = "URGENT";
          statusClass = "text-red-400 border-red-400/20 bg-red-400/10";
        }

        return {
          id: m.id,
          name: m.machineName || m.id,
          task: "Routine Maintenance",
          date: m.standardSchedule || "To be scheduled",
          status,
          statusClass,
        };
      });

      setSchedules(mappedSchedules);
    };

    fetchSchedules();
  }, []);

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      {schedules.map((sched) => (
        <div
          key={sched.id}
          className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2.5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold font-sans text-[#2B3674]">{sched.name}</h4>
              <p className="text-[10px] text-[#A3AED0] font-mono">ID: {sched.id}</p>
            </div>
            <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${sched.statusClass}`}>
              {sched.status}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-2.5 flex flex-col gap-1 text-[10px] font-mono text-[#A3AED0]">
            <div className="flex justify-between">
              <span className="text-[#A3AED0]">Task:</span>
              <span className="text-[#2B3674] font-sans font-medium">{sched.task}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A3AED0]">Date:</span>
              <span className="text-[#2B3674]">{sched.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
