import React from "react";
import { ProcessedRequisition } from "@/types/request";

interface ProcurementKanbanProps {
  ongoingCards: ProcessedRequisition[];
  onShipmentCards: ProcessedRequisition[];
  doneCards: ProcessedRequisition[];
  onStatusChange: (id: string, newStatus: any) => void;
}

export default function ProcurementKanban({
  ongoingCards,
  onShipmentCards,
  doneCards,
  onStatusChange,
}: ProcurementKanbanProps) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-2 px-1">
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
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
        </div>
        <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
          Procurement Board (Jira Kanban)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Ongoing (Sedang Dipesan) */}
        <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
              Ongoing (Sedang Dipesan)
            </span>
            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-mono font-bold rounded">
              {ongoingCards.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
            {ongoingCards.length === 0 ? (
              <div className="my-auto text-center text-[10px] text-gray-600 font-mono uppercase py-8">
                No active items
              </div>
            ) : (
              ongoingCards.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl shadow-md transition-colors flex flex-col gap-3.5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-500">{item.id}</span>
                    <select
                      value="ONGOING"
                      onChange={(e) => onStatusChange(item.id, e.target.value)}
                      className="bg-neutral-950 border border-zinc-850 text-neutral-400 text-[9px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-red-500"
                    >
                      <option value="ONGOING">Ongoing</option>
                      <option value="ON_SHIPMENT">Shipment</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[12px] font-sans font-bold text-white line-clamp-2 leading-tight">
                      {item.itemName}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono">{item.destination}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2.5">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className="text-[9px] truncate max-w-[80px]" title={item.documentName}>
                        {item.documentName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 text-white font-mono font-bold rounded text-[10px]">
                      QTY: {item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: On Shipment (Sudah Diantar) */}
        <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-wider">
              On Shipment (Sudah Diantar)
            </span>
            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-mono font-bold rounded">
              {onShipmentCards.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
            {onShipmentCards.length === 0 ? (
              <div className="my-auto text-center text-[10px] text-gray-600 font-mono uppercase py-8">
                No active shipments
              </div>
            ) : (
              onShipmentCards.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl shadow-md transition-colors flex flex-col gap-3.5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500"></div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-500">{item.id}</span>
                    <select
                      value="ON_SHIPMENT"
                      onChange={(e) => onStatusChange(item.id, e.target.value)}
                      className="bg-neutral-950 border border-zinc-850 text-neutral-400 text-[9px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-red-500"
                    >
                      <option value="ONGOING">Ongoing</option>
                      <option value="ON_SHIPMENT">Shipment</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[12px] font-sans font-bold text-white line-clamp-2 leading-tight">
                      {item.itemName}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono">{item.destination}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2.5">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className="text-[9px] truncate max-w-[80px]" title={item.documentName}>
                        {item.documentName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 text-white font-mono font-bold rounded text-[10px]">
                      QTY: {item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Done (Sampai) */}
        <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-wider">
              Done (Sampai)
            </span>
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-mono font-bold rounded">
              {doneCards.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
            {doneCards.length === 0 ? (
              <div className="my-auto text-center text-[10px] text-gray-600 font-mono uppercase py-8">
                No completed items
              </div>
            ) : (
              doneCards.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl shadow-md transition-colors flex flex-col gap-3.5 relative overflow-hidden opacity-75"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-500">{item.id}</span>
                    <select
                      value="DONE"
                      onChange={(e) => onStatusChange(item.id, e.target.value)}
                      className="bg-neutral-950 border border-zinc-850 text-neutral-400 text-[9px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-red-500"
                    >
                      <option value="ONGOING">Ongoing</option>
                      <option value="ON_SHIPMENT">Shipment</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[12px] font-sans font-bold text-white line-clamp-2 leading-tight">
                      {item.itemName}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono">{item.destination}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-850/60 pt-2.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className="text-[9px] truncate max-w-[80px]" title={item.documentName}>
                        {item.documentName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-850 text-white font-mono font-bold rounded text-[10px]">
                      QTY: {item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
