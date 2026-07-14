"use client";

import React from "react";
import Card from "@/component/common/Card";
import Dropdown from "@/component/common/Dropdown";

interface OrderRequestsCardProps {
  liveOrders: Array<{
    id: string;
    customerName: string;
    orderDate: string;
    status: string;
  }>;
  orderFilter: string;
  setOrderFilter: (val: string) => void;
  filterOptions: { value: string; label: string }[];
}

export default function OrderRequestsCard({
  liveOrders,
  orderFilter,
  setOrderFilter,
  filterOptions,
}: OrderRequestsCardProps) {
  return (
    <Card
      title="Order Request"
      actions={
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-xs font-medium flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        {liveOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">
            No pending requests in database.
          </div>
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
                <tr
                  key={idx}
                  className="border-b border-zinc-800/40 text-neutral-400 hover:text-zinc-200 transition-colors"
                >
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
  );
}
