import React from "react";

import { cn } from "@/lib/utils";

export default function Seperator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="w-full h-[1px] bg-[#E4E7EC]" />
    </div>
  );
}
