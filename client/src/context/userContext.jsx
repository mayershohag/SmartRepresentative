"use client";
import { createContext, useContext, useState } from "react";

const userContext = createContext();

const ContextProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     return (
          <userContext.Provider value={{ user, setUser }}>
               {children}
          </userContext.Provider>
     );
};

export const useUserContext = () => {
     return useContext(userContext);
};
export default ContextProvider;
