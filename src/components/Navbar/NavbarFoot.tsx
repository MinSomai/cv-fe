import React from "react";

import { cn } from "@/lib/utils";

type props = {
  children?: React.ReactNode;
  className?: string;
};

const NavbarFoot: React.FC<props> = ({ children, className }) => {
  return <li className={cn("mt-14 px-4", className)}>{children}</li>;
};

export default NavbarFoot;
