import React from "react";

import { ChevronRight, EllipsisVertical, ArrowUp } from "lucide-react";
import Image from "next/image";

export default function Header({
  imgsrc,
  username,
}: {
  imgsrc: string;
  username: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-1 items-center">
        <div className="w-7 h-7">
          <Image
            src={imgsrc}
            alt="User Avatar"
            className="w-full h-full rounded-full"
            width={28}
            height={28}
            unoptimized
          />
        </div>
        <span className="px-2 py-1 font-semibold text-sm text-[#535862]">
          {username}
        </span>
        <ChevronRight size={16} color="#D5D7DA" />
        <span className="px-2 py-1 bg-[#FAFAFA] font-semibold text-sm text-[#414651] rounded-md">
          Dashboard
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold text-[#181D27]">
          Welcome, {username}
        </span>
        <span className="text-[#535862]">
          Here&apos;s an overview of your activity.
        </span>
      </div>
    </div>
  );
}
