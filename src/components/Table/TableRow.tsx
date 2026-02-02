import React, { act, useEffect } from "react";
import { TableColumn } from ".";
import { cn } from "@/lib/utils";
interface TableRowProps {
  data: Record<string, any>;
  columns: TableColumn[];
  striped?: boolean;
  hover?: boolean;
  active?: boolean;
  currentIndex?: boolean;
  className?: string;
  onClick?: (e: Event) => void;
  onDoubleClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
  data,
  columns,
  onClick,
  onDoubleClick,
  striped = false,
  hover = false,
  active = false,
  currentIndex = false,
  className,
}) => {
  // const currentRef = React.useRef<HTMLTableRowElement>(null);
  // useEffect(() => {
  //   if (currentIndex && currentRef.current) {
  //     currentRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });
  //   }
  // }, [currentIndex]);
  return (
    <tr
      className={cn(
        "text-xs text-paragraph duration-200",
        {
          "even:bg-tertiary-background": striped,
          "hover:bg-slate-50": hover,
          "bg-secondary/40": active,
          "outline outline-1 outline-primary": currentIndex,
        },
        className
      )} // @ts-ignore
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      // ref={currentRef}
    >
      {columns.map((col, index) => (
        <td
          key={index}
          className={cn("pl-6 text-nowrap border-b border-[#F2F4F7]")}
        >
          {col.render ? col.render(data) : data[col.key]}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
