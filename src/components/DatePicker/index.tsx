import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  where?: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
};

interface CustomDateInputProps {
  where?: string;
  value?: string;
  onClick?: () => void;
}

const CustomDateInput = forwardRef<HTMLDivElement, CustomDateInputProps>(
  ({ where, value, onClick }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-row items-center justify-between w-full p-2 border-gray-300 cursor-pointer",
          where === "profile" && "border rounded-lg",
          !value && "text-gray-400"
        )}
        onClick={onClick}
        ref={ref}
      >
        {where === "onboarding" ? (
          <span>{value || "dd mm"}</span>
        ) : (
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-500" />
            <span>{value || "Select an upcoming interview time"}</span>
          </div>
        )}

        <ChevronDown />
      </div>
    );
  }
);

CustomDateInput.displayName = "CustomDateInput";

export const CustomDatePicker: React.FC<Props> = ({
  where,
  selectedDate,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "text-center w-full",
        where === "onboarding" ? "md:text-6xl text-4xl" : ""
      )}
    >
      <div className="w-full">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          dateFormat={where === "onboarding" ? "dd MMM" : "dd MMM, yyyy"}
          customInput={<CustomDateInput where={where} />}
          calendarClassName="custom-calendar"
          popperClassName="custom-popper"
          wrapperClassName="custom-wrapper"
          minDate={new Date()}
          showDisabledMonthNavigation
        />
      </div>
    </div>
  );
};
