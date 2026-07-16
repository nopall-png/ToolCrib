"use client";

import React from "react";
import Card from "@/component/common/Card";

interface LiveInventoryStockCardProps {
  liveStockSummary: {
    currentStock: number;
    replenishedStock: number;
    completedOrders: number;
  };
  liveStockItems: Array<{
    name: string;
    partName: string;
    quantity: number;
    maxQty: number;
    isCritical: boolean;
  }>;
  liveHistoryLength: number;
}

export default function LiveInventoryStockCard({
  liveStockSummary,
  liveStockItems,
  liveHistoryLength,
}: LiveInventoryStockCardProps) {
  return (
    <Card
      title="Live Inventory Stock"
      actions={
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 text-xs select-none">
            <div className="flex items-center gap-1.5 text-[#A3AED0]">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical Stock
            </div>
            <div className="flex items-center gap-1.5 text-[#A3AED0]">
              <span className="w-2 h-2 rounded-full bg-[#E9EDF7]"></span> Normal Stock
            </div>
          </div>
        </div>
      }
      className="h-80"
    >
      <div className="flex flex-col gap-6 h-full w-full justify-between pb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white shadow-sm rounded-2xl border border-red-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#A3AED0] font-mono truncate">Realtime Items</span>
              <div className="text-[#2B3674] text-xs sm:text-sm font-bold truncate">
                {liveStockSummary.currentStock.toLocaleString()}{" "}
                <span className="text-[#A3AED0] font-normal text-[9px] font-mono">units</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white shadow-sm rounded-2xl border border-yellow-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#A3AED0] font-mono truncate">Stock Value</span>
              <div className="text-[#2B3674] text-xs sm:text-sm font-bold truncate">
                ${liveStockSummary.replenishedStock.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="p-3 bg-white shadow-sm rounded-2xl border border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#A3AED0] font-mono truncate">Processed Reqs</span>
              <div className="text-[#2B3674] text-xs sm:text-sm font-bold truncate">
                {liveHistoryLength} <span className="text-[#A3AED0] font-normal text-[9px] font-mono">requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-28 flex items-end justify-between select-none">
          <div className="flex-1 h-24 flex items-end justify-around z-10 px-2">
            {liveStockItems.length === 0 ? (
              <div className="w-full text-center text-[#A3AED0] font-mono text-[10px] mt-10">
                No items found in DB.
              </div>
            ) : (
              liveStockItems.map((item, idx) => {
                const heightPercent = Math.max(5, (item.quantity / item.maxQty) * 100);
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-end gap-1 group relative h-full"
                    title={`${item.partName}: ${item.quantity} units`}
                  >
                    <div
                      className={`w-4 rounded-t-sm transition-all duration-500 ${
                        item.isCritical ? "bg-red-500" : "bg-[#E9EDF7] group-hover:bg-[#4318FF]"
                      }`}
                      style={{ height: `${heightPercent}%`, minHeight: "4px" }}
                    ></div>
                    <span className="text-[7px] font-mono text-[#A3AED0] font-semibold truncate max-w-[40px] px-0.5">
                      {item.name.split("-").slice(1).join("-")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
