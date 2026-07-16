"use client";

import React from "react";

interface DatabaseStatsCardsProps {
  stats: {
    productsCount: number;
    usersCount: number;
    incomingItemsCount: number;
    totalItemsCount: number;
  };
}

export default function DatabaseStatsCards({ stats }: DatabaseStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Product */}
      <div className="bg-white shadow-sm rounded-[20px] p-6 relative flex items-center justify-between h-40">
        <div className="flex flex-col gap-2 z-10">
          <span className="text-[#2B3674] text-3xl font-bold font-sans tracking-wide leading-8">
            {stats.productsCount}
          </span>
          <span className="text-[#A3AED0] text-base font-normal font-sans tracking-wide">
            Product
          </span>
        </div>
        <div className="w-14 h-12 bg-red-50 rounded-2xl flex justify-center items-center shrink-0 text-red-500 z-10">
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
      <div className="bg-white shadow-sm rounded-[20px] p-6 relative flex items-center justify-between h-40">
        <div className="flex flex-col gap-2 z-10">
          <span className="text-[#2B3674] text-3xl font-bold font-sans tracking-wide leading-8">
            {stats.usersCount}
          </span>
          <span className="text-[#A3AED0] text-base font-normal font-sans tracking-wide">
            User
          </span>
        </div>
        <div className="w-14 h-12 bg-yellow-50 rounded-2xl flex justify-center items-center shrink-0 text-yellow-500 z-10">
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
      <div className="bg-white shadow-sm rounded-[20px] p-6 relative flex items-center justify-between h-40">
        <div className="flex flex-col gap-2 z-10">
          <span className="text-[#2B3674] text-3xl font-bold font-sans tracking-wide leading-8">
            {stats.incomingItemsCount}
          </span>
          <span className="text-[#A3AED0] text-base font-normal font-sans tracking-wide">
            Total Incoming Items
          </span>
        </div>
        <div className="w-14 h-12 bg-blue-50 rounded-2xl flex justify-center items-center shrink-0 text-blue-500 z-10">
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
      <div className="bg-white shadow-sm rounded-[20px] p-6 relative flex items-center justify-between h-40">
        <div className="flex flex-col gap-2 z-10">
          <span className="text-[#2B3674] text-3xl font-bold font-sans tracking-wide leading-8">
            {stats.totalItemsCount.toLocaleString()}
          </span>
          <span className="text-[#A3AED0] text-base font-normal font-sans tracking-wide">
            Total Items
          </span>
        </div>
        <div className="w-14 h-12 bg-green-50 rounded-2xl flex justify-center items-center shrink-0 text-green-500 z-10">
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
  );
}
