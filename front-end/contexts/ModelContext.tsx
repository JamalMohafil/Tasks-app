// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // حالة لفتح/إغلاق النافذة

  return (
    <GlobalContext.Provider value={{ modalIsOpen, setModalIsOpen }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useModelContext = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.modalIsOpen, context.setModalIsOpen];
};
