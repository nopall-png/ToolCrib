import React from "react";
import { Requisition, ProcessedRequisition } from "@/types/request";

interface RequisitionLogsProps {
  pendingList: Requisition[];
  processedList: ProcessedRequisition[];
}

export default function RequisitionLogs({ pendingList, processedList }: RequisitionLogsProps) {
  return (
    <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 min-h-[200px]">
      <div className="overflow-x-auto w-full text-xs font-mono">
        {pendingList.length === 0 && processedList.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 uppercase tracking-widest text-[10px]">
            No requisitions filed yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                <th className="pb-3 px-4">REQ ID</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Item details</th>
                <th className="pb-3 px-4 text-center">Qty</th>
                <th className="pb-3 px-4">Document</th>
                <th className="pb-3 px-4">Urgency</th>
                <th className="pb-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Render pending requests */}
              {pendingList.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-white">{req.id}</td>
                  <td className="py-4 px-4">{req.date}</td>
                  <td className="py-4 px-4 font-sans font-medium text-gray-300">
                    {req.itemName}
                    <br />
                    <span className="text-gray-500 font-mono text-[9px]">{req.destination}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 bg-neutral-950 border border-zinc-850 rounded text-white font-bold">
                      {req.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{req.documentName}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${
                      req.urgency === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      req.urgency === "HIGH" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      "bg-zinc-800/30 text-gray-400 border-zinc-800"
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-bold">
                      PENDING (NEED ACC)
                    </span>
                  </td>
                </tr>
              ))}

              {/* Render processed requests */}
              {processedList.map((proc) => (
                <tr
                  key={proc.id}
                  className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors animate-fade-in"
                >
                  <td className="py-4 px-4 text-gray-500">{proc.id}</td>
                  <td className="py-4 px-4 text-gray-500">{proc.dateProcessed.split(" ")[0]}</td>
                  <td className="py-4 px-4 font-sans font-medium text-gray-300">
                    {proc.itemName}
                    <br />
                    <span className="text-gray-500 font-mono text-[9px]">{proc.destination}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 bg-neutral-950 border border-zinc-850 rounded text-gray-400 font-bold">
                      {proc.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{proc.documentName}</td>
                  <td className="py-4 px-4 text-gray-500">-</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold border ${
                      proc.status === "PURCHASING" || proc.status === "APPROVED" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      proc.status === "DELIVERED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                      {proc.status === "PURCHASING" ? "PURCHASING" :
                       proc.status === "DELIVERED" ? "DELIVERED" :
                       proc.status === "APPROVED" ? "APPROVED" : "REJECTED"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
