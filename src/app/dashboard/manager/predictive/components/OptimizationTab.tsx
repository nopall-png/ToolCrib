"use client";

import React, { useState } from "react";
import { OptimizationItem, OptimizationSummary } from "@/services/predictiveService";

interface OptimizationTabProps {
  optimizationData: OptimizationItem[];
  optimizationSummary: OptimizationSummary | null;
  loadingOptimization: boolean;
}

export default function OptimizationTab({
  optimizationData,
  optimizationSummary,
  loadingOptimization,
}: OptimizationTabProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const filteredOptimizationData = optimizationData.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "ALL" || item.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      {optimizationSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl">
            <div className="text-red-400 text-[10px] font-mono uppercase font-bold">Overstock Items</div>
            <div className="text-white text-2xl font-bold mt-1">{optimizationSummary.overstockCount}</div>
            <div className="text-red-400/60 text-[10px] font-mono mt-1">
              Excess Value: Rp {optimizationSummary.totalExcessValue.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="p-4 bg-yellow-950/20 border border-yellow-900/30 rounded-xl">
            <div className="text-yellow-400 text-[10px] font-mono uppercase font-bold">Understock Items</div>
            <div className="text-white text-2xl font-bold mt-1">{optimizationSummary.understockCount}</div>
            <div className="text-yellow-400/60 text-[10px] font-mono mt-1">
              Shortage Value: Rp {optimizationSummary.totalShortageValue.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="p-4 bg-orange-950/20 border border-orange-900/30 rounded-xl">
            <div className="text-orange-400 text-[10px] font-mono uppercase font-bold">Slow-Moving</div>
            <div className="text-white text-2xl font-bold mt-1">{optimizationSummary.slowMovingCount}</div>
            <div className="text-orange-400/60 text-[10px] font-mono mt-1">Class C + Z: Review needed</div>
          </div>
          <div className="p-4 bg-green-950/20 border border-green-900/30 rounded-xl">
            <div className="text-green-400 text-[10px] font-mono uppercase font-bold">Potential Savings</div>
            <div className="text-white text-2xl font-bold mt-1">
              Rp {optimizationSummary.totalExcessValue.toLocaleString("id-ID")}
            </div>
            <div className="text-green-400/60 text-[10px] font-mono mt-1">From inventory reduction</div>
          </div>
        </div>
      )}

      {/* Search and Filters Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-900 border border-zinc-800 p-4 rounded-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-zinc-950 text-white rounded-lg border border-zinc-800 focus:border-blue-500 focus:outline-none transition-colors text-xs font-mono placeholder-zinc-600"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Action Needed:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="OVERSTOCK">Reduce Stock (Overstock)</option>
              <option value="UNDERSTOCK">Reorder Now (Understock)</option>
              <option value="SLOW_MOVING">Review / Remove (Slow Moving)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-neutral-900 border border-zinc-800 rounded-xl overflow-hidden relative min-h-[300px]">
        {loadingOptimization ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4">
            <svg
              className="animate-spin text-green-500"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-green-500 font-mono text-[10px] uppercase font-bold tracking-widest">
              Calculating Inventory Optimization Opportunities...
            </span>
          </div>
        ) : null}
        <div className="overflow-x-auto w-full text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold bg-zinc-950/40">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4 text-center">Value / Stability</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Min (ROP)</th>
                <th className="py-3 px-4 text-center">Max</th>
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4 text-right">Impact Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredOptimizationData.filter((item) => item.action !== "OPTIMAL").length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
                    No optimization opportunities match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOptimizationData
                  .filter((item) => item.action !== "OPTIMAL")
                  .map((item) => {
                    const actionBadge =
                      item.action === "OVERSTOCK"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : item.action === "UNDERSTOCK"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20";
                    const actionLabel =
                      item.action === "OVERSTOCK"
                        ? "REDUCE STOCK"
                        : item.action === "UNDERSTOCK"
                        ? "REORDER NOW"
                        : "REVIEW / REMOVE";
                    const impactValue = item.action === "OVERSTOCK" ? item.excessValue : item.shortageValue;
                    return (
                      <tr
                        key={item.sku}
                        className="border-b border-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        <td className="py-3 px-4 text-zinc-300 font-medium">{item.sku}</td>
                        <td className="py-3 px-4 font-sans text-zinc-300">{item.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-zinc-300">
                            {item.abcClass}/{item.xyzClass}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-zinc-300">{item.currentStock}</td>
                        <td className="py-3 px-4 text-center text-zinc-400">{item.dynamicMinROP}</td>
                        <td className="py-3 px-4 text-center text-zinc-400">{item.dynamicMax}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${actionBadge}`}>
                            {actionLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-zinc-200">
                          Rp {impactValue.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
