import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { authService } from "@/services/authService";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync user state on mount
  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  /**
   * Melakukan login dan mengembalikan boolean sukses/tidaknya.
   */
  const login = async (operatorId: string, accessKey: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    try {
      const loggedInUser = await authService.login(operatorId, accessKey);
      setUser(loggedInUser);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Mengakhiri sesi dan meredireksi user ke halaman login.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/auth/login");
  };

  /**
   * Melakukan validasi status autentikasi dan rute guard (opsional dengan filter role).
   */
  const checkAuth = (requiredRole?: string) => {
    const isAuthed = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuthed || !currentUser) {
      router.push("/auth/login");
      return { authorized: false, user: null };
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push(`/dashboard/${currentUser.role}`);
      return { authorized: false, user: currentUser };
    }

    return { authorized: true, user: currentUser };
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    setUser,
  };
}
