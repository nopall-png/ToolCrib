"use client";

import React from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";

export default function ManagerDashboard() {
  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-6 w-full select-none">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
          <span className="text-neutral-500 font-medium">Dashboard/</span>
          <span className="text-neutral-400 font-light text-xl">On Boarding</span>
        </div>

        {/* Welcome Announcement Card matching Figma design */}
        <div className="relative w-full h-32 bg-neutral-900 border border-zinc-800 rounded-2xl p-8 overflow-hidden shadow-2xl flex flex-col justify-center">
          <div className="z-10 flex flex-col gap-1">
            <h2 className="text-white text-3xl font-bold tracking-tight font-sans leading-9">
              Welcome to ToolCrib AI Control Center
            </h2>
            <p className="text-neutral-400 text-sm font-normal font-sans leading-5">
              Global initialization complete. Monitoring automated MRO flows and machinery status.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
