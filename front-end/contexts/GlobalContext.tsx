// context/GlobalContext.tsx
'use client'
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  activeSidebar: boolean;
  setActiveSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false);

  return (
    <GlobalContext.Provider value={{ activeSidebar, setActiveSidebar }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useActiveSidebar = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.activeSidebar, context.setActiveSidebar];
};
