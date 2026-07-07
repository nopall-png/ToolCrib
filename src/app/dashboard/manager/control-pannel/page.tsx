"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import Card from "@/component/common/Card";
import Dropdown from "@/component/common/Dropdown";

// Services Asli
import { requestService } from "@/services/requestService";
import { databaseService } from "@/services/databaseService";
import { predictiveService, AIStockRecommendation } from "@/services/predictiveService";
import { Requisition } from "@/types/request";
import { InventoryItem, MachineryItem, TransactionItem } from "@/types/database";

export default function ControlPanelPage() {
  const [orderFilter, setOrderFilter] = useState("monthly");
  const [maintenanceFilter, setMaintenanceFilter] = useState("monthly");
  const [stockFilter, setStockFilter] = useState("monthly");

  // State untuk Data Live
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [liveMaintenances, setLiveMaintenances] = useState<any[]>([]);
  const [liveStockSummary, setLiveStockSummary] = useState({
    currentStock: 0,
    replenishedStock: 0,
    completedOrders: 0,
  });
  const [liveStockItems, setLiveStockItems] = useState<any[]>([]);
  const [liveHistory, setLiveHistory] = useState<any[]>([]);
  const [aiAlerts, setAiAlerts] = useState<AIStockRecommendation[] | null>(null);

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
      let totalValue = 0;
      const chartItems: any[] = [];
      
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
        const alerts = metrics.filter(m => {
          const matchingPart = parts.find(p => p.sku === m.sku);
          const currentStock = matchingPart ? matchingPart.quantity : 0;
          return currentStock <= m.dynamicMinROP; 
        });
        
        alerts.sort((a, b) => a.abcClass.localeCompare(b.abcClass));
        setAiAlerts(alerts.slice(0, 3));
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
            <span className="text-neutral-500 font-medium">Dashboard/</span>
            <span className="text-neutral-400 font-light text-xl">Control Panel</span>
          </div>
          <div className="text-[10px] font-mono bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
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
            
            {/* 1. Order Request Card */}
            <Card
              title="Order Request"
              actions={
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filter
                  </span>
                  <Dropdown options={filterOptions} value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} />
                </div>
              }
              className="h-80"
            >
              <div className="overflow-x-auto w-full h-full text-xs font-sans">
                {liveOrders.length === 0 ? (
                  <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">No pending requests in database.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-red-500/20 text-neutral-400 pb-2">
                        <th className="pb-2.5 font-medium">Order ID</th>
                        <th className="pb-2.5 font-medium">Requestor</th>
                        <th className="pb-2.5 font-medium">Date</th>
                        <th className="pb-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveOrders.map((req, idx) => (
                        <tr key={idx} className="border-b border-zinc-800/40 text-neutral-400 hover:text-zinc-200 transition-colors">
                          <td className="py-3 font-normal font-mono">{req.id}</td>
                          <td className="py-3 font-medium text-zinc-300">{req.customerName}</td>
                          <td className="py-3 font-normal font-mono">{req.orderDate}</td>
                          <td className="py-3 font-medium text-yellow-500">{req.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>

            {/* 2. Scheduled Maintenance Card */}
            <Card
              title="Factory Machinery Status"
              actions={
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filter
                  </span>
                  <Dropdown options={filterOptions} value={maintenanceFilter} onChange={(e) => setMaintenanceFilter(e.target.value)} />
                </div>
              }
              className="h-80"
            >
              <div className="overflow-x-auto w-full h-full text-xs font-sans">
                {liveMaintenances.length === 0 ? (
                   <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">No machines registered.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-red-500/20 text-neutral-400 pb-2">
                        <th className="pb-2.5 font-medium">Machine ID</th>
                        <th className="pb-2.5 font-medium">Machine Name</th>
                        <th className="pb-2.5 font-medium">Last Maint.</th>
                        <th className="pb-2.5 font-medium">Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveMaintenances.map((maint, idx) => {
                      const statusColor = maint.status === "HEALTHY" 
                        ? "text-green-500" 
                        : maint.status === "WARNING" 
                        ? "text-yellow-500" 
                        : maint.status === "CRITICAL" 
                        ? "text-red-500 animate-pulse" 
                        : "text-gray-400";
                      const impactBadge = maint.downtimeImpact === "HIGH"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : maint.downtimeImpact === "MEDIUM"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20";
                      return (
                        <tr key={idx} className="border-b border-zinc-800/40 text-neutral-400 hover:text-zinc-200 transition-colors">
                          <td className="py-3 font-normal font-mono">{maint.id}</td>
                          <td className="py-3 font-medium text-zinc-300">{maint.customerName}</td>
                          <td className="py-3 font-normal font-mono">{maint.orderDate}</td>
                          <td className="py-3">
                            <span className={`${statusColor} font-bold text-[10px] uppercase tracking-wider`}>
                              {maint.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* 3. Current Stock Card */}
            <div className="md:col-span-6">
              <Card
                title="Live Inventory Stock"
                actions={
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4 text-xs select-none">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical Stock
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-zinc-800"></span> Normal Stock
                      </div>
                    </div>
                  </div>
                }
                className="h-80"
              >
                <div className="flex flex-col gap-6 h-full w-full justify-between pb-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-red-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-neutral-500 font-mono truncate">Realtime Items</span>
                        <div className="text-white text-xs sm:text-sm font-semibold truncate">
                          {liveStockSummary.currentStock.toLocaleString()} <span className="text-neutral-500 font-normal text-[9px] font-mono">units</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-yellow-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-neutral-500 font-mono truncate">Stock Value</span>
                        <div className="text-white text-xs sm:text-sm font-semibold truncate">
                          ${liveStockSummary.replenishedStock.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-green-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-neutral-500 font-mono truncate">Processed Reqs</span>
                        <div className="text-white text-xs sm:text-sm font-semibold truncate">
                          {liveHistory.length} <span className="text-neutral-500 font-normal text-[9px] font-mono">requests</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="relative h-28 flex items-end justify-between select-none">
                    <div className="flex-1 h-24 flex items-end justify-around z-10 px-2">
                      {liveStockItems.length === 0 ? (
                        <div className="w-full text-center text-neutral-600 font-mono text-[10px] mt-10">No items found in DB.</div>
                      ) : (
                        liveStockItems.map((item, idx) => {
                          const heightPercent = Math.max(5, (item.quantity / item.maxQty) * 100);
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1 group relative" title={`${item.partName}: ${item.quantity} units`}>
                              <div 
                                className={`w-4 rounded-t-sm transition-all duration-500 ${item.isCritical ? "bg-red-500" : "bg-neutral-600 group-hover:bg-blue-400"}`}
                                style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                              ></div>
                              <span className="text-[7px] font-mono text-neutral-500 font-semibold truncate max-w-[40px] px-0.5">{item.name.split("-").slice(1).join("-")}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>
              </Card>
            </div>

            {/* 4. History (md:col-span-3) */}
            <div className="md:col-span-3">
              <Card title="Recent Transactions" className="h-80">
                <div className="flex flex-col gap-4">
                  {liveHistory.length === 0 ? (
                    <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">No recent transactions.</div>
                  ) : (
                    liveHistory.map((history, idx) => (
                      <div key={idx} className="p-3 bg-neutral-950/40 border border-zinc-900 rounded-2xl flex items-center gap-3.5">
                        <div className={`w-14 h-14 rounded-lg border flex justify-center items-center shrink-0 ${
                          history.type === "OUT" 
                            ? "bg-red-950/40 border-red-900/50 text-red-500" 
                            : "bg-green-950/40 border-green-900/50 text-green-500"
                        }`}>
                          {history.type === "OUT" ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                          )}
                        </div>
                        <div className="flex-1 py-0.5 flex flex-col justify-between h-full min-w-0">
                          <div className="flex justify-between items-start">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-medium ${
                              history.type === "OUT" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-500"
                            }`}>{history.timeAgo}</span>
                            <span className={`text-[10px] font-mono font-bold ${
                              history.type === "OUT" ? "text-red-400" : "text-green-400"
                            }`}>{history.type === "OUT" ? "ISSUED" : "RECEIVED"}</span>
                          </div>
                          <h4 className="text-zinc-200 text-xs font-semibold mt-1 font-sans truncate">{history.title}</h4>
                          <p className="text-neutral-400 text-[10px] font-mono mt-0.5 truncate">{history.quantityInfo}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* 5. Prediction (md:col-span-3) */}
            <div className="md:col-span-3">
              <Card title="AI Predictive Alerts" className="h-80">
                <div className="flex flex-col gap-4">
                  {aiAlerts === null ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                      <svg className="animate-spin text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                      <span className="text-neutral-500 font-mono text-[10px] uppercase">Connecting to Prophet Engine...</span>
                    </div>
                  ) : aiAlerts.length === 0 ? (
                    <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">Stock is healthy. No critical alerts.</div>
                  ) : (
                    aiAlerts.map((alert, idx) => (
                      <div key={idx} className="p-3 bg-red-950/20 border border-red-900/50 rounded-2xl flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-red-950/40 rounded-lg border border-red-900/50 flex justify-center items-center text-red-500 shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="flex-1 py-0.5 flex flex-col justify-between h-full min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-medium bg-red-500/10 text-red-500">CLASS {alert.abcClass}</span>
                            <span className="text-red-400 text-xs font-mono font-medium">ROP: {alert.dynamicMinROP}</span>
                          </div>
                          <h4 className="text-zinc-200 text-xs font-semibold mt-1 font-sans truncate">{alert.name}</h4>
                          <p className="text-neutral-400 text-[10px] font-mono mt-0.5 truncate">Needs restock to max: {alert.dynamicMax}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
