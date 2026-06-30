import React, { useState } from "react";
import FormInput from "@/component/common/FormInput";
import { requestService } from "@/services/requestService";

interface RequisitionFormProps {
  engineerName: string;
  onSuccess: () => void;
}

export default function RequisitionForm({ engineerName, onSuccess }: RequisitionFormProps) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("CNC Milling Axis-5");
  const [urgency, setUrgency] = useState<"CRITICAL" | "HIGH" | "NORMAL">("NORMAL");
  const [docName, setDocName] = useState("");

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
    onSuccess();
    alert("REQUISITION FILED: Sparepart request successfully sent to the Manager.");
  };

  return (
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
  );
}
