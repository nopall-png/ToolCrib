"use client";

import React from "react";
import { ProcessedRequisition } from "@/types/request";
import { getStatusLabel } from "@/features/procurement/utils";

interface ProcessedPoHistoryTableProps {
  processedList: ProcessedRequisition[];
  expandedRows: Record<string, boolean>;
  toggleRow: (id: string) => void;
}

export default function ProcessedPoHistoryTable({
  processedList,
  expandedRows,
  toggleRow,
}: ProcessedPoHistoryTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <div className="w-4 h-4 text-[#A3AED0] flex items-center justify-center">
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
        <h3 className="text-[#A3AED0] text-sm font-bold font-mono uppercase tracking-wider">
          Processed PO / History
        </h3>
      </div>

      {/* Processed Table Card */}
      <div className="w-full bg-white border-none rounded-2xl overflow-hidden shadow-sm p-6">
        <div className="overflow-x-auto w-full text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#A3AED0] text-[10px] uppercase font-bold">
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
                <React.Fragment key={proc.id}>
                  <tr
                    onClick={() => toggleRow(proc.id)}
                    className="border-b border-gray-50 text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-[#A3AED0]">{proc.id}</td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="text-[#2B3674] font-semibold leading-5 text-[13px]">{proc.itemName}</span>{" "}
                      <span className="text-[#A3AED0] font-mono text-[9px]">({proc.destination})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 text-[#A3AED0]">
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
                    <td className="py-3.5 px-4 text-center text-[#2B3674] font-semibold">{proc.quantity}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                          getStatusLabel(proc.status).className.replace('bg-zinc-800/50 text-gray-400 border-zinc-700', 'bg-gray-100 text-gray-500').replace('bg-green-500/10 text-green-500 border-green-500/20', 'bg-green-50 text-green-500').replace('bg-red-500/10 text-red-500 border-red-500/20', 'bg-red-50 text-red-500')
                        }`}
                      >
                        {getStatusLabel(proc.status).label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#A3AED0]">{proc.dateProcessed}</td>
                  </tr>
                  {expandedRows[proc.id] && proc.items && proc.items.length > 0 && (
                    <tr className="bg-[#F4F7FE] border-b border-gray-100">
                      <td colSpan={6} className="py-4 px-8">
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                          <h4 className="text-[#2B3674] text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Detailed Processed Items
                          </h4>
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-[#A3AED0] text-[10px] uppercase border-b border-gray-100">
                                <th className="pb-2 w-1/4">SKU / Part ID</th>
                                <th className="pb-2 w-1/2">Part Name</th>
                                <th className="pb-2 text-center w-1/4">Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {proc.items.map((item, idx) => (
                                <tr
                                  key={idx}
                                  className="text-[#2B3674] text-xs border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="py-2.5 font-mono text-[#A3AED0]">{item.sku}</td>
                                  <td className="py-2.5 text-[#4318FF] font-medium">{item.part_name}</td>
                                  <td className="py-2.5 text-center font-bold text-[#2B3674] bg-gray-50 rounded">
                                    {item.quantity}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
