import { InventoryItem } from "@/types/database";

const API_BASE_URL = "http://localhost:8000/api/v1/ai";

export interface AIStockRecommendation {
  sku: string;
  name: string;
  abcClass: "A" | "B" | "C";
  xyzClass: "X" | "Y" | "Z";
  unitPrice: number;
  leadTimeDays: number;
  yearlyQty: number;
  dynamicMinROP: number;
  dynamicMax: number;
}

export interface DuplicateSkuResult {
  sku1: string;
  desc1: string;
  sku2: string;
  desc2: string;
  similarityScore: number;
}

export interface ForecastPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
  actual?: number;
}

export interface CriticalSpareResult {
  sku: string;
  name: string;
  unitPrice: number;
  leadTimeDays: number;
  totalUsage: number;
  usageScore: number;
  leadTimeScore: number;
  machineScore: number;
  compositeScore: number;
  criticalityClass: "CRITICAL" | "IMPORTANT" | "STANDARD";
}

export interface OptimizationItem {
  sku: string;
  name: string;
  abcClass: string;
  xyzClass: string;
  currentStock: number;
  dynamicMinROP: number;
  dynamicMax: number;
  unitPrice: number;
  action: "OVERSTOCK" | "UNDERSTOCK" | "SLOW_MOVING" | "OPTIMAL";
  excessQty: number;
  excessValue: number;
  shortageQty: number;
  shortageValue: number;
}

export interface OptimizationSummary {
  overstockCount: number;
  understockCount: number;
  slowMovingCount: number;
  totalExcessValue: number;
  totalShortageValue: number;
}

export const predictiveService = {
  /**
   * Menembak endpoint GET /api/v1/ai/abc-xyz-analysis
   */
  async calculatePredictiveMetrics(items: InventoryItem[]): Promise<AIStockRecommendation[]> {
    try {
      // Kita tidak mengirim items ke backend, karena backend akan membaca langsung dari Database!
      const response = await fetch(`${API_BASE_URL}/abc-xyz-analysis`);
      if (!response.ok) throw new Error("Failed to fetch ABC/XYZ from AI Engine");
      
      const result = await response.json();
      return result.data.map((r: any) => ({
        sku: r.SKU_ID,
        name: r.Description || r.SKU_ID,
        abcClass: r.ABC_Class,
        xyzClass: r.XYZ_Class,
        unitPrice: r.Unit_Price || 0,
        leadTimeDays: r.Lead_Time_Days || 14,
        yearlyQty: r.Total_Qty_Yearly || 0,
        dynamicMinROP: r.Dynamic_Min_ROP,
        dynamicMax: r.Dynamic_Max,
      }));
    } catch (error) {
      console.error("AI Engine Error (ABC/XYZ):", error);
      return [];
    }
  },

  /**
   * Menembak endpoint GET /api/v1/ai/detect-duplicates
   */
  async detectDuplicates(items: InventoryItem[], threshold: number = 0.50): Promise<DuplicateSkuResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/detect-duplicates?threshold=${threshold}`);
      if (!response.ok) throw new Error("Failed to fetch Duplicate Detection from AI Engine");

      const result = await response.json();
      return result.data.map((r: any) => ({
        sku1: r.SKU_1,
        desc1: r.Desc_1 || "Unknown Description",
        sku2: r.SKU_2,
        desc2: r.Desc_2 || "Unknown Description",
        similarityScore: Math.round(r.Similarity_Score || 0), // Already 0-100 from backend
      }));
    } catch (error) {
      console.error("AI Engine Error (Detect Duplicates):", error);
      return [];
    }
  },

  /**
   * Menembak endpoint GET /api/v1/ai/forecast/{sku}
   */
  async forecastStock(sku: string, daysAhead: number = 30): Promise<ForecastPoint[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/forecast/${sku}?days_ahead=${daysAhead}`);
      if (!response.ok) throw new Error("Failed to fetch Forecast from Prophet AI Engine");

      const result = await response.json();
      // Data format dari prophet pandas biasanya ds dan yhat
      return result.predictions.map((p: any) => ({
        ds: p.ds.split("T")[0],
        yhat: Math.max(0, p.yhat),
        yhat_lower: Math.max(0, p.yhat_lower),
        yhat_upper: Math.max(0, p.yhat_upper),
        actual: p.actual ? Math.max(0, p.actual) : undefined
      }));
    } catch (error) {
      console.error(`AI Engine Error (Prophet Forecast for ${sku}):`, error);
      return [];
    }
  },

  /**
   * Menembak endpoint GET /api/v1/ai/critical-spare-classification
   */
  async classifyCriticalSpares(): Promise<CriticalSpareResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/critical-spare-classification`);
      if (!response.ok) throw new Error("Failed to fetch Critical Spare Classification");

      const result = await response.json();
      return result.data.map((r: any) => ({
        sku: r.SKU_ID,
        name: r.Description || r.SKU_ID,
        unitPrice: r.Unit_Price || 0,
        leadTimeDays: r.Lead_Time_Days || 14,
        totalUsage: r.Total_Usage || 0,
        usageScore: r.Usage_Score || 0,
        leadTimeScore: r.Lead_Time_Score || 0,
        machineScore: r.Machine_Score || 0,
        compositeScore: r.Composite_Score || 0,
        criticalityClass: r.Criticality_Class || "STANDARD",
      }));
    } catch (error) {
      console.error("AI Engine Error (Critical Spare):", error);
      return [];
    }
  },

  /**
   * Menembak endpoint GET /api/v1/ai/optimization-opportunities
   */
  async getOptimizationOpportunities(): Promise<{ summary: OptimizationSummary; data: OptimizationItem[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/optimization-opportunities`);
      if (!response.ok) throw new Error("Failed to fetch Optimization Opportunities");

      const result = await response.json();
      const summary: OptimizationSummary = {
        overstockCount: result.summary.overstock_count,
        understockCount: result.summary.understock_count,
        slowMovingCount: result.summary.slow_moving_count,
        totalExcessValue: result.summary.total_excess_value,
        totalShortageValue: result.summary.total_shortage_value,
      };
      const data: OptimizationItem[] = result.data.map((r: any) => ({
        sku: r.SKU_ID,
        name: r.Description || r.SKU_ID,
        abcClass: r.ABC_Class,
        xyzClass: r.XYZ_Class,
        currentStock: r.Current_Stock || 0,
        dynamicMinROP: r.Dynamic_Min_ROP || 0,
        dynamicMax: r.Dynamic_Max || 0,
        unitPrice: r.Unit_Price || 0,
        action: r.Action || "OPTIMAL",
        excessQty: r.Excess_Qty || 0,
        excessValue: r.Excess_Value || 0,
        shortageQty: r.Shortage_Qty || 0,
        shortageValue: r.Shortage_Value || 0,
      }));
      return { summary, data };
    } catch (error) {
      console.error("AI Engine Error (Optimization):", error);
      return {
        summary: { overstockCount: 0, understockCount: 0, slowMovingCount: 0, totalExcessValue: 0, totalShortageValue: 0 },
        data: []
      };
    }
  },
};
