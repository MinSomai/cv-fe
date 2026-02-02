import React from "react";

import { cn } from "@/lib/utils";

type props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const FeatureCard: React.FC<props> = ({
  title,
  description,
  children,
  className,
  variant,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-secondary-foreground">{description}</p>
      <div className="flex items-center justify-between">{children}</div>
      <div className="flex flex-row gap-2 font-bold">
        <a>Dismiss</a>
        <a className="text-primary">Upgrade Plan</a>
      </div>
    </div>
  );
};

export default FeatureCard;
