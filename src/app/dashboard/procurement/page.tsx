"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { requestService } from "@/services/requestService";
import { ProcessedRequisition } from "@/types/request";
import ProcuredGoodsTable from "@/features/procurement/ProcuredGoodsTable";
import ProcurementKanban from "@/features/procurement/ProcurementKanban";
import { getNormalizedStatus } from "@/features/procurement/utils";

export default function ProcurementDashboard() {
  const [processedList, setProcessedList] = useState<ProcessedRequisition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadRequests = async () => {
    const { processed } = await requestService.fetchAllRequests();
    setProcessedList(processed);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: any) => {
    await requestService.updateStatus(id, newStatus);
    loadRequests();
  };

  // Filter out REJECTED requisitions for procurement workspace
  const procurementItems = processedList.filter((item) => item.status !== "REJECTED");

  // Filter items based on search query
  const filteredItems = procurementItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items for Kanban Columns
  const ongoingCards = filteredItems.filter((item) => getNormalizedStatus(item.status) === "ONGOING");
  const onShipmentCards = filteredItems.filter((item) => getNormalizedStatus(item.status) === "ON_SHIPMENT");
  const doneCards = filteredItems.filter((item) => getNormalizedStatus(item.status) === "DONE");

  return (
    <DashboardLayout role="procurement">
      <div className="flex flex-col gap-8 w-full select-none pb-12">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-gray-500 font-medium">Dashboard/</span>
            <span className="text-[#2B3674] font-bold text-xl">Procurement Workspace</span>
          </div>
        </div>

        {/* Onboarding Welcome Announcement Card */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-center">
          <div className="z-10 flex flex-col gap-1">
            <h2 className="text-[#2B3674] text-3xl font-bold tracking-tight font-sans leading-9">
              Welcome to ToolCrib Procurement Center
            </h2>
            <p className="text-[#A3AED0] text-sm font-normal font-sans leading-5">
              Fulfillment desk active. Track active shipments, verify purchase orders, and update Kanban workflows.
            </p>
          </div>
        </div>

        {/* SECTION 1: All Items Table */}
        <ProcuredGoodsTable
          filteredItems={filteredItems}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onStatusChange={handleStatusChange}
        />

        {/* SECTION 2: Jira-like Kanban Board */}
        <ProcurementKanban
          ongoingCards={ongoingCards}
          onShipmentCards={onShipmentCards}
          doneCards={doneCards}
          onStatusChange={handleStatusChange}
        />

      </div>
    </DashboardLayout>
  );
}
