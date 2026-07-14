"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { InventoryItem, MachineryItem } from "@/types/database";
import { databaseService } from "@/services/databaseService";
import { userService } from "@/services/userService";
import { requestService } from "@/services/requestService";

// Sub-components
import DatabaseStatsCards from "./components/DatabaseStatsCards";
import StockTable from "./components/StockTable";
import MachineTable from "./components/MachineTable";
import PendingApprovalsQueue from "./components/PendingApprovalsQueue";

export default function DatabaseInputPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "approvals">("directory");
  const [stats, setStats] = useState({
    productsCount: 0,
    usersCount: 0,
    incomingItemsCount: 0,
    totalItemsCount: 0,
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  // Load inventory items & machinery from backend API
  const fetchData = async () => {
    const [apiInventory, apiMachinery] = await Promise.all([
      databaseService.getInventoryItems(),
      databaseService.getMachineryItems(),
    ]);
    setInventoryItems(apiInventory);
    setMachineryItems(apiMachinery);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update stats & pending count
  useEffect(() => {
    const fetchDynamicStats = async () => {
      const users = await userService.getAllUsers();
      const { pending } = await requestService.fetchAllRequests();

      setStats({
        productsCount: inventoryItems.length,
        usersCount: users.length,
        incomingItemsCount: pending.length,
        totalItemsCount: inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0),
      });
    };

    fetchDynamicStats();
  }, [inventoryItems]);

  // Sync pending approvals count from localStorage
  const updatePendingCount = () => {
    const stock = localStorage.getItem("pending_stock_approvals");
    const machines = localStorage.getItem("pending_machine_approvals");
    const stockArr = stock ? JSON.parse(stock) : [];
    const machinesArr = machines ? JSON.parse(machines) : [];
    setPendingCount(stockArr.length + machinesArr.length);
  };

  useEffect(() => {
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 3000);
    return () => clearInterval(interval);
  }, []);

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
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">Database Control</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-neutral-900 border border-zinc-800 p-1.5 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                activeTab === "directory"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Master Directory
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === "approvals"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Approvals Queue
              {pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-[9px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "directory" ? (
          <div className="flex flex-col gap-8 animate-fadeIn">
            <DatabaseStatsCards stats={stats} />
            <StockTable inventoryItems={inventoryItems} handleDeleteStock={handleDeleteStock} />
            <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
            <MachineTable machineryItems={machineryItems} handleDeleteMachine={handleDeleteMachine} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <PendingApprovalsQueue onApprovalSuccess={fetchData} />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
