export interface OrderRequest {
  id: string;
  customerName: string;
  orderDate: string;
  status: string;
}

export interface MaintenanceSchedule {
  id: string;
  customerName: string;
  orderDate: string;
  status: string;
}

export interface StockSummary {
  currentStock: number;
  replenishedStock: number;
  completedOrders: number;
}

export interface StockItem {
  name: string;
  quantity: number;
  isCritical?: boolean;
}

export interface PurchaseHistory {
  id: string;
  timeAgo: string;
  title: string;
  quantityInfo: string;
  image?: string;
  avatars?: string[];
}

export interface PredictiveMaintenance {
  id: string;
  timeLeft: string;
  machineName: string;
  predictionInfo: string;
  image?: string;
  avatars?: string[];
}
