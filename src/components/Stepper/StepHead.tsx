import React from "react";

import { cn } from "@/lib/utils";
import ProgressBar from "../ProgressBar";

const StepHead: React.FC<{
  className?: string;
  activeStep?: number;
  activePage?: string;
  labels: string[];
}> = ({ className, activeStep = 0, activePage = "", labels = [] }) => {
  return (
    <>
      {activePage === "interviewsetup" ? (
        <div className="h-20 w-full flex items-center justify-center border">
          <div className={cn("flex items-center justify-between", className)}>
            {labels.map((label, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 flex items-center justify-center border rounded-full",
                    {
                      "border-primary bg-primary text-white":
                        index + 1 < activeStep,
                      "border-primary text-primary": index + 1 == activeStep,
                      "border-[#CCD2DD] text-[#CCD2DD]": index + 1 > activeStep,
                    }
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm pl-2 ${
                    index + 1 < activeStep
                      ? "text-primary font-semibold"
                      : index + 1 == activeStep
                      ? "font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {index < labels.length - 1 && (
                  <div
                    className={cn("h-px bg-gray-300 w-8 mx-4", {
                      "bg-primary": index + 1 < activeStep,
                    })}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        activeStep <= 12 && (
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-row justify-between">
              <span className="suisse-intl-regular">Career Assessment</span>
              <span className="text-gray-500">
                {activeStep <= 12 ? activeStep : 12} of 12
              </span>
            </div>
            <ProgressBar
              value={((activeStep <= 12 ? activeStep : 12) / 12) * 100}
              variant="primary"
              className="bg-[#F2F4F7]"
            />
          </div>
        )
      )}
    </>
  );
};
export default StepHead;
