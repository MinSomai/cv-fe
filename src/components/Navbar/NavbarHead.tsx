import React from "react";

import { cn } from "@/lib/utils";

type props = {
  children?: React.ReactNode;
  className?: string;
};

const NavbarHead: React.FC<props> = ({ children, className }) => {
  return <li className={cn(className)}>{children}</li>;
};

export default NavbarHead;
