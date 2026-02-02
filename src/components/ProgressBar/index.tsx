import React from "react";

import { cn } from "@/lib/utils";

type props = {
  label?: string;
  value?: number;
  size?: string;
  variant?: string;
  showValue?: boolean;
  className?: string;
};

const ProgressBar: React.FC<props> = ({
  label,
  value,
  size,
  variant,
  showValue,
  className,
}) => {
  return (
    <div className={cn("w-full rounded-lg", className)}>
      <div className="flex items-center justify-between inter">
        {showValue && (
          <div className="flex w-full text-[12px] justify-between">
            <i
              className={cn(
                "text-black font-semibold",
                variant === "destructive" && "text-primary-foreground"
              )}
            >
              {label}
            </i>
            <span
              className={cn(
                "text-primary font-bold",
                variant === "destructive" && "text-primary-foreground"
              )}
            >
              {value}%
            </span>
          </div>
        )}
      </div>
      <div
        className={cn(
          "w-full bg-transparent rounded-full",
          variant === "primary" && "h-2",
          variant !== "primary" &&
            "h-[14px] border-[1px] gap-0.5 border-[#CCD3FF]"
        )}
      >
        <div
          className={cn(
            "bg-primary h-full transition-all duration-500 ease-in-out",
            variant === "primary" && "rounded-full",
            variant === "secondary" &&
              "rounded-l-full border-[1px] border-[#DFE4FF]",
            variant === "secondary" &&
              value === 100 &&
              "rounded-full border-[1px] border-[#DFE4FF]",
            variant === "destructive" &&
              "rounded-l-full border-[1px] border-[#DFE4FF] bg-primary-foreground",
            variant === "destructive" &&
              value === 100 &&
              "rounded-full border-[1px] border-[#DFE4FF]  bg-primary-foreground"
          )}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
