import React from "react";

import NavbarComponent from "./_components/NavbarComponent";

export default function InterviewSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <NavbarComponent />
      <main className="flex-1 items-center justify-center">{children}</main>
    </div>
  );
}
