import React from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import ModalBody from "@/components/Modal/ModalBody";
import Separator from "@/components/Separator";

type Props = {
  isOpen: boolean;
  title: string;
  description: string;
  content: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
};

export default function UpgradeModal({
  isOpen,
  title,
  description,
  content,
  footer,
  onClose,
}: Props) {
  return (
    <Modal isVisible={isOpen} onClose={onClose}>
      <div className="w-[640px]" onClick={(e) => e.stopPropagation()}>
        <ModalBody>
          <div className="bg-white rounded-2xl">
            <Image
              src="/upgrademodalheader.png"
              alt="Upgrade Modal Header"
              width={640}
              height={208}
            />
            <div className="flex flex-col gap-5 px-6">
              <div className="flex flex-col gap-4">
                <span className="text-[#000000DE] font-semibold text-2xl">
                  {title}
                </span>
                <span className="w-full text-secondary-foreground text-base">
                  {description}
                </span>
              </div>
              {content}
            </div>
            <Separator className="mt-8" />
            {footer}
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
}
