"use client";

import React, { useState } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import Dropdown from "@/component/common/Dropdown";
import {
  initialPendingRequisitions,
  initialProcessedRequisitions,
} from "@/data/request";
import { Requisition, ProcessedRequisition } from "@/types/request";

export default function RequestPanelPage() {
  const [pendingList, setPendingList] = useState<Requisition[]>(initialPendingRequisitions);
  const [processedList, setProcessedList] = useState<ProcessedRequisition[]>(initialProcessedRequisitions);
  const [filterPeriod, setFilterPeriod] = useState("monthly");

  const filterOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  // Accept/Approve Handler (Moves to processed with status PURCHASING/APPROVED)
  const handleAccept = (req: Requisition) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const newProcessed: ProcessedRequisition = {
      id: req.id,
      itemName: req.itemName,
      destination: req.destination.includes("Dest:") ? req.destination : `Dest: ${req.destination}`,
      documentName: req.documentName,
      quantity: req.quantity,
      status: "PURCHASING", // Approved moves to purchasing state matching figma screenshot
      dateProcessed: formattedDate,
    };

    setPendingList(pendingList.filter((item) => item.id !== req.id));
    setProcessedList([newProcessed, ...processedList]);
  };

  // Reject Handler (Moves to processed with status REJECTED)
  const handleReject = (req: Requisition) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const newProcessed: ProcessedRequisition = {
      id: req.id,
      itemName: req.itemName,
      destination: req.destination.includes("Dest:") ? req.destination : `Dest: ${req.destination}`,
      documentName: req.documentName,
      quantity: req.quantity,
      status: "REJECTED",
      dateProcessed: formattedDate,
    };

    setPendingList(pendingList.filter((item) => item.id !== req.id));
    setProcessedList([newProcessed, ...processedList]);
  };

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-8 w-full select-none pb-12">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">Request Pannel</span>
          </div>
          <div className="text-[10px] font-mono bg-neutral-900 border border-zinc-800 text-neutral-400 px-3 py-1.5 rounded-lg">
            SYS NODE: REQ_SYS_STAGE_2
          </div>
        </div>

        {/* Procurement Approvals Header Panel */}
        <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="size-64 absolute -right-24 -top-24 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex justify-center items-center shrink-0 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-white text-2xl font-bold font-sans">
                Procurement Approvals
              </h2>
              <p className="text-gray-400 text-xs font-mono font-normal leading-relaxed">
                Review and approve sparepart requests from mechanics.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Pending Requisitions */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
                Pending Requisitions (Need ACC)
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Filter
              </span>
              <Dropdown
                options={filterOptions}
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              />
            </div>
          </div>

          {/* Pending Table Card */}
          <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 min-h-[220px]">
            <div className="overflow-x-auto w-full text-xs font-mono">
              {pendingList.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 uppercase tracking-widest text-[10px]">
                  No pending requisitions require action.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                      <th className="pb-3 px-4">REQ ID / Date</th>
                      <th className="pb-3 px-4">Requestor</th>
                      <th className="pb-3 px-4">Item Details</th>
                      <th className="pb-3 px-4 text-center">Qty</th>
                      <th className="pb-3 px-4">Document</th>
                      <th className="pb-3 px-4">Urgency</th>
                      <th className="pb-3 px-4 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.map((req) => (
                      <tr
                        key={req.id}
                        className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-white">
                          {req.id}
                          <br />
                          <span className="text-[9px] font-normal text-gray-500">
                            {req.date}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-gray-400 select-none">
                              {req.requestor.charAt(0)}
                            </div>
                            <span className="font-sans text-gray-300 font-medium">
                              {req.requestor} ({req.shift})
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-blue-500 text-sm font-semibold font-sans">
                            {req.itemName}
                          </span>
                          <br />
                          <span className="text-gray-500 text-[9px]">
                            {req.destination}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 bg-neutral-950 border border-zinc-850 rounded text-white font-bold font-mono">
                            {req.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="px-2.5 py-1.5 bg-neutral-950 rounded border border-zinc-850 inline-flex items-center gap-2 max-w-[170px]">
                            <div className="p-1 bg-red-500/10 text-red-500 rounded shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-gray-300 truncate max-w-[100px]" title={req.documentName}>
                                {req.documentName}
                              </span>
                              <span className="text-[8px] text-gray-500 font-normal">
                                {req.documentSize}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${
                              req.urgency === "CRITICAL"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : req.urgency === "HIGH"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : "bg-zinc-800/30 text-gray-400 border-zinc-800"
                            }`}
                          >
                            {req.urgency}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2.5">
                            <button
                              onClick={() => handleReject(req)}
                              className="px-3 py-1.5 rounded-sm border border-zinc-850 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-500 text-gray-400 text-xs font-bold transition-all cursor-pointer tracking-wider"
                            >
                              REJECT
                            </button>
                            <button
                              onClick={() => handleAccept(req)}
                              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold rounded-sm shadow-[0px_0px_15px_0px_rgba(59,130,246,0.20)] transition-all cursor-pointer tracking-wider"
                            >
                              ACC
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Processed PO / History */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h3 className="text-gray-400 text-sm font-bold font-mono uppercase tracking-wider">
              Processed PO / History
            </h3>
          </div>

          {/* Processed Table Card */}
          <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="overflow-x-auto w-full text-xs font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-600 text-[10px] uppercase font-bold">
                    <th className="pb-3 px-4">REQ ID</th>
                    <th className="pb-3 px-4">Item Details</th>
                    <th className="pb-3 px-4">Document</th>
                    <th className="pb-3 px-4 text-center">Qty</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Date Processed</th>
                  </tr>
                </thead>
                <tbody>
                  {processedList.map((proc) => (
                    <tr
                      key={proc.id}
                      className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-gray-500">{proc.id}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="text-gray-300 font-semibold leading-5 text-[13px]">
                          {proc.itemName}
                        </span>{" "}
                        <span className="text-gray-500 font-mono text-[9px]">
                          ({proc.destination})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          <span className="text-[10px]">{proc.documentName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-400 font-semibold">{proc.quantity}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${
                            proc.status === "PURCHASING" || proc.status === "APPROVED"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {proc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-500">{proc.dateProcessed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
