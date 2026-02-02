import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export default function Logo({ isNavbarClose }: { isNavbarClose: boolean }) {
  return (
    <div
      className={cn("flex items-center w-full", {
        "justify-center": isNavbarClose,
      })}
    >
      {isNavbarClose ? (
        <div className="flex w-6 h-6">
          <Image
            src="/logo_ai.png"
            alt="logo_ai"
            width={158}
            height={132}
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="w-36 h-10">
          <Image
            src="/logo1.png"
            alt="logo"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
