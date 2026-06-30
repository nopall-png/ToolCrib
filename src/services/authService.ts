import { users } from "@/data/user";
import { auths } from "@/data/auth";
import { User } from "@/types/user";

export const authService = {
  /**
   * Melakukan autentikasi menggunakan operatorId (employeeId atau username) dan accessKey.
   */
  login(operatorId: string, accessKey: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Simulasi delay jaringan
      setTimeout(() => {
        let foundUser: User | undefined = users.find(
          (u) => u.employeeId.toLowerCase() === operatorId.trim().toLowerCase()
        );

        let foundAuth = auths.find(
          (a) => a.username.toLowerCase() === operatorId.trim().toLowerCase()
        );

        if (foundAuth && !foundUser) {
          const auth = foundAuth;
          foundUser = users.find((u) => u.id === auth.userId);
        } else if (foundUser && !foundAuth) {
          const user = foundUser;
          foundAuth = auths.find((a) => a.userId === user.id);
        }

        // Verifikasi password / access key
        if (foundUser && foundAuth && foundAuth.password === accessKey) {
          localStorage.setItem("currentUser", JSON.stringify(foundUser));
          localStorage.setItem("isAuthenticated", "true");
          resolve(foundUser);
        } else {
          reject(new Error("AUTHENTICATION FAILED: Invalid Operator ID or Access Key."));
        }
      }, 800);
    });
  },

  /**
   * Mengakhiri sesi pengguna dengan menghapus data dari localStorage.
   */
  logout(): void {
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
