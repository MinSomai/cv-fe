"use client";

import React, { useContext, createContext, useState } from "react";

// Define the context type
interface NavbarContextType {
  isNavbarClose: boolean;
  setIsNavbarClose: (value: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isNavbarClose, setIsNavbarClose] = useState<boolean>(false);

  return (
    <NavbarContext.Provider value={{ isNavbarClose, setIsNavbarClose }}>
      {children}
    </NavbarContext.Provider>
  );
};
