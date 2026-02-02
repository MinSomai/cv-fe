"use client";

import React, { useState } from "react";

import { Trash2 } from "lucide-react";

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
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const DeleteInterviewModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteInterview: string;
  pageRenderOperation: () => void;
}> = ({
  isModalOpen,
  setIsModalOpen,
  deleteInterview,
  pageRenderOperation,
}) => {
  const { user } = useAuth();
  const tError = useTranslations("errors");
  const [isNotShowAgain, setIsNotShowAgain] = useState(false);

  const handleCheckboxChange = () => {
    setIsNotShowAgain(!isNotShowAgain);
    if (user?.id) {
      let localData = JSON.parse(localStorage.getItem(user.id) || "{}");
      localData.deleteInterviewModalOpen = false;
      localStorage.setItem(user.id, JSON.stringify(localData));
    }
  };

  const handleDeleteClick = async () => {
    try {
      await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${deleteInterview}`,
        {},
        {
          method: "DELETE",
        }
      );
      setIsModalOpen(false);
      pageRenderOperation();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        } else {
          toast.error(tError("unknownError"));
        }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-[544px] inter">
        <DialogHeader>
          <span className="flex flex-row rounded-full bg-[#D92D20] bg-opacity-10 w-12 h-12 items-center justify-center">
            <Trash2 color="#D92D20" size={24} />
          </span>
          <DialogTitle className="text-[#0E131D] text-lg">
            Delete Interview
          </DialogTitle>
          <DialogDescription className="text-[#475467]">
            Are you sure you want to delete this interview? All associated
            information will also be permanently deleted. This action cannot be
            undone.
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
              className="shadow-[inset_0_1.5px_0_0px_#FFFFFF4D,inset_0_0_0_1px_#D92D20] bg-red-600 hover:bg-red-700"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInterviewModal;
