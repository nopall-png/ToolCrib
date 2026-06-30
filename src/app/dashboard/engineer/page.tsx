"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import FormInput from "@/component/common/FormInput";
import { requestService } from "@/services/requestService";
import { authService } from "@/services/authService";
import { Requisition, ProcessedRequisition } from "@/types/request";

export default function EngineerDashboard() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("CNC Milling Axis-5");
  const [urgency, setUrgency] = useState<"CRITICAL" | "HIGH" | "NORMAL">("NORMAL");
  const [docName, setDocName] = useState("");
  
  const [pendingList, setPendingList] = useState<Requisition[]>([]);
  const [processedList, setProcessedList] = useState<ProcessedRequisition[]>([]);
  const [engineerName, setEngineerName] = useState("Engineer Operator");

  // Load request lists and user details
  const loadRequests = () => {
    setPendingList(requestService.getPendingRequisitions());
    setProcessedList(requestService.getProcessedRequisitions());
  };

  useEffect(() => {
    loadRequests();
    const user = authService.getCurrentUser();
    if (user) {
      setEngineerName(user.fullName);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !destination.trim() || quantity <= 0) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const docSize = docName ? `${(Math.random() * 4 + 0.5).toFixed(1)} MB` : "N/A";
    const attachment = docName || "No attachment";

    requestService.addRequisition({
      requestor: engineerName,
      shift: "Shift 1",
      itemName: itemName.trim(),
      destination: destination.trim(),
      quantity: Number(quantity),
      documentName: attachment,
      documentSize: docSize,
      urgency,
    });

    // Reset Form
    setItemName("");
    setQuantity(1);
    setDocName("");
    setUrgency("NORMAL");

    // Refresh list
    loadRequests();
    alert("REQUISITION FILED: Sparepart request successfully sent to the Manager.");
  };

  return (
    <DashboardLayout role="engineer">
      <div className="flex flex-col gap-8 w-full select-none pb-12">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">Engineer Portal</span>
          </div>
        </div>

        {/* Onboarding Welcome Announcement Card matching manager style */}
        <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl flex flex-col justify-center">
          <div className="z-10 flex flex-col gap-1">
            <h2 className="text-white text-3xl font-bold tracking-tight font-sans leading-9">
              Welcome to ToolCrib Engineer Portal
            </h2>
            <p className="text-neutral-400 text-sm font-normal font-sans leading-5">
              Secure console active. File requisitions for tools/spareparts and trace manager approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 1: Form Request */}
          <div className="lg:col-span-2 flex flex-col gap-4">
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                </svg>
              </div>
              <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
                Create Sparepart Requisition
              </h3>
            </div>

            <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Item Name */}
                  <FormInput
                    label="Item Name / Part Description"
                    isRequired
                    placeholder="e.g. Servo Motor AX-9"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />

                  {/* Quantity */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                      Quantity Required *
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all text-sm font-mono"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Destination Machine */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                      Destination Machine / Cell *
                    </span>
                    <select
                      className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-all text-sm font-sans"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option value="CNC Milling Axis-5 (MCH-0012)">CNC Milling Axis-5 (MCH-0012)</option>
                      <option value="Industrial Lathe L-300 (MCH-0013)">Industrial Lathe L-300 (MCH-0013)</option>
                      <option value="Hydraulic Press H-50 (MCH-0014)">Hydraulic Press H-50 (MCH-0014)</option>
                      <option value="Stamping Cell Press 2">Stamping Cell Press 2</option>
                      <option value="General Mechanical Inventory">General Mechanical Inventory</option>
                    </select>
                  </div>

                  {/* Urgency */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                      Urgency Level *
                    </span>
                    <select
                      className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-all text-sm font-sans"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                    >
                      <option value="NORMAL">NORMAL (Routine stock / scheduling)</option>
                      <option value="HIGH">HIGH (Urgent maintenance required)</option>
                      <option value="CRITICAL">CRITICAL (Machinery breakdown - downtime)</option>
                    </select>
                  </div>
                </div>

                {/* Attach Document (Simulation) */}
                <FormInput
                  label="Attach Spec Sheet / Drawing (Filename)"
                  placeholder="e.g. servo_ax9_spec.pdf (Optional)"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md transition-all uppercase tracking-wider cursor-pointer"
                  >
                    File Requisition
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Section 2: Machine Diagnostic info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-4 h-4 text-green-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
                Machinery Diagnoses
              </h3>
            </div>

            <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="p-4 bg-neutral-950 rounded-xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-sans text-gray-200">CNC Milling Axis-5</h4>
                  <p className="text-[10px] text-gray-500 font-mono">ID: MCH-0012 • Operational</p>
                </div>
                <div className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-bold rounded">
                  98% HEALTH
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-sans text-gray-200">Industrial Lathe L-300</h4>
                  <p className="text-[10px] text-gray-500 font-mono">ID: MCH-0013 • Maintenance Pending</p>
                </div>
                <div className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-bold rounded">
                  78% HEALTH
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-sans text-gray-200">Hydraulic Press H-50</h4>
                  <p className="text-[10px] text-gray-500 font-mono">ID: MCH-0014 • Operational</p>
                </div>
                <div className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-bold rounded">
                  92% HEALTH
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: History of Requisitions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
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
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-gray-400 text-sm font-bold font-mono uppercase tracking-wider">
              Requisition Logs & Tracking
            </h3>
          </div>

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
        </div>

      </div>
    </DashboardLayout>
  );
}
