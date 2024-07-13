// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  socket: any;
  setSocket: any;
}

const GlobalContext = createContext<any>(undefined);

export const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<any>(null); // حالة لفتح/إغلاق النافذة

  return (
    <GlobalContext.Provider value={{ socket, setSocket }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.socket, context.setSocket];
};
