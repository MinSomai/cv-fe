"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Modal from "@/components/Modal";
import ModalBody from "@/components/Modal/ModalBody";

import { toast } from "sonner";
import { Button } from "@/components/Button";
import { rest } from "@/lib/rest";
import { set } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";
import { HappyFace, HappySun } from "@/components/Icons/Icons";

interface Permissions {
  camera: boolean | null;
  microphone: boolean | null;
}

const AudioCamAllowModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const t = useTranslations("interview.audioCamModal");
  const tCommon = useTranslations("common");
  return (
    <Modal isVisible={isVisible} onClose={onClose} className="overflow-auto">
      <div
        className="bg-white w-[778px] rounded-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalBody>
          <div className="flex flex-col gap-6 py-8">
            <div className="flex items-center justify-center">
              <Image
                src="/interview-setup/allowmodal.svg"
                alt="allow"
                width={324}
                height={270}
              />
            </div>
            <div className="flex flex-col gap-4 text-center items-center">
              <span className="text-[30px] leading-[38px] font-semibold">
                {t("enableMicCamera")}
              </span>
              <span className="text-[16px] text-secondary-foreground leading-5 w-[550px]">
                {t("needAccess")}
              </span>
            </div>
            <div className="flex flex-row gap-3 justify-center mt-4">
              <Button
                type="button"
                variant="default"
                className="font-semibold"
                onClick={onClose}
              >
                {t("allow")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="font-semibold"
                onClick={onClose}
              >
                {tCommon("cancel")}
              </Button>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

const InterviewStartModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");
  const interviewType = searchParams.get("type");
  const t = useTranslations("interview.startModal");
  const tCommon = useTranslations("common");

  const handleStart = async () => {
    const res = await rest(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/check-plan-status?interviewType=${interviewType}`,
      {},
      { method: "GET" }
    );

    if (res.status === "success") {
      if (interviewType === "interview") {
        router.push(`/interview/${interviewId}?type=${interviewType}`);
      } else {
        // router.push("/careercounselling/waiting");
        // toast.info("Not supported yet! 😒");
        router.push(`/interview/${interviewId}?type=${interviewType}`);
      }
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="overflow-auto">
      <div
        className="bg-white w-[778px] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalBody>
          <div className="flex flex-col gap-6 py-8">
            <div className="flex items-center justify-center">
              <Image
                src={
                  interviewType === "interview"
                    ? "/interview-setup/startmodal.svg"
                    : "/interview-setup/counsellingready.svg"
                }
                alt=""
                width={193}
                height={113}
              />
            </div>
            <div className="flex flex-col text-center px-[112.5px]">
              <div className="flex flex-col gap-2">
                <h1 className="text-[24px]">
                  {interviewType === "interview"
                    ? t("readyToShine")
                    : t("getReadyForYour")}{" "}
                  <i className="playfair-display">
                    {interviewType === "interview"
                      ? t("setTheStage")
                      : t("careerConsultation")}
                  </i>
                  !
                </h1>
                <i className="text-secondary-foreground">
                  {interviewType === "interview"
                    ? t("beforeWeDiveIn")
                    : t("beforeWeBegin")}
                </i>
              </div>
              <div className="flex flex-col pt-8 gap-3 text-secondary-foreground">
                <div className="flex flex-row gap-2">
                  <div className="flex bg-primary rounded-full w-[26px] h-[26px] text-primary-foreground items-center justify-center">
                    <HappyFace />
                  </div>
                  <div className="flex-1 text-start text-sm">
                    <i className="font-semibold">
                      {interviewType === "interview"
                        ? t("findQuietSpace")
                        : t("minimizeDistractions")}
                    </i>{" "}
                    - {t("distractionFreeEnvironment")}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex bg-primary rounded-full w-[26px] h-[26px] text-primary-foreground items-center justify-center">
                    <HappySun />
                  </div>
                  <div className="flex-1 text-start text-sm">
                    <i className="font-semibold">
                      {interviewType === "interview" ? t("check") : t("optimize")}{" "}
                      {t("yourLighting")}
                    </i>{" "}
                    - {t("wellLitRoom")}
                  </div>
                </div>
              </div>
              <div className="flex flex-col pt-6">
                <Button
                  type="button"
                  variant="defaultRing"
                  className="font-semibold"
                  onClick={handleStart}
                >
                  {interviewType === "interview"
                    ? t("letsStart")
                    : t("startCareerConsultation")}
                </Button>
                <Button
                  variant="secondary"
                  className="font-semibold bg-transparent shadow-none text-[#0E131D]"
                  onClick={onClose}
                >
                  {t("goBack")}
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

const StartModal: React.FC<{
  handleShowModal: () => void;
}> = ({ handleShowModal }) => {
  const tError = useTranslations("errors");
  const t = useTranslations("interview.startModal");
  const tCommon = useTranslations("common");
  const [permissions, setPermissions] = useState<Permissions>({
    camera: null,
    microphone: null,
  });
  const [isAllowModalVisible, setIsAllowModalVisible] = useState(true);
  const [isStartModalVisibile, setIsStartModalVisibile] = useState(false);

  const handleAlllowModal = () => {
    setIsAllowModalVisible((prev) => !prev);
    handleShowModal();
  };

  const handleStartModal = () => {
    setIsStartModalVisibile((prev) => !prev);
    handleShowModal();
  };

  const requestMediaPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      setPermissions({
        camera: true,
        microphone: true,
      });

      setIsAllowModalVisible(false);
      setIsStartModalVisibile(true);

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      if (err instanceof DOMException) {
        toast.error(err.message);
      } else {
        toast.error(tError("permissionError"));
      }

      setPermissions({
        camera: false,
        microphone: false,
      });

      setIsAllowModalVisible(true);
      setIsStartModalVisibile(false);
    }
  }, [tError]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      requestMediaPermissions();
    } else {
      toast.error(tError("mediaDevicesNotSupported"));
    }
  }, [tError, requestMediaPermissions]);

  return (
    <div className="z-100">
      {permissions.camera === true && permissions.microphone === true ? (
        <InterviewStartModal
          isVisible={isStartModalVisibile}
          onClose={handleStartModal}
        />
      ) : (
        <AudioCamAllowModal
          isVisible={isAllowModalVisible}
          onClose={handleAlllowModal}
        />
      )}
    </div>
  );
};

export default StartModal;
