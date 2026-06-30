import { Requisition, ProcessedRequisition } from "@/types/request";
import { initialPendingRequisitions, initialProcessedRequisitions } from "@/data/request";

const PENDING_KEY = "pendingRequisitions";
const PROCESSED_KEY = "processedRequisitions";

export const requestService = {
  /**
   * Mengambil semua rincian request pending dari localStorage.
   * Jika tidak ada, diinisialisasi dengan data awal.
   */
  getPendingRequisitions(): Requisition[] {
    if (typeof window === "undefined") return initialPendingRequisitions;
    const pendingStr = localStorage.getItem(PENDING_KEY);
    if (!pendingStr) {
      localStorage.setItem(PENDING_KEY, JSON.stringify(initialPendingRequisitions));
      return initialPendingRequisitions;
    }
    try {
      return JSON.parse(pendingStr);
    } catch {
      return initialPendingRequisitions;
    }
  },

  /**
   * Mengambil semua rincian request yang sudah diproses (Purchasing, Approved, Rejected, Delivered).
   */
  getProcessedRequisitions(): ProcessedRequisition[] {
    if (typeof window === "undefined") return initialProcessedRequisitions;
    const processedStr = localStorage.getItem(PROCESSED_KEY);
    if (!processedStr) {
      localStorage.setItem(PROCESSED_KEY, JSON.stringify(initialProcessedRequisitions));
      return initialProcessedRequisitions;
    }
    try {
      return JSON.parse(processedStr);
    } catch {
      return initialProcessedRequisitions;
    }
  },

  /**
   * Menambahkan request baru oleh Engineer.
   */
  addRequisition(reqData: Omit<Requisition, "id" | "date">): Requisition {
    const list = this.getPendingRequisitions();
    
    // Generate ID unik, misal REQ-9048, dst.
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newReq: Requisition = {
      ...reqData,
      id: `REQ-${randomNum}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updatedList = [newReq, ...list];
    localStorage.setItem(PENDING_KEY, JSON.stringify(updatedList));
    return newReq;
  },

  /**
   * Menyetujui request (Memindahkan dari pending ke processed dengan status PURCHASING).
   */
  approveRequisition(id: string): void {
    const pending = this.getPendingRequisitions();
    const processed = this.getProcessedRequisitions();
    
    const req = pending.find(item => item.id === id);
    if (!req) return;

    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const newProcessed: ProcessedRequisition = {
      id: req.id,
      itemName: req.itemName,
      destination: req.destination.includes("Dest:") ? req.destination : `Dest: ${req.destination}`,
      documentName: req.documentName,
      quantity: req.quantity,
      status: "PURCHASING",
      dateProcessed: dateStr,
    };

    const updatedPending = pending.filter(item => item.id !== id);
    const updatedProcessed = [newProcessed, ...processed];

    localStorage.setItem(PENDING_KEY, JSON.stringify(updatedPending));
    localStorage.setItem(PROCESSED_KEY, JSON.stringify(updatedProcessed));
  },

  /**
   * Menolak request (Memindahkan dari pending ke processed dengan status REJECTED).
   */
  rejectRequisition(id: string): void {
    const pending = this.getPendingRequisitions();
    const processed = this.getProcessedRequisitions();
    
    const req = pending.find(item => item.id === id);
    if (!req) return;

    const now = new Date();
    const dateStr = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const newProcessed: ProcessedRequisition = {
      id: req.id,
      itemName: req.itemName,
      destination: req.destination.includes("Dest:") ? req.destination : `Dest: ${req.destination}`,
      documentName: req.documentName,
      quantity: req.quantity,
      status: "REJECTED",
      dateProcessed: dateStr,
    };

    const updatedPending = pending.filter(item => item.id !== id);
    const updatedProcessed = [newProcessed, ...processed];

    localStorage.setItem(PENDING_KEY, JSON.stringify(updatedPending));
    localStorage.setItem(PROCESSED_KEY, JSON.stringify(updatedProcessed));
  },

  /**
   * Menandai item request yang disetujui (PURCHASING) menjadi sudah dibeli/diterima (DELIVERED).
   */
  deliverRequisition(id: string): void {
    this.updateProcessedStatus(id, "DELIVERED");
  },

  /**
   * Memperbarui status item request yang diproses (untuk kebutuhan papan Kanban/Jira).
   */
  updateProcessedStatus(
    id: string,
    status: "PURCHASING" | "REJECTED" | "APPROVED" | "DELIVERED" | "ONGOING" | "ON_SHIPMENT" | "DONE"
  ): void {
    const processed = this.getProcessedRequisitions();
    const updated = processed.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
        };
      }
      return item;
    });
    localStorage.setItem(PROCESSED_KEY, JSON.stringify(updated));
  }
};
