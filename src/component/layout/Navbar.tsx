"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/user";

interface NavbarProps {
  onToggleChatbot: () => void;
}

export default function Navbar({ onToggleChatbot }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setTimeout(() => {
          setUser(parsedUser);
        }, 0);
      } catch {}
    }
  }, []);

  // Format position or role for greetings
  const displayGreeting = user
    ? `${user.position} !`
    : "Manager Operasional !";

  const displayName = user
    ? user.fullName
    : "John Hardward";

  const displayAvatar = user && user.avatar
    ? user.avatar
    : "https://placehold.co/32x32";

  return (
    <div className="w-full h-14 flex items-center justify-between relative select-none">
      
      {/* Left: User Welcome Greeting */}
      <div className="flex flex-col justify-start items-start">
        <div className="flex items-center gap-1 text-neutral-400 text-sm font-normal">
          <span>Welcome,</span>
          <span className="text-neutral-400 text-sm font-normal">
            {displayGreeting}
          </span>
        </div>
        <div className="text-white text-2xl font-bold font-sans tracking-wide leading-8">
          {displayName}
        </div>
      </div>

      {/* Right: Notification Bell & Profile Dropdown */}
      <div className="flex items-center gap-4 z-30">
        
        {/* Notification Bell */}
        <button
          onClick={() => alert("Notification panel is in read-only onboarding state.")}
          className="relative w-12 h-12 bg-neutral-900 border border-zinc-800 hover:border-zinc-700 text-neutral-400 hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          {/* Bell Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {/* Red Indicator Badge */}
          <div className="absolute right-3.5 top-3.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        </button>

        {/* Profile Dropdown Box */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-12 pl-1 pr-4 py-1 bg-neutral-900 border border-zinc-800 hover:border-zinc-700 text-neutral-400 hover:text-white rounded-full flex items-center gap-3 cursor-pointer transition-all"
          >
            {/* User Avatar */}
            {/* Using standard img tag for external fallback/placeholder url */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayAvatar}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-zinc-800 object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).src = "https://placehold.co/32x32";
              }}
            />
            {/* Caret Down Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transform transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-zinc-800 rounded-xl py-2 shadow-2xl z-50 text-[11px] font-mono text-neutral-400">
              <div className="px-4 py-2 border-b border-zinc-800/80 text-white font-sans font-bold">
                User Details
              </div>
              <div className="px-4 py-1.5">
                <span className="text-gray-500">ID:</span> {user?.employeeId || "EMP-1001"}
              </div>
              <div className="px-4 py-1.5">
                <span className="text-gray-500">Dept:</span> {user?.department || "Operational"}
              </div>
              <div className="px-4 py-1.5 pb-3">
                <span className="text-gray-500">Status:</span>{" "}
                <span className="text-green-500">{user?.status || "active"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Company Logo button to toggle Chatbot */}
        <button
          onClick={onToggleChatbot}
          className="w-16 h-12 px-4 py-1 bg-neutral-900 border border-zinc-800 hover:border-zinc-700 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg overflow-hidden shrink-0 group"
          title="Toggle ToolCrib Copilot"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-10 h-10 object-contain brightness-110 group-hover:scale-105 transition-transform"
          />
        </button>

      </div>

    </div>
  );
}
