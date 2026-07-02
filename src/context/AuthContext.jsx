import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("agah_user");
    const storedClient = localStorage.getItem("agah_client");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    }
    setLoading(false);
  }, []);

  // 🔑 LOGIN - Agora com Supabase
  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      setClient(result.client || null);

      localStorage.setItem("agah_user", JSON.stringify(result.user));
      if (result.client) {
        localStorage.setItem("agah_client", JSON.stringify(result.client));
      }

      return {
        success: true,
        role: result.user.role,
        user: result.user,
        client: result.client,
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error.message || "Credenciais inválidas",
      };
    }
  };

  // 📝 REGISTRO - Agora com Supabase
  const register = async (email, password, name, phone = "") => {
    try {
      const result = await authService.register(email, password, name, phone);
      setUser(result.user);
      setClient(result.client);

      localStorage.setItem("agah_user", JSON.stringify(result.user));
      localStorage.setItem("agah_client", JSON.stringify(result.client));

      return {
        success: true,
        user: result.user,
        client: result.client,
      };
    } catch (error) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        error: error.message || "Erro ao criar conta",
      };
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setClient(null);
    localStorage.removeItem("agah_user");
    localStorage.removeItem("agah_client");
    sessionStorage.clear();
  };

  // 🔄 ATUALIZAR USUÁRIO
  const updateUser = async (updates) => {
    if (!user) return null;
    try {
      const updated = await authService.updateUser(user.id, updates);
      setUser(updated);
      localStorage.setItem("agah_user", JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return null;
    }
  };

  const value = {
    user,
    client,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
