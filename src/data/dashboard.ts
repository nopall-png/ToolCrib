import {
  OrderRequest,
  MaintenanceSchedule,
  StockSummary,
  StockItem,
  PurchaseHistory,
  PredictiveMaintenance,
} from "@/types/dashboard";

export const orderRequests: OrderRequest[] = [
  {
    id: "#1245",
    customerName: "Brad Morrison",
    orderDate: "2026-06-28",
    status: "Processing",
  },
  {
    id: "#1246",
    customerName: "Andrew Williams",
    orderDate: "2026-06-29",
    status: "Preparing for Shipment",
  },
  {
    id: "#1247",
    customerName: "Rick Taylor",
    orderDate: "2026-06-29",
    status: "Processing",
  },
  {
    id: "#1248",
    customerName: "Sarah Conner",
    orderDate: "2026-06-30",
    status: "Preparing for Shipment",
  },
  {
    id: "#1249",
    customerName: "David Chen",
    orderDate: "2026-06-30",
    status: "Processing",
  },
  {
    id: "#1250",
    customerName: "Alex Johnson",
    orderDate: "2026-06-30",
    status: "Preparing for Shipment",
  },
];

export const scheduledMaintenances: MaintenanceSchedule[] = [
  {
    id: "MCH-0012",
    customerName: "CNC Milling Axis-5",
    orderDate: "2026-07-05",
    status: "To be done",
  },
  {
    id: "MCH-0013",
    customerName: "Industrial Lathe L-300",
    orderDate: "2026-07-01",
    status: "To be done",
  },
  {
    id: "MCH-0014",
    customerName: "Hydraulic Press H-50",
    orderDate: "2026-06-28",
    status: "done",
  },
  {
    id: "MCH-0015",
    customerName: "Robotic Arm RA-10",
    orderDate: "2026-07-12",
    status: "To be done",
  },
  {
    id: "MCH-0016",
    customerName: "Laser Cutter LC-500",
    orderDate: "2026-06-29",
    status: "done",
  },
];

export const stockSummary: StockSummary = {
  currentStock: 6800,
  replenishedStock: 9500,
  completedOrders: 4200,
};

export const stockItems: StockItem[] = [
  { name: "Industrial Heavy Duty Rim (24 inch)", quantity: 150 },
  { name: "Titanium Sprocket Gear (120mm)", quantity: 12, isCritical: true },
  { name: "Hydraulic Valve Assembly (Standard)", quantity: 85 },
  { name: "Pneumatic Cylinder PC-200", quantity: 40 },
  { name: "High-Temp Coolant Filter", quantity: 5, isCritical: true },
  { name: "Servo Motor AX-9", quantity: 2, isCritical: true },
  { name: "Flexible Coupling D30-L40", quantity: 32 },
  { name: "Industrial Grease Tube (400g)", quantity: 60 },
  { name: "Titanium Bolts M8", quantity: 500 },
  { name: "Pneumatic Cylinder Seal Kit", quantity: 15 },
  { name: "Hydraulic Fluid 50L", quantity: 8 },
  { name: "Safety Goggles Set (10-Pack)", quantity: 20 },
  { name: "Diamond Grit Grinding Wheel", quantity: 6, isCritical: true },
];

export const purchaseHistory: PurchaseHistory[] = [
  {
    id: "PH-001",
    timeAgo: "1 Day Ago",
    title: "Industrial Heavy Duty Rims",
    quantityInfo: "150 units received",
    image: "https://placehold.co/62x62",
  },
  {
    id: "PH-002",
    timeAgo: "3 Days Ago",
    title: "Hydraulic Fluid 50L",
    quantityInfo: "100 liters replenished",
    avatars: [
      "https://placehold.co/24x24",
      "https://placehold.co/24x24",
    ],
  },
  {
    id: "PH-003",
    timeAgo: "1 Week Ago",
    title: "Inductive Proximity Sensors",
    quantityInfo: "25 units received",
    image: "https://placehold.co/62x62",
  },
];

export const predictiveMaintenances: PredictiveMaintenance[] = [
  {
    id: "PM-001",
    timeLeft: "2 Weeks left",
    machineName: "CNC Milling Axis-5",
    predictionInfo: "Overhaul prediction in 10 days",
    image: "https://placehold.co/62x62",
  },
  {
    id: "PM-002",
    timeLeft: "5 Weeks Left",
    machineName: "Hydraulic Press H-50",
    predictionInfo: "Filter seal check prediction in 3 weeks",
    avatars: [
      "https://placehold.co/24x24",
      "https://placehold.co/24x24",
    ],
  },
  {
    id: "PM-003",
    timeLeft: "6 Weeks Left",
    machineName: "Robotic Arm RA-10",
    predictionInfo: "Joint calibration prediction in 4 weeks",
    image: "https://placehold.co/62x62",
  },
];
