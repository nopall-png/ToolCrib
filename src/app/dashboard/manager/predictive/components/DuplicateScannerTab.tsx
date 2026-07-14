"use client";

import React from "react";
import { DuplicateSkuResult } from "@/services/predictiveService";

interface DuplicateScannerTabProps {
  similarityThreshold: number;
  setSimilarityThreshold: (val: number) => void;
  duplicates: DuplicateSkuResult[];
  loadingDuplicates: boolean;
}

export default function DuplicateScannerTab({
  similarityThreshold,
  setSimilarityThreshold,
  duplicates,
  loadingDuplicates,
}: DuplicateScannerTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Minimal Control Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-zinc-800/80 px-5 py-4 rounded-xl">
        <div>
          <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">Semantic Match Threshold</h4>
          <p className="text-zinc-500 text-[10px] mt-0.5">Determine sensitivity limit for NLP catalog duplicate scoring.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-300 text-xs font-mono font-bold">{Math.round(similarityThreshold * 100)}% Match</span>
          <input
            type="range"
            min="0.30"
            max="0.90"
            step="0.05"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
            className="w-40 accent-white cursor-pointer h-1.5 rounded-lg bg-zinc-800"
          />
        </div>
      </div>

      {/* Grid of Minimal Cards instead of table */}
      <div className="relative min-h-[200px]">
        {loadingDuplicates ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4 rounded-xl border border-zinc-850">
            <svg
              className="animate-spin text-red-500"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-red-500 font-mono text-[10px] uppercase font-bold tracking-widest">
              Running NLP Cosine Similarity...
            </span>
          </div>
        ) : null}

        {duplicates.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest bg-neutral-900 border border-zinc-850 rounded-xl">
            No potential duplicates detected above threshold.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {duplicates.map((dup, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 shadow-xl group"
              >
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-400 font-mono text-[10px] font-bold">
                        #{idx + 1}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">
                        Catalog Overlap
                      </span>
                    </div>

                    {/* Similarity Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold border flex items-center gap-1.5 ${
                        dup.similarityScore >= 80
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : dup.similarityScore >= 65
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            dup.similarityScore >= 80
                              ? "bg-red-400"
                              : dup.similarityScore >= 65
                              ? "bg-yellow-400"
                              : "bg-blue-400"
                          }`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                            dup.similarityScore >= 80
                              ? "bg-red-500"
                              : dup.similarityScore >= 65
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                      </span>
                      {dup.similarityScore}% MATCH
                    </div>
                  </div>

                  {/* Comparison Panels */}
                  <div className="flex flex-col gap-3 relative">
                    {/* Item 1 */}
                    <div className="p-3.5 bg-zinc-950/40 border border-zinc-850/60 rounded-xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wide uppercase">
                          {dup.sku1}
                        </span>
                        <span
                          className="text-zinc-200 text-xs font-semibold leading-relaxed mt-0.5 truncate"
                          title={dup.desc1}
                        >
                          {dup.desc1}
                        </span>
                      </div>
                    </div>

                    {/* Connector Icon */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors shadow-md">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="17 11 21 15 17 19"></polyline>
                        <polyline points="7 13 3 9 7 5"></polyline>
                        <line x1="21" y1="15" x2="9" y2="15"></line>
                        <line x1="3" y1="9" x2="15" y2="9"></line>
                      </svg>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3.5 bg-zinc-950/40 border border-zinc-850/60 rounded-xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wide uppercase">
                          {dup.sku2}
                        </span>
                        <span
                          className="text-zinc-200 text-xs font-semibold leading-relaxed mt-0.5 truncate"
                          title={dup.desc2}
                        >
                          {dup.desc2}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions / Advice */}
                <div className="mt-4 pt-3.5 border-t border-zinc-850 flex justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5 text-zinc-500 min-w-0">
                    <svg
                      className="shrink-0"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span className="text-[9px] font-mono uppercase tracking-wider truncate">
                      Consolidation Recommended
                    </span>
                  </div>
                  <button className="text-[9px] font-bold tracking-wider font-sans bg-zinc-850 text-zinc-300 border border-zinc-800 px-3.5 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer select-none shrink-0 active:scale-95">
                    Consolidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
