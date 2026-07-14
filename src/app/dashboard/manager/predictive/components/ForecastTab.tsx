"use client";

import React from "react";
import { ForecastPoint } from "@/services/predictiveService";
import { InventoryItem } from "@/types/database";

interface ForecastTabProps {
  selectedSku: string;
  setSelectedSku: (val: string) => void;
  inventoryItems: InventoryItem[];
  forecastData: ForecastPoint[];
  loadingForecast: boolean;
}

export default function ForecastTab({
  selectedSku,
  setSelectedSku,
  inventoryItems,
  forecastData,
  loadingForecast,
}: ForecastTabProps) {
  
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
            <svg
              className="animate-spin text-purple-500"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span className="text-purple-500 font-mono text-[10px] uppercase font-bold tracking-widest">
              Generating Prophet Time-Series Forecast...
            </span>
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
  );
}
