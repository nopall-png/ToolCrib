"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { databaseService } from "@/services/databaseService";
import { InventoryItem, MachineryItem } from "@/types/database";

// Reusable Database Tables
import StockTable from "../../manager/database/components/StockTable";
import MachineTable from "../../manager/database/components/MachineTable";

export default function ViewDirectoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([]);

  // Load directory data
  const loadDirectoryData = async () => {
    const [apiInventory, apiMachinery] = await Promise.all([
      databaseService.getInventoryItems(),
      databaseService.getMachineryItems(),
    ]);
    setInventoryItems(apiInventory);
    setMachineryItems(apiMachinery);
  };

  useEffect(() => {
    loadDirectoryData();
  }, []);

  return (
    <DashboardLayout role="engineer">
      <div className="flex flex-col gap-8 w-full select-none pb-16 animate-fadeIn">
        <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
          <span className="text-neutral-500 font-medium">Dashboard/</span>
          <span className="text-neutral-400 font-light text-xl">View Directory</span>
        </div>

        <div>
          <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider mb-4 px-1">
            Spare Parts Stock Directory
          </h3>
          <StockTable inventoryItems={inventoryItems} readOnly={true} />
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        <div>
          <h3 className="text-gray-300 text-sm font-bold font-mono uppercase tracking-wider mb-4 px-1">
            Registered Machinery Directory
          </h3>
          <MachineTable machineryItems={machineryItems} readOnly={true} />
        </div>
      </div>
    </DashboardLayout>
  );
}
