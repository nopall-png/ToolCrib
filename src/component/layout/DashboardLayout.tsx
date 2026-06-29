"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ChatbotDrawer from "./ChatbotDrawer";
import { User } from "@/types/user";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "manager" | "procurement" | "engineer";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const userStr = localStorage.getItem("currentUser");

    if (isAuth !== "true" || !userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // Role Guard: Redirect to correct dashboard if they try to access a different one
      if (user.role !== role) {
        router.push(`/dashboard/${user.role}`);
      } else {
        setTimeout(() => {
          setCurrentUser(user);
          setAuthorized(true);
        }, 0);
      }
    } catch {
      router.push("/auth/login");
    }
  }, [router, role]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-xs text-neutral-500 tracking-wider">
        <div className="flex flex-col items-center gap-3">
          {/* Loading Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>AUTHORIZING SECURE NODE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white relative overflow-hidden flex flex-col md:flex-row pl-4 pr-4 py-6 md:pl-[45px] md:pr-[45px] md:pt-[67px] md:pb-[60px] gap-6 md:gap-[67px]">
      
      {/* Decorative Radial Background Lights */}
      <div className="w-[600px] h-[600px] absolute -left-[10%] top-[20%] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="w-[600px] h-[600px] absolute right-[5%] bottom-[10%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Sidebar */}
      <div className="flex justify-center md:block">
        <Sidebar role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar onToggleChatbot={() => setChatbotOpen(!chatbotOpen)} />

        {/* Dynamic Page Content */}
        <div className="mt-8 flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>

      {/* Slide-out Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        user={currentUser}
      />
      
    </div>
  );
}
