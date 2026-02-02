import React from "react";
import { EllipsisVertical, ArrowUp, ArrowDown } from "lucide-react";

import Chip from "@/components/Chip";
import { cn } from "@/lib/utils";

export default function OverviewCard({
  title,
  value,
  chipValue,
}: {
  title: string;
  value: React.ReactNode;
  chipValue?: number;
}) {
  return (
    <div className="flex flex-col p-5 rounded-2xl border border-[#F2F4F7] w-full h-full justify-between gap-2">
      <div className="flex flex-row justify-between">
        <span className="text-sm text-[#535862]">{title}</span>
        <EllipsisVertical size={20} color="#A4A7AE" />
      </div>
      <div className="flex flex-row justify-between gap-4">
        {value}
        {chipValue && (
          <div className="flex items-end justify-end">
            <Chip
              icon={
                chipValue >= 0 ? (
                  <ArrowUp size={12} color="#067647" />
                ) : (
                  <ArrowDown size={12} color="#B42318" />
                )
              }
              label={chipValue + "%"}
              variant={chipValue >= 0 ? "secondary" : "accent"}
              className={cn("border rounded-full gap-1 px-1.5", {
                "border-[#ABEFC6]": chipValue >= 0,
                "border-[#f5b1ad]": chipValue < 0,
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
