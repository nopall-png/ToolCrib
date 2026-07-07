import React, { useState } from "react";
import FormInput from "@/component/common/FormInput";
import { requestService } from "@/services/requestService";
import { authService } from "@/services/authService";

interface RequisitionFormProps {
  engineerName: string;
  onSuccess: () => void;
}

export default function RequisitionForm({ engineerName, onSuccess }: RequisitionFormProps) {
  const [items, setItems] = useState<{sku: string, quantity: number}[]>([{sku: "", quantity: 1}]);
  const [destination, setDestination] = useState("");
  const [urgency, setUrgency] = useState<"CRITICAL" | "HIGH" | "NORMAL">("NORMAL");
  const [requestType, setRequestType] = useState<"TAKE" | "PROCUREMENT">("TAKE");
  const [docName, setDocName] = useState("");
  const [machines, setMachines] = useState<any[]>([]);

  React.useEffect(() => {
    import("@/services/databaseService").then(({ databaseService }) => {
      databaseService.getMachineryItems().then((machineryItems) => {
        setMachines(machineryItems);
        if (machineryItems.length > 0) {
          setDestination(`${machineryItems[0].machineName} (${machineryItems[0].id})`);
        }
      });
    });
  }, []);

  const handleItemChange = (index: number, field: "sku" | "quantity", value: string | number) => {
    const newItems = [...items];
    if (field === "sku") newItems[index].sku = value as string;
    else newItems[index].quantity = Number(value);
    setItems(newItems);
  };

  const addItemRow = () => setItems([...items, {sku: "", quantity: 1}]);
  
  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = items.every(item => item.sku.trim() !== "" && item.quantity > 0);
    
    if (!isValid || !destination.trim()) {
      alert("Please fill all required fields correctly (SKU and Quantity must be valid).");
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
      machine_id: machineId,
      document_url: attachment,
      urgency,
      request_type: requestType,
      items: items.map(i => ({ sku: i.sku.trim(), quantity: i.quantity }))
    });

    if (!success) {
      alert("Failed to submit requisition. Please check if SKU is valid.");
      return;
    }

    // Reset Form
    setItems([{sku: "", quantity: 1}]);
    setDocName("");
    setUrgency("NORMAL");
    setRequestType("TAKE");

    // Refresh list
    onSuccess();
    alert("REQUISITION FILED: Sparepart request successfully sent to the Manager.");
  };

  return (
    <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Dynamic Item Rows */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-zinc-300 font-mono text-sm font-bold uppercase">Requested Items</h3>
            <button
              type="button"
              onClick={addItemRow}
              className="text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded transition-colors"
            >
              + ADD NEW ITEM
            </button>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                  Item SKU / Part ID *
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKU-1002"
                  className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-all text-sm font-mono"
                  value={item.sku}
                  onChange={(e) => handleItemChange(index, "sku", e.target.value)}
                />
              </div>
              <div className="w-32 flex flex-col gap-1.5">
                <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                  Quantity *
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-all text-sm font-mono"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="h-10 px-3 bg-red-950/50 text-red-500 hover:text-white hover:bg-red-500 rounded-[10px] border border-red-900/50 transition-colors text-xs font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Request Type */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
              Request Type *
            </span>
            <select
              className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-all text-sm font-sans"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as any)}
            >
              <option value="TAKE">Ambil Barang (TAKE)</option>
              <option value="PROCUREMENT">Beli Baru (PROCUREMENT)</option>
            </select>
          </div>

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
          
          {/* Attach Document (Simulation) */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
              Attach Spec Sheet (Filename)
            </span>
            <input
              type="text"
              placeholder="e.g. servo_ax9_spec.pdf (Optional)"
              className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-red-500 focus:outline-none transition-all text-sm font-mono"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>
        </div>

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
