"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { requestService } from "@/services/requestService";
import { authService } from "@/services/authService";
import { Requisition, ProcessedRequisition } from "@/types/request";

// Existing Engineer Feature Components
import RequisitionForm from "@/features/engineer/RequisitionForm";
import MaintenanceSchedule from "@/features/engineer/MaintenanceSchedule";
import RequisitionLogs from "@/features/engineer/RequisitionLogs";

export default function EngineerDashboard() {
  const [pendingList, setPendingList] = useState<Requisition[]>([]);
  const [processedList, setProcessedList] = useState<ProcessedRequisition[]>([]);
  const [engineerName, setEngineerName] = useState("Engineer Operator");

  // Load requests
  const loadRequests = async () => {
    const { pending, processed } = await requestService.fetchAllRequests();
    setPendingList(pending);
    setProcessedList(processed);
  };

  useEffect(() => {
    loadRequests();
    const user = authService.getCurrentUser();
    if (user) {
      setEngineerName(user.fullName);
    }
  }, []);

  return (
    <DashboardLayout role="engineer">
      <div className="flex flex-col gap-8 w-full select-none pb-12">

        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-gray-500 font-medium">Dashboard/</span>
            <span className="text-[#2B3674] font-bold text-xl">Engineer Portal</span>
          </div>
        </div>

        <div className="flex flex-col gap-8 animate-fadeIn">
          {/* Announcement Card */}
          <div className="w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-[#2B3674] text-3xl font-bold tracking-tight font-sans">
              Welcome to ToolCrib Engineer Portal
            </h2>
            <p className="text-[#A3AED0] text-sm mt-1 font-sans">
              Secure console active. File requisitions for tools/spareparts and trace manager approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section 1: Form Request */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-4 h-4 text-[#4318FF] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                  </svg>
                </div>
                <h3 className="text-[#A3AED0] text-sm font-bold font-mono uppercase tracking-wider">
                  Create Sparepart Requisition
                </h3>
              </div>
              <RequisitionForm engineerName={engineerName} onSuccess={loadRequests} />
            </div>

            {/* Section 2: Maintenance schedule */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-4 h-4 text-[#4318FF] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
                <h3 className="text-[#A3AED0] text-sm font-bold font-mono uppercase tracking-wider">
                  Maintenance Machine Schedule
                </h3>
              </div>
              <MaintenanceSchedule />
            </div>
          </div>

          {/* Section 3: History of Requisitions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-4 h-4 text-[#4318FF] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-[#A3AED0] text-sm font-bold font-mono uppercase tracking-wider">
                Requisition Logs & Tracking
              </h3>
            </div>
            <RequisitionLogs pendingList={pendingList} processedList={processedList} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
