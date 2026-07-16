"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { requestService } from "@/services/requestService";
import { Requisition, ProcessedRequisition } from "@/types/request";

// Subcomponents
import ProcurementApprovalsHeader from "./components/ProcurementApprovalsHeader";
import PendingRequisitionsTable from "./components/PendingRequisitionsTable";
import ProcessedPoHistoryTable from "./components/ProcessedPoHistoryTable";

export default function RequestPanelPage() {
  const [pendingList, setPendingList] = useState<Requisition[]>([]);
  const [processedList, setProcessedList] = useState<ProcessedRequisition[]>([]);
  const [filterPeriod, setFilterPeriod] = useState("monthly");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const loadRequests = async () => {
    const { pending, processed } = await requestService.fetchAllRequests();
    setPendingList(pending);
    setProcessedList(processed);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filterOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  // Accept/Approve Handler (Moves to processed with status PURCHASING)
  const handleAccept = async (req: Requisition) => {
    const success = await requestService.approveRequisition(req.id);
    if (success) loadRequests();
    else alert("Gagal menyetujui request.");
  };

  // Reject Handler (Moves to processed with status REJECTED)
  const handleReject = async (req: Requisition) => {
    const success = await requestService.rejectRequisition(req.id);
    if (success) loadRequests();
    else alert("Gagal menolak request.");
  };

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-8 w-full select-none pb-12">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            {/* Breadcrumbs moved to Navbar */}
          </div>
          <div className="text-[10px] font-mono bg-white border border-gray-100 text-[#A3AED0] px-3 py-1.5 rounded-lg shadow-sm">
            SYS NODE: REQ_SYS_STAGE_2
          </div>
        </div>

        <ProcurementApprovalsHeader />

        <PendingRequisitionsTable
          pendingList={pendingList}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          filterOptions={filterOptions}
          expandedRows={expandedRows}
          toggleRow={toggleRow}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />

        <ProcessedPoHistoryTable
          processedList={processedList}
          expandedRows={expandedRows}
          toggleRow={toggleRow}
        />

      </div>
    </DashboardLayout>
  );
}
