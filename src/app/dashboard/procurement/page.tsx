"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { requestService } from "@/services/requestService";
import { ProcessedRequisition } from "@/types/request";

export default function ProcurementDashboard() {
  const [processedList, setProcessedList] = useState<ProcessedRequisition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadRequests = () => {
    setProcessedList(requestService.getProcessedRequisitions());
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = (id: string, newStatus: any) => {
    requestService.updateProcessedStatus(id, newStatus);
    loadRequests();
  };

  // Normalize status for table and board grouping
  const getNormalizedStatus = (status: string): "ONGOING" | "ON_SHIPMENT" | "DONE" | "OTHER" => {
    if (status === "ONGOING" || status === "PURCHASING" || status === "APPROVED") {
      return "ONGOING";
    }
    if (status === "ON_SHIPMENT") {
      return "ON_SHIPMENT";
    }
    if (status === "DONE" || status === "DELIVERED") {
      return "DONE";
    }
    return "OTHER";
  };

  const getStatusLabel = (status: string) => {
    const normalized = getNormalizedStatus(status);
    switch (normalized) {
      case "ONGOING":
        return { label: "Ongoing", className: "bg-red-500/10 text-red-500 border-red-500/20" };
      case "ON_SHIPMENT":
        return { label: "On Shipment", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" };
      case "DONE":
        return { label: "Done", className: "bg-green-500/10 text-green-500 border-green-500/20" };
      default:
        return { label: "Rejected", className: "bg-zinc-800/30 text-gray-500 border-zinc-800" };
    }
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
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">Procurement Workspace</span>
          </div>
        </div>

        {/* Onboarding Welcome Announcement Card */}
        <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl flex flex-col justify-center">
          <div className="z-10 flex flex-col gap-1">
            <h2 className="text-white text-3xl font-bold tracking-tight font-sans leading-9">
              Welcome to ToolCrib Procurement Center
            </h2>
            <p className="text-neutral-400 text-sm font-normal font-sans leading-5">
              Fulfillment desk active. Track active shipments, verify purchase orders, and update Kanban workflows.
            </p>
          </div>
        </div>

        {/* SECTION 1: All Items Table */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-red-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
                All Procured Goods
              </h3>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search items / request IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg border border-zinc-800 text-xs font-sans focus:outline-none focus:border-red-500 transition-colors w-full md:w-64"
            />
          </div>

          <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="overflow-x-auto w-full text-xs font-mono">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 uppercase tracking-widest text-[10px]">
                  No items found matching the filter.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                      <th className="pb-3 px-4">REQ ID</th>
                      <th className="pb-3 px-4">Item Details</th>
                      <th className="pb-3 px-4">Destination</th>
                      <th className="pb-3 px-4 text-center">Qty</th>
                      <th className="pb-3 px-4">Document</th>
                      <th className="pb-3 px-4">Status Stage</th>
                      <th className="pb-3 px-4 text-right">Process Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const { label, className } = getStatusLabel(item.status);
                      const normStatus = getNormalizedStatus(item.status);
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-white">{item.id}</td>
                          <td className="py-3.5 px-4 font-sans font-semibold text-gray-200">{item.itemName}</td>
                          <td className="py-3.5 px-4">{item.destination}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 rounded text-white font-bold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-500">{item.documentName}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${className}`}>
                              {label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={normStatus}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className="px-2 py-1 bg-neutral-950 border border-zinc-800 text-neutral-300 text-[10px] font-mono rounded focus:outline-none focus:border-red-500 cursor-pointer"
                            >
                              <option value="ONGOING">Ongoing</option>
                              <option value="ON_SHIPMENT">On Shipment</option>
                              <option value="DONE">Done</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Jira-like Kanban Board */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-4 h-4 text-red-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
            </div>
            <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
              Procurement Board (Jira Kanban)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Ongoing (Sedang Dipesan) */}
            <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 min-h-[400px]">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
                  Ongoing (Sedang Dipesan)
                </span>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-mono font-bold rounded">
                  {ongoingCards.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
                {ongoingCards.length === 0 ? (
                  <div className="my-auto text-center text-[10px] text-gray-600 font-mono uppercase py-8">
                    No active items
                  </div>
                ) : (
                  ongoingCards.map((item) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl shadow-md transition-colors flex flex-col gap-3.5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                      
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-500">{item.id}</span>
                        <select
                          value="ONGOING"
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-neutral-950 border border-zinc-850 text-neutral-400 text-[9px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-red-500"
                        >
                          <option value="ONGOING">Ongoing</option>
                          <option value="ON_SHIPMENT">Shipment</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[12px] font-sans font-bold text-white line-clamp-2 leading-tight">
                          {item.itemName}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono">{item.destination}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2.5">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span className="text-[9px] truncate max-w-[80px]" title={item.documentName}>
                            {item.documentName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 text-white font-mono font-bold rounded text-[10px]">
                          QTY: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: On Shipment (Sudah Diantar) */}
            <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 min-h-[400px]">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <span className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-wider">
                  On Shipment (Sudah Diantar)
                </span>
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-mono font-bold rounded">
                  {onShipmentCards.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
                {onShipmentCards.length === 0 ? (
                  <div className="my-auto text-center text-[10px] text-gray-600 font-mono uppercase py-8">
                    No active shipments
                  </div>
                ) : (
                  onShipmentCards.map((item) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl shadow-md transition-colors flex flex-col gap-3.5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500"></div>
                      
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-500">{item.id}</span>
                        <select
                          value="ON_SHIPMENT"
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-neutral-950 border border-zinc-850 text-neutral-400 text-[9px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-red-500"
                        >
                          <option value="ONGOING">Ongoing</option>
                          <option value="ON_SHIPMENT">Shipment</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[12px] font-sans font-bold text-white line-clamp-2 leading-tight">
                          {item.itemName}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono">{item.destination}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2.5">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span className="text-[9px] truncate max-w-[80px]" title={item.documentName}>
                            {item.documentName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 text-white font-mono font-bold rounded text-[10px]">
                          QTY: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Done (Sampai) */}
            <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 min-h-[400px]">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-wider">
                  Done (Sampai)
                </span>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-mono font-bold rounded">
                  {doneCards.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
                {doneCards.length === 0 ? (
                  <div className="my-auto text-center text-[10px] text-gray-600 font-mono uppercase py-8">
                    No completed items
                  </div>
                ) : (
                  doneCards.map((item) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl shadow-md transition-colors flex flex-col gap-3.5 relative overflow-hidden opacity-75"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                      
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-500">{item.id}</span>
                        <select
                          value="DONE"
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-neutral-950 border border-zinc-850 text-neutral-400 text-[9px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-red-500"
                        >
                          <option value="ONGOING">Ongoing</option>
                          <option value="ON_SHIPMENT">Shipment</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[12px] font-sans font-bold text-white line-clamp-2 leading-tight">
                          {item.itemName}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono">{item.destination}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2.5">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span className="text-[9px] truncate max-w-[80px]" title={item.documentName}>
                            {item.documentName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 text-white font-mono font-bold rounded text-[10px]">
                          QTY: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
