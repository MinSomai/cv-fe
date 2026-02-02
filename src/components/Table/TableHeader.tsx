import React from "react";
import { ChevronsUpDown } from "lucide-react";

import { TableColumn } from ".";
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  columns: TableColumn[];
  className?: string;
  headerClick?: (key: string) => void;
}

const TableHeader = ({ columns, className, headerClick }: TableHeaderProps) => {
  return (
    <thead className={cn("", className)}>
      <tr>
        {columns.map((column, index) => (
          <th key={index} className={`text-left ${column.className}`}>
            <div
              className="flex items-center gap-1 text-[#717680] text-xs leading-[18px]"
              onClick={
                column.sortable && headerClick
                  ? () => headerClick(column.key)
                  : undefined
              }
            >
              <span
                className={cn("", {
                  "hover:text-accent-foreground": column.sortable,
                })}
              >
                {column.title}
              </span>
              {column.sortable && <ChevronsUpDown size={12} />}
            </div>
          </th>
        ))}
        <th></th>
      </tr>
    </thead>
  );
};

export default TableHeader;
