// context/GlobalContext.tsx
"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface GlobalContextProps {
  changeFriends: any;
  setChangeFriends: React.Dispatch<React.SetStateAction<any>>;
}

const ChangeNotiContext = createContext<GlobalContextProps | undefined>(
  undefined
);

export const ChangeFriendsProvider = ({ children }: { children: ReactNode }) => {
  const [changeFriends, setChangeFriends] = useState<any>(false);

  return (
    <ChangeNotiContext.Provider value={{ changeFriends, setChangeFriends }}>
      {children}
    </ChangeNotiContext.Provider>
  );
};

export const useChangeFriends = (): [
  any,
  React.Dispatch<React.SetStateAction<any>>
] => {
  const context = useContext(ChangeNotiContext);
  if (context === undefined) {
    throw new Error("useActiveSidebar must be used within a GlobalProvider");
  }
  return [context.changeFriends, context.setChangeFriends];
};
