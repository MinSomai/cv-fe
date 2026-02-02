import React from "react";

import { cn } from "@/lib/utils";

type props = {
  children?: React.ReactNode;
  className?: string;
};

const NavbarBody: React.FC<props> = ({ children, className }) => {
  return <li className={cn("space-y-1 px-4", className)}>{children}</li>;
};

export default NavbarBody;
