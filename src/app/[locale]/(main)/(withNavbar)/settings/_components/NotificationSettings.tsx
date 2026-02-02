import React, { useEffect, useState } from "react";
import GroupButtons from "./GroupButtons";
import { rest } from "@/lib/rest";

type SelectedState = {
  none: boolean;
  inApp: boolean;
  email: boolean;
};

const Settings = ({ description }: { description: string }) => {
  const [selected, setSelected] = useState<SelectedState>({
    none: true,
    inApp: false,
    email: false,
  });

  const handleNoneClick = () => {
    setSelected({
      none: true,
      inApp: false,
      email: false,
    });
  };

  const handleCheckboxClick = (key: string) => {
    if (key === "inApp" || key === "email") {
      setSelected((prev) => {
        const newState = {
          ...prev,
          none: false,
          [key]: !prev[key as keyof SelectedState],
        };

        if (!newState.inApp && !newState.email) {
          newState.none = true;
        }

        return newState;
      });
    }
  };

  useEffect(() => {
    const updateNotificationSettings = async () => {
      const requestBody = {
        notifications: selected,
      };

      await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
        requestBody,
        {
          method: "POST",
        }
      );
    };

    updateNotificationSettings();
  }, [selected]);

  return (
    <div className="flex flex-row items-center justify-between">
      <span className="text-sm text-[#414651] font-medium">{description}</span>
      <div className="flex flex-row h-10">
        <GroupButtons
          handleNoneClick={handleNoneClick}
          handleCheckboxClick={handleCheckboxClick}
          selected={selected}
        />
      </div>
    </div>
  );
};

export default Settings;
