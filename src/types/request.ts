export interface RequestItem {
  sku: string;
  part_name: string;
  quantity: number;
}

export interface Requisition {
  id: string;
  date: string;
  requestor: string;
  shift: string;
  itemName: string;
  destination: string;
  quantity: number;
  documentName: string;
  documentSize: string;
  urgency: "CRITICAL" | "HIGH" | "NORMAL";
  items?: RequestItem[];
}

export interface ProcessedRequisition {
  id: string;
  itemName: string;
  destination: string;
  documentName: string;
  quantity: number;
  status: "PURCHASING" | "REJECTED" | "APPROVED" | "DELIVERED" | "ONGOING" | "ON_SHIPMENT" | "DONE";
  dateProcessed: string;
  items?: RequestItem[];
}
