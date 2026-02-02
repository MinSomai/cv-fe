import { cn } from "@/lib/utils";
import React from "react";

export default function DecorateButton({
  icon,
  name,
  className,
}: {
  icon: string;
  name: string;
  className: string;
}) {
  return (
    <button
      className={cn(
        "absolute px-3 py-1.5 md:px-5 md:py-4 text-base font-medium bg-primary-foreground border border-primary rounded-full w-fit",
        className
      )}
    >
      <span className="text-white" role="emoji">
        {icon}
      </span>
      <span className="leading-6 text-black">{name}</span>
    </button>
  );
}
