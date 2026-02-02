import React, { useState } from "react";
import { CloudDownload, UserRoundPlus } from "lucide-react";

import InviteParticipantModal from "./Modal/InviteParticipantModal";
import AdminOverviewTable from "./Table/AdminOverviewTable";
import OverviewCard from "./Card/OverviewCard";
import { Button } from "@/components/Button";
import UploadParticipantListModal from "./Modal/UploadParticipantListModal";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
  const t = useTranslations("dashboard");
  const [isInviteParticipantModalOpen, setIsInviteParticipantModalOpen] =
    useState(false);
  const [
    isUploadParticipantListModalOpen,
    setIsUploadParticipantListModalOpen,
  ] = useState(false);
  const [inviteTableRender, setInviteTableRender] = useState(false);

  const handleinviteTableRender = () => {
    setInviteTableRender((prev) => !prev);
  };

  const handleInviteParticpantModal = () => {
    setTimeout(() => {
      setIsInviteParticipantModalOpen(true);
    }, 0);
  };

  const handleUploadParticipantListModal = () => {
    setTimeout(() => {
      setIsUploadParticipantListModalOpen(true);
    }, 0);
  };

  return (
    <>
      <div className="flex flex-col gap-8 scrollbar overflow-y-auto">
        <div className="flex flex-row gap-6">
          <OverviewCard
            title="Active participants"
            value={
              <span className="font-semibold text-[30px] text-[#181D27]">
                24&nbsp;
                <span className="text-sm text-[#CCCCCC] font-semibold">
                  /52 invited
                </span>
              </span>
            }
          />
          <OverviewCard
            title="Completed interviews"
            value={
              <span className="font-semibold text-[30px] text-[#181D27] flex-1">
                1420
              </span>
            }
          />
          <OverviewCard
            title={t("avgInterviewScore")}
            value={
              <span className="font-semibold text-[30px] text-[#181D27] flex-1">
                78%
              </span>
            }
            chipValue={5}
          />
          <OverviewCard
            title={t("avgImprovementRate")}
            value={
              <span className="font-semibold text-[30px] text-[#181D27] flex-1">
                12%
              </span>
            }
            chipValue={5}
          />
        </div>
        <div className="flex flex-col border border-[#F2F4F7] rounded-2xl">
          <div className="flex flex-row py-5 px-6 justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-[#181D27]">
                Overview
              </span>
              <span className="text-sm text-[#535862]">
                Keep track of your participants and their progress.
              </span>
            </div>
            <div className="flex flex-row gap-3 items-center">
              <Button
                variant="ghost"
                className="flex flex-row gap-2 items-center border border-[#F2F4F7] shadow-none"
                onClick={handleUploadParticipantListModal}
              >
                <CloudDownload />
                <span className="text-[#414651] text-sm font-semibold">
                  Import
                </span>
              </Button>
              <Button
                variant="defaultRing"
                className="flex flex-row gap-2 items-center"
                onClick={handleInviteParticpantModal}
              >
                <UserRoundPlus />
                <span className="text-sm">Add Participant</span>
              </Button>
            </div>
          </div>
          <AdminOverviewTable tableRender={inviteTableRender} />
        </div>
      </div>

      <InviteParticipantModal
        isModalOpen={isInviteParticipantModalOpen}
        setIsModalOpen={setIsInviteParticipantModalOpen}
        tableRenderOperation={handleinviteTableRender}
      />
      <UploadParticipantListModal
        isModalOpen={isUploadParticipantListModalOpen}
        setIsModalOpen={setIsUploadParticipantListModalOpen}
        tableRenderOperation={handleinviteTableRender}
      />
    </>
  );
}
