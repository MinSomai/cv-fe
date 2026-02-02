import React from "react";
import Separator from "@/components/Separator";

export default function Profilesettings({
  title,
  description,
  body,
}: {
  title: string;
  description: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Separator />
      <div className="flex flex-row gap-8">
        <div className="flex flex-col w-[280px]">
          <span className="text-sm font-semibold text-[#414651]">{title}</span>
          <span className="text-sm text-[#535862] w-full">{description}</span>
        </div>
        {body}
      </div>
    </div>
  );
}
