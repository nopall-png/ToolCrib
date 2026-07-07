import { InventoryItem, MachineryItem, TransactionItem } from "@/types/database";

const API_BASE = "http://localhost:8000";

/**
 * Service layer untuk menghubungkan halaman Database frontend
 * dengan API Backend FastAPI tanpa mengubah komponen UI.
 * 
 * Fungsi utama: Mapping key dari snake_case (backend) ke camelCase (frontend).
 */
export const databaseService = {

  // =====================================================================
  // INVENTORY / SPARE PARTS
  // =====================================================================

  /**
   * Mengambil semua spare parts dari backend dan memetakannya
   * ke format InventoryItem yang dimengerti frontend.
   */
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/spare-parts`);
      if (!response.ok) throw new Error("Failed to fetch spare parts");
      
      const result = await response.json();
      
      // MAPPING: Backend snake_case -> Frontend camelCase
      return (result.data || []).map((item: any) => {
        const qty = item.current_stock ?? 0;
        let status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK" = "IN STOCK";
        if (qty === 0) status = "OUT OF STOCK";
        else if (qty < 20) status = "LOW STOCK";

        return {
          sku: item.sku,
          name: item.part_name,        // part_name -> name
          category: item.category || "General",
          quantity: qty,                // current_stock -> quantity
          status: status,              // Dihitung dinamis dari stok
        };
      });
    } catch (error) {
      console.error("❌ databaseService.getInventoryItems error:", error);
      return [];
    }
  },

  /**
   * Menambahkan spare part baru ke database melalui API POST.
   */
  async addInventoryItem(item: InventoryItem): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/spare-parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: item.sku,
          part_name: item.name,         // name -> part_name (reverse mapping)
          category: item.category,
          current_stock: item.quantity,  // quantity -> current_stock
          min_stock: item.minStock || 5,
          max_stock: item.maxStock || 100,
          criticality_level: item.criticalityLevel || "LOW",
          rack_location: item.rackLocation || "A1-01",
          unit_price: 0.0,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error("❌ databaseService.addInventoryItem error:", error);
      return false;
    }
  },

  /**
   * Menghapus spare part dari database melalui API DELETE.
   */
  async deleteInventoryItem(sku: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/spare-parts/${sku}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("❌ databaseService.deleteInventoryItem error:", error);
      return false;
    }
  },

  // =====================================================================
  // MACHINERY
  // =====================================================================

  /**
   * Mengambil semua mesin dari backend dan memetakannya
   * ke format MachineryItem yang dimengerti frontend.
   */
  async getMachineryItems(): Promise<MachineryItem[]> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/machines`);
      if (!response.ok) throw new Error("Failed to fetch machines");

      const result = await response.json();

      // MAPPING: Backend snake_case -> Frontend camelCase
      return (result.data || []).map((item: any) => ({
        id: item.machine_id,
        machineName: item.machine_name,
        requiredParts: item.required_spare_parts || [],
        lastMaintenance: item.last_maintenance_date || "",
        standardSchedule: item.standard_schedule_date || "",
        aiPrediction: item.ai_prediction_date || "",
        status: item.status || "HEALTHY",
        downtimeImpact: item.downtime_impact || "MEDIUM",
      }));
    } catch (error) {
      console.error("❌ databaseService.getMachineryItems error:", error);
      return [];
    }
  },

  /**
   * Mendaftarkan mesin baru ke database melalui API POST.
   */
  async addMachineryItem(item: MachineryItem): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/machines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_id: item.id,                     // id -> machine_id (reverse mapping)
          machine_name: item.machineName,           // machineName -> machine_name
          required_spare_parts: item.requiredParts, // requiredParts -> required_spare_parts
          last_maintenance_date: item.lastMaintenance, // lastMaintenance -> last_maintenance_date
        }),
      });
      return response.ok;
    } catch (error) {
      console.error("❌ databaseService.addMachineryItem error:", error);
      return false;
    }
  },

  /**
   * Menghapus mesin dari database melalui API DELETE.
   */
  async deleteMachineryItem(machineId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/machines/${machineId}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("❌ databaseService.deleteMachineryItem error:", error);
      return false;
    }
  },

  // =====================================================================
  // INVENTORY TRANSACTIONS
  // =====================================================================

  async getInventoryTransactions(limit: number = 10): Promise<TransactionItem[]> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const result = await response.json();

      const sorted = (result.data || [])
        .sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
        .slice(0, limit);

      return sorted.map((t: any) => ({
        id: t.id,
        sku: t.sku,
        transactionType: t.transaction_type,
        quantity: t.quantity,
        transactionDate: t.transaction_date,
        notes: t.notes || "",
      }));
    } catch (error) {
      console.error("databaseService.getInventoryTransactions error:", error);
      return [];
    }
  },
};
