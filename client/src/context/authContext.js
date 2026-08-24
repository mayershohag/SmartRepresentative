"use client";

import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            async function checkAuth() {
                  try {
                        const res = await fetch("https://smartrepresentative.onrender.com/api/auth/profile", {
                              credentials: "include"
                        });

                        if (res.ok) {
                              const data = await res.json();
                              setUser(data.user);
                        } else {
                              setUser(null);
                        }
                  } catch {
                        setUser(null);
                  } finally {
                        setLoading(false);
                  }
            }
            checkAuth();
      }, []);

      return (
            <AuthContext.Provider value={{ user, loading, isLoggedIn: Boolean(user) }}>
                  {children}
            </AuthContext.Provider>
      );
}

export const useAuth = () => useContext(AuthContext);