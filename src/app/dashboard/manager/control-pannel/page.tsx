"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";

// Services Asli
import { requestService } from "@/services/requestService";
import { databaseService } from "@/services/databaseService";
import { predictiveService } from "@/services/predictiveService";

// Sub-components
import OrderRequestsCard from "./components/OrderRequestsCard";
import MachineryStatusCard from "./components/MachineryStatusCard";
import LiveInventoryStockCard from "./components/LiveInventoryStockCard";
import RecentTransactionsCard from "./components/RecentTransactionsCard";
import AiPredictiveAlertsCard from "./components/AiPredictiveAlertsCard";

export default function ControlPanelPage() {
  const [orderFilter, setOrderFilter] = useState("monthly");
  const [maintenanceFilter, setMaintenanceFilter] = useState("monthly");

  // State untuk Data Live
  const [liveOrders, setLiveOrders] = useState<Array<{ id: string; customerName: string; orderDate: string; status: string }>>([]);
  const [liveMaintenances, setLiveMaintenances] = useState<Array<{ id: string; customerName: string; orderDate: string; status: string; downtimeImpact: string }>>([]);
  const [liveStockSummary, setLiveStockSummary] = useState({
    currentStock: 0,
    replenishedStock: 0,
    completedOrders: 0,
  });
  const [liveStockItems, setLiveStockItems] = useState<Array<{ name: string; partName: string; quantity: number; maxQty: number; isCritical: boolean }>>([]);
  const [liveHistory, setLiveHistory] = useState<Array<{ type: "OUT" | "IN" | string; timeAgo: string; title: string; quantityInfo: string }>>([]);
  const [aiAlerts, setAiAlerts] = useState<Array<{
    type: "STOCK" | "MACHINE" | string;
    status: string;
    name: string;
    abcClass?: "A" | "B" | "C" | string;
    dynamicMinROP?: number;
    dynamicMax?: number;
    sku?: string;
    machineId?: string;
    lastMaintenance?: string;
  }> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Requests (Untuk Order Request & History)
      const { pending, processed } = await requestService.fetchAllRequests();
      
      const mappedOrders = pending.slice(0, 5).map(req => ({
        id: req.id,
        customerName: req.requestor,
        orderDate: req.date.split(" ")[0],
        status: "Processing"
      }));
      setLiveOrders(mappedOrders);

      // 2. Fetch Machines (Untuk Factory Machinery Status)
      const machines = await databaseService.getMachineryItems();
      const mappedMachines = machines.slice(0, 10).map(m => ({
        id: m.id,
        customerName: m.machineName,
        orderDate: m.lastMaintenance,
        status: m.status,
        downtimeImpact: m.downtimeImpact || "MEDIUM"
      }));
      setLiveMaintenances(mappedMachines);

      // 3. Fetch Spare Parts (Untuk Stock Summary & Chart)
      const parts = await databaseService.getInventoryItems();
      
      let totalStock = 0;
      const chartItems: Array<{ name: string; partName: string; quantity: number; maxQty: number; isCritical: boolean }> = [];
      
      // Sort by quantity ascending so critical items appear first
      const sortedParts = [...parts].sort((a, b) => a.quantity - b.quantity);
      const maxQty = Math.max(...parts.map(p => p.quantity), 1);
      
      sortedParts.forEach((p, idx) => {
        totalStock += p.quantity;
        if (idx < 12) {
          chartItems.push({
            name: p.sku,
            partName: p.name,
            quantity: p.quantity,
            maxQty: maxQty,
            isCritical: p.status === "OUT OF STOCK" || p.status === "LOW STOCK"
          });
        }
      });
      
      setLiveStockSummary({
        currentStock: totalStock,
        replenishedStock: totalStock, // Will show total units
        completedOrders: processed.length,
      });
      setLiveStockItems(chartItems);

      // 4. Fetch Recent Transactions
      const transactions = await databaseService.getInventoryTransactions(5);
      const mappedHistory = transactions.map((trx) => {
        const matchingPart = parts.find(p => p.sku === trx.sku);
        const partName = matchingPart ? matchingPart.name : trx.sku;
        
        // Calculate relative time
        const trxDate = new Date(trx.transactionDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - trxDate.getTime()) / (1000 * 60 * 60 * 24));
        let timeAgo = "Today";
        if (diffDays === 1) timeAgo = "1 Day Ago";
        else if (diffDays > 1 && diffDays < 30) timeAgo = `${diffDays} Days Ago`;
        else if (diffDays >= 30) timeAgo = `${Math.floor(diffDays / 30)} Month(s) Ago`;
        
        return {
          id: trx.id,
          title: partName,
          quantityInfo: `${trx.quantity} units ${trx.transactionType}`,
          timeAgo: timeAgo,
          type: trx.transactionType,
        };
      });
      setLiveHistory(mappedHistory);

      // 5. Fetch AI Predictive Alerts
      try {
        const metrics = await predictiveService.calculatePredictiveMetrics(parts);
        const stockAlerts = metrics
          .filter(m => {
            const matchingPart = parts.find(p => p.sku === m.sku);
            const currentStock = matchingPart ? matchingPart.quantity : 0;
            return currentStock <= m.dynamicMinROP; 
          })
          .map(a => ({
            type: "STOCK",
            status: "CRITICAL",
            name: a.name,
            abcClass: a.abcClass,
            dynamicMinROP: a.dynamicMinROP,
            dynamicMax: a.dynamicMax,
            sku: a.sku
          }));

        const machineAlerts = machines
          .filter(m => m.status === "WARNING" || m.status === "CRITICAL")
          .map(m => ({
            type: "MACHINE",
            status: m.status,
            name: m.machineName,
            machineId: m.id,
            lastMaintenance: m.lastMaintenance,
          }));

        const combinedAlerts = [...machineAlerts, ...stockAlerts];

        // Sort: CRITICAL first, then WARNING, then others
        combinedAlerts.sort((a, b) => {
          const scoreA = a.status === "CRITICAL" ? 3 : a.status === "WARNING" ? 2 : 1;
          const scoreB = b.status === "CRITICAL" ? 3 : b.status === "WARNING" ? 2 : 1;
          return scoreB - scoreA;
        });

        setAiAlerts(combinedAlerts);
      } catch (err) {
        console.error(err);
        setAiAlerts([]);
      }
    };

    fetchData();
  }, []);

  const filterOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-6 w-full select-none pb-12">
        
        {/* Header Section / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-wide">
            {/* Breadcrumbs moved to Navbar */}
          </div>
          <div className="text-[10px] font-mono bg-green-50 text-green-500 border border-green-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            LIVE DB CONNECTED
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <OrderRequestsCard
              liveOrders={liveOrders}
              orderFilter={orderFilter}
              setOrderFilter={setOrderFilter}
              filterOptions={filterOptions}
            />

            <MachineryStatusCard
              liveMaintenances={liveMaintenances}
              maintenanceFilter={maintenanceFilter}
              setMaintenanceFilter={setMaintenanceFilter}
              filterOptions={filterOptions}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-6">
              <LiveInventoryStockCard
                liveStockSummary={liveStockSummary}
                liveStockItems={liveStockItems}
                liveHistoryLength={liveHistory.length}
              />
            </div>

            <div className="md:col-span-3">
              <RecentTransactionsCard liveHistory={liveHistory} />
            </div>

            <div className="md:col-span-3">
              <AiPredictiveAlertsCard aiAlerts={aiAlerts} />
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
