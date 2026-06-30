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
    <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
      {schedules.map((sched) => (
        <div
          key={sched.id}
          className="p-4 bg-neutral-950 rounded-xl border border-zinc-850 flex flex-col gap-2.5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold font-sans text-gray-200">{sched.name}</h4>
              <p className="text-[10px] text-gray-500 font-mono">ID: {sched.id}</p>
            </div>
            <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${sched.statusClass}`}>
              {sched.status}
            </span>
          </div>

          <div className="border-t border-zinc-850/60 pt-2.5 flex flex-col gap-1 text-[10px] font-mono text-gray-400">
            <div className="flex justify-between">
              <span className="text-gray-600">Task:</span>
              <span className="text-gray-300 font-sans font-medium">{sched.task}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-neutral-400">{sched.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
