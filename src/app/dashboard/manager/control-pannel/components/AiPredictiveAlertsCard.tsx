"use client";

import React from "react";
import Card from "@/component/common/Card";

interface AiPredictiveAlertsCardProps {
  aiAlerts: Array<{
    type: string;
    status?: "CRITICAL" | "WARNING" | string;
    machineId?: string;
    abcClass?: string;
    dynamicMinROP?: number;
    dynamicMax?: number;
    name: string;
    lastMaintenance?: string;
  }> | null;
}

export default function AiPredictiveAlertsCard({ aiAlerts }: AiPredictiveAlertsCardProps) {
  return (
    <Card title="AI Predictive Alerts" className="h-80">
      <div className="flex flex-col gap-4 overflow-y-auto h-full pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {aiAlerts === null ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
            <svg
              className="animate-spin text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-[#A3AED0] font-mono text-[10px] uppercase">Connecting to Prophet Engine...</span>
          </div>
        ) : aiAlerts.length === 0 ? (
          <div className="py-20 text-center text-[#A3AED0] font-mono text-[10px] uppercase">
            Stock & machines are healthy. No alerts.
          </div>
        ) : (
          aiAlerts.map((alert, idx) => {
            const isMachine = alert.type === "MACHINE";
            return (
              <div
                key={idx}
                className={`p-3 border rounded-2xl flex items-center gap-3.5 shadow-sm ${
                  isMachine
                    ? alert.status === "CRITICAL"
                      ? "bg-white border-red-100"
                      : "bg-white border-yellow-100"
                    : "bg-white border-red-100"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg border flex justify-center items-center shrink-0 ${
                    isMachine
                      ? alert.status === "CRITICAL"
                        ? "bg-red-50 border-red-100 text-red-500"
                        : "bg-yellow-50 border-yellow-100 text-yellow-500"
                      : "bg-red-50 border-red-100 text-red-500"
                  }`}
                >
                  {isMachine ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      <line x1="6" y1="6" x2="6.01" y2="6"></line>
                      <line x1="6" y1="18" x2="6.01" y2="18"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  )}
                </div>
                <div className="flex-1 py-0.5 flex flex-col justify-between h-full min-w-0">
                  <div className="flex justify-between items-start">
                    {isMachine ? (
                      <>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-medium ${
                            alert.status === "CRITICAL" ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-500"
                          }`}
                        >
                          MACHINE {alert.status}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-medium ${
                            alert.status === "CRITICAL" ? "text-red-500" : "text-yellow-500"
                          }`}
                        >
                          {alert.machineId}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-medium bg-red-50 text-red-500">
                          CLASS {alert.abcClass}
                        </span>
                        <span className="text-red-500 text-xs font-mono font-medium">ROP: {alert.dynamicMinROP}</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-[#2B3674] text-xs font-bold mt-1 font-sans truncate">{alert.name}</h4>
                  <p className="text-[#A3AED0] text-[10px] font-mono mt-0.5 truncate">
                    {isMachine ? `Last Maint: ${alert.lastMaintenance || "N/A"}` : `Needs restock to max: ${alert.dynamicMax}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
