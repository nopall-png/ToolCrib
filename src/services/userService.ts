import { UserPersonnel } from "@/types/user-panel";

// BASE URL HARUS MENGARAH KE BACKEND FASTAPI
const API_BASE_URL = "http://localhost:8000/api/v1";

export const userService = {
  /**
   * Mengambil semua daftar pegawai dari Supabase Postgres via FastAPI.
   */
  async getAllUsers(): Promise<UserPersonnel[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users. Status: ${response.status}`);
      }

      const result = await response.json();
      const dbUsers = result.data || [];

      // Menerjemahkan data backend (snake_case) ke format frontend (camelCase)
      return dbUsers.map((u: any) => ({
        empId: u.employee_id,
        name: u.full_name,
        email: u.email || `${u.full_name.toLowerCase().replace(/\s+/g, ".")}@toolcrib.ai`,
        role: u.role_name,
        department: u.department_shift || "General",
        shift: "Shift 1", // Hardcode sementara, atau bisa di parsing dari department_shift jika formatnya "Dept - Shift"
        status: u.network_status || "OFFLINE",
        lastActive: u.last_active || "Offline",
      }));
    } catch (error) {
      console.error("Error fetching users from DB:", error);
      // Fallback sementara agar web tidak crash jika DB mati
      return [];
    }
  },

  /**
   * Menambahkan pegawai baru ke Supabase Postgres via FastAPI.
   */
  async addUser(newUser: UserPersonnel, rawPassword: string = "default123"): Promise<boolean> {
    try {
      // Kita perlu mapping Role (string) ke role_id (number) di database
      // 1: Manager, 2: Procurement, 3: Engineer
      let roleId = 3;
      if (newUser.role === "MANAGER") roleId = 1;
      else if (newUser.role === "PROCUREMENT") roleId = 2;
      else if (newUser.role === "ENGINEER") roleId = 3;

      const payload = {
        employee_id: newUser.empId,
        full_name: newUser.name,
        password_hash: rawPassword,
        role_id: roleId,
        department_shift: newUser.department,
        email: newUser.email,
        network_status: newUser.status
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to add user. Status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error adding new user:", error);
      return false;
    }
  },

  /**
   * Menghapus pegawai dari Supabase Postgres via FastAPI.
   */
  async deleteUser(employeeId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${employeeId}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
};
