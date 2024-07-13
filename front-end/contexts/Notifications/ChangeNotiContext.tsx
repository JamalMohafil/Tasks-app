// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  changeNoti: any;
  setChangeNoti: React.Dispatch<React.SetStateAction<any>>;
}

const ChangeNotiContext = createContext<GlobalContextProps | undefined>(
  undefined
);

export const ChangeNotiProvider = ({ children }: { children: ReactNode }) => {
  const [changeNoti, setChangeNoti] = useState<any>(false);

  return (
    <ChangeNotiContext.Provider value={{ changeNoti, setChangeNoti }}>
      {children}
    </ChangeNotiContext.Provider>
  );
};

export const useChangeNoti = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(ChangeNotiContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.changeNoti, context.setChangeNoti];
};
