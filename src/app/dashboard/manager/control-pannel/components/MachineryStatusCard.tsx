"use client";

import React from "react";
import Card from "@/component/common/Card";
import Dropdown from "@/component/common/Dropdown";

interface MachineryStatusCardProps {
  liveMaintenances: Array<{
    id: string;
    customerName: string;
    orderDate: string;
    status: string;
  }>;
  maintenanceFilter: string;
  setMaintenanceFilter: (val: string) => void;
  filterOptions: { value: string; label: string }[];
}

export default function MachineryStatusCard({
  liveMaintenances,
  maintenanceFilter,
  setMaintenanceFilter,
  filterOptions,
}: MachineryStatusCardProps) {
  return (
    <Card
      title="Factory Machinery Status"
      actions={
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter
          </span>
          <Dropdown
            options={filterOptions}
            value={maintenanceFilter}
            onChange={(e) => setMaintenanceFilter(e.target.value)}
          />
        </div>
      }
      className="h-80"
    >
      <div className="overflow-x-auto w-full h-full text-xs font-sans">
        {liveMaintenances.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">
            No machines registered.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-red-500/20 text-neutral-400 pb-2">
                <th className="pb-2.5 font-medium">Machine ID</th>
                <th className="pb-2.5 font-medium">Machine Name</th>
                <th className="pb-2.5 font-medium">Last Maint.</th>
                <th className="pb-2.5 font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {liveMaintenances.map((maint, idx) => {
                const statusColor =
                  maint.status === "HEALTHY"
                    ? "text-green-500"
                    : maint.status === "WARNING"
                    ? "text-yellow-500"
                    : maint.status === "CRITICAL"
                    ? "text-red-500 animate-pulse"
                    : "text-gray-400";
                return (
                  <tr
                    key={idx}
                    className="border-b border-zinc-800/40 text-neutral-400 hover:text-zinc-200 transition-colors"
                  >
                    <td className="py-3 font-normal font-mono">{maint.id}</td>
                    <td className="py-3 font-medium text-zinc-300">{maint.customerName}</td>
                    <td className="py-3 font-normal font-mono">{maint.orderDate}</td>
                    <td className="py-3">
                      <span className={`${statusColor} font-bold text-[10px] uppercase tracking-wider`}>
                        {maint.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
