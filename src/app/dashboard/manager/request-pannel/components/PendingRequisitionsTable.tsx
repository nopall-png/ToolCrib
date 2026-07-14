"use client";

import React from "react";
import Dropdown from "@/component/common/Dropdown";
import { Requisition } from "@/types/request";

interface PendingRequisitionsTableProps {
  pendingList: Requisition[];
  filterPeriod: string;
  setFilterPeriod: (val: string) => void;
  filterOptions: { value: string; label: string }[];
  expandedRows: Record<string, boolean>;
  toggleRow: (id: string) => void;
  handleAccept: (req: Requisition) => void;
  handleReject: (req: Requisition) => void;
}

export default function PendingRequisitionsTable({
  pendingList,
  filterPeriod,
  setFilterPeriod,
  filterOptions,
  expandedRows,
  toggleRow,
  handleAccept,
  handleReject,
}: PendingRequisitionsTableProps) {
  return (
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
                  <React.Fragment key={req.id}>
                    <tr
                      onClick={() => toggleRow(req.id)}
                      className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 font-bold text-white">
                        {req.id}
                        <br />
                        <span className="text-[9px] font-normal text-gray-500">{req.date}</span>
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
                        <span className="text-blue-500 text-sm font-semibold font-sans">{req.itemName}</span>
                        <br />
                        <span className="text-gray-500 text-[9px]">{req.destination}</span>
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
                            <span className="text-[8px] text-gray-500 font-normal">{req.documentSize}</span>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(req);
                            }}
                            className="px-3 py-1.5 rounded-sm border border-zinc-850 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-500 text-gray-400 text-xs font-bold transition-all cursor-pointer tracking-wider"
                          >
                            REJECT
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(req);
                            }}
                            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold rounded-sm shadow-[0px_0px_15px_0px_rgba(59,130,246,0.20)] transition-all cursor-pointer tracking-wider"
                          >
                            ACC
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[req.id] && req.items && req.items.length > 0 && (
                      <tr className="bg-neutral-950/80 border-b border-zinc-800/50">
                        <td colSpan={7} className="py-4 px-8">
                          <div className="bg-zinc-900/80 rounded-xl border border-zinc-800/80 p-5 shadow-inner">
                            <h4 className="text-zinc-400 text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              Detailed Requested Items
                            </h4>
                            <table className="w-full text-left">
                              <thead>
                                <tr className="text-zinc-500 text-[10px] uppercase border-b border-zinc-800/80">
                                  <th className="pb-2 w-1/4">SKU / Part ID</th>
                                  <th className="pb-2 w-1/2">Part Name</th>
                                  <th className="pb-2 text-center w-1/4">Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {req.items.map((item, idx) => (
                                  <tr
                                    key={idx}
                                    className="text-zinc-300 text-xs border-b border-zinc-800/50 last:border-0 hover:bg-white/5 transition-colors"
                                  >
                                    <td className="py-2.5 font-mono text-gray-400">{item.sku}</td>
                                    <td className="py-2.5 text-blue-400 font-medium">{item.part_name}</td>
                                    <td className="py-2.5 text-center font-bold text-white bg-zinc-800/30 rounded">
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
          )}
        </div>
      </div>
    </div>
  );
}
