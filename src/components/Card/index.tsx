"use client";

import React from "react";
import Image from "next/image";

import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  where?: string;
  picture: ({ colorful }: { colorful: boolean }) => React.ReactNode;
  title?: string;
  value: string;
  description?: string;
  defaultStyle: string;
  hoverStyle: string;
  isSelected?: boolean;
  handleClick: (title: string) => void;
}

export default function Card({
  where,
  picture,
  title,
  value,
  description,
  defaultStyle,
  isSelected,
  hoverStyle,
  handleClick,
}: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={() => handleClick(value)}
      className={cn(
        "relative flex flex-col justify-center grow items-center px-6 py-6 gap-6 rounded-3xl min-w-[240px] w-[229px] cursor-pointer bg-[#FBFBFB] outline-[#FBFBFB]",
        isSelected
          ? where === "onboarding"
            ? "bg-primary text-primary-foreground"
            : "outline outline-1 outline-primary"
          : defaultStyle,
        hoverStyle
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {picture &&
        picture({
          colorful: !!(isHovered || isSelected) && where === "onboarding",
        })}
      {where === "profile" && isSelected && (
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-500 rounded-full flex justify-center items-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      )}
      {where === "onboarding" && (
        <div className="flex flex-col items-center text-center max-w-full">
          <h3 className="text-xl font-semibold leading-[30px]">{title}</h3>
          <p className="text-xs text-center">{description}</p>
        </div>
      )}
    </div>
  );
}
