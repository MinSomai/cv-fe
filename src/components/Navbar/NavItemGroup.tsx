import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type props = {
  title: string;
  icon?: React.ReactNode;
  opened?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const NavItemGroup: React.FC<props> = ({
  title,
  icon,
  opened,
  children,
  className,
}) => {
  return (
    <div>
      <details
        className="group [&_summary::-webkit-details-marker]:hidden"
        open={opened}
      >
        <summary className="group flex items-center justify-between rounded-lg px-[20px] py-2 text-link hover:bg-gray-100 hover:text-gray-700">
          <div className="flex items-center gap-2">
            {icon}
            <span className={cn("text-sm font-bold", className)}>
              {" "}
              {title}{" "}
            </span>
          </div>

          {/* <span className="shrink-0 transition duration-300 group-open:-rotate-180">
            <ChevronDown size={20} />
          </span> */}
        </summary>

        <ul className="mt-2 space-y-1 pl-7">{children}</ul>
      </details>
    </div>
  );
};
export default NavItemGroup;
