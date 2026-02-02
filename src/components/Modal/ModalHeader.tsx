import React from "react";

import { cn } from "@/lib/utils";
import Separator from "@/components/Separator";

const ModalHeader: React.FC<{
  className?: string;
  title?: string;
  description?: string;
  icon?: string | React.ReactNode;
}> = ({ className, title, description, icon }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-5">
        <span className="flex items-center">{icon}</span>
        <div className="flex flex-col pt-2.5">
          <span className="text-[18px] font-semibold">{title}</span>
          <span className="text-[14px]">{description}</span>
        </div>
      </div>
      <Separator className="pt-5" />
    </div>
  );
};

export default ModalHeader;
