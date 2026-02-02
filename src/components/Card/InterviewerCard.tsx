import React from "react";

import { cn } from "@/lib/utils";

import Image from "next/image";
import InterviwerChip from "../Chip/InterviewerChip";
import { CircleCheck, Lock } from "lucide-react";
import Link from "next/link";

type props = {
  name?: string;
  photo?: string;
  title?: string;
  skillSet?: object;
  className?: string;
  variant?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const InterviewerCard: React.FC<props> = ({
  name,
  photo,
  title,
  skillSet,
  className,
  selected,
  disabled = false,
  onClick,
}) => {
  return (
    <div className="relative group">
      <div
        className={cn(
          "flex flex-col rounded-[30px] w-full cursor-pointer border-2 border-[#FAFAFA] grayscale hover:grayscale-0 hover:border-primary",
          { "grayscale-0 border-primary": selected },
          { "opacity-50 cursor-not-allowed pointer-events-none": disabled },
          className
        )}
        onClick={onClick}
      >
        <div className="relative h-[444px]">
          <Image
            src={photo || ""}
            alt={name || ""}
            width={320}
            height={444}
            className="w-full h-full object-cover rounded-[30px]"
            unoptimized
          />
          <div
            className={cn(
              "absolute flex flex-col items-center justify-center gap-[22px] bottom-0 text-white w-full p-[13px]"
            )}
          >
            <div className="flex flex-col items-center">
              <span className="text-[29px]">{name}</span>
              <i className="playfair-display">{title}</i>
            </div>
            <div className="w-full flex flex-row gap-2 flex-wrap justify-center">
              {Object.entries(skillSet || {}).map(([skill, value]) => (
                <InterviwerChip key={skill} label={skill} value={value} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black bg-opacity-20 backdrop-blur-[1.5px]">
          <div className="flex flex-col items-center gap-3 p-4 text-white">
            <Lock size={24} />
            <Link
              href="/settings?value=Plans"
              className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Upgrade to unlock
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default InterviewerCard;
