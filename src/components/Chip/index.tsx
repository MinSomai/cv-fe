import React from "react";

import { cn } from "@/lib/utils";

type props = {
  variant?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  secondIcon?: React.ReactNode;
  className?: string;
  labelClassName?: string;
};

const Chip: React.FC<props> = ({
  variant,
  icon,
  label,
  className,
  secondIcon,
  labelClassName,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1",
        variant === "primary" && "bg-[#DFE4FF] text-primary",
        variant === "secondary" && "bg-[#E7F9F2] text-[#027848]",
        variant === "destructive" && "bg-[#FAF6EA] text-[#B14608]",
        variant === "accent" && "bg-[#FEF3F2] text-[#B42318]",
        className
      )}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {label && <span className={cn("text-sm", labelClassName)}>{label}</span>}
      {secondIcon && <span className="text-sm">{secondIcon}</span>}
    </div>
  );
};

export default Chip;
