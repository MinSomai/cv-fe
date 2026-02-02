import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import Profilesettings from "../profileSettings";
import { Button } from "@/components/Button";
import { Option } from "@/utils/types";
import {
  getIndustryOptions,
  getLevelOptions,
  getRoleOptions,
  getGoalOptions,
  getInterviewChallenges,
} from "@/utils/data";
import {
  CareerCard,
  IndustryDropdown,
  RoleDropdown,
  LevelDropdown,
  ChallengeButtons,
  TrainingPath,
  PlanTime,
  InterviewDate,
} from "../profileSettings/Components";
import { rest } from "@/lib/rest";
import { useAuth } from "@/providers/Auth";
import { User } from "@/payload-types";
import { toast } from "sonner";

export default function ProfileTab() {
  const t = useTranslations("settings.profileTab");
  const tCommon = useTranslations("common");
  const tError = useTranslations("errors");
  const { user, fetchMe } = useAuth();
  const [industryOptions, setIndustryOptions] = useState<Option[]>([]);
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [goalOptions, setGoalOptions] = useState<Option[]>([]);
  const [challenges, setChallenges] = useState<Option[]>([]);

  const [persona, setPersona] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [challengesSelected, setChallengesSelected] = useState<string[]>([]);
  const [trainingPath, setTrainingPath] = useState<string>("");
  const [planHour, setPlanHour] = useState<string>("");
  const [planMinute, setPlanMinute] = useState<string>("");
  const [planWeek, setPlanWeek] = useState<string>("");
  const [interviewDate, setInterviewDate] = useState<Date | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleCancel = () => {
    setIsSaved(!isSaved);
  };

  const settings = [
    {
      title: t("status"),
      description: t("statusDescription"),
      body: (
        <div className="flex-1">
          {user && (
            <CareerCard user={user} setPersona={setPersona} isSaved={isSaved} />
          )}
        </div>
      ),
    },
    {
      title: t("industry"),
      description: t("industryDescription"),
      body: (
        <div className="flex-1">
          {user && (
            <IndustryDropdown
              user={user}
              industryOptions={industryOptions}
              setSaveIndustry={setIndustry}
              isSaved={isSaved}
            />
          )}
        </div>
      ),
    },
    {
      title: t("role"),
      description: t("roleDescription"),
      body: (
        <div className="flex flex-row flex-1">
          <div className="flex flex-row w-[80%] gap-6">
            {user && (
              <LevelDropdown
                user={user}
                levelOptions={levelOptions}
                setSaveLevel={setLevel}
                isSaved={isSaved}
              />
            )}
            {user && (
              <RoleDropdown
                user={user}
                roleOptions={roleOptions}
                setSaveRole={setRole}
                isSaved={isSaved}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      title: t("interviewChallenges"),
      description: t("interviewChallengesDescription"),
      body: (
        <div className="flex-1 mb-2">
          {user && (
            <ChallengeButtons
              user={user}
              challenges={challenges}
              setSaveChallenges={setChallengesSelected}
              isSaved={isSaved}
            />
          )}
        </div>
      ),
    },
  ];

  const saveChanges = async () => {
    try {
      let profileObject: User["onboarding"] = {
        targetRole: {
          level: levelOptions.find(
            (option) => option.label.toLowerCase() === level.toLowerCase()
          )?.id,
          role: roleOptions.find(
            (option) => option.label.toLowerCase() === role.toLowerCase()
          )?.id,
        },
        // trainingPlan: {
        //   hours: planHour,
        //   mins: planMinute,
        //   per:
        //     planWeek === ""
        //       ? "day"
        //       : (planWeek as "day" | "week" | "month" | null | undefined),
        // },
      };

      if (persona) {
        profileObject.persona = persona as
          | "student"
          | "professional"
          | "free"
          | null
          | undefined;
      }
      if (industry) {
        profileObject.industry = industryOptions.find(
          (option) => option.label.toLowerCase() === industry.toLowerCase()
        )?.id;
      }
      if (trainingPath) {
        profileObject.trainingPlan = {
          ...profileObject.trainingPlan,
          trainingType: trainingPath as
            | "structured"
            | "freestyle"
            | null
            | undefined,
        };
      }
      if (interviewDate) {
        profileObject.interviewDate = interviewDate.toISOString();
      }
      if (challengesSelected) {
        profileObject.challenge = challengesSelected;
      }

      const req = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/setting`,
        {
          onboarding: profileObject,
        },
        {
          method: "POST",
        }
      );
      await fetchMe();
      toast.success(t("profileUpdated"));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error(tError("requestRuntimeError"));
      }
    }
  };

  useEffect(() => {
    getIndustryOptions().then((options) => {
      setIndustryOptions(options);
    });
    getRoleOptions().then((options) => {
      setRoleOptions(options);
    });
    getLevelOptions().then((options) => {
      setLevelOptions(options);
    });
    getGoalOptions().then((options) => {
      setGoalOptions(options);
    });
    getInterviewChallenges().then((options) => {
      setChallenges(options.reverse());
    });
  }, []);

  return (
    <div className="flex flex-col gap-6 px-[6px]">
      <div className="flex flex-row justify-between py-4 sticky top-11 z-10 bg-white">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{t("title")}</span>
          <span className="text-sm text-[#535862]">
            {t("description")}
          </span>
        </div>
        <div className="flex flex-row gap-3">
          <Button
            variant="secondary"
            className="text-secondary-foreground font-semibold bg-white border hover:bg-[#FAFAFA] hover:text-secondary-foreground"
            onClick={handleCancel}
          >
            {tCommon("cancel")}
          </Button>
          <Button onClick={saveChanges} className="font-semibold">
            {t("saveChanges")}
          </Button>
        </div>
      </div>
      {settings.map((setting, index) => (
        <Profilesettings
          key={index}
          title={setting.title}
          description={setting.description}
          body={setting.body}
        />
      ))}
    </div>
  );
}
