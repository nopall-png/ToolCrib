"use client";

import React from "react";
import FormInput from "@/component/common/FormInput";
import Dropdown from "@/component/common/Dropdown";

interface AddStockFormProps {
  stockName: string;
  setStockName: (val: string) => void;
  stockSku: string;
  setStockSku: (val: string) => void;
  stockSize: string;
  setStockSize: (val: string) => void;
  stockCategory: string;
  setStockCategory: (val: string) => void;
  stockQty: string;
  setStockQty: (val: string) => void;
  minStock: string;
  setMinStock: (val: string) => void;
  maxStock: string;
  setMaxStock: (val: string) => void;
  criticality: string;
  setCriticality: (val: string) => void;
  rackLocation: string;
  setRackLocation: (val: string) => void;
  handleAddStock: (e: React.FormEvent) => void;
  categoryOptions: { value: string; label: string }[];
}

export default function AddStockForm({
  stockName,
  setStockName,
  stockSku,
  setStockSku,
  stockSize,
  setStockSize,
  stockCategory,
  setStockCategory,
  stockQty,
  setStockQty,
  minStock,
  setMinStock,
  maxStock,
  setMaxStock,
  criticality,
  setCriticality,
  rackLocation,
  setRackLocation,
  handleAddStock,
  categoryOptions,
}: AddStockFormProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 text-red-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold font-sans">
            Add New Stock Entry
          </h2>
        </div>
        <p className="text-neutral-500 text-xs font-mono font-normal">
          Register components into the central MRO database.
        </p>
      </div>

      <form
        onSubmit={handleAddStock}
        className="w-full bg-neutral-900 border border-zinc-800 rounded-2xl p-8 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Component Name */}
          <div className="md:col-span-2">
            <FormInput
              label="Component Name"
              placeholder="e.g. Hydraulic Pump"
              isRequired
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
            />
          </div>

          {/* SKU Code */}
          <div>
            <FormInput
              label="SKU Code (Optional)"
              placeholder="Auto-generated if blank"
              value={stockSku}
              onChange={(e) => setStockSku(e.target.value)}
            />
          </div>

          {/* Dimensions */}
          <div>
            <FormInput
              label="Size / Dimensions"
              placeholder="e.g. 24 inch"
              value={stockSize}
              onChange={(e) => setStockSize(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
              Category
            </span>
            <Dropdown
              options={categoryOptions}
              value={stockCategory}
              onChange={(e) => setStockCategory(e.target.value)}
              className="w-full h-10 border-zinc-800"
            />
          </div>

          {/* Quantity */}
          <div>
            <FormInput
              label="Quantity"
              type="number"
              placeholder="0"
              min="0"
              isRequired
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
            />
          </div>

          {/* Min Stock */}
          <div>
            <FormInput
              label="Min Stock (Optional)"
              type="number"
              placeholder="e.g. 5"
              min="0"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>

          {/* Max Stock */}
          <div>
            <FormInput
              label="Max Stock (Optional)"
              type="number"
              placeholder="e.g. 100"
              min="0"
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
            />
          </div>

          {/* Criticality Level */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-gray-500 text-xs font-normal font-mono uppercase tracking-wide px-1">
              Criticality Level
            </span>
            <Dropdown
              options={[
                { value: "LOW", label: "LOW" },
                { value: "MEDIUM", label: "MEDIUM" },
                { value: "HIGH", label: "HIGH" },
              ]}
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
              className="w-full h-10 border-zinc-800"
            />
          </div>

          {/* Rack Location */}
          <div className="md:col-span-2">
            <FormInput
              label="Rack Location (Optional)"
              placeholder="e.g. A1-01"
              value={rackLocation}
              onChange={(e) => setRackLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Action button right-aligned */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold font-mono rounded-[10px] shadow-[0px_0px_15px_0px_rgba(239,68,68,0.20)] flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Stock</span>
          </button>
        </div>
      </form>
    </div>
  );
}
