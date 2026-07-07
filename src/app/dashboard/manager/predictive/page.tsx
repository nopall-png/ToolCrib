"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/component/layout/DashboardLayout";
import { databaseService } from "@/services/databaseService";
import { InventoryItem } from "@/types/database";
import {
  predictiveService,
  AIStockRecommendation,
  DuplicateSkuResult,
  ForecastPoint,
  CriticalSpareResult,
  OptimizationItem,
  OptimizationSummary,
} from "@/services/predictiveService";

export default function PredictivePage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "duplicates" | "forecast" | "critical" | "optimization">("matrix");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [metrics, setMetrics] = useState<AIStockRecommendation[]>([]);
  
  // Duplicates scanner states
  const [similarityThreshold, setSimilarityThreshold] = useState(0.50);
  const [duplicates, setDuplicates] = useState<DuplicateSkuResult[]>([]);
  
  // Forecasting states
  const [selectedSku, setSelectedSku] = useState("");
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);

  // Critical Spare states
  const [criticalSpares, setCriticalSpares] = useState<CriticalSpareResult[]>([]);
  const [loadingCritical, setLoadingCritical] = useState(false);

  // Optimization states
  const [optimizationData, setOptimizationData] = useState<OptimizationItem[]>([]);
  const [optimizationSummary, setOptimizationSummary] = useState<OptimizationSummary | null>(null);
  const [loadingOptimization, setLoadingOptimization] = useState(false);

  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Load real database items
      const items = await databaseService.getInventoryItems();
      setInventoryItems(items);

      if (items.length > 0) {
        setSelectedSku(items[0].sku);
      }

      // Compute metrics
      setLoadingMetrics(true);
      const computedMetrics = await predictiveService.calculatePredictiveMetrics(items);
      setMetrics(computedMetrics);
      setLoadingMetrics(false);
    };
    fetchInitialData();
  }, []);

  // Update duplicate matches when threshold changes
  useEffect(() => {
    const fetchDuplicates = async () => {
      if (inventoryItems.length > 0) {
        setLoadingDuplicates(true);
        const dups = await predictiveService.detectDuplicates(inventoryItems, similarityThreshold);
        setDuplicates(dups);
        setLoadingDuplicates(false);
      }
    };
    fetchDuplicates();
  }, [inventoryItems, similarityThreshold]);

  // Update forecast data when SKU changes
  useEffect(() => {
    const fetchForecast = async () => {
      if (selectedSku) {
        setLoadingForecast(true);
        const data = await predictiveService.forecastStock(selectedSku);
        setForecastData(data);
        setLoadingForecast(false);
      }
    };
    fetchForecast();
  }, [selectedSku]);

  // Minimal helper to get color of ABC classes
  const getAbcBadge = (abc: "A" | "B" | "C") => {
    if (abc === "A") return "text-red-400 border border-red-500/10 bg-red-950/20";
    if (abc === "B") return "text-yellow-400 border border-yellow-500/10 bg-yellow-950/20";
    return "text-green-400 border border-green-500/10 bg-green-950/20";
  };

  // Minimal helper to get color of XYZ classes
  const getXyzBadge = (xyz: "X" | "Y" | "Z") => {
    if (xyz === "X") return "text-cyan-400 border border-cyan-500/10 bg-cyan-950/20";
    if (xyz === "Y") return "text-purple-400 border border-purple-500/10 bg-purple-950/20";
    return "text-orange-400 border border-orange-500/10 bg-orange-950/20";
  };

  // RENDER CUSTOM SVG GRAPH (No external library dependency)
  const renderSvgChart = () => {
    if (forecastData.length === 0) return null;

    const width = 800;
    const height = 260;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 15;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const yValues = forecastData.map((d) => [d.yhat, d.yhat_lower, d.yhat_upper, d.actual || 0]).flat();
    const maxY = Math.max(...yValues, 10);
    const minY = 0;

    const getX = (index: number) => {
      return paddingLeft + (index / (forecastData.length - 1)) * chartWidth;
    };

    const getY = (value: number) => {
      const ratio = (value - minY) / (maxY - minY);
      return height - paddingBottom - ratio * chartHeight;
    };

    // Minimal grid lines
    const gridLines = [];
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const yVal = minY + (i / gridCount) * (maxY - minY);
      const yPos = getY(yVal);
      gridLines.push(
        <g key={`grid-${i}`}>
          <line
            x1={paddingLeft}
            y1={yPos}
            x2={width - paddingRight}
            y2={yPos}
            stroke="#1f1f22"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 8}
            y={yPos + 3}
            fill="#52525b"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="end"
          >
            {Math.round(yVal)}
          </text>
        </g>
      );
    }

    // Actual Line (History)
    const actualPoints = forecastData.filter((d) => d.actual !== undefined);
    let actualPath = "";
    actualPoints.forEach((d, idx) => {
      const x = getX(idx);
      const y = getY(d.actual!);
      actualPath += `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    });

    // Prediction Line & Confidence Bounds (Forecast)
    const forecastStartIndex = actualPoints.length;
    let forecastPath = "";
    let areaPathTop = "";
    let areaPathBottom = "";

    forecastData.forEach((d, idx) => {
      if (idx >= forecastStartIndex) {
        const x = getX(idx);
        const y = getY(d.yhat);
        forecastPath += `${idx === forecastStartIndex ? "M" : "L"} ${x} ${y}`;

        areaPathTop += `${idx === forecastStartIndex ? "M" : "L"} ${x} ${getY(d.yhat_upper)}`;
      }
    });

    for (let idx = forecastData.length - 1; idx >= forecastStartIndex; idx--) {
      const d = forecastData[idx];
      const x = getX(idx);
      areaPathBottom += `L ${x} ${getY(d.yhat_lower)}`;
    }

    const fullAreaPath = `${areaPathTop} ${areaPathBottom} Z`;

    return (
      <div className="w-full bg-neutral-900 border border-zinc-800/80 p-5 rounded-xl">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-visible">
          {gridLines}

          {/* Uncertainty Bounds (95% Confidence Area) */}
          {forecastPath && (
            <path
              d={fullAreaPath}
              fill="rgba(113, 113, 122, 0.04)"
              stroke="none"
            />
          )}

          {/* Connect history to prediction */}
          {actualPoints.length > 0 && forecastPath && (
            <line
              x1={getX(actualPoints.length - 1)}
              y1={getY(actualPoints[actualPoints.length - 1].actual!)}
              x2={getX(actualPoints.length)}
              y2={getY(forecastData[actualPoints.length].yhat)}
              stroke="#71717a"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Actual line (Gray) */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="#d4d4d8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Prediction line (White dashed) */}
          {forecastPath && (
            <path
              d={forecastPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Vertical divider showing Today */}
          {actualPoints.length > 0 && (
            <g>
              <line
                x1={getX(actualPoints.length - 1)}
                y1={paddingTop}
                x2={getX(actualPoints.length - 1)}
                y2={height - paddingBottom}
                stroke="#52525b"
                strokeWidth="1"
              />
              <text
                x={getX(actualPoints.length - 1) + 4}
                y={paddingTop + 6}
                fill="#71717a"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="normal"
              >
                TODAY
              </text>
            </g>
          )}

          {/* Date Axis */}
          <text
            x={paddingLeft}
            y={height - 8}
            fill="#52525b"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="start"
          >
            {forecastData[0].ds}
          </text>
          <text
            x={width - paddingRight}
            y={height - 8}
            fill="#52525b"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="end"
          >
            {forecastData[forecastData.length - 1].ds}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-6 w-full select-none pb-12">
        
        {/* Minimal Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm font-mono text-zinc-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-zinc-400">Predictive Engine</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Logistics & Forecasting</h1>
          <p className="text-zinc-500 text-xs font-sans">
            Logistical ABC/XYZ classification, semantic duplicate checking, and Prophet time-series projections.
          </p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="flex gap-6 border-b border-zinc-800/80 mt-2">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "matrix" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Inventory Value & Stability
            {activeTab === "matrix" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("duplicates")}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "duplicates" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Duplicate Scanner
            {activeTab === "duplicates" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("forecast")}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "forecast" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Demand Forecasting
            {activeTab === "forecast" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("critical");
              if (criticalSpares.length === 0) {
                setLoadingCritical(true);
                predictiveService.classifyCriticalSpares().then((data) => {
                  setCriticalSpares(data);
                  setLoadingCritical(false);
                });
              }
            }}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "critical" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Critical Spare Engine
            {activeTab === "critical" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("optimization");
              if (optimizationData.length === 0) {
                setLoadingOptimization(true);
                predictiveService.getOptimizationOpportunities().then(({ summary, data }) => {
                  setOptimizationSummary(summary);
                  setOptimizationData(data);
                  setLoadingOptimization(false);
                });
              }
            }}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "optimization" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Optimization
            {activeTab === "optimization" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white rounded"></span>
            )}
          </button>
        </div>

        {/* TAB CONTENTS */}

        {/* Tab 1: ABC/XYZ Matrix */}
        {activeTab === "matrix" && (
          <div className="flex flex-col gap-6">
            
            {/* Minimal Legend Info */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-mono bg-zinc-900/30 border border-zinc-850 p-3 rounded-lg">
              <div><strong className="text-zinc-400">Value Priority:</strong> A (High value contribution), B (Medium), C (Low)</div>
              <div><strong className="text-zinc-400">Demand Stability:</strong> X (Stable demand), Y (Volatile), Z (Highly erratic)</div>
            </div>

            {/* Minimalist Table */}
            <div className="w-full bg-neutral-900 border border-zinc-800 rounded-xl overflow-hidden relative min-h-[300px]">
              {loadingMetrics ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4">
                  <svg className="animate-spin text-blue-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span className="text-blue-500 font-mono text-[10px] uppercase font-bold tracking-widest">Processing ABC/XYZ Matrices in Python AI Engine...</span>
                </div>
              ) : null}
              <div className="overflow-x-auto w-full text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold bg-zinc-950/40">
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">Value Priority</th>
                      <th className="py-3 px-4">Demand Stability</th>
                      <th className="py-3 px-4 text-center">Unit Price</th>
                      <th className="py-3 px-4 text-center">Lead Time</th>
                      <th className="py-3 px-4 text-center">Yearly Demand</th>
                      <th className="py-3 px-4 text-center">Rec. Min (ROP)</th>
                      <th className="py-3 px-4 text-right">Rec. Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((item) => (
                      <tr key={item.sku} className="border-b border-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors">
                        <td className="py-3 px-4 text-zinc-300 font-medium">{item.sku}</td>
                        <td className="py-3 px-4 font-sans text-zinc-300">{item.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${getAbcBadge(item.abcClass)}`}>
                            {item.abcClass}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${getXyzBadge(item.xyzClass)}`}>
                            {item.xyzClass}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-zinc-300">${item.unitPrice}</td>
                        <td className="py-3 px-4 text-center text-zinc-400">{item.leadTimeDays}d</td>
                        <td className="py-3 px-4 text-center text-zinc-400">{item.yearlyQty} u</td>
                        <td className="py-3 px-4 text-center font-bold text-zinc-200">{item.dynamicMinROP}</td>
                        <td className="py-3 px-4 text-right font-bold text-zinc-200">{item.dynamicMax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Duplicate Scanner */}
        {activeTab === "duplicates" && (
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
                  <svg className="animate-spin text-red-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span className="text-red-500 font-mono text-[10px] uppercase font-bold tracking-widest">Running NLP Cosine Similarity...</span>
                </div>
              ) : null}

              {duplicates.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest bg-neutral-900 border border-zinc-850 rounded-xl">
                  No potential duplicates detected above threshold.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {duplicates.map((dup, idx) => (
                    <div key={idx} className="bg-neutral-900 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
                      <div>
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60 mb-3">
                          <span className="text-[10px] text-zinc-500 font-mono uppercase font-semibold">Catalog Overlap #{idx+1}</span>
                          <span className="text-red-400 font-mono text-xs font-bold">{dup.similarityScore}% Match</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 font-mono font-bold">{dup.sku1}</span>
                            <span className="text-zinc-300 text-xs font-medium">{dup.desc1}</span>
                          </div>
                          <div className="w-full border-t border-zinc-850/60 my-1"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 font-mono font-bold">{dup.sku2}</span>
                            <span className="text-zinc-300 text-xs font-medium">{dup.desc2}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-zinc-850 flex justify-end">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">Recommendation: Catalog Consolidation</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Forecasting */}
        {activeTab === "forecast" && (
          <div className="flex flex-col gap-5">
            
            {/* Dropdown Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-zinc-800/80 px-5 py-4 rounded-xl">
              <div>
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">Select Component Target</h4>
                <p className="text-zinc-500 text-[10px] mt-0.5">Visualize 30-day Prophet forward projections.</p>
              </div>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer"
              >
                {inventoryItems.map((item) => (
                  <option key={item.sku} value={item.sku}>
                    {item.sku} - {item.name.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Svg Chart with Loading Overlay */}
            <div className="relative min-h-[300px]">
              {loadingForecast ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4 rounded-xl border border-zinc-850">
                  <svg className="animate-spin text-purple-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span className="text-purple-500 font-mono text-[10px] uppercase font-bold tracking-widest">Generating Prophet Time-Series Forecast...</span>
                </div>
              ) : null}
              {renderSvgChart()}
            </div>

            {/* Simple Minimal Legend */}
            <div className="flex justify-center gap-6 text-[10px] font-mono text-zinc-500 py-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-zinc-300 block"></span>
                <span>Actual Demand (Last 30d)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 border-t border-dashed border-red-500 block"></span>
                <span>Prophet Prediction (Next 30d)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-2 bg-zinc-800/50 block"></span>
                <span>95% Confidence Area</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Critical Spare Classification */}
        {activeTab === "critical" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-mono bg-zinc-900/30 border border-zinc-850 p-3 rounded-lg">
              <div><strong className="text-zinc-400">Scoring Formula:</strong> Usage (35%) + Lead Time (25%) + Machine Downtime Impact (40%)</div>
              <div><strong className="text-red-400">CRITICAL</strong> ≥ 70 | <strong className="text-yellow-400">IMPORTANT</strong> ≥ 40 | <strong className="text-green-400">STANDARD</strong> &lt; 40</div>
            </div>

            <div className="w-full bg-neutral-900 border border-zinc-800 rounded-xl overflow-hidden relative min-h-[300px]">
              {loadingCritical ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4">
                  <svg className="animate-spin text-orange-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span className="text-orange-500 font-mono text-[10px] uppercase font-bold tracking-widest">Analyzing Machine Criticality & Usage Patterns...</span>
                </div>
              ) : null}
              <div className="overflow-x-auto w-full text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold bg-zinc-950/40">
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4 text-center">Usage Score</th>
                      <th className="py-3 px-4 text-center">Lead Time Score</th>
                      <th className="py-3 px-4 text-center">Machine Score</th>
                      <th className="py-3 px-4 text-center">Composite Score</th>
                      <th className="py-3 px-4 text-center">Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalSpares.map((item) => {
                      const classColor = item.criticalityClass === "CRITICAL"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : item.criticalityClass === "IMPORTANT"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20";
                      return (
                        <tr key={item.sku} className="border-b border-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors">
                          <td className="py-3 px-4 text-zinc-300 font-medium">{item.sku}</td>
                          <td className="py-3 px-4 font-sans text-zinc-300">{item.name}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.usageScore}%` }}></div>
                              </div>
                              <span className="text-[10px]">{item.usageScore}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.leadTimeScore}%` }}></div>
                              </div>
                              <span className="text-[10px]">{item.leadTimeScore}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.machineScore}%` }}></div>
                              </div>
                              <span className="text-[10px]">{item.machineScore}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-zinc-200">{item.compositeScore}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${classColor}`}>
                              {item.criticalityClass}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Optimization Opportunities */}
        {activeTab === "optimization" && (
          <div className="flex flex-col gap-6">
            
            {/* Summary Cards */}
            {optimizationSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl">
                  <div className="text-red-400 text-[10px] font-mono uppercase font-bold">Overstock Items</div>
                  <div className="text-white text-2xl font-bold mt-1">{optimizationSummary.overstockCount}</div>
                  <div className="text-red-400/60 text-[10px] font-mono mt-1">Excess Value: Rp {optimizationSummary.totalExcessValue.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-yellow-950/20 border border-yellow-900/30 rounded-xl">
                  <div className="text-yellow-400 text-[10px] font-mono uppercase font-bold">Understock Items</div>
                  <div className="text-white text-2xl font-bold mt-1">{optimizationSummary.understockCount}</div>
                  <div className="text-yellow-400/60 text-[10px] font-mono mt-1">Shortage Value: Rp {optimizationSummary.totalShortageValue.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-orange-950/20 border border-orange-900/30 rounded-xl">
                  <div className="text-orange-400 text-[10px] font-mono uppercase font-bold">Slow-Moving</div>
                  <div className="text-white text-2xl font-bold mt-1">{optimizationSummary.slowMovingCount}</div>
                  <div className="text-orange-400/60 text-[10px] font-mono mt-1">Class C + Z: Review needed</div>
                </div>
                <div className="p-4 bg-green-950/20 border border-green-900/30 rounded-xl">
                  <div className="text-green-400 text-[10px] font-mono uppercase font-bold">Potential Savings</div>
                  <div className="text-white text-2xl font-bold mt-1">Rp {optimizationSummary.totalExcessValue.toLocaleString()}</div>
                  <div className="text-green-400/60 text-[10px] font-mono mt-1">From inventory reduction</div>
                </div>
              </div>
            )}

            <div className="w-full bg-neutral-900 border border-zinc-800 rounded-xl overflow-hidden relative min-h-[300px]">
              {loadingOptimization ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 gap-4">
                  <svg className="animate-spin text-green-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span className="text-green-500 font-mono text-[10px] uppercase font-bold tracking-widest">Calculating Inventory Optimization Opportunities...</span>
                </div>
              ) : null}
              <div className="overflow-x-auto w-full text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold bg-zinc-950/40">
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4 text-center">Value / Stability</th>
                      <th className="py-3 px-4 text-center">Current Stock</th>
                      <th className="py-3 px-4 text-center">Min (ROP)</th>
                      <th className="py-3 px-4 text-center">Max</th>
                      <th className="py-3 px-4 text-center">Action</th>
                      <th className="py-3 px-4 text-right">Impact Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizationData.filter(item => item.action !== "OPTIMAL").map((item) => {
                      const actionBadge = item.action === "OVERSTOCK"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : item.action === "UNDERSTOCK"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20";
                      const actionLabel = item.action === "OVERSTOCK" ? "REDUCE STOCK"
                        : item.action === "UNDERSTOCK" ? "REORDER NOW"
                        : "REVIEW / REMOVE";
                      const impactValue = item.action === "OVERSTOCK" ? item.excessValue : item.shortageValue;
                      return (
                        <tr key={item.sku} className="border-b border-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors">
                          <td className="py-3 px-4 text-zinc-300 font-medium">{item.sku}</td>
                          <td className="py-3 px-4 font-sans text-zinc-300">{item.name}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-zinc-300">{item.abcClass}/{item.xyzClass}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-zinc-300">{item.currentStock}</td>
                          <td className="py-3 px-4 text-center text-zinc-400">{item.dynamicMinROP}</td>
                          <td className="py-3 px-4 text-center text-zinc-400">{item.dynamicMax}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${actionBadge}`}>
                              {actionLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-zinc-200">Rp {impactValue.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
