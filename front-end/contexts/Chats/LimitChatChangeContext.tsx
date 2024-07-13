// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  limitChat: any;
  setLimitChat: React.Dispatch<React.SetStateAction<any>>;
}

const ChangeNotiContext = createContext<GlobalContextProps | undefined>(
  undefined
);

export const LimitChatChangeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [limitChat, setLimitChat] = useState<any>(10);

  return (
    <ChangeNotiContext.Provider
      value={{ limitChat, setLimitChat }}
    >
      {children}
    </ChangeNotiContext.Provider>
  );
};

export const useLimitChatChange = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(ChangeNotiContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.limitChat, context.setLimitChat];
};
