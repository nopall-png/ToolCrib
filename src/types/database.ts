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
  minStock?: number;
  maxStock?: number;
  criticalityLevel?: string;
  rackLocation?: string;
}

export interface MachineryItem {
  id: string;
  machineName: string;
  requiredParts: string[];
  lastMaintenance: string;
  standardSchedule: string;
  aiPrediction: string;
  status: "Operational" | "Maintenance Required" | "Offline" | "HEALTHY" | "WARNING" | "CRITICAL";
  downtimeImpact?: string;
}

export interface TransactionItem {
  id: string;
  sku: string;
  transactionType: string;
  quantity: number;
  transactionDate: string;
  notes: string;
}

export interface MachineMaintenanceSchedule {
  id: string;
  name: string;
  task: string;
  date: string;
  status: "SCHEDULED" | "URGENT" | "COMPLETED";
  statusClass: string;
}
