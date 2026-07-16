import { Requisition, ProcessedRequisition } from "@/types/request";
import { getStatusLabel } from "@/features/procurement/utils";

interface RequisitionLogsProps {
  pendingList: Requisition[];
  processedList: ProcessedRequisition[];
}

export default function RequisitionLogs({ pendingList, processedList }: RequisitionLogsProps) {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-6 min-h-[200px]">
      <div className="overflow-x-auto w-full text-xs font-mono">
        {pendingList.length === 0 && processedList.length === 0 ? (
          <div className="py-12 text-center text-[#A3AED0] uppercase tracking-widest text-[10px]">
            No requisitions filed yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#A3AED0] text-[10px] uppercase font-bold">
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
                  className="border-b border-gray-50 text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-[#2B3674]">{req.id}</td>
                  <td className="py-4 px-4">{req.date}</td>
                  <td className="py-4 px-4 font-sans font-medium text-[#2B3674]">
                    {req.itemName}
                    <br />
                    <span className="text-[#A3AED0] font-mono text-[9px]">{req.destination}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[#2B3674] font-bold">
                      {req.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#4318FF]">{req.documentName}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${
                      req.urgency === "CRITICAL" ? "bg-red-50 text-red-500 border-red-100" :
                      req.urgency === "HIGH" ? "bg-yellow-50 text-yellow-500 border-yellow-100" :
                      "bg-gray-50 text-[#A3AED0] border-gray-100"
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2 py-1 rounded bg-yellow-50 border border-yellow-100 text-yellow-500 text-[9px] font-bold">
                      PENDING (NEED ACC)
                    </span>
                  </td>
                </tr>
              ))}

              {/* Render processed requests */}
              {processedList.map((proc) => (
                <tr
                  key={proc.id}
                  className="border-b border-gray-50 text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50/50 transition-colors animate-fade-in"
                >
                  <td className="py-4 px-4 text-[#A3AED0] font-bold">{proc.id}</td>
                  <td className="py-4 px-4 text-[#A3AED0]">{proc.dateProcessed.split(" ")[0]}</td>
                  <td className="py-4 px-4 font-sans font-medium text-[#2B3674]">
                    {proc.itemName}
                    <br />
                    <span className="text-[#A3AED0] font-mono text-[9px]">{proc.destination}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[#2B3674] font-bold">
                      {proc.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#4318FF]">{proc.documentName}</td>
                  <td className="py-4 px-4 text-[#A3AED0]">-</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold border ${getStatusLabel(proc.status).className}`}>
                      {getStatusLabel(proc.status).label}
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
