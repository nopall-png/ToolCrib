"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  role?: string;
}

export default function Sidebar({ role = "manager" }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to initialize logout sequence?")) {
      logout();
    }
  };

  // Nav items with their respective paths
  const navItems = [
    {
      id: "dashboard",
      label: "Control Center",
      path: `/dashboard/${role}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "MRO Analytics",
      path: `/dashboard/${role}/control-pannel`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },
    {
      id: "inventory",
      label: "Database",
      path: `/dashboard/${role}/database`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
    },
    {
      id: "requisitions",
      label: "Request Panel",
      path: `/dashboard/${role}/request-pannel`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
    },
    {
      id: "user",
      label: "Users",
      path: `/dashboard/${role}/user`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          <path d="M9 21v-2a4 4 0 0 0-4-4H3a4 4 0 0 0-4 4v2"></path>
          <circle cx="7" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      id: "predictive",
      label: "Predictive AI",
      path: `/dashboard/${role}/predictive`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
    },
    {
      id: "register",
      label: "Register Registry",
      path: `/dashboard/${role}/register`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      ),
    },
    {
      id: "directory",
      label: "View Directory",
      path: `/dashboard/${role}/directory`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      ),
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (role === "engineer") {
      return ["dashboard", "register", "directory"].includes(item.id);
    }
    if (role === "procurement") {
      return item.id === "dashboard";
    }
    return !["register", "directory"].includes(item.id);
  });

  return (
    <div className="w-28 shrink-0 flex flex-col items-center justify-between py-8 bg-white rounded-[45px] border border-transparent shadow-sm h-[817px] relative select-none">

      {/* Brand Logo */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <Image
          src="/logo1.png"
          alt="ToolCrib Logo"
          width={54}
          height={53}
          className="w-12 h-12 object-contain brightness-110"
          priority
        />
      </div>

      {/* Navigation Stack */}
      <div className="flex flex-col gap-6 items-center">
        {filteredNavItems.map((item) => {
          // Check if item path matches pathname
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.path.startsWith("/")) {
                  router.push(item.path);
                } else {
                  // Fallback alert for demo placeholders
                  alert(`${item.label} monitor is currently in read-only onboarding state.`);
                }
              }}
              title={item.label}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group relative ${isActive
                ? "bg-[#4318FF] text-white shadow-[0px_4px_6px_-4px_rgba(67,24,255,0.20)] shadow-[0px_10px_15px_-3px_rgba(67,24,255,0.20)]"
                : "text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50"
                }`}
            >
              {item.icon}
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-white text-gray-700 text-[10px] font-mono font-medium tracking-wide uppercase border border-gray-100 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        title="Terminate Session"
        className="w-20 h-20 bg-gray-50 hover:bg-red-50 text-[#A3AED0] hover:text-red-500 border border-gray-100 hover:border-red-100 rounded-full flex items-center justify-center transition-all duration-300 group cursor-pointer"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
      </button>
    </div>
  );
}
