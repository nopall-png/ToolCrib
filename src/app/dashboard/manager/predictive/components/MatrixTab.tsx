"use client";

import React, { useState } from "react";
import { AIStockRecommendation } from "@/services/predictiveService";

interface MatrixTabProps {
  metrics: AIStockRecommendation[];
  loadingMetrics: boolean;
}

export default function MatrixTab({ metrics, loadingMetrics }: MatrixTabProps) {
  const [search, setSearch] = useState("");
  const [abcFilter, setAbcFilter] = useState("ALL");
  const [xyzFilter, setXyzFilter] = useState("ALL");

  const getAbcBadge = (abc: "A" | "B" | "C") => {
    if (abc === "A") return "text-red-400 border border-red-500/10 bg-red-950/20";
    if (abc === "B") return "text-yellow-400 border border-yellow-500/10 bg-yellow-950/20";
    return "text-green-400 border border-green-500/10 bg-green-950/20";
  };

  const getXyzBadge = (xyz: "X" | "Y" | "Z") => {
    if (xyz === "X") return "text-cyan-400 border border-cyan-500/10 bg-cyan-950/20";
    if (xyz === "Y") return "text-purple-400 border border-purple-500/10 bg-purple-950/20";
    return "text-orange-400 border border-orange-500/10 bg-orange-950/20";
  };

  const filteredMetrics = metrics.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesAbc = abcFilter === "ALL" || item.abcClass === abcFilter;
    const matchesXyz = xyzFilter === "ALL" || item.xyzClass === xyzFilter;
    return matchesSearch && matchesAbc && matchesXyz;
  });

  return (
    <div className="flex flex-col gap-6">
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
            <span className="text-[10px] font-mono text-zinc-500 uppercase">ABC:</span>
            <select
              value={abcFilter}
              onChange={(e) => setAbcFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Values</option>
              <option value="A">Class A (High Value)</option>
              <option value="B">Class B (Med Value)</option>
              <option value="C">Class C (Low Value)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">XYZ:</span>
            <select
              value={xyzFilter}
              onChange={(e) => setXyzFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Stability</option>
              <option value="X">Class X (Stable)</option>
              <option value="Y">Class Y (Volatile)</option>
              <option value="Z">Class Z (Erratic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Minimal Legend Info */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-mono bg-zinc-900/30 border border-zinc-850 p-3 rounded-lg">
        <div>
          <strong className="text-zinc-400">Value Priority:</strong> A (High value contribution), B (Medium), C (Low)
        </div>
        <div>
          <strong className="text-zinc-400">Demand Stability:</strong> X (Stable demand), Y (Volatile), Z (Highly erratic)
        </div>
      </div>

      {/* Minimalist Table */}
      <div className="w-full bg-neutral-900 border border-zinc-800 rounded-xl overflow-hidden relative min-h-[300px]">
        {loadingMetrics ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4">
            <svg
              className="animate-spin text-blue-500"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-blue-500 font-mono text-[10px] uppercase font-bold tracking-widest">
              Processing ABC/XYZ Matrices in Python AI Engine...
            </span>
          </div>
        ) : null}
        <div className="overflow-x-auto w-full text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold bg-zinc-950/40">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Value Priority</th>
                <th className="py-3 px-4">Demand Stability</th>
                <th className="py-3 px-4 text-center">Unit Price</th>
                <th className="py-3 px-4 text-center">Lead Time</th>
                <th className="py-3 px-4 text-center">Yearly Demand</th>
                <th className="py-3 px-4 text-center">Rec. Min (ROP)</th>
                <th className="py-3 px-4 text-right">Rec. Max</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
                    No metrics match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((item) => (
                  <tr
                    key={item.sku}
                    className="border-b border-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <td className="py-3 px-4 text-zinc-300 font-medium">{item.sku}</td>
                    <td className="py-3 px-4 font-sans text-zinc-300">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${getAbcBadge(item.abcClass)}`}>
                        {item.abcClass}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${getXyzBadge(item.xyzClass)}`}>
                        {item.xyzClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-zinc-300">Rp {item.unitPrice.toLocaleString("id-ID")}</td>
                    <td className="py-3 px-4 text-center text-zinc-400">{item.leadTimeDays}d</td>
                    <td className="py-3 px-4 text-center text-zinc-400">{item.yearlyQty} u</td>
                    <td className="py-3 px-4 text-center font-bold text-zinc-200">{item.dynamicMinROP}</td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-200">{item.dynamicMax}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
