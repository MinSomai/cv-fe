"use client";

import React from "react";
import { AuthProvider } from "@/providers/Auth";
import { SocketProvider } from "@/providers/SocketProvider";
import { NavbarProvider } from "@/providers/NavbarProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider api="rest">
      <SocketProvider>
        <NavbarProvider>{children}</NavbarProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Providers;
