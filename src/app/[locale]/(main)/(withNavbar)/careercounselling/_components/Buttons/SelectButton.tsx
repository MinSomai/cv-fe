import React from "react";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type props = {
  className?: string;
  icon?: ({ colorful }: { colorful: boolean }) => React.ReactNode;
  title?: string;
  value?: string;
  description?: string;
  backgroundImage?: string;
  type?: "button" | "radio" | "checkbox";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const SelectButton: React.FC<props> = ({
  title,
  value,
  description,
  className,
  icon,
  type,
  selected = false,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl items-center p-4 bg-primary-foreground bg-no-repeat bg-right-top outline outline-1 outline-[#C3CCFF] cursor-pointer",
        {
          "outline-primary": selected,
          "opacity-50": disabled,
          "hover:outline-primary": !disabled,
        },
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex w-full">
        <div
          className={cn(
            "flex w-6 h-6 rounded-full border border-[#C3CCFF] items-center justify-center",
            {
              "bg-primary border-none": selected,
            }
          )}
        >
          {selected && <Check size={14} color="white" />}
        </div>
      </div>
      <div className="w-[56px] h-[56px] items-center">
        {icon && icon({ colorful: selected })}
      </div>
      <div className="flex flex-col text-center">
        <span
          className={cn("text-base suisse-intl-medium", {
            "text-primary": selected,
          })}
        >
          {title}
        </span>
        <span
          className={cn("text-sm suisse-intl-regular", {
            "text-primary": selected,
          })}
        >
          {description}
        </span>
      </div>
    </div>
  );
};
export default SelectButton;
