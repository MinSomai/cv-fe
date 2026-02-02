import { cn } from "@/lib/utils";
import React from "react";

type DraggableButtonProps = {
  index: number;
  indexHidden?: boolean;
  title: string;
  description?: string;
  icon: React.ReactNode;
  className?: string;
};

export function DraggableButton({
  index,
  title,
  indexHidden,
  description,
  icon,
  className,
}: DraggableButtonProps) {
  return (
    <div
      className={cn(
        "flex flex-row gap-5 p-3 rounded-2xl items-center justify-start border border-primary",
        className
      )}
    >
      <div className="w-6 h-6">
        {!indexHidden && (
          <div className="w-full h-full text-center rounded-full bg-primary text-white flex items-center justify-center">
            {index + 1}
          </div>
        )}
      </div>
      <div className="w-10 h-10">{icon}</div>
      <span className="text-[#000000DE] text-base suisse-intl-medium">
        {title}
      </span>
    </div>
  );
}
