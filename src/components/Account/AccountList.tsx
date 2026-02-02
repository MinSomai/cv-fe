"user client";

import React from "react";
import { useRouter } from "@/lib/navigation";
import { User, Settings, Plus, LogOut, Circle } from "lucide-react";

import { useAuth } from "@/providers/Auth";

import Account from ".";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export default function AccountList() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const ACCOUNT_LIST = [
    {
      username: user?.name,
      email: user?.email,
      avatar: user?.picture,
      showLogout: true,
    },
    // {
    //   username: "Olivia Rhye",
    //   email: "olivia@gmail.com",
    //   avatar: "/users/Olivia.jpg",
    //   showLogout: true,
    // },
  ];

  const viewSettingsClick = () => {
    router.push("/settings?value=My details");
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#E9EAEB]">
      {/* <div className="flex flex-col gap-0.5 p-1.5">
        <div
          className="flex flex-row p-2 gap-3 justify-between hover:bg-[#F3F4F6] cursor-pointer"
          onClick={viewSettingsClick}
        >
          <div className="flex flex-row gap-2">
            <Settings size={20} color="#535862" />
            <span className="text-[#414651] font-semibold text-sm">
              Account settings
            </span>
          </div>
        </div>
      </div> */}
      <div className="flex flex-col p-1.5 gap-0.5 border-t border-[#E9EAEB]">
        <span className="p-1.5 font-semibold text-[#535862] text-xs">
          Switch account
        </span>
        {ACCOUNT_LIST.map((account, index) => (
          <div
            key={index}
            className="flex flex-row justify-between items-center p-2 gap-3 cursor-pointer hover:bg-[#F3F4F6]"
          >
            <Account
              username={account.username}
              email={account.email}
              avatar={account.avatar || "/users/user.png"}
            />
            <div
              className={cn(
                "w-5 h-5 border border-[#D5D7DA] rounded-full flex justify-center items-center",
                {
                  "bg-[#7F56D9]":
                    account.username === user?.name &&
                    account.email === user?.email,
                }
              )}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="flex flex-col px-2 pt-0.5 pb-2 border-b rounded-b-2xl">
        <Button
          className="flex flex-row rounded-lg border border-[#D5D7DA] gap-1 justify-center items-center"
          variant="ghost"
        >
          <Plus size={20} color="#414651" />
          <span className="text-[#414651] font-semibold text-sm">
            Add account
          </span>
        </Button>
      </div> */}
      <div className="flex flex-col p-1.5 bg-[#FAFAFA]">
        <div className="flex flex-row p-2 gap-3 justify-between">
          <div className="flex flex-row gap-2 cursor-pointer" onClick={logout}>
            <LogOut size={20} className="text-[#535862]" />
            <span className="text-[#414651] font-semibold text-sm">
              Sign Out
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
