"use client";

import React, { useState } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { InventoryItem, MachineryItem } from "@/types/database";

// Reusable Database Forms
import AddStockForm from "../../manager/database/components/AddStockForm";
import AddMachineForm from "../../manager/database/components/AddMachineForm";

export default function RegisterRegistryPage() {
  // Add Stock Form State
  const [stockName, setStockName] = useState("");
  const [stockSku, setStockSku] = useState("");
  const [stockSize, setStockSize] = useState("");
  const [stockCategory, setStockCategory] = useState("Mechanical");
  const [stockQty, setStockQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [criticality, setCriticality] = useState("LOW");
  const [rackLocation, setRackLocation] = useState("");

  // Add Machine Form State
  const [machineName, setMachineName] = useState("");
  const [lastMaintDate, setLastMaintDate] = useState("");
  const [spareParts, setSpareParts] = useState("");

  const categoryOptions = [
    { value: "Mechanical", label: "Mechanical" },
    { value: "Drivetrain", label: "Drivetrain" },
    { value: "Hydraulics", label: "Hydraulics" },
    { value: "Electrical", label: "Electrical" },
    { value: "Pneumatics", label: "Pneumatics" },
  ];

  // Submit Stock to Manager Approval Queue (localStorage)
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();

    if (!stockName.trim() || !stockQty) {
      alert("Please fill in Component Name and Quantity.");
      return;
    }

    const qty = parseInt(stockQty);
    const skuCode = stockSku.trim() || `SKU-${Math.floor(10000 + Math.random() * 90000)}`;

    let status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK" = "IN STOCK";
    if (qty === 0) {
      status = "OUT OF STOCK";
    } else if (qty < 20) {
      status = "LOW STOCK";
    }

    const newItem: InventoryItem = {
      sku: skuCode,
      name: stockSize.trim() ? `${stockName.trim()} (${stockSize.trim()})` : stockName.trim(),
      category: stockCategory,
      quantity: qty,
      status: status,
      minStock: minStock ? parseInt(minStock) : 5,
      maxStock: maxStock ? parseInt(maxStock) : 100,
      criticalityLevel: criticality,
      rackLocation: rackLocation.trim() || "A1-01",
    };

    const currentPending = localStorage.getItem("pending_stock_approvals");
    const pendingList: InventoryItem[] = currentPending ? JSON.parse(currentPending) : [];

    if (pendingList.some((item) => item.sku.toLowerCase() === skuCode.toLowerCase())) {
      alert(`An item with SKU ${skuCode} is already pending approval.`);
      return;
    }

    pendingList.push(newItem);
    localStorage.setItem("pending_stock_approvals", JSON.stringify(pendingList));
    alert(`Success: Stock entry registration request submitted for Manager's approval.`);

    // Reset Form
    setStockName("");
    setStockSku("");
    setStockSize("");
    setStockCategory("Mechanical");
    setStockQty("");
    setMinStock("");
    setMaxStock("");
    setCriticality("LOW");
    setRackLocation("");
  };

  // Submit Machine to Manager Approval Queue (localStorage)
  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();

    if (!machineName.trim() || !lastMaintDate) {
      alert("Please fill in Machine Name and Last Maintenance Date.");
      return;
    }

    const mchId = `MCH-00${Math.floor(15 + Math.random() * 85)}`;
    
    const lastDateObj = new Date(lastMaintDate);
    const standardDate = new Date(lastDateObj);
    standardDate.setDate(standardDate.getDate() + 90);
    const standardSchedule = standardDate.toISOString().split("T")[0];

    const aiDate = new Date(lastDateObj);
    aiDate.setDate(aiDate.getDate() + 75);
    const aiPrediction = aiDate.toISOString().split("T")[0];

    const parts = spareParts.trim()
      ? spareParts.split(",").map((p) => p.trim()).filter((p) => p !== "")
      : ["General Inspection"];

    const newMachine: MachineryItem = {
      id: mchId,
      machineName: machineName.trim(),
      requiredParts: parts,
      lastMaintenance: lastMaintDate,
      standardSchedule: standardSchedule,
      aiPrediction: aiPrediction,
      status: "Operational",
    };

    const currentPending = localStorage.getItem("pending_machine_approvals");
    const pendingList: MachineryItem[] = currentPending ? JSON.parse(currentPending) : [];

    pendingList.push(newMachine);
    localStorage.setItem("pending_machine_approvals", JSON.stringify(pendingList));
    alert(`Success: Machine registration request submitted for Manager's approval.`);

    // Reset Form
    setMachineName("");
    setLastMaintDate("");
    setSpareParts("");
  };

  return (
    <DashboardLayout role="engineer">
      <div className="flex flex-col gap-10 w-full select-none pb-16 animate-fadeIn">
        <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
          <span className="text-gray-500 font-medium">Dashboard/</span>
          <span className="text-[#2B3674] font-bold text-xl">Register Registry</span>
        </div>

        <AddStockForm
          stockName={stockName}
          setStockName={setStockName}
          stockSku={stockSku}
          setStockSku={setStockSku}
          stockSize={stockSize}
          setStockSize={setStockSize}
          stockCategory={stockCategory}
          setStockCategory={setStockCategory}
          stockQty={stockQty}
          setStockQty={setStockQty}
          minStock={minStock}
          setMinStock={setMinStock}
          maxStock={maxStock}
          setMaxStock={setMaxStock}
          criticality={criticality}
          setCriticality={setCriticality}
          rackLocation={rackLocation}
          setRackLocation={setRackLocation}
          handleAddStock={handleAddStock}
          categoryOptions={categoryOptions}
        />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <AddMachineForm
          machineName={machineName}
          setMachineName={setMachineName}
          lastMaintDate={lastMaintDate}
          setLastMaintDate={setLastMaintDate}
          spareParts={spareParts}
          setSpareParts={setSpareParts}
          handleAddMachine={handleAddMachine}
        />
      </div>
    </DashboardLayout>
  );
}
