// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  sendMessageChange: any;
  setSendMessageChange: React.Dispatch<React.SetStateAction<any>>;
}

const ChangeNotiContext = createContext<GlobalContextProps | undefined>(
  undefined
);

export const SendMessageChangeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sendMessageChange, setSendMessageChange] = useState<any>(false);

  return (
    <ChangeNotiContext.Provider value={{ sendMessageChange, setSendMessageChange }}>
      {children}
    </ChangeNotiContext.Provider>
  );
};

export const useSendMessageChange = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(ChangeNotiContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.sendMessageChange, context.setSendMessageChange];
};
