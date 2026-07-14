"use client";

import React from "react";
import Card from "@/component/common/Card";

interface RecentTransactionsCardProps {
  liveHistory: Array<{
    type: string;
    timeAgo: string;
    title: string;
    quantityInfo: string;
  }>;
}

export default function RecentTransactionsCard({ liveHistory }: RecentTransactionsCardProps) {
  return (
    <Card title="Recent Transactions" className="h-80">
      <div className="flex flex-col gap-4 overflow-y-auto h-full pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {liveHistory.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 font-mono text-[10px] uppercase">
            No recent transactions.
          </div>
        ) : (
          liveHistory.map((history, idx) => (
            <div
              key={idx}
              className="p-3 bg-neutral-950/40 border border-zinc-900 rounded-2xl flex items-center gap-3.5"
            >
              <div
                className={`w-14 h-14 rounded-lg border flex justify-center items-center shrink-0 ${
                  history.type === "OUT"
                    ? "bg-red-950/40 border-red-900/50 text-red-500"
                    : "bg-green-950/40 border-green-900/50 text-green-500"
                }`}
              >
                {history.type === "OUT" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                )}
              </div>
              <div className="flex-1 py-0.5 flex flex-col justify-between h-full min-w-0">
                <div className="flex justify-between items-start">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-medium ${
                      history.type === "OUT" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {history.timeAgo}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      history.type === "OUT" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {history.type === "OUT" ? "ISSUED" : "RECEIVED"}
                  </span>
                </div>
                <h4 className="text-zinc-200 text-xs font-semibold mt-1 font-sans truncate">{history.title}</h4>
                <p className="text-neutral-400 text-[10px] font-mono mt-0.5 truncate">{history.quantityInfo}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
