// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  limitNoti: any;
  setLimitNoti: React.Dispatch<React.SetStateAction<any>>;
}

const ChangeNotiContext = createContext<GlobalContextProps | undefined>(
  undefined
);

export const LimitNotiProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [limitNoti, setLimitNoti] = useState<any>(10);

  return (
    <ChangeNotiContext.Provider value={{ limitNoti, setLimitNoti }}>
      {children}
    </ChangeNotiContext.Provider>
  );
};

export const useLimitNoti = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(ChangeNotiContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.limitNoti, context.setLimitNoti];
};
