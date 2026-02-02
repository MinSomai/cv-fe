import React from "react";

import { cn } from "@/lib/utils";
import Chip from "@/components/Chip/";

type props = {
  title: string;
  icon?: React.ReactNode;
  badge?: { title?: React.ReactNode; variant?: string; className?: string };
  selected?: boolean;
  className?: string;
  isNavbarClose?: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<props> = ({
  title,
  icon,
  badge,
  selected,
  className,
  isNavbarClose,
  onClick,
}) => {
  return (
    <div
      className={cn("text-sm text-muted-foreground cursor-pointer", {
        "bg-[#FAFAFA] rounded-[6px]": selected,
      })}
      onClick={onClick}
    >
      <div className="block rounded-lg px-2 py-2 text-sm text-link hover:bg-[#FAFAFA] hover:text-gray-700">
        <div
          className={cn(
            "flex flex-row gap-2",
            !isNavbarClose ? "justify-between" : "justify-center"
          )}
        >
          <div className="flex items-center gap-2">
            {icon}
            {!isNavbarClose && (
              <span
                className={cn(
                  "text-base font-semibold",
                  selected ? "text-[#0E131D]" : "text-[#475467]"
                )}
              >
                {" "}
                {title}{" "}
              </span>
            )}
          </div>
          {!isNavbarClose && (
            <Chip
              label={badge?.title}
              variant={badge?.variant}
              className={badge?.className}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavItem;
