import { Requisition, ProcessedRequisition } from "@/types/request";

export const initialPendingRequisitions: Requisition[] = [
  {
    id: "REQ-9045",
    date: "2024-06-25 08:30 AM",
    requestor: "Alex J.",
    shift: "Shift 1",
    itemName: "High-Temp Coolant Filter",
    destination: "CNC Milling (MCH-001)",
    quantity: 5,
    documentName: "REQ-9045_Spec.pdf",
    documentSize: "1.2 MB",
    urgency: "CRITICAL",
  },
  {
    id: "REQ-9046",
    date: "2024-06-25 09:15 AM",
    requestor: "Budi R.",
    shift: "Shift 1",
    itemName: "Servo Motor AX-9",
    destination: "Stamping Press (MCH-002)",
    quantity: 2,
    documentName: "Motor_AX9_Datasheet.pdf",
    documentSize: "3.4 MB",
    urgency: "HIGH",
  },
  {
    id: "REQ-9047",
    date: "2024-06-25 10:05 AM",
    requestor: "Sarah W.",
    shift: "Shift 2",
    itemName: "Titanium Bolts M8",
    destination: "General Stock",
    quantity: 50,
    documentName: "M8_Bolt_QuoteForm.pdf",
    documentSize: "840 KB",
    urgency: "NORMAL",
  },
];

export const initialProcessedRequisitions: ProcessedRequisition[] = [
  {
    id: "REQ-9042",
    itemName: "Hydraulic Fluid 50L",
    destination: "MCH-004",
    documentName: "Hydraulic_Req.pdf",
    quantity: 2,
    status: "PURCHASING",
    dateProcessed: "2024-06-24 14:20 PM",
  },
  {
    id: "REQ-9040",
    itemName: "Safety Goggles Set",
    destination: "General Stock",
    documentName: "PPE_Request.pdf",
    quantity: 15,
    status: "REJECTED",
    dateProcessed: "2024-06-23 11:00 AM",
  },
];
