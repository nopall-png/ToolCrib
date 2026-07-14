"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { authService } from "@/services/authService";
import LoginForm from "./components/LoginForm";
import DemoCredentials from "./components/DemoCredentials";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  // Ensure mounting on client side
  useEffect(() => {
    authService.logout();

    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center px-4 select-none">
      {/* Main Container */}
      <div className="w-full max-w-sm flex flex-col justify-start items-center gap-6 z-10">
        {/* Login Form Card */}
        <div className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

          {/* Header */}
          <div className="flex flex-col justify-start items-center text-center">
            {/* Logo */}
            <div className="pb-5">
              <Image
                src="/logo.png"
                alt="ToolCrib Logo"
                width={54}
                height={53}
                className="w-14 h-14 object-contain brightness-110"
                priority
              />
            </div>
            {/* Title */}
            <div className="pb-2 text-2xl font-bold flex items-center justify-center font-sans tracking-tight">
              <span className="text-white">Tool</span>
              <span className="text-red-500">Crib</span>
            </div>
            {/* Subtitle */}
            <div className="text-gray-400 text-[10px] font-mono tracking-wider uppercase">
              System Authentication Required
            </div>
          </div>

          <LoginForm />
        </div>

        <DemoCredentials />

      </div>
    </div>
  );
}

