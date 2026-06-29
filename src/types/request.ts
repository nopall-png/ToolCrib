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
}

export interface ProcessedRequisition {
  id: string;
  itemName: string;
  destination: string;
  documentName: string;
  quantity: number;
  status: "PURCHASING" | "REJECTED" | "APPROVED";
  dateProcessed: string;
}
