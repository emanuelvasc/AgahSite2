import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEMO_USERS = {
  "admin@agah.com": {
    password: "admin123",
    role: "admin",
    name: "Carlos Mendes",
    avatar: "CM",
  },
  "cliente@agah.com": {
    password: "cliente123",
    role: "client",
    name: "Rafael Mendonça",
    avatar: "RM",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("agah_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = DEMO_USERS[email];
    if (found && found.password === password) {
      const u = {
        email,
        role: found.role,
        name: found.name,
        avatar: found.avatar,
      };
      setUser(u);
      localStorage.setItem("agah_user", JSON.stringify(u));
      return { success: true, role: found.role };
    }
    return { success: false, error: "Credenciais inválidas" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agah_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
