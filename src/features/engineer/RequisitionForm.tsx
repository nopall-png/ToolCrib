import React, { useState } from "react";
import FormInput from "@/component/common/FormInput";
import { requestService } from "@/services/requestService";
import { authService } from "@/services/authService";

interface RequisitionFormProps {
  engineerName: string;
  onSuccess: () => void;
}

export default function RequisitionForm({ engineerName, onSuccess }: RequisitionFormProps) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("");
  const [urgency, setUrgency] = useState<"CRITICAL" | "HIGH" | "NORMAL">("NORMAL");
  const [docName, setDocName] = useState("");
  const [machines, setMachines] = useState<any[]>([]);

  React.useEffect(() => {
    import("@/services/databaseService").then(({ databaseService }) => {
      databaseService.getMachineryItems().then((items) => {
        setMachines(items);
        if (items.length > 0) {
          setDestination(`${items[0].machineName} (${items[0].id})`);
        }
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !destination.trim() || quantity <= 0) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      alert("Session expired or user not found. Please log in again.");
      return;
    }

    // Ekstrak machine_id dari string "Mesin ABC (MCH-001)" -> "MCH-001"
    const machineIdMatch = destination.match(/\(([^)]+)\)$/);
    const machineId = machineIdMatch ? machineIdMatch[1] : destination;

    const attachment = docName || undefined;

    const success = await requestService.addRequisition({
      requestor_id: currentUser.id,
      sku: itemName.trim(),
      machine_id: machineId,
      quantity: Number(quantity),
      document_url: attachment,
      urgency,
    });

    if (!success) {
      alert("Failed to submit requisition. Please check if SKU is valid.");
      return;
    }

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
          {/* Item SKU */}
          <FormInput
            label="Item SKU / Part ID"
            isRequired
            placeholder="e.g. SKU-1002"
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
              {machines.length > 0 ? (
                machines.map((m) => (
                  <option key={m.id} value={`${m.machineName} (${m.id})`}>
                    {m.machineName} ({m.id})
                  </option>
                ))
              ) : (
                <option value="">-- No Machinery Found in Database --</option>
              )}
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
