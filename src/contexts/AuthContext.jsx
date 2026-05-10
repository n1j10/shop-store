import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api, parseApiError } from "@/lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "italina_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);

      return { ok: true };
    } catch (error) {
      return { ok: false, message: parseApiError(error, "Registration failed.") };
    }
  };

  const login = async (payload) => {
    try {
      const { data } = await api.post("/auth/login", payload);

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);

      return { ok: true };
    } catch (error) {
      return { ok: false, message: parseApiError(error, "Login failed.") };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}