import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Option } from "@/utils/types";

interface ChallengeSelectorProps {
  challenges: Option[];
  selectedChallenges: string[];
  className?: string;
  isAllSelected: boolean;
  onChallengeToggle: (challenge: string) => void;
  onSelectAll: () => void;
}

export default function ChallengeSelector({
  challenges,
  selectedChallenges,
  isAllSelected,
  className,
  onChallengeToggle,
  onSelectAll,
}: ChallengeSelectorProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-4 justify-center items-center w-full text-base font-medium text-black max-md:max-w-full",
        className
      )}
    >
      <Button
        type="button"
        onClick={onSelectAll}
        className={cn(
          "px-5 py-3 my-auto border border-muted bg-primary-foreground text-accent-foreground border-solid min-h-[48px] rounded-[32px] hover:bg-gray-100 cursor-pointer",
          {
            "border-indigo-600 bg-indigo-600 bg-opacity-10": !isAllSelected,
          }
        )}
      >
        Select All
      </Button>
      {challenges.map((challenge) => (
        <Button
          key={challenge.label}
          type="button"
          onClick={() => onChallengeToggle(challenge.id)}
          className={`flex gap-2 self-stretch px-5 py-3 my-auto bg-primary-foreground text-accent-foreground border border-solid min-h-[48px] rounded-[32px] hover:bg-gray-100 cursor-pointer ${
            selectedChallenges.includes(challenge.id)
              ? "border-indigo-600 bg-indigo-600 bg-opacity-10"
              : "border-gray-200"
          }`}
        >
          <span className="self-stretch my-auto">
            <span role="emoji">
              {challenge.label.substring(0, challenge.label.indexOf(" "))}
            </span>
            {challenge.label.substring(challenge.label.indexOf(" "))}
          </span>
        </Button>
      ))}
    </div>
  );
}
