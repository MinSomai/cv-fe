import { cn } from "@/lib/utils";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

export interface TableColumn {
  title: string;
  sortable?: boolean;
  editable?: boolean;
  key: string; // key in the data items
  className?: string;
  width?: number | string;
  render?: (data: any) => React.ReactNode;
}

export interface TableProps {
  data: Array<Record<string, any>>;
  columns: TableColumn[];
  className?: string;
  defaultSort?: string;
  striped?: boolean;
  hover?: boolean;
  stickyHeader?: boolean;
  showHeader?: boolean;
  infiniteLoad?: number; // for lazy loading
  activeRows?: number[];
  lastSelected?: number;
  onRowClick?: (e: Event, data: any, index: number) => void;
  onRowDoubleClick?: (data: any, index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>, data: any[]) => void;
  onHeaderClick?: (key: string) => void;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  className,
  defaultSort,
  striped,
  hover,
  stickyHeader,
  showHeader,
  infiniteLoad,
  activeRows,
  lastSelected,
  onRowClick,
  onRowDoubleClick,
  onKeyDown,
  onHeaderClick,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <table className="table-auto">
        {showHeader && (
          <TableHeader
            columns={columns}
            className="border-b border-[#F2F4F7]"
            headerClick={onHeaderClick}
          />
        )}
        <TableBody
          data={data}
          columns={columns}
          hover={hover}
          onRowClick={onRowClick}
        />
      </table>
    </div>
  );
};

export default Table;
