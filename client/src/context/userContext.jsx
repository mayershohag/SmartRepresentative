"use client";
import { createContext, useContext, useEffect, useState } from "react";

import getProfile from '../apis/getProfile.js';
import logout from '../apis/logout.js';

const userContext = createContext();

const ContextProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [isLogin, setIsLogin] = useState(false);
     const [loading, setLoading] = useState(true);

     // Rehydrate session from localStorage and verify with backend httpOnly cookie
     useEffect(() => {
          const initAuth = async () => {
               try {
                    // 1. Initial quick restore from localStorage
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                         const parsed = JSON.parse(storedUser);
                         setUser(parsed);
                         setIsLogin(true);
                    }

                    // 2. Verify with backend using httpOnly cookie
                    const res = await getProfile();
                    if (res.ok && res.data?.user) {
                         setUser(res.data.user);
                         setIsLogin(true);
                         localStorage.setItem("user", JSON.stringify(res.data.user));
                    } else if (res.status === 401) {
                         setUser(null);
                         setIsLogin(false);
                         localStorage.removeItem("user");
                    }
               } catch (error) {
                    console.error("Auth verification failed:", error);
               } finally {
                    setLoading(false);
               }
          };

          initAuth();
     }, []);
     const updateUser = (userData) => {
          if (userData) {
               setUser(userData);
               setIsLogin(true);
               try {
                    localStorage.setItem("user", JSON.stringify(userData));
               } catch (e) {
                    console.error("Failed to save user in localStorage:", e);
               }
          } else {
               setUser(null);
               setIsLogin(false);
               try {
                    localStorage.removeItem("user");
               } catch (e) {
                    console.error("Failed to remove user from localStorage:", e);
               }
          }
     };

     // Logout handler
     const logout = async () => {
          try {
               await logout();
          } catch (e) {
               console.error("Logout error:", e);
          } finally {
               setUser(null);
               setIsLogin(false);
               try {
                    localStorage.removeItem("user");
               } catch (e) {
                    console.error("Failed to remove user from localStorage:", e);
               }
          }
     };

     return (
          <userContext.Provider
               value={{
                    user,
                    setUser: updateUser,
                    isLogin,
                    setIsLogin,
                    loading,
                    logout,
               }}
          >
               {children}
          </userContext.Provider>
     );
};

export const useUserContext = () => {
     return useContext(userContext);
};
export default ContextProvider;
