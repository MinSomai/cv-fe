"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/Dropdown";
import { Button } from "@/components/Button";
import { Option } from "@/utils/types";
import { ClipboardListCheck } from "@/components/Icons/Icons";

import Modal from "@/components/Modal";
import ModalHeader from "@/components/Modal/ModalHeader";
import ModalBody from "@/components/Modal/ModalBody";

const RoleModal: React.FC<{
  defaultLevel: Option | undefined;
  defaultRole: Option | undefined;
  defaultIndustry: Option | undefined;
  isVisible: boolean;
  className?: string;
  industryOptions: Option[];
  levelOptions: Option[];
  roleOptions: Option[];
  setInterviewRoleLevel: (level: Option) => void;
  setInterviewRole: (role: Option) => void;
  setInterviewIndustry: (industry: Option) => void;
  setInterviewJobDescription: (jobDescription: string) => void;
  setInterviewCompanyInfo: (companyInfo: string) => void;
  onClose?: () => void;
}> = ({
  defaultLevel,
  defaultRole,
  defaultIndustry,
  isVisible,
  industryOptions,
  levelOptions,
  roleOptions,
  setInterviewRoleLevel,
  setInterviewRole,
  setInterviewIndustry,
  setInterviewJobDescription,
  setInterviewCompanyInfo,
  onClose,
}) => {
  const t = useTranslations("interview.roleModal");
  const tCommon = useTranslations("common");
  const [industry, setIndustry] = useState<Option | string>("");
  const [level, setLevel] = useState<Option | string>("");
  const [role, setRole] = useState<Option | string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [companyInfo, setCompanyInfo] = useState<string>("");

  const handleJobDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(event.target.value);
  };

  const handleCompanyInfo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompanyInfo(event.target.value);
  };

  const handleSave = () => {
    if (typeof level === "object" && level !== null) {
      setInterviewRoleLevel(level as Option);
    }
    if (typeof role === "object" && role !== null) {
      setInterviewRole(role as Option);
    }
    if (typeof industry === "object" && industry !== null) {
      setInterviewIndustry(industry as Option);
    }
    setInterviewJobDescription(jobDescription);
    setInterviewCompanyInfo(companyInfo);
    onClose?.();
  };

  useEffect(() => {
    if (defaultIndustry) setIndustry(defaultIndustry);
    if (defaultLevel) setLevel(defaultLevel);
    if (defaultRole) setRole(defaultRole);
  }, [defaultIndustry, defaultLevel, defaultRole]);

  return (
    <Modal isVisible={isVisible} onClose={onClose} className="overflow-auto">
      <div
        className="bg-white w-[576px] rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title="Role Details"
          description="Update your role info & details here."
          icon={<ClipboardListCheck />}
        />
        <ModalBody>
          <div className="flex flex-col mt-5 gap-5">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-1.5 w-[179px]">
                <label className="text-sm font-medium leading-none text-accent-foreground">
                  Seniority*
                </label>
                <Dropdown
                  type="text"
                  name="level"
                  options={levelOptions}
                  selectedOption={
                    typeof level === "string" ? level : level?.label
                  }
                  onSelect={(option) => setLevel(option)}
                  onChange={(option) => setLevel(option)}
                  placeholder={t("selectLevel")}
                  containerClassName="mt-0"
                  className="flex text-base leading-[44px] pl-3.5 font-medium text-accent-foreground bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm"
                />
              </div>
              <div className="flex flex-col flex-1 gap-1.5 w-[179px]">
                <label className="text-sm font-medium leading-none text-accent-foreground">
                  {t("yourRole")}
                </label>
                <Dropdown
                  type="text"
                  name="role"
                  options={roleOptions}
                  selectedOption={typeof role === "string" ? role : role?.label}
                  onSelect={(option) => setRole(option)}
                  onChange={(option) => setRole(option)}
                  placeholder={t("selectRole")}
                  containerClassName="mt-0"
                  className="flex text-base pl-3.5 leading-[44px] font-medium text-accent-foreground bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium leading-none text-accent-foreground">
                {t("industry")}
              </label>
              <Dropdown
                type="text"
                name="role"
                options={industryOptions}
                selectedOption={
                  typeof industry === "string" ? industry : industry?.label
                }
                onSelect={(option) => setIndustry(option)}
                onChange={(option) => setIndustry(option)}
                placeholder="Select a role"
                containerClassName="mt-0"
                className="flex text-base pl-3.5 leading-[44px] font-medium text-accent-foreground bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium leading-none text-accent-foreground">
                {t("jobDescriptionOptional")}
              </label>
              <textarea
                className="w-full h-32 p-3.5 border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md resize-none shadow-[0px_1px_2px_0px_#1018280D]"
                placeholder={t("enterDescription")}
                onChange={handleJobDescription}
                value={jobDescription}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium leading-none text-accent-foreground mb-1.5">
                {t("companyInfoOptional")}
              </label>
              <textarea
                className="w-full h-32 p-3.5 border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md resize-none shadow-[0px_1px_2px_0px_#1018280D]"
                placeholder={t("enterDescription")}
                onChange={handleCompanyInfo}
                value={companyInfo}
              />
            </div>
          </div>
          <div className="flex flex-row items-center mt-8 gap-3">
            <Button
              type="button"
              variant="secondary"
              className={cn(
                "font-semibold w-full bg-transparent shadow-none text-[#0E131D] border border-gray-300"
              )}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="w-full" onClick={handleSave}>
              Save
            </Button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};
export default RoleModal;
