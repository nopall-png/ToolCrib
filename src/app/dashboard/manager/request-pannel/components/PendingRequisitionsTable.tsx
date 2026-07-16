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
          <h3 className="text-[#2B3674] text-sm font-bold font-mono uppercase tracking-wider">
            Pending Requisitions (Need ACC)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#A3AED0] text-xs font-medium flex items-center gap-1">
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

      <div className="w-full bg-white border-none rounded-2xl overflow-hidden shadow-sm p-6 min-h-[220px]">
        <div className="overflow-x-auto w-full text-xs font-mono">
          {pendingList.length === 0 ? (
            <div className="py-12 text-center text-[#A3AED0] uppercase tracking-widest text-[10px]">
              No pending requisitions require action.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[#A3AED0] text-[10px] uppercase font-bold">
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
                      className="border-b border-gray-50 text-[#A3AED0] hover:bg-gray-50/50 hover:text-[#2B3674] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 font-bold text-[#2B3674]">
                        {req.id}
                        <br />
                        <span className="text-[9px] font-normal text-[#A3AED0]">{req.date}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] text-[#2B3674] select-none font-bold">
                            {req.requestor.charAt(0)}
                          </div>
                          <span className="font-sans text-[#2B3674] font-medium">
                            {req.requestor} ({req.shift})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#4318FF] text-sm font-semibold font-sans">{req.itemName}</span>
                        <br />
                        <span className="text-[#A3AED0] text-[9px]">{req.destination}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded text-[#2B3674] font-bold font-mono">
                          {req.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="px-2.5 py-1.5 bg-gray-50 rounded border border-gray-100 inline-flex items-center gap-2 max-w-[170px]">
                          <div className="p-1 bg-red-50 text-red-500 rounded shrink-0">
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
                            <span className="text-[10px] text-[#2B3674] truncate max-w-[100px]" title={req.documentName}>
                              {req.documentName}
                            </span>
                            <span className="text-[8px] text-[#A3AED0] font-normal">{req.documentSize}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                            req.urgency === "CRITICAL"
                              ? "bg-red-50 text-red-500"
                              : req.urgency === "HIGH"
                              ? "bg-yellow-50 text-yellow-500"
                              : "bg-gray-100 text-gray-500"
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
                            className="px-3 py-1.5 rounded-sm border border-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-500 text-[#A3AED0] text-xs font-bold transition-all cursor-pointer tracking-wider"
                          >
                            REJECT
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(req);
                            }}
                            className="px-4 py-1.5 bg-[#4318FF] hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-sm shadow-sm transition-all cursor-pointer tracking-wider"
                          >
                            ACC
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows[req.id] && req.items && req.items.length > 0 && (
                      <tr className="bg-[#F4F7FE] border-b border-gray-100">
                        <td colSpan={7} className="py-4 px-8">
                          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <h4 className="text-[#2B3674] text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4318FF]"></span>
                              Detailed Requested Items
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
                                {req.items.map((item, idx) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
