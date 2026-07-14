"use client";

import React, { useState } from "react";
import { InventoryItem } from "@/types/database";

interface StockTableProps {
  inventoryItems: InventoryItem[];
  handleDeleteStock?: (sku: string, qty: number) => void;
  readOnly?: boolean;
}

export default function StockTable({ inventoryItems, handleDeleteStock, readOnly = false }: StockTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl">
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
            placeholder="Search SKU or component name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-zinc-950 text-white rounded-lg border border-zinc-800 focus:border-blue-500 focus:outline-none transition-colors text-xs font-mono placeholder-zinc-600"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Drivetrain">Drivetrain</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Electrical">Electrical</option>
              <option value="Pneumatics">Pneumatics</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="IN STOCK">In Stock</option>
              <option value="LOW STOCK">Low Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full text-xs font-mono">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
              <th className="pb-3 px-4">SKU Code</th>
              <th className="pb-3 px-4">Component Name</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4 text-center">Qty</th>
              <th className="pb-3 px-4">Status</th>
              {!readOnly && <th className="pb-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 5 : 6} className="py-12 text-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
                  No stock items match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.sku}
                  className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                >
                  <td className="py-3.5 px-4 text-red-500 font-semibold">{item.sku}</td>
                  <td className="py-3.5 px-4 font-sans text-gray-200">{item.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-800 text-gray-400 rounded text-[9px] uppercase tracking-wide">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-white font-semibold font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        item.status === "IN STOCK"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : item.status === "LOW STOCK"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteStock?.(item.sku, item.quantity)}
                        className="text-neutral-600 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                        title="Remove entry"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
