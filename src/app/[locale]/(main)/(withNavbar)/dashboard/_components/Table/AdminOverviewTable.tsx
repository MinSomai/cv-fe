"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ListFilter, Search } from "lucide-react";

import ActiveParticipantsTable from "./ActiveParticipantsTable";
import InvitedParticipantsTable from "./InvitedParticipantsTable";

import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function AdminOverviewTable({
  tableRender,
}: {
  tableRender: boolean;
}) {
  const t = useTranslations("dashboard");
  const [participants, setParticipants] = React.useState("Active");

  const handleParticipants = (participants: string) => {
    setParticipants(participants);
  };

  return (
    <div className="flex flex-col border-t border-[#F2F4F7]">
      <div className="flex flex-row px-6 py-3 justify-between">
        <div className="flex flex-row border border-[#F2F4F7] rounded-lg">
          <Button
            className={cn(
              "rounded-r-none border-r",
              participants === "Active" && "bg-[#F2F4F7]"
            )}
            variant="ghost"
            onClick={() => handleParticipants("Active")}
          >
            <span
              className={cn(
                "text-[#414651] text-sm font-semibold",
                participants === "Active" && "text-[#252B37]"
              )}
            >
              Active Participants
            </span>
          </Button>
          <Button
            className={cn(
              "rounded-l-none",
              participants === "Invited" && "bg-[#F2F4F7]"
            )}
            variant="ghost"
            onClick={() => handleParticipants("Invited")}
          >
            <span
              className={cn(
                "text-[#414651] text-sm font-semibold",
                participants === "Invited" && "text-[#252B37]"
              )}
            >
              Invited Participants
            </span>
          </Button>
        </div>
        <div className="flex flex-row gap-3">
          <div>
            <Input
              name="search"
              type="text"
              icon={<Search size={20} color="#717680" />}
              placeholder={t("searchForParticipant")}
              iconPosition="left"
              className="pl-10 items-center border border-[#F2F4F7]"
            />
          </div>
          <div>
            <Button
              className="flex flex-row gap-1 rounded-lg border border-slate-300  shadow-none items-center"
              variant="ghost"
            >
              <ListFilter size={20} />
              <span className="text-sm text-[#414651]">Filters</span>
            </Button>
          </div>
        </div>
      </div>
      {participants === "Active" ? (
        <ActiveParticipantsTable />
      ) : (
        <InvitedParticipantsTable tableRender={tableRender} />
      )}
    </div>
  );
}
