import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheck, Crown } from "lucide-react";
import Link from "next/link";

type props = {
  className?: string;
  icon?: ({ colorful }: { colorful: boolean }) => React.ReactNode;
  title?: string;
  value?: string;
  description?: string;
  backgroundImage?: string;
  type?: "button" | "radio" | "checkbox";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CardButton: React.FC<props> = ({
  title,
  value,
  description,
  className,
  backgroundImage,
  icon,
  type,
  selected = false,
  disabled = false,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-4 bg-primary-foreground bg-no-repeat bg-right-top outline outline-1 outline-[#F0F3FF] cursor-pointer",
        { "outline-primary": selected },
        !disabled && backgroundImage,
        !disabled && "hover:outline-primary",
        disabled && "opacity-70",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex flex-col gap-4">
        <span className="flex flex-row justify-between">
          <div className="w-10 h-10">
            {icon && icon({ colorful: selected })}
          </div>
          {selected && type === "checkbox" && (
            <CircleCheck color="white" fill="#465FF1" size={24} />
          )}
        </span>
        <h1 className="text-[24px] leading-[29px] font-semibold">{title}</h1>
        <span className="text-[16px] inter">{description}</span>
      </div>
      {disabled && (
        <>
          <Crown className="text-purple-600 p-4 absolute top-0 right-0" size={54} />
          <Link
            href="/settings?value=Plans"
            className="absolute text-primary px-2 py-1 right-0 underline bottom-0 text-sm"
          >
            Upgrade
          </Link>
        </>
      )}
    </div>
  );
};

export default CardButton;
