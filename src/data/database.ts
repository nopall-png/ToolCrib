import { DatabaseStats, InventoryItem, MachineryItem } from "@/types/database";

export const initialDatabaseStats: DatabaseStats = {
  productsCount: 6,
  usersCount: 4,
  incomingItemsCount: 20,
  totalItemsCount: 852,
};

export const initialInventoryItems: InventoryItem[] = [
  {
    sku: "SKU-10482",
    name: "Industrial Heavy Duty Rim (24 inch)",
    category: "Mechanical",
    quantity: 150,
    status: "IN STOCK",
  },
  {
    sku: "SKU-10483",
    name: "Titanium Sprocket Gear (120mm)",
    category: "Drivetrain",
    quantity: 12,
    status: "LOW STOCK",
  },
  {
    sku: "SKU-10484",
    name: "Hydraulic Valve Assembly (Standard)",
    category: "Hydraulics",
    quantity: 85,
    status: "IN STOCK",
  },
];

export const initialMachineryItems: MachineryItem[] = [
  {
    id: "MCH-0012",
    machineName: "CNC Milling Axis-5",
    requiredParts: ["Drill bits", "Oil"],
    lastMaintenance: "2024-08-01",
    standardSchedule: "2024-11-01",
    aiPrediction: "2024-10-15",
    status: "Operational",
  },
  {
    id: "MCH-0013",
    machineName: "Industrial Lathe L-300",
    requiredParts: ["Carbon Brush", "Lubricant"],
    lastMaintenance: "2024-07-15",
    standardSchedule: "2024-10-15",
    aiPrediction: "2024-10-10",
    status: "Operational",
  },
  {
    id: "MCH-0014",
    machineName: "Hydraulic Press H-50",
    requiredParts: ["Seal kit", "Pressure Gauge"],
    lastMaintenance: "2024-09-01",
    standardSchedule: "2024-12-01",
    aiPrediction: "2024-11-20",
    status: "Operational",
  },
];
