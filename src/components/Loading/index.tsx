import React from "react";

export default function Loading({ text }: { text?: string }) {
  return (
    <div className="flex-col gap-4 w-full h-screen flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-[#22C55E] text-2xl animate-spin flex items-center justify-center border-t-[#22C55E] rounded-full"></div>
      </div>
      <span className="text-lg font-semibold text-secondary-foreground">
        {text}
      </span>
    </div>
  );
}
