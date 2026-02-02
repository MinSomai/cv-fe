"use client";

import React from "react";

import AdminDashboard from "./_components/AdminDashboard";
import UserDashboard from "./_components/UserDashboard";
import Header from "./_components/Header";

import { useAuth } from "@/providers/Auth";

export default function Dashboard() {
  const { user } = useAuth();

  return user ? (
    <div className="flex flex-col p-8 gap-8 h-screen inter">
      <div className="flex flex-col gap-8 h-full">
        <Header
          imgsrc={user?.picture || "/users/user.png"}
          username={user?.name}
        />
        {user?.entity?.role === "owner" ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
