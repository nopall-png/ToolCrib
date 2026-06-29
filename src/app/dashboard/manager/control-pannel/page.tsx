"use client";

import React, { useState } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import Card from "@/component/common/Card";
import Dropdown from "@/component/common/Dropdown";
import {
  orderRequests,
  scheduledMaintenances,
  stockSummary,
  stockItems,
  purchaseHistory,
  predictiveMaintenances,
} from "@/data/dashboard";

export default function ControlPanelPage() {
  const [orderFilter, setOrderFilter] = useState("monthly");
  const [maintenanceFilter, setMaintenanceFilter] = useState("monthly");
  const [stockFilter, setStockFilter] = useState("monthly");

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
          <div className="text-[10px] font-mono bg-neutral-900 border border-zinc-800 text-neutral-400 px-3 py-1.5 rounded-lg">
            SYS NODE: CTRL_PNL_STAGE_1
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Order Request (xl:span-5), Scheduled Maintenance (xl:span-5), History Purchasement (xl:span-4) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            
            {/* 1. Order Request Card */}
            <Card
              title="Order Request"
              actions={
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filter
                  </span>
                  <Dropdown
                    options={filterOptions}
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                  />
                </div>
              }
              className="h-80"
            >
              <div className="overflow-x-auto w-full h-full text-xs font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-red-500/20 text-neutral-400 pb-2">
                      <th className="pb-2.5 font-medium">Order ID</th>
                      <th className="pb-2.5 font-medium">Customer Name</th>
                      <th className="pb-2.5 font-medium">Order Date</th>
                      <th className="pb-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderRequests.map((req) => (
                      <tr key={req.id} className="border-b border-zinc-800/40 text-neutral-400 hover:text-zinc-200 transition-colors">
                        <td className="py-3 font-normal font-mono">{req.id}</td>
                        <td className="py-3 font-medium text-zinc-300">{req.customerName}</td>
                        <td className="py-3 font-normal font-mono">{req.orderDate}</td>
                        <td
                          className={`py-3 font-medium ${
                            req.status.includes("Shipment") ? "text-green-500" : "text-neutral-400"
                          }`}
                        >
                          {req.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* 2. Scheduled Maintenance Card */}
            <Card
              title="Scheduled Maintenance"
              actions={
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filter
                  </span>
                  <Dropdown
                    options={filterOptions}
                    value={maintenanceFilter}
                    onChange={(e) => setMaintenanceFilter(e.target.value)}
                  />
                </div>
              }
              className="h-80"
            >
              <div className="overflow-x-auto w-full h-full text-xs font-sans">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-red-500/20 text-neutral-400 pb-2">
                      <th className="pb-2.5 font-medium">Order ID</th>
                      <th className="pb-2.5 font-medium">Customer Name</th>
                      <th className="pb-2.5 font-medium">Order Date</th>
                      <th className="pb-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledMaintenances.map((maint) => (
                      <tr key={maint.id} className="border-b border-zinc-800/40 text-neutral-400 hover:text-zinc-200 transition-colors">
                        <td className="py-3 font-normal font-mono">{maint.id}</td>
                        <td className="py-3 font-medium text-zinc-300">{maint.customerName}</td>
                        <td className="py-3 font-normal font-mono">{maint.orderDate}</td>
                        <td
                          className={`py-3 font-medium ${
                            maint.status === "done" ? "text-green-500" : "text-neutral-500 font-mono text-[10px] uppercase"
                          }`}
                        >
                          {maint.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: Current Stock (xl:span-7), History (xl:span-3), Predictions (xl:span-4) inside nested Grid */}
          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* 3. Current Stock Card (md:col-span-6) */}
            <div className="md:col-span-6">
              <Card
                title="Current Stock"
                actions={
                  <div className="flex items-center gap-6">
                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-4 text-xs select-none">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Top Stock
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                        Other Stock
                      </div>
                    </div>
                    <Dropdown
                      options={filterOptions}
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                    />
                  </div>
                }
                className="h-80"
              >
                <div className="flex flex-col gap-6 h-full w-full justify-between pb-2">
                  {/* Three Stat Badges */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Stat 1 */}
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-red-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-neutral-500 font-mono truncate">Current Stock</span>
                        <div className="text-white text-xs sm:text-sm font-semibold truncate">
                          {stockSummary.currentStock.toLocaleString()}{" "}
                          <span className="text-neutral-500 font-normal text-[9px] font-mono">units</span>
                        </div>
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-yellow-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-neutral-500 font-mono truncate">Stock Replenished</span>
                        <div className="text-white text-xs sm:text-sm font-semibold truncate">
                          {stockSummary.replenishedStock.toLocaleString()}{" "}
                          <span className="text-neutral-500 font-normal text-[9px] font-mono">units</span>
                        </div>
                      </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="p-3 bg-zinc-900/50 rounded-2xl border border-green-500/20 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-neutral-500 font-mono truncate">Order Complete</span>
                        <div className="text-white text-xs sm:text-sm font-semibold truncate">
                          {stockSummary.completedOrders.toLocaleString()}{" "}
                          <span className="text-neutral-500 font-normal text-[9px] font-mono">units</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom CSS Bar Chart Area */}
                  <div className="relative h-28 flex items-end justify-between select-none">
                    
                    {/* Gridlines Background */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-8">
                      <div className="w-full border-t border-zinc-800/60 relative">
                        <span className="absolute right-0 -top-2.5 text-[8px] font-mono text-neutral-500 font-semibold bg-neutral-900 pl-1.5">220</span>
                      </div>
                      <div className="w-full border-t border-zinc-800/60 relative">
                        <span className="absolute right-0 -top-2.5 text-[8px] font-mono text-neutral-500 bg-neutral-900 pl-1.5">165</span>
                      </div>
                      <div className="w-full border-t border-zinc-800/60 relative">
                        <span className="absolute right-0 -top-2.5 text-[8px] font-mono text-neutral-500 bg-neutral-900 pl-1.5">110</span>
                      </div>
                      <div className="w-full border-t border-zinc-800/60 relative">
                        <span className="absolute right-0 -top-2.5 text-[8px] font-mono text-neutral-500 bg-neutral-900 pl-1.5">55</span>
                      </div>
                      <div className="w-full border-t border-zinc-800/60 relative">
                        <span className="absolute right-0 -top-2.5 text-[8px] font-mono text-neutral-500 bg-neutral-900 pl-1.5">0</span>
                      </div>
                    </div>

                    {/* Bars Grid */}
                    <div className="flex-1 h-24 flex items-end justify-around z-10 px-2 pr-12">
                      {stockItems.map((item, idx) => {
                        const isTire = item.name === "Tire";
                        // Height mapping based on Figma specs
                        const barHeight = isTire ? "h-14" : 
                          item.name === "Rim" || item.name === "Seat" ? "h-7" :
                          item.name === "Hub" || item.name === "Frame" ? "h-6" :
                          item.name === "Pedal" ? "h-3.5" :
                          item.name === "Chain" || item.name === "Gear" ? "h-8" :
                          item.name === "Brake" || item.name === "Fork" ? "h-5" :
                          item.name === "Spoke" ? "h-9" : "h-3"; // Valve/Other

                        return (
                          <div key={idx} className="flex flex-col items-center gap-1 group relative">
                            {/* Tire Tooltip Element */}
                            {isTire && (
                              <div className="absolute bottom-full mb-1.5 flex flex-col items-center select-none z-20">
                                <div className="px-2 py-0.5 bg-neutral-900 rounded-lg border border-zinc-800 shadow-2xl text-white text-[9px] font-mono font-medium tracking-wide">
                                  {item.quantity} Unit
                                </div>
                                {/* Small Triangle Pointer */}
                                <div className="w-1.5 h-1.5 bg-red-500 border-r border-b border-zinc-800 transform rotate-45 -mt-0.5"></div>
                              </div>
                            )}

                            {/* Bar Visual element */}
                            <div
                              className={`w-3.5 rounded-t-sm transition-all duration-300 ${barHeight} ${
                                item.isCritical ? "bg-red-500" : "bg-neutral-600 group-hover:bg-neutral-400"
                              }`}
                            ></div>

                            {/* Label */}
                            <span className="text-[8px] font-mono text-neutral-400 font-semibold truncate max-w-[32px]">
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </Card>
            </div>

            {/* 4. History Purchasement Card (md:col-span-3) */}
            <div className="md:col-span-3">
              <Card title="History purchasement" className="h-80">
                <div className="flex flex-col gap-4">
                  {purchaseHistory.map((history) => (
                    <div
                      key={history.id}
                      className="p-3 bg-neutral-950/40 border border-zinc-900 rounded-2xl flex items-center gap-3.5 hover:border-zinc-800 transition-colors"
                    >
                      {/* Image / Avatar stack box */}
                      <div className="w-14 h-14 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-center items-center overflow-hidden shrink-0">
                        {history.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={history.image}
                            alt={history.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="flex items-center -space-x-2">
                            {history.avatars?.map((avatar, idx) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={idx}
                                src={avatar}
                                alt="avatar"
                                className="w-6 h-6 rounded-full border border-neutral-900"
                              />
                            ))}
                            <div className="w-6 h-6 rounded-full bg-red-500 border border-neutral-900 flex justify-center items-center text-[8px] font-bold text-white uppercase select-none">
                              W
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 py-0.5 flex flex-col justify-between h-full min-w-0">
                        <div className="flex justify-between items-start">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-medium ${
                              history.timeAgo.includes("Day")
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {history.timeAgo}
                          </span>
                        </div>
                        <h4 className="text-zinc-200 text-xs font-semibold mt-1 font-sans truncate">
                          {history.title}
                        </h4>
                        <p className="text-neutral-400 text-[10px] font-mono mt-0.5 truncate">
                          {history.quantityInfo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 5. Prediction Maintenance Machine Card (md:col-span-3) */}
            <div className="md:col-span-3">
              <Card title="Prediction Maintenance" className="h-80">
                <div className="flex flex-col gap-4">
                  {predictiveMaintenances.map((pred) => (
                    <div
                      key={pred.id}
                      className="p-3 bg-neutral-950/40 border border-zinc-900 rounded-2xl flex items-center gap-3.5 hover:border-zinc-800 transition-colors"
                    >
                      {/* Image / Avatar stack box */}
                      <div className="w-14 h-14 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-center items-center overflow-hidden shrink-0">
                        {pred.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pred.image}
                            alt={pred.machineName}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="flex items-center -space-x-2">
                            {pred.avatars?.map((avatar, idx) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={idx}
                                src={avatar}
                                alt="avatar"
                                className="w-6 h-6 rounded-full border border-neutral-900"
                              />
                            ))}
                            <div className="w-6 h-6 rounded-full bg-red-500 border border-neutral-900 flex justify-center items-center text-[8px] font-bold text-white uppercase select-none">
                              W
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 py-0.5 flex flex-col justify-between h-full min-w-0">
                        <div className="flex justify-between items-start">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-medium ${
                              pred.timeLeft.includes("4")
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {pred.timeLeft}
                          </span>
                        </div>
                        <h4 className="text-zinc-200 text-xs font-semibold mt-1 font-sans truncate">
                          {pred.machineName}
                        </h4>
                        <p className="text-neutral-400 text-[10px] font-mono mt-0.5 truncate">
                          {pred.predictionInfo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
