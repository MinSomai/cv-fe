import React, { useState } from "react";
import Image from "next/image";

import { BadgeCheck } from "lucide-react";
import { useAuth } from "@/providers/Auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <div className="w-full h-[83px] pt-2 bg-gradient-to-b from-[#A6C0E2] to-[#C2C2EE] rounded-xl" />
      <div className="flex flex-rol -mt-6 gap-6">
        <div className="flex flex-row items-center justify-between pl-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-white rounded-full p-1">
              <Image
                src={user?.picture || "/users/user.png"}
                alt="User Avatar"
                className="w-full h-full rounded-full border border-black border-opacity-[8%]"
                width={96}
                height={96}
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 flex items-center justify-center">
              <BadgeCheck className="text-white" size={30} fill="#2E90FA" />
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-8">
          <span className="font-semibold text-[24px] text-[#181D27] leading-8">
            {user?.name}
          </span>
          <span className="text-[16px] text-[#535862] leading-6">
            {user?.email}
          </span>
        </div>
      </div>
    </div>
  );
}
