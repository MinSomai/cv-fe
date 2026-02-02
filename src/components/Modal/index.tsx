import React from "react";

import { cn } from "@/lib/utils";

const Modal: React.FC<{
  children?: React.ReactNode;
  className?: string;
  isVisible: boolean;
  onClose?: () => void;
}> = ({ children, className, isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClose) onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-[#101828] bg-opacity-70 backdrop-blur-md",
        className
      )}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export default Modal;
