import React, { useState } from "react";
import { Star, Pen, Target, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Industry, Level, Role } from "@/payload-types";

import Chip from "@/components/Chip";
import { ClipboardListCheck } from "../Icons/Icons";

const RoleCard: React.FC<{
  level: Level;
  role: Role;
  industry: Industry;
  jobDescription?: string;
  companyInfo?: string;
  className?: string;
  onClick?: () => void;
  onEditclick?: () => void;
}> = ({
  level,
  role,
  industry,
  jobDescription,
  companyInfo,
  className,
  onClick,
  onEditclick,
}) => {
  const [showMoreJob, setShowMoreJob] = useState(false);
  const [showMoreCompany, setShowMoreCompany] = useState(false);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <div
      className={cn(
        "flex flex-col p-6 gap-4 rounded-3xl border border-[#F0F3FF] w-full max-w-[500px] bg-primary-foreground select-none",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <ClipboardListCheck />
        <span className="flex gap-1 cursor-pointer" onClick={onEditclick}>
          <Pen size={20} />
          Edit
        </span>
      </div>
      <div className="text-2xl font-semibold">{role && role.label}</div>
      {jobDescription && (
        <div>
          <span className="font-semibold">Job Description</span>:
          <span className="text-secondary-foreground">
            {" "}
            {showMoreJob ? jobDescription : truncateText(jobDescription, 150)}
          </span>
          {jobDescription.length > 100 && (
            <button
              className="text-blue-500 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreJob(!showMoreJob);
              }}
            >
              {showMoreJob ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}
      {companyInfo && (
        <div>
          <span className="font-semibold">Company Info</span>:
          <span className="text-secondary-foreground">
            {" "}
            {showMoreCompany ? companyInfo : truncateText(companyInfo, 150)}
          </span>
          {companyInfo.length > 100 && (
            <button
              className="text-blue-500 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreCompany(!showMoreCompany);
              }}
            >
              {showMoreCompany ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex w-full">
          <Chip
            icon={<Star size={20} fill="#465FF1" className="text-primary" />}
            label={"Level: " + (level && level.label)}
            className="py-2 rounded-full bg-[#FAFAFA] text-[#414651]"
          />
        </div>
        <div className="flex w-full">
          <Chip
            icon={
              <Target size={20} strokeWidth={2.5} className="text-primary" />
            }
            label={
              "Industry: " +
              (industry &&
                (industry.label.length > 27
                  ? industry.label.substring(0, 27) + "..."
                  : industry.label))
            }
            className="py-2 rounded-full bg-[#FAFAFA] text-[#414651]"
          />
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
