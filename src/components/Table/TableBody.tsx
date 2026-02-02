import React, { forwardRef } from "react";

import { TableColumn } from ".";
import TableRow from "./TableRow";

interface TableBodyProps {
  data: Array<Record<string, any>>;
  columns: TableColumn[];
  striped?: boolean;
  hover?: boolean;
  activeRows?: number[];
  lastSelected?: number;
  onRowClick?: (e: Event, data: any, index: number) => void;
  onRowDoubleClick?: (data: any, index: number) => void;
  className?: string;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (
    {
      data,
      columns,
      onRowClick,
      onRowDoubleClick,
      striped = false,
      hover = false,
      activeRows = [],
      lastSelected = 0,
      className,
      ...props
    },
    ref
  ) => (
    <tbody {...props} className={className} ref={ref}>
      {data.map((row, rowIndex) => (
        <TableRow
          key={rowIndex}
          data={row}
          columns={columns}
          striped={striped}
          hover={hover}
          active={activeRows.indexOf(rowIndex) > -1}
          // currentIndex={lastSelected === rowIndex}
          onClick={
            onRowClick ? (e: Event) => onRowClick(e, row, rowIndex) : undefined
          }
          onDoubleClick={
            onRowDoubleClick ? () => onRowDoubleClick(row, rowIndex) : undefined
          }
        />
      ))}
    </tbody>
  )
);

TableBody.displayName = "TableBody";

export default TableBody;
