import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Modal/Dialog";

export const PrivacyPolicyModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isModalOpen, setIsModalOpen }) => {
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-[544px] inter">
        <DialogHeader>
          <DialogTitle className="text-[#0E131D] text-lg">
            Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-[#475467]">
            <p className="text-base font-normal leading-6 text-[#475467]">
              This Privacy Policy describes how we collect, use, and share your
              personal information when you use our website. By using our
              website, you consent to the collection, use, and sharing of your
              personal information as described in this Privacy Policy.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
