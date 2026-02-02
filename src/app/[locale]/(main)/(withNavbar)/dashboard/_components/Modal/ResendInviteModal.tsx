"use client";

import React, { useState } from "react";

import { Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Modal/Dialog";
import { useAuth } from "@/providers/Auth";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { rest } from "@/lib/rest";

const ResendInviteModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inviteParticipant: string;
}> = ({ isModalOpen, setIsModalOpen, inviteParticipant }) => {
  const { user } = useAuth();
  const [isNotShowAgain, setIsNotShowAgain] = useState(false);

  const handleCheckboxChange = () => {
    setIsNotShowAgain(!isNotShowAgain);
    if (user?.id) {
      let localData = JSON.parse(localStorage.getItem(user.id) || "{}");
      localData.inviteModalOpen = false;
      localStorage.setItem(user.id, JSON.stringify(localData));
    }
  };

  const handleResendOnClick = async () => {
    await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/invites/create`,
      {
        email: inviteParticipant,
      },
      {
        method: "POST",
      }
    );
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-[544px] inter">
        <DialogHeader>
          <span className="flex flex-row rounded-full bg-[#DC6803] bg-opacity-10 w-12 h-12 items-center justify-center">
            <Send color="#DC6803" size={24} />
          </span>
          <DialogTitle className="text-[#0E131D] text-lg">
            Resend invitation
          </DialogTitle>
          <DialogDescription className="text-[#475467]">
            Are you sure you want to resend the invitation to{" "}
            <span className="text-primary">Elena Ukrakova</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="fle flex-row pt-4 items-center">
          <div>
            <Checkbox
              size="default"
              text="Don't show again"
              isChecked={isNotShowAgain}
              handleCheckbox={handleCheckboxChange}
            />
          </div>
          <div className="flex flex-row gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-[#F2F4F7] shadow-none"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="defaultRing"
              onClick={handleResendOnClick}
            >
              Resend invitation
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResendInviteModal;
