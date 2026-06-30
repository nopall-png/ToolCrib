"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const [operatorId, setOperatorId] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const displayError = error || authError;

  // Ensure mounting on client side
  useEffect(() => {
    authService.logout();

    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!operatorId.trim() || !accessKey.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const success = await login(operatorId, accessKey);
    if (success) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        router.push(`/dashboard/${currentUser.role}`);
      }
    }
  };

  const handleResetKey = () => {
    alert(
      "ACCESS SYSTEM WARNING:\nTo reset your access key, please contact the System Administrator or Procurement IT Support Desk directly."
    );
  };

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

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* Operator ID Field */}
            <div className="flex flex-col justify-start items-start">
              <label className="pl-1 pb-1.5 text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                Operator ID
              </label>
              <div className="relative w-full">
                {/* Input box */}
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="Enter your Employee ID"
                  className="w-full h-12 pl-10 pr-4 bg-neutral-950/50 text-white rounded-lg border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 text-sm font-mono placeholder-neutral-600 disabled:opacity-50"
                />
                {/* User/ID Icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4 flex items-center justify-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* Access Key Field */}
            <div className="flex flex-col justify-start items-start">
              <div className="w-full flex justify-between items-center px-1 pb-1.5">
                <label className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                  Access Key
                </label>
                <button
                  type="button"
                  onClick={handleResetKey}
                  className="text-red-500 hover:text-red-400 text-[10px] font-mono hover:underline uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Reset Key
                </button>
              </div>
              <div className="relative w-full">
                {/* Input box */}
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-10 bg-neutral-950/50 text-white rounded-lg border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 text-sm font-mono placeholder-neutral-600 disabled:opacity-50 tracking-wider"
                />
                {/* Key Icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4 flex items-center justify-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                  </svg>
                </div>
                {/* Eye Show/Hide Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 w-4 h-4 flex items-center justify-center cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-500 text-[11px] font-mono leading-relaxed">
                {displayError}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg shadow-md font-bold text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Accounts Panel */}
        <div className="w-full bg-neutral-900/40 border border-zinc-900 rounded-xl p-4 text-[10px] text-gray-500 font-mono space-y-2">
          <div className="text-gray-400 font-semibold tracking-wider uppercase">
            Demo Operator Credentials:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-red-500/80">Manager:</span>
              <br />
              ID: manager (EMP-001)
              <br />
              Key: manager123
            </div>
            <div>
              <span className="text-red-500/80">Procurement:</span>
              <br />
              ID: procurement (EMP-002)
              <br />
              Key: procurement123
            </div>
            <div>
              <span className="text-red-500/80">Engineer:</span>
              <br />
              ID: engineer (EMP-003)
              <br />
              Key: engineer123
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
