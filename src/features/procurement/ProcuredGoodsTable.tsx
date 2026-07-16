import React from "react";
import { ProcessedRequisition } from "@/types/request";
import { getNormalizedStatus, getStatusLabel } from "./utils";

interface ProcuredGoodsTableProps {
  filteredItems: ProcessedRequisition[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (id: string, newStatus: any) => void;
}

export default function ProcuredGoodsTable({
  filteredItems,
  searchQuery,
  onSearchChange,
  onStatusChange,
}: ProcuredGoodsTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-[#4318FF] flex items-center justify-center">
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
          <h3 className="text-[#A3AED0] text-sm font-bold font-mono uppercase tracking-wider">
            All Procured Goods
          </h3>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search items / request IDs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-2 bg-white text-[#2B3674] placeholder-[#A3AED0] rounded-lg border border-gray-100 text-xs font-sans focus:outline-none focus:border-[#4318FF] transition-colors w-full md:w-64 shadow-sm"
        />
      </div>

      <div className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-6">
        <div className="overflow-x-auto w-full text-xs font-mono">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#A3AED0] uppercase tracking-widest text-[10px]">
              No items found matching the filter.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[#A3AED0] text-[10px] uppercase font-bold">
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
                      className="border-b border-gray-50 text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#2B3674]">{item.id}</td>
                      <td className="py-3.5 px-4 font-sans font-semibold text-[#2B3674]">{item.itemName}</td>
                      <td className="py-3.5 px-4">{item.destination}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[#2B3674] font-bold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#4318FF]">{item.documentName}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${className}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={normStatus}
                          onChange={(e) => onStatusChange(item.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-gray-100 text-[#2B3674] text-[10px] font-mono rounded focus:outline-none focus:border-[#4318FF] cursor-pointer"
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
  );
}
