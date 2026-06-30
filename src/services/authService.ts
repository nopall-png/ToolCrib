import { User } from "@/types/user";

const API_BASE = "http://localhost:8000";

export const authService = {
  /**
   * Melakukan autentikasi menggunakan operatorId (employeeId atau username) dan accessKey.
   * Mengirimkan request POST ke backend FastAPI, bukan mock data lagi.
   */
  async login(operatorId: string, accessKey: string): Promise<User> {
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operatorId: operatorId.trim(), accessKey }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || "AUTHENTICATION FAILED: Invalid Operator ID or Access Key."
      );
    }

    const user: User = await response.json();

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true");

    return user;
  },

  /**
   * Mengakhiri sesi pengguna dengan menghapus data dari localStorage
   * dan mengirim sinyal ke backend untuk merubah status jadi OFFLINE.
   */
  async logout(): Promise<void> {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        await fetch(`${API_BASE}/api/v1/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operatorId: user.employeeId, accessKey: "" }), // accessKey tak terpakai di logout
        });
      } catch (error) {
        console.error("Gagal memberitahu server tentang status logout", error);
      }
    }
    
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
  },

  /**
   * Mendapatkan data pengguna yang sedang login saat ini dari localStorage.
   */
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Mengecek apakah pengguna sudah terautentikasi.
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isAuthenticated") === "true";
  }
};
