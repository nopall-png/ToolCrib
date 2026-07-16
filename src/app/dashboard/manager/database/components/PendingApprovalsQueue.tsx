"use client";

import React, { useState, useEffect } from "react";
import { InventoryItem, MachineryItem } from "@/types/database";
import { databaseService } from "@/services/databaseService";

interface PendingApprovalsQueueProps {
  onApprovalSuccess: () => void;
}

export default function PendingApprovalsQueue({ onApprovalSuccess }: PendingApprovalsQueueProps) {
  const [pendingStock, setPendingStock] = useState<InventoryItem[]>([]);
  const [pendingMachines, setPendingMachines] = useState<MachineryItem[]>([]);

  useEffect(() => {
    loadPending();
    const interval = setInterval(loadPending, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadPending = () => {
    const stock = localStorage.getItem("pending_stock_approvals");
    const machines = localStorage.getItem("pending_machine_approvals");
    if (stock) setPendingStock(JSON.parse(stock));
    else setPendingStock([]);
    if (machines) setPendingMachines(JSON.parse(machines));
    else setPendingMachines([]);
  };

  const handleApproveStock = async (item: InventoryItem) => {
    const success = await databaseService.addInventoryItem(item);
    if (success) {
      const updated = pendingStock.filter((s) => s.sku !== item.sku);
      localStorage.setItem("pending_stock_approvals", JSON.stringify(updated));
      setPendingStock(updated);
      onApprovalSuccess();
    } else {
      alert("Failed to save stock to database.");
    }
  };

  const handleRejectStock = (sku: string) => {
    const updated = pendingStock.filter((s) => s.sku !== sku);
    localStorage.setItem("pending_stock_approvals", JSON.stringify(updated));
    setPendingStock(updated);
  };

  const handleApproveMachine = async (item: MachineryItem) => {
    const success = await databaseService.addMachineryItem(item);
    if (success) {
      const updated = pendingMachines.filter((m) => m.id !== item.id);
      localStorage.setItem("pending_machine_approvals", JSON.stringify(updated));
      setPendingMachines(updated);
      onApprovalSuccess();
    } else {
      alert("Failed to register machine in database.");
    }
  };

  const handleRejectMachine = (id: string) => {
    const updated = pendingMachines.filter((m) => m.id !== id);
    localStorage.setItem("pending_machine_approvals", JSON.stringify(updated));
    setPendingMachines(updated);
  };

  const hasApprovals = pendingStock.length > 0 || pendingMachines.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {!hasApprovals ? (
        <div className="w-full bg-white border-none rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-[#A3AED0]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="text-[#2B3674] font-mono text-xs uppercase tracking-wider font-bold">
            Approvals Queue Clear
          </h3>
          <p className="text-[#A3AED0] text-[11px] font-sans mt-1">
            No new machinery or stock registrations pending engineer requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pending Stock Card */}
          <div className="bg-white border-none rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-[#2B3674] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Pending Stock Approvals ({pendingStock.length})
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {pendingStock.length === 0 ? (
                <div className="py-12 text-center text-[#A3AED0] text-[10px] font-mono uppercase">
                  No pending stock requests
                </div>
              ) : (
                pendingStock.map((item) => (
                  <div
                    key={item.sku}
                    className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-[#2B3674] font-sans text-xs font-bold leading-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#A3AED0] font-mono">{item.sku}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-gray-50 border border-gray-100 text-[#A3AED0] font-mono rounded">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#2B3674] font-mono font-bold">{item.quantity} units</span>
                        <div className="text-[9px] text-[#A3AED0] font-mono mt-0.5">Loc: {item.rackLocation}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 pt-2.5">
                      <div className="flex gap-4 text-[10px] font-mono text-[#A3AED0]">
                        <div>Min/Max: {item.minStock}/{item.maxStock}</div>
                        <div>Criticality: <span className="text-[#2B3674] font-bold">{item.criticalityLevel}</span></div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectStock(item.sku)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 text-[10px] font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveStock(item)}
                          className="px-2.5 py-1 bg-green-50 hover:bg-green-100 border border-green-100 text-green-500 text-[10px] font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          ACC
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Machine Card */}
          <div className="bg-white border-none rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-[#2B3674] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                Pending Machine Registrations ({pendingMachines.length})
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {pendingMachines.length === 0 ? (
                <div className="py-12 text-center text-[#A3AED0] text-[10px] font-mono uppercase">
                  No pending machine requests
                </div>
              ) : (
                pendingMachines.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-[#2B3674] font-sans text-xs font-bold leading-tight">
                          {item.machineName}
                        </h4>
                        <span className="text-[10px] text-[#A3AED0] font-mono mt-1 block">ID: {item.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] px-1.5 py-0.5 bg-gray-50 border border-gray-100 text-[#A3AED0] font-mono rounded">
                          {item.status}
                        </span>
                        <div className="text-[9px] text-[#A3AED0] font-mono mt-1">Maint: {item.lastMaintenance}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 border-t border-gray-100 pt-2 pb-1">
                      {item.requiredParts.map((part, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 bg-gray-50 border border-gray-100 rounded text-[9px] text-[#A3AED0]">
                          {part}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-2.5">
                      <button
                        onClick={() => handleRejectMachine(item.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 text-[10px] font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveMachine(item)}
                        className="px-2.5 py-1 bg-green-50 hover:bg-green-100 border border-green-100 text-green-500 text-[10px] font-mono uppercase font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        ACC
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
