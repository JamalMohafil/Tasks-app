// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";



const ChangeNotiContext = createContext<any>(
  undefined
);

export const ChangeWorkpacesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [changeWorkSpaces, setChangeWorkSpaces] = useState<any>(false);

  return (
    <ChangeNotiContext.Provider
      value={{ changeWorkSpaces, setChangeWorkSpaces }}
    >
      {children}
    </ChangeNotiContext.Provider>
  );
};

export const useChangeWorkSpaces = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(ChangeNotiContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.changeWorkSpaces, context.setChangeWorkSpaces];
};
