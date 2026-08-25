"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      const checkAuth = useCallback(async () => {
            try {
                  const res = await fetch("/api/auth/profile", {
                        method: "GET",
                        credentials: "include"
                  });

                  if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                        return true
                  } else {
                        setUser(null);
                        return false
                  }
            } catch {
                  setUser(null);
                  return false
            } finally {
                  setLoading(false);
            }
      }, [])

      useEffect(() => {
            checkAuth();
      }, [checkAuth]);

      return (
            <AuthContext.Provider value={{ user, loading, isLoggedIn: Boolean(user), refetchUser: checkAuth }}>
                  {children}
            </AuthContext.Provider>
      );
}

export const useAuth = () => useContext(AuthContext);