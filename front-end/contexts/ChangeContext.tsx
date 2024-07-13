// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  changeAuth: any;
  setChangeAuth: React.Dispatch<React.SetStateAction<any>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const ChangeAuthProvider = ({ children }: { children: ReactNode }) => {
  const [changeAuth, setChangeAuth] = useState<any>(false);

  return (
    <GlobalContext.Provider value={{ changeAuth, setChangeAuth }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useChangeAuth = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.changeAuth, context.setChangeAuth];
};
