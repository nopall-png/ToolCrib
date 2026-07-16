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

// Tab Subcomponents
import MatrixTab from "./components/MatrixTab";
import DuplicateScannerTab from "./components/DuplicateScannerTab";
import ForecastTab from "./components/ForecastTab";
import CriticalSpareTab from "./components/CriticalSpareTab";
import OptimizationTab from "./components/OptimizationTab";

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
      const items = await databaseService.getInventoryItems();
      setInventoryItems(items);

      if (items.length > 0) {
        setSelectedSku(items[0].sku);
      }

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

  return (
    <DashboardLayout role="manager">
      <div className="flex flex-col gap-6 w-full select-none pb-12">
        
        {/* Minimal Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm font-mono text-zinc-500">
            {/* Breadcrumbs handled by Navbar */}
          </div>
          <h1 className="text-[#2B3674] text-2xl font-bold tracking-tight">Logistics & Forecasting</h1>
          <p className="text-[#A3AED0] text-xs font-sans">
            Logistical ABC/XYZ classification, semantic duplicate checking, and Prophet time-series projections.
          </p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="flex gap-6 border-b border-gray-200 mt-2">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "matrix" ? "text-[#4318FF]" : "text-[#A3AED0] hover:text-[#2B3674]"
            }`}
          >
            Inventory Value & Stability
            {activeTab === "matrix" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4318FF] rounded"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("duplicates")}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "duplicates" ? "text-[#4318FF]" : "text-[#A3AED0] hover:text-[#2B3674]"
            }`}
          >
            Duplicate Scanner
            {activeTab === "duplicates" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4318FF] rounded"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("forecast")}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer relative ${
              activeTab === "forecast" ? "text-[#4318FF]" : "text-[#A3AED0] hover:text-[#2B3674]"
            }`}
          >
            Demand Forecasting
            {activeTab === "forecast" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4318FF] rounded"></span>
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
              activeTab === "critical" ? "text-[#4318FF]" : "text-[#A3AED0] hover:text-[#2B3674]"
            }`}
          >
            Critical Spare Engine
            {activeTab === "critical" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4318FF] rounded"></span>
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
              activeTab === "optimization" ? "text-[#4318FF]" : "text-[#A3AED0] hover:text-[#2B3674]"
            }`}
          >
            Optimization
            {activeTab === "optimization" && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#4318FF] rounded"></span>
            )}
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "matrix" && (
          <MatrixTab metrics={metrics} loadingMetrics={loadingMetrics} />
        )}

        {activeTab === "duplicates" && (
          <DuplicateScannerTab
            similarityThreshold={similarityThreshold}
            setSimilarityThreshold={setSimilarityThreshold}
            duplicates={duplicates}
            loadingDuplicates={loadingDuplicates}
          />
        )}

        {activeTab === "forecast" && (
          <ForecastTab
            selectedSku={selectedSku}
            setSelectedSku={setSelectedSku}
            inventoryItems={inventoryItems}
            forecastData={forecastData}
            loadingForecast={loadingForecast}
          />
        )}

        {activeTab === "critical" && (
          <CriticalSpareTab criticalSpares={criticalSpares} loadingCritical={loadingCritical} />
        )}

        {activeTab === "optimization" && (
          <OptimizationTab
            optimizationData={optimizationData}
            optimizationSummary={optimizationSummary}
            loadingOptimization={loadingOptimization}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
