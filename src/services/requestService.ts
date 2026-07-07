import { Requisition, ProcessedRequisition } from "@/types/request";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const requestService = {
  /**
   * Mengambil SEMUA requests dari backend dan memecahnya jadi Pending vs Processed.
   */
  async fetchAllRequests(): Promise<{ pending: Requisition[], processed: ProcessedRequisition[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const result = await response.json();
      const data = result.data || [];

      const pending: Requisition[] = [];
      const processed: ProcessedRequisition[] = [];

      data.forEach((r: any) => {
        if (r.approval_status === "PENDING") {
          pending.push({
            id: r.request_id,
            date: r.created_at,
            requestor: r.requestor_name,
            shift: r.requestor_shift,
            itemName: r.part_name,
            destination: r.machine_name,
            quantity: r.quantity,
            documentName: r.document_url || "Form_MRO_Standard.pdf",
            documentSize: "1.2 MB",
            urgency: r.urgency as any,
            items: r.items || []
          });
        } else {
          processed.push({
            id: r.request_id,
            itemName: r.part_name,
            destination: r.machine_name,
            documentName: r.document_url || "Form_MRO_Standard.pdf",
            quantity: r.quantity,
            status: r.approval_status as any,
            dateProcessed: r.created_at,
            items: r.items || []
          });
        }
      });

      return { pending, processed };
    } catch (error) {
      console.error("Error fetching requests:", error);
      return { pending: [], processed: [] };
    }
  },

  /**
   * Menambahkan request baru ke Backend.
   */
  async addRequisition(reqData: { requestor_id: string, machine_id: string, urgency: string, request_type: string, document_url?: string, items: {sku: string, quantity: number}[] }): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqData)
      });
      return response.ok;
    } catch (error) {
      console.error("Error adding request:", error);
      return false;
    }
  },

  /**
   * Update status (APPROVE/REJECT/DELIVER) ke Backend.
   */
  async updateStatus(id: string, status: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_status: status })
      });
      return response.ok;
    } catch (error) {
      console.error("Error updating request status:", error);
      return false;
    }
  },

  async approveRequisition(id: string): Promise<boolean> {
    return this.updateStatus(id, "PURCHASING");
  },

  async rejectRequisition(id: string): Promise<boolean> {
    return this.updateStatus(id, "REJECTED");
  },

  async deliverRequisition(id: string): Promise<boolean> {
    return this.updateStatus(id, "DELIVERED");
  }
};
