import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import {
  profileCareerSelect,
  profileTrainingOptions,
  hourOptions,
  minuteOptions,
  weekOptions,
} from "@/utils/data";

import { Dropdown } from "@/components/Dropdown";
import { Option } from "@/utils/types";
import { CustomDatePicker } from "@/components/DatePicker";
import Card from "@/components/Card";
import ChallengeButton from "@/components/Button/ChallengeButton";
import { User } from "@/payload-types";

export const CareerCard = ({
  user,
  setPersona,
  isSaved,
}: {
  user: User;
  setPersona: (persona: string) => void;
  isSaved: boolean;
}) => {
  const [selected, setSelected] = useState<number>();
  const handleCardClick = (index: number) => {
    setSelected(index);
    setPersona(profileCareerSelect[index].value);
  };

  useEffect(() => {
    let persona = user?.onboarding?.persona!;
    if (persona === "student") setSelected(0);
    if (persona === "professional") setSelected(1);
    if (persona === "free") setSelected(2);
  }, [user, isSaved]);

  return (
    <div className="flex flex-wrap gap-5">
      {profileCareerSelect.map((career, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Card
            isSelected={selected === index}
            {...career}
            handleClick={() => handleCardClick(index)}
          />
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#181D27] font-semibold">
              {career.title}
            </span>
            <span className="text-xs text-[#535862]">{career.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const IndustryDropdown = ({
  user,
  industryOptions,
  setSaveIndustry,
  isSaved,
}: {
  user: User;
  industryOptions: Option[];
  setSaveIndustry: (industry: string) => void;
  isSaved: boolean;
}) => {
  const t = useTranslations("settings.profileSettings");
  const [industry, setIndustry] = useState<Option | string>("");

  const handleSelect = (option: Option | string) => {
    setIndustry(option);
    setSaveIndustry(typeof option === "string" ? option : option.label);
  };

  useEffect(() => {
    if (user?.onboarding?.industry) {
      const industry =
        (user.onboarding.industry as unknown as Option) || undefined;
      setIndustry(industry);
    } else {
      setIndustry("");
    }
  }, [user, isSaved]);
  return (
    <Dropdown
      type="text"
      name="industry"
      options={industryOptions}
      selectedOption={typeof industry === "string" ? industry : industry?.label}
      onSelect={handleSelect}
      onChange={(option) => setIndustry(option)}
      placeholder={t("selectOrEnterIndustry")}
      containerClassName="mt-0 w-[80%]"
      className="flex text-base pl-3.5 leading-[44px] font-medium text-[#181D27] bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
    />
  );
};
export const LevelDropdown = ({
  user,
  levelOptions,
  setSaveLevel,
  isSaved,
}: {
  user: User;
  levelOptions: Option[];
  setSaveLevel: (level: string) => void;
  isSaved: boolean;
}) => {
  const t = useTranslations("settings.profileSettings");
  const [level, setLevel] = useState<Option | string>("");

  const handleSelect = (option: Option | string) => {
    setLevel(option);
    setSaveLevel(typeof option === "string" ? option : option.label);
  };

  useEffect(() => {
    let level = user?.onboarding?.targetRole?.level!;
    if (level) {
      setLevel(level);
      setSaveLevel(typeof level === "string" ? level : level.label);
    } else {
      setLevel("");
    }
  }, [user, setSaveLevel, isSaved]);
  return (
    <Dropdown
      type="text"
      name="level"
      options={levelOptions}
      selectedOption={typeof level === "string" ? level : level?.label}
      onSelect={handleSelect}
      onChange={(option) => setLevel(option)}
      placeholder={t("level")}
      containerClassName="mt-0 w-[35%]"
      className="flex text-base leading-[44px] pl-3.5 font-medium text-[#181D27] bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm"
    />
  );
};

export const RoleDropdown = ({
  user,
  roleOptions,
  setSaveRole,
  isSaved,
}: {
  user: User;
  roleOptions: Option[];
  setSaveRole: (role: string) => void;
  isSaved: boolean;
}) => {
  const t = useTranslations("settings.profileSettings");
  const [role, setRole] = useState<Option | string>("");

  const handleSelect = (option: Option | string) => {
    setRole(option);
    setSaveRole(typeof option === "string" ? option : option.label);
  };

  useEffect(() => {
    let role = user?.onboarding?.targetRole?.role!;
    if (role) {
      setRole(role);
      setSaveRole(typeof role === "string" ? role : role.label);
    } else {
      setRole("");
    }
  }, [user, setSaveRole, isSaved]);
  return (
    <Dropdown
      type="text"
      name="role"
      options={roleOptions}
      selectedOption={typeof role === "string" ? role : role?.label}
      onSelect={handleSelect}
      onChange={(option) => setRole(option)}
      placeholder={t("selectOrEnterRole")}
      containerClassName="mt-0"
      className="flex text-base pl-3.5 leading-[44px] font-medium text-[#181D27] bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
    />
  );
};

export const ChallengeButtons = ({
  user,
  challenges,
  setSaveChallenges,
  isSaved,
}: {
  user: User;
  challenges: Option[];
  setSaveChallenges: (challenges: string[]) => void;
  isSaved: boolean;
}) => {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [isAll, setIsAll] = useState(true);

  const handleChallengeToggle = (challenge: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(challenge)
        ? prev.filter((c) => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleSelectAll = () => {
    if (isAll) {
      setSelectedChallenges(challenges.map((c) => c.id));
      setIsAll(false);
    } else {
      setSelectedChallenges([]);
      setIsAll(true);
    }
    setSaveChallenges(challenges.map((c) => c.id));
  };

  useEffect(() => {
    selectedChallenges.length === 11 ? setIsAll(false) : setIsAll(true);
    setSaveChallenges(selectedChallenges);
  }, [selectedChallenges, setSaveChallenges]);

  useEffect(() => {
    if (user?.onboarding?.challenge) {
      const challenge = user.onboarding.challenge as unknown as Option[];
      if (challenge.length === 11) setIsAll(false);
      setSelectedChallenges(challenge.map((c) => c.id));
    } else {
      setSelectedChallenges([]);
    }
  }, [user, isSaved]);

  return (
    <div className="w-[80%]">
      <ChallengeButton
        challenges={challenges}
        selectedChallenges={selectedChallenges}
        isAllSelected={isAll}
        onChallengeToggle={handleChallengeToggle}
        onSelectAll={handleSelectAll}
        className="justify-start"
      />
    </div>
  );
};

export const TrainingPath = ({
  user,
  setTrainingPath,
  isSaved,
}: {
  user: User;
  setTrainingPath: (path: string) => void;
  isSaved: boolean;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelected(index);
    setTrainingPath(index === 0 ? "structured" : "freestyle");
  };

  useEffect(() => {
    let trainingType = user?.onboarding?.trainingPlan?.trainingType!;
    if (trainingType === "structured") setSelected(0);
    if (trainingType === "freestyle") setSelected(1);
  }, [user, isSaved]);

  return (
    <div className="flex flex-row gap-6">
      {profileTrainingOptions?.map((option, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Card
            isSelected={selected === index}
            {...option}
            handleClick={() => handleCardClick(index)}
          />
          <div className="flex flex-col w-60">
            <span className="text-sm text-[#181D27] font-semibold">
              {option.title}
            </span>
            <span className="text-xs text-[#181D27]">{option.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PlanTime = ({
  user,
  setHour,
  setMinute,
  setWeek,
  isSaved,
}: {
  user: User;
  setHour: (hour: string) => void;
  setMinute: (minute: string) => void;
  setWeek: (week: string) => void;
  isSaved: boolean;
}) => {
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  const handleHourClick = (option: Option | string) => {
    setSelectedHour(typeof option === "string" ? option : option.toString());
    setHour(typeof option === "string" ? option : option.toString());
  };
  const handleMinuteClick = (option: Option | string) => {
    setSelectedMinute(typeof option === "string" ? option : option.toString());
    setMinute(typeof option === "string" ? option : option.toString());
  };
  const handleWeekClick = (option: Option | string) => {
    setSelectedWeek(typeof option === "string" ? option : option.toString());
    setWeek(typeof option === "string" ? option : option.toString());
  };

  useEffect(() => {
    if (
      typeof user?.onboarding?.trainingPlan?.hours === "number" &&
      typeof user?.onboarding?.trainingPlan?.mins === "number" &&
      typeof user?.onboarding?.trainingPlan?.per === "string"
    ) {
      setSelectedHour(user?.onboarding?.trainingPlan?.hours.toString() + "h");
      setSelectedMinute(user?.onboarding?.trainingPlan?.mins.toString() + "m");
      setSelectedWeek(user?.onboarding?.trainingPlan?.per);

      setHour(user?.onboarding?.trainingPlan?.hours.toString() + "h");
      setMinute(user?.onboarding?.trainingPlan?.mins.toString() + "m");
      setWeek(user?.onboarding?.trainingPlan?.per);
    } else {
      setSelectedHour("");
      setSelectedMinute("");
      setSelectedWeek("");
    }
  }, [user, setHour, setMinute, setWeek, isSaved]);

  return (
    <div className="flex flex-row w-[80%] gap-6">
      <Dropdown
        name="hour"
        type="number"
        options={hourOptions}
        selectedOption={selectedHour}
        onChange={(option) => setSelectedHour(option)}
        onSelect={handleHourClick}
        placeholder="00h"
        containerClassName="w-1/3"
        className="flex text-base pl-3.5 leading-[44px] font-medium text-[#181D27] bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
      />
      <Dropdown
        name="minute"
        type="number"
        options={minuteOptions}
        selectedOption={selectedMinute}
        onChange={(option) => setSelectedMinute(option)}
        onSelect={handleMinuteClick}
        placeholder="00m"
        containerClassName="w-1/3"
        className="flex text-base pl-3.5 leading-[44px] font-medium text-[#181D27] bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
      />
      <Dropdown
        name="week"
        type="text"
        options={weekOptions}
        selectedOption={selectedWeek}
        onChange={(option) => setSelectedWeek(option)}
        onSelect={handleWeekClick}
        placeholder="day"
        containerClassName="w-1/3"
        className="flex text-base pl-3.5 leading-[44px] font-medium text-accent-foreground bg-primary-foreground rounded-lg border border-gray-300 border-solid shadow-sm h-11"
      />
    </div>
  );
};

export const InterviewDate = ({
  user,
  setSaveInterviewDate,
  isSaved,
}: {
  user: User;
  setSaveInterviewDate: (date: Date | null) => void;
  isSaved: boolean;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSaveInterviewDate(date);
  };

  useEffect(() => {
    let date = user?.onboarding?.interviewDate;

    if (date) {
      setSelectedDate(new Date(date));
    } else {
      setSelectedDate(null);
    }
  }, [user, setSaveInterviewDate, isSaved]);
  return (
    <div className="flex flex-row w-[80%]">
      <CustomDatePicker
        where="profile"
        selectedDate={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};
