import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

type Size = "default" | "lg";

type Props = {
  size: Size;
  text: React.ReactNode;
  className?: string;
  isChecked: boolean;
  handleCheckbox: (checked: boolean) => void;
};

const inputVariants = cva(cn("rounded border border-gray-300 border-solid"), {
  variants: {
    size: {
      default: "size-4 rounded-sm",
      lg: "size-7 rounded-md",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const Checkbox: React.FC<Props> = memo(
  ({
    size = "default",
    text,
    className = "",
    isChecked = false,
    handleCheckbox,
  }) => {
    return (
      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleCheckbox(e.target.checked)}
          className={inputVariants({ size, className })}
        />
        <span className="text-sm font-medium text-accent-foreground">
          {text}
        </span>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export { Checkbox };
