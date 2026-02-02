import React from "react";

import { cn } from "@/lib/utils";

const ModalBody: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div>{children}</div>;
};

export default ModalBody;
