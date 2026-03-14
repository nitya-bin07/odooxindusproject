import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null; 
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      return { success: true, message: "Reset link sent to your email!" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    setLoading(true);
    try {
      
      await api.post(`/auth/reset-password/${resetToken}`, { password: newPassword });
      return { success: true, message: "Password updated successfully!" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Reset failed" };
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      signup, 
      logout, 
      forgotPassword, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
