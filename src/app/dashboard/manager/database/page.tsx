"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import FormInput from "@/component/common/FormInput";
import Dropdown from "@/component/common/Dropdown";
import Link from "next/link";
import {
  initialDatabaseStats,
  initialInventoryItems,
  initialMachineryItems,
} from "@/data/database";
import { InventoryItem, MachineryItem } from "@/types/database";
import { predictiveService, AIStockRecommendation } from "@/services/predictiveService";
import { databaseService } from "@/services/databaseService";
import { userService } from "@/services/userService";
import { requestService } from "@/services/requestService";

export default function DatabaseInputPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    usersCount: 0,
    incomingItemsCount: 0,
    totalItemsCount: 0,
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([]);
  const [predictiveMetrics, setPredictiveMetrics] = useState<AIStockRecommendation[]>([]);

  // Load inventory items & machinery from backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      const [apiInventory, apiMachinery] = await Promise.all([
        databaseService.getInventoryItems(),
        databaseService.getMachineryItems(),
      ]);
      // Hapus fallback ke data palsu! Jika dari DB kosong (length 0), maka biarkan tabel kosong.
      setInventoryItems(apiInventory);
      setMachineryItems(apiMachinery);
    };
    fetchData();
  }, []);

  // Update stats setiap kali inventoryItems berubah
  useEffect(() => {
    const fetchDynamicStats = async () => {
      // Ambil jumlah user asli
      const users = await userService.getAllUsers();
      // Ambil jumlah request yang pending
      const { pending } = await requestService.fetchAllRequests();

      setStats({
        productsCount: inventoryItems.length,
        usersCount: users.length,
        incomingItemsCount: pending.length,
        totalItemsCount: inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0),
      });
    };

    fetchDynamicStats();

    const fetchMetrics = async () => {
      if (inventoryItems.length > 0) {
        const metrics = await predictiveService.calculatePredictiveMetrics(inventoryItems);
        setPredictiveMetrics(metrics);
      }
    };
    fetchMetrics();
  }, [inventoryItems]);

  // Form State for Stock Entry
  const [stockName, setStockName] = useState("");
  const [stockSku, setStockSku] = useState("");
  const [stockSize, setStockSize] = useState("");
  const [stockCategory, setStockCategory] = useState("Mechanical");
  const [stockQty, setStockQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [criticality, setCriticality] = useState("LOW");
  const [rackLocation, setRackLocation] = useState("");

  // Form State for Machinery
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

  const getAbcColor = (abc: "A" | "B" | "C") => {
    if (abc === "A") return "bg-red-500/10 text-red-500 border-red-500/20";
    if (abc === "B") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  const getXyzColor = (xyz: "X" | "Y" | "Z") => {
    if (xyz === "X") return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    if (xyz === "Y") return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  };

  // Add Stock Handler
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stockName.trim() || !stockQty) {
      alert("Please fill in Component Name and Quantity.");
      return;
    }

    const qty = parseInt(stockQty);
    const skuCode = stockSku.trim() || `SKU-${Math.floor(10000 + Math.random() * 90000)}`;

    // Calculate status
    let status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK" = "IN STOCK";
    if (qty === 0) {
      status = "OUT OF STOCK";
    } else if (qty < 20) {
      status = "LOW STOCK";
    }

    // Check if SKU already exists
    if (inventoryItems.some((item) => item.sku.toLowerCase() === skuCode.toLowerCase())) {
      alert(`An item with SKU ${skuCode} already exists.`);
      return;
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

    // POST ke backend API, lalu update state UI
    const success = await databaseService.addInventoryItem(newItem);
    if (!success) {
      alert("Failed to save to database. Saving locally only.");
    }

    setInventoryItems([newItem, ...inventoryItems]);
    
    // Update stats count
    setStats((prev) => ({
      ...prev,
      productsCount: prev.productsCount + 1,
      totalItemsCount: prev.totalItemsCount + qty,
      incomingItemsCount: prev.incomingItemsCount + 1,
    }));

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

  // Delete Stock Handler
  const handleDeleteStock = async (sku: string, qty: number) => {
    if (confirm(`Remove item ${sku} from database?`)) {
      const success = await databaseService.deleteInventoryItem(sku);
      if (success) {
        setInventoryItems(inventoryItems.filter((item) => item.sku !== sku));
        setStats((prev) => ({
          ...prev,
          productsCount: Math.max(0, prev.productsCount - 1),
          totalItemsCount: Math.max(0, prev.totalItemsCount - qty),
        }));
      } else {
        alert("Failed to delete from database.");
      }
    }
  };

  // Add Machine Handler
  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!machineName.trim() || !lastMaintDate) {
      alert("Please fill in Machine Name and Last Maintenance Date.");
      return;
    }

    const mchId = `MCH-00${Math.floor(15 + Math.random() * 85)}`;
    
    // Calculate standard schedule (+90 days from last maintenance)
    const lastDateObj = new Date(lastMaintDate);
    const standardDate = new Date(lastDateObj);
    standardDate.setDate(standardDate.getDate() + 90);
    const standardSchedule = standardDate.toISOString().split("T")[0];

    // Calculate AI prediction (+75 days from last maintenance - slightly earlier)
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

    // POST ke backend API, lalu update state UI
    const success = await databaseService.addMachineryItem(newMachine);
    if (!success) {
      alert("Failed to save machine to database. Saving locally only.");
    }

    setMachineryItems([newMachine, ...machineryItems]);

    // Reset Form
    setMachineName("");
    setLastMaintDate("");
    setSpareParts("");
  };

  // Delete Machine Handler
  const handleDeleteMachine = async (id: string) => {
    if (confirm(`Remove machine ${id} from register?`)) {
      const success = await databaseService.deleteMachineryItem(id);
      if (success) {
        setMachineryItems(machineryItems.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete machine from database.");
      }
    }
  };

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-8 w-full select-none pb-16">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">Database</span>
          </div>
        </div>

        {/* 4 Stat Cards at the Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Product */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-[20px] p-6 relative flex items-center justify-between h-40">
            <div className="flex flex-col gap-2 z-10">
              <span className="text-white text-3xl font-bold font-sans tracking-wide leading-8">
                {stats.productsCount}
              </span>
              <span className="text-neutral-400 text-base font-normal font-sans tracking-wide">
                Product
              </span>
            </div>
            <div className="w-14 h-12 bg-white/10 rounded-2xl flex justify-center items-center shrink-0 text-red-500 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.5 12H16l-3.5 7L9 5l-3.5 7H2"></path>
              </svg>
            </div>
          </div>

          {/* Card 2: User */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-[20px] p-6 relative flex items-center justify-between h-40">
            <div className="flex flex-col gap-2 z-10">
              <span className="text-white text-3xl font-bold font-sans tracking-wide leading-8">
                {stats.usersCount}
              </span>
              <span className="text-neutral-400 text-base font-normal font-sans tracking-wide">
                User
              </span>
            </div>
            <div className="w-14 h-12 bg-white/10 rounded-2xl flex justify-center items-center shrink-0 text-yellow-500 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>

          {/* Card 3: Total Incoming Items */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-[20px] p-6 relative flex items-center justify-between h-40">
            <div className="flex flex-col gap-2 z-10">
              <span className="text-white text-3xl font-bold font-sans tracking-wide leading-8">
                {stats.incomingItemsCount}
              </span>
              <span className="text-neutral-400 text-base font-normal font-sans tracking-wide">
                Total Incoming Items
              </span>
            </div>
            <div className="w-14 h-12 bg-white/10 rounded-2xl flex justify-center items-center shrink-0 text-blue-500 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
            </div>
          </div>

          {/* Card 4: Total Items */}
          <div className="bg-neutral-900 border border-zinc-800 rounded-[20px] p-6 relative flex items-center justify-between h-40">
            <div className="flex flex-col gap-2 z-10">
              <span className="text-white text-3xl font-bold font-sans tracking-wide leading-8">
                {stats.totalItemsCount.toLocaleString()}
              </span>
              <span className="text-neutral-400 text-base font-normal font-sans tracking-wide">
                Total Items
              </span>
            </div>
            <div className="w-14 h-12 bg-white/10 rounded-2xl flex justify-center items-center shrink-0 text-green-500 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* SECTION 1: Add New Stock Entry */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 text-red-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold font-sans">
                Add New Stock Entry
              </h2>
            </div>
            <p className="text-neutral-500 text-xs font-mono font-normal">
              Register components into the central MRO database.
            </p>
          </div>

          {/* Stock Form Card */}
          <form
            onSubmit={handleAddStock}
            className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl"
          >
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Component Name */}
              <div className="md:col-span-2">
                <FormInput
                  label="Component Name"
                  placeholder="e.g. Hydraulic Pump"
                  isRequired
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                />
              </div>

              {/* SKU Code */}
              <div>
                <FormInput
                  label="SKU Code (Optional)"
                  placeholder="Auto-generated if blank"
                  value={stockSku}
                  onChange={(e) => setStockSku(e.target.value)}
                />
              </div>

              {/* Dimensions */}
              <div>
                <FormInput
                  label="Size / Dimensions"
                  placeholder="e.g. 24 inch"
                  value={stockSize}
                  onChange={(e) => setStockSize(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
                  Category
                </span>
                <Dropdown
                  options={categoryOptions}
                  value={stockCategory}
                  onChange={(e) => setStockCategory(e.target.value)}
                  className="w-full h-10 border-zinc-800"
                />
              </div>

              {/* Quantity */}
              <div>
                <FormInput
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  min="0"
                  isRequired
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                />
              </div>

              {/* Min Stock */}
              <div>
                <FormInput
                  label="Min Stock (Optional)"
                  type="number"
                  placeholder="e.g. 5"
                  min="0"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                />
              </div>

              {/* Max Stock */}
              <div>
                <FormInput
                  label="Max Stock (Optional)"
                  type="number"
                  placeholder="e.g. 100"
                  min="0"
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value)}
                />
              </div>

              {/* Criticality Level */}
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
                  Criticality Level
                </span>
                <Dropdown
                  options={[
                    { value: "LOW", label: "LOW" },
                    { value: "MEDIUM", label: "MEDIUM" },
                    { value: "HIGH", label: "HIGH" },
                  ]}
                  value={criticality}
                  onChange={(e) => setCriticality(e.target.value)}
                  className="w-full h-10 border-zinc-800"
                />
              </div>

              {/* Rack Location */}
              <div className="md:col-span-2">
                <FormInput
                  label="Rack Location (Optional)"
                  placeholder="e.g. A1-01"
                  value={rackLocation}
                  onChange={(e) => setRackLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Action button right-aligned */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold font-mono rounded-[10px] shadow-[0px_0px_15px_0px_rgba(239,68,68,0.20)] flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Stock</span>
              </button>
            </div>
          </form>

          {/* Stock Table Card */}
          <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="overflow-x-auto w-full text-xs font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                    <th className="pb-3 px-4">SKU Code</th>
                    <th className="pb-3 px-4">Component Name</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4 text-center">Qty</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <tr
                      key={item.sku}
                      className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-red-500 font-semibold">{item.sku}</td>
                      <td className="py-3.5 px-4 font-sans text-gray-200">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-neutral-950 border border-zinc-800 text-gray-400 rounded text-[9px] uppercase tracking-wide">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-white font-semibold font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            item.status === "IN STOCK"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : item.status === "LOW STOCK"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteStock(item.sku, item.quantity)}
                          className="text-neutral-600 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Remove entry"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Stock Prediction Recommendations Table Card */}
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-red-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider">
                  AI Stock Optimization Recommendations (ABC/XYZ & Min-Max ROP)
                </h3>
              </div>
              <Link
                href="/dashboard/manager/predictive"
                className="text-red-500 hover:text-red-400 text-xs font-mono font-medium hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Predictive Console &rarr;</span>
              </Link>
            </div>

            <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
              <div className="overflow-x-auto w-full text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                      <th className="pb-3 px-4">SKU Code</th>
                      <th className="pb-3 px-4">Component Name</th>
                      <th className="pb-3 px-4">ABC Class</th>
                      <th className="pb-3 px-4">XYZ Class</th>
                      <th className="pb-3 px-4 text-center">Lead Time</th>
                      <th className="pb-3 px-4 text-center">Rec. Min (ROP)</th>
                      <th className="pb-3 px-4 text-right">Rec. Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictiveMetrics.map((rec) => (
                      <tr
                        key={rec.sku}
                        className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-red-500 font-semibold">{rec.sku}</td>
                        <td className="py-3.5 px-4 font-sans text-gray-200">{rec.name}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getAbcColor(rec.abcClass)}`}>
                            {rec.abcClass}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getXyzColor(rec.xyzClass)}`}>
                            {rec.xyzClass}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-gray-400">{rec.leadTimeDays} days</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 bg-neutral-950 border border-zinc-850 rounded text-yellow-500 font-bold">
                            {rec.dynamicMinROP}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2.5 py-1 bg-neutral-950 border border-zinc-850 rounded text-green-500 font-bold">
                            {rec.dynamicMax}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        {/* SECTION 2: Machinery & Maintenance */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 text-blue-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              <h2 className="text-white text-2xl font-bold font-sans">
                Machinery & Maintenance
              </h2>
            </div>
            <p className="text-neutral-500 text-xs font-mono font-normal">
              Register machinery, track required parts, and monitor AI predictive maintenance schedules.
            </p>
          </div>

          {/* Machine Form Card */}
          <form
            onSubmit={handleAddMachine}
            className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl"
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Machine Name */}
              <div>
                <FormInput
                  label="Machine Name / ID"
                  placeholder="e.g. CNC Milling Unit 01"
                  isRequired
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                />
              </div>

              {/* Last Maintenance Date */}
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide">
                    Last Maintenance Date
                  </span>
                  <span className="text-red-500 text-xs font-normal">*</span>
                </div>
                <input
                  type="date"
                  required
                  value={lastMaintDate}
                  onChange={(e) => setLastMaintDate(e.target.value)}
                  className="w-full h-10 px-4 bg-neutral-950/50 text-white rounded-[10px] border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-sm font-mono cursor-pointer"
                />
              </div>

              {/* Required Spare Parts */}
              <div>
                <FormInput
                  label="Required Spare Parts"
                  placeholder="e.g. Valve, Filter, Rim (comma-separated)"
                  value={spareParts}
                  onChange={(e) => setSpareParts(e.target.value)}
                />
              </div>
            </div>

            {/* Action button right-aligned */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold font-mono rounded-[10px] shadow-[0px_0px_15px_0px_rgba(59,130,246,0.20)] flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Register Machine</span>
              </button>
            </div>
          </form>

          {/* Machine Table Card */}
          <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="overflow-x-auto w-full text-xs font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-500 text-[10px] uppercase font-bold">
                    <th className="pb-3 px-4">Machine / ID</th>
                    <th className="pb-3 px-4">Required Spare Parts</th>
                    <th className="pb-3 px-4">Last Maintenance</th>
                    <th className="pb-3 px-4">Standard Schedule</th>
                    <th className="pb-3 px-4">
                      <span className="text-cyan-500">AI Prediction</span>
                    </th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {machineryItems.map((mch) => (
                    <tr
                      key={mch.id}
                      className="border-b border-zinc-800/50 text-neutral-400 hover:text-zinc-200 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-sans font-medium text-gray-200">
                        {mch.machineName}
                        <br />
                        <span className="text-[9px] font-mono text-gray-500">{mch.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {mch.requiredParts.map((part, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.5 bg-neutral-950/80 rounded text-[9px] border border-zinc-850 text-neutral-400 capitalize"
                            >
                              {part}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-semibold">{mch.lastMaintenance}</td>
                      <td className="py-3.5 px-4 text-neutral-500 font-semibold">{mch.standardSchedule}</td>
                      <td className="py-3.5 px-4">
                        <div className="h-6 px-2 py-1 bg-cyan-500/10 rounded-sm border border-cyan-500/20 inline-flex items-center gap-1">
                          <span className="text-cyan-500 text-[9px] font-bold uppercase select-none">AI Pred:</span>
                          <span className="text-cyan-500 text-[10px] font-bold">{mch.aiPrediction}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold border bg-green-500/10 text-green-500 border-green-500/20">
                          {mch.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteMachine(mch.id)}
                          className="text-neutral-600 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Unregister machine"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
