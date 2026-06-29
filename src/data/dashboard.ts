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
    customerName: "John Doe",
    orderDate: "2024-09-10",
    status: "Processing",
  },
  {
    id: "#1246",
    customerName: "Jane Smith",
    orderDate: "2024-09-12",
    status: "Preparing for Shipment",
  },
  {
    id: "#1247",
    customerName: "Alex Johnson",
    orderDate: "2024-09-13",
    status: "Processing",
  },
  {
    id: "#1248",
    customerName: "Emily Carter",
    orderDate: "2024-09-15",
    status: "Preparing for Shipment",
  },
];

export const scheduledMaintenances: MaintenanceSchedule[] = [
  {
    id: "#1245",
    customerName: "John Doe",
    orderDate: "2024-09-10",
    status: "done",
  },
  {
    id: "#1246",
    customerName: "Jane Smith",
    orderDate: "2024-09-12",
    status: "To be done",
  },
  {
    id: "#1247",
    customerName: "Alex Johnson",
    orderDate: "2024-09-13",
    status: "To be done",
  },
  {
    id: "#1248",
    customerName: "Emily Carter",
    orderDate: "2024-09-15",
    status: "To be done",
  },
];

export const stockSummary: StockSummary = {
  currentStock: 5200,
  replenishedStock: 7800,
  completedOrders: 3400,
};

export const stockItems: StockItem[] = [
  { name: "Rim", quantity: 58 },
  { name: "Hub", quantity: 50 },
  { name: "Pedal", quantity: 25 },
  { name: "Chain", quantity: 66 },
  { name: "Brake", quantity: 40 },
  { name: "Tire", quantity: 148, isCritical: true },
  { name: "Seat", quantity: 58 },
  { name: "Gear", quantity: 66 },
  { name: "Frame", quantity: 50 },
  { name: "Spoke", quantity: 75 },
  { name: "Fork", quantity: 40 },
  { name: "Valve", quantity: 20 },
];

export const purchaseHistory: PurchaseHistory[] = [
  {
    id: "PH-001",
    timeAgo: "1 Day Ago",
    title: "RUM",
    quantityInfo: "12,500 units/day",
    image: "https://placehold.co/62x62",
  },
  {
    id: "PH-002",
    timeAgo: "1 Week Ago",
    title: "Oil",
    quantityInfo: "2 liters",
    avatars: [
      "https://placehold.co/24x24",
      "https://placehold.co/24x24",
    ],
  },
];

export const predictiveMaintenances: PredictiveMaintenance[] = [
  {
    id: "PM-001",
    timeLeft: "4 Weeks left",
    machineName: "BUBUT",
    predictionInfo: "Prediction 2 weeks",
    image: "https://placehold.co/62x62",
  },
  {
    id: "PM-002",
    timeLeft: "5 Weeks Left",
    machineName: "Mesin Jait",
    predictionInfo: "Prediction 3 Weeks",
    avatars: [
      "https://placehold.co/24x24",
      "https://placehold.co/24x24",
    ],
  },
];
