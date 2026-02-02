import React from "react";
import { useTranslations } from "next-intl";

import { Mail, Folder, Trash2, UserRound } from "lucide-react";

import { getGroupOptions } from "@/utils/data";
import { Input } from "@/components/Input";
import { Dropdown } from "@/components/Dropdown";
import { toast } from "sonner";
import { ParticipantType } from "./InviteParticipantModal";
import { rest } from "@/lib/rest";

type ParticipantProps = {
  id: number;
  name: string;
  email: string;
  group: string;
  groupData: string[];
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof ParticipantType, value: string) => void;
  setGroupOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

const Participant: React.FC<ParticipantProps> = ({
  id,
  name,
  email,
  group,
  groupData,
  onRemove,
  onChange,
  setGroupOptions,
}) => {
  const t = useTranslations("dashboard");
  const tDropdown = useTranslations("dropdown");
  const createNewGroup = async (option: string) => {
    if (option !== "" && groupData.includes(option) === false) {
      onChange(id, "group", option);
      await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/group`,
        {
          name: option,
        },
        {
          method: "POST",
        }
      );

      getGroupOptions().then((options) => {
        setGroupOptions(options.map((option) => option.name));
      });
      toast.success(`Group ${option} created successfully`);
    }
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <Input
        name={`name-${id}`}
        type="text"
        value={name}
        onChange={(e) => {
          onChange(id, "name", e.target.value);
        }}
        placeholder={t("enterParticipantFullName")}
        iconPosition="left"
        icon={<UserRound size={20} color="#717680" />}
        className="pl-12 w-full"
      />
      <Input
        name={`email-${id}`}
        type="email"
        value={email}
        onChange={(e) => {
          onChange(id, "email", e.target.value);
        }}
        placeholder={t("emailPlaceholderExample")}
        iconPosition="left"
        icon={<Mail size={20} color="#717680" />}
        className="pl-12 w-full"
      />
      <Dropdown
        name={`group-${id}`}
        type="text"
        options={groupData}
        selectedOption={group}
        onChange={(option) => onChange(id, "group", option as string)}
        onSelect={(option) => onChange(id, "group", option as string)}
        icon={
          <Folder
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
            color="#717680"
          />
        }
        isShowIcon={true}
        isGroupSelect={true}
        createNewGroup={createNewGroup}
        placeholder={t("selectOrCreateGroup")}
        containerClassName="mt-0"
        className="flex w-full pl-11 text-base leading-[44px] text-secondary-foreground bg-primary-foreground rounded-lg border border-gray-300 placeholder-[#667085] border-solid shadow-sm"
      />
      <div className="cursor-pointer" onClick={() => onRemove(id)}>
        <Trash2 size={20} color="#F04438" />
      </div>
    </div>
  );
};

export default Participant;
