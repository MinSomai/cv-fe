import type { LucideIcon } from "lucide-react";
import React from "react";

interface KeyInsightCardProps {
  icon?: LucideIcon;
  iconColor?: string;
  iconSize?: number;
  title?: string;
  titleColor?: string;
  category?: string;
  description?: string;
  content?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export default function KeyInsightCard({
  icon: Icon,
  iconColor = "#465ff1",
  iconSize = 24,
  title,
  titleColor = "black",
  category,
  description,
  content,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}: KeyInsightCardProps) {
  // Create style objects for dynamic colors
  const iconStyle = {
    color: iconColor,
  };

  const titleStyle = {
    color: titleColor,
    fontWeight: 600,
  };

  const contentStyle = {
    color: "rgba(71, 84, 103, 1)",
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-4 h-full ${className}`}
    >
      <div className={`mb-4 flex items-start ${headerClassName}`}>
        {Icon && (
          <Icon className="mr-3 h-fit" style={iconStyle} size={iconSize} />
        )}
        <div className="w-full">
          {(title || category) && (
            <div className="flex justify-between items-center gap-2">
              {title && (
                <h4 className="font-semibold" style={titleStyle}>
                  {title}
                </h4>
              )}
              {category && (
                <span className="inline-flex rounded-full bg-[#f0f3ff] px-2 py-1 text-xs text-[#465ff1]">
                  {category}
                </span>
              )}
            </div>
          )}
          <div className={`mt-2 ${bodyClassName}`} style={contentStyle}>
            {content
              ? content
              : description && (
                  <p dangerouslySetInnerHTML={{ __html: description }}></p>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}
