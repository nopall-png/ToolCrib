export interface DatabaseStats {
  productsCount: number;
  usersCount: number;
  incomingItemsCount: number;
  totalItemsCount: number;
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  quantity: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
}

export interface MachineryItem {
  id: string;
  machineName: string;
  requiredParts: string[];
  lastMaintenance: string;
  standardSchedule: string;
  aiPrediction: string;
  status: "Operational" | "Maintenance Required" | "Offline";
}
