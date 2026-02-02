import React from "react";
import { cn } from "@/lib/utils";

type props = {
  children?: React.ReactNode;
  className?: string;
};

const Navbar: React.FC<props> = ({ children, className }) => {
  return <ul className={cn("inter", className)}>{children}</ul>;
};

export default Navbar;
