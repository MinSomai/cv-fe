"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "sonner";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  getIndustryOptions,
  getLevelOptions,
  getRoleOptions,
  getInterviewer,
  levelSelect,
  questionSelect,
  getLanguageOptions,
} from "@/utils/data";
import { Industry, Level, Role, User } from "@/payload-types";
import { Option, Interviewer, Language } from "@/utils/types";
import { useAuth } from "@/providers/Auth";
import { rest } from "@/lib/rest";
import {
  getPlanStatus,
} from "@/lib/utils";

import { SwiperNavButtons } from "./Swiper/SwiperNavButtons";
import { LanguageSelector } from "@/components/Dropdown/LanguageSelector";
import Stepper from "@/components/Stepper";
import RoleCard from "@/components/Card/RoleCard";
import CardButton from "@/components/Button/CardButton";
import InterviewerCard from "@/components/Card/InterviewerCard";
import RoleModal from "./Modal/RoleModal";
import StartModal from "./Modal/StartModal";
import "./InterviewSetupCreate.css";

const RoleComponent: React.FC<{
  interviewRoleLevel: Level | undefined;
  interviewRole: Role | undefined;
  interviewIndustry: Industry | undefined;
  interviewjobDescription: string;
  interviewcompanyInfo: string;
  footer: React.ReactNode;
  industryOptions: Option[];
  levelOptions: Option[];
  roleOptions: Option[];
  isModalVisible: boolean;
  setInterviewRoleLevel: (level: Option) => void;
  setInterviewRole: (role: Option) => void;
  setInterviewIndustry: (industry: Option) => void;
  setJobDescription: (description: string) => void;
  setCompanyInfo: (info: string) => void;
  onModalToggle: () => void;
}> = ({
  interviewRoleLevel,
  interviewRole,
  interviewIndustry,
  interviewjobDescription,
  interviewcompanyInfo,
  footer,
  industryOptions,
  levelOptions,
  roleOptions,
  isModalVisible,
  setInterviewRoleLevel,
  setInterviewRole,
  setInterviewIndustry,
  setJobDescription,
  setCompanyInfo,
  onModalToggle,
}) => {
  return (
    <div className="flex flex-col items-center mt-8 w-full gap-8">
      <RoleCard
        level={interviewRoleLevel as Level}
        role={interviewRole as Level}
        industry={interviewIndustry as Level}
        jobDescription={interviewjobDescription}
        companyInfo={interviewcompanyInfo}
        onEditclick={onModalToggle}
      />
      <RoleModal
        defaultLevel={interviewRoleLevel}
        defaultRole={interviewRole}
        defaultIndustry={interviewIndustry}
        setInterviewRoleLevel={setInterviewRoleLevel}
        setInterviewRole={setInterviewRole}
        setInterviewIndustry={setInterviewIndustry}
        setInterviewJobDescription={setJobDescription}
        setInterviewCompanyInfo={setCompanyInfo}
        isVisible={isModalVisible}
        onClose={onModalToggle}
        industryOptions={industryOptions}
        roleOptions={roleOptions}
        levelOptions={levelOptions}
      />
      {footer}
    </div>
  );
};

const LevelComponent: React.FC<{
  footer: React.ReactNode;
  selectedCard: number | undefined;
  planStatus: string;
  onSelectCard: (index: number) => void;
}> = ({ footer, selectedCard, planStatus, onSelectCard }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-row gap-[17px] mt-8">
        {levelSelect.map((level, index) => (
          <CardButton
            key={index}
            backgroundImage={level.backgroundImage}
            icon={() =>
              typeof level.icon === "function" ? level.icon() : level.icon
            }
            title={level.title}
            type="radio"
            description={level.description}
            className="w-[300px]"
            selected={selectedCard === index}
            disabled={planStatus.includes("free") && index !== 0}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      <div className="w-[378px]">{footer}</div>
    </div>
  );
};

const QuestionsComponent: React.FC<{
  footer: React.ReactNode;
  selectedQuestions: number[];
  planStatus: string;
  onSelectQuestion: (index: number) => void;
}> = ({
  footer,
  selectedQuestions,
  planStatus,
  onSelectQuestion,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[17px] mt-8">
        {questionSelect.map((question, index) => (
          <CardButton
            key={index}
            icon={({ colorful }: { colorful: boolean }) =>
              typeof question.icon === "function"
                ? question.icon({ colorful })
                : question.icon
            }
            title={question.title}
            description={question.description}
            type="checkbox"
            className="w-[258px] gap-[17px]"
            selected={selectedQuestions.includes(index)}
            disabled={planStatus.includes("free") && index !== 0}
            onClick={() => onSelectQuestion(index)}
          />
        ))}
      </div>
      <div className="w-[378px]">{footer}</div>
    </div>
  );
};

const LanguageComponent: React.FC<{
  footer: React.ReactNode;
  selectedLanguage: Language;
  languageOptions: Language[];
  planStatus: string;
  onSelectLanguage: (language: Language) => void;
}> = ({
  footer,
  selectedLanguage,
  languageOptions,
  planStatus,
  onSelectLanguage,
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-8">
      <div className="flex w-full gap-[17px] mt-8">
        <LanguageSelector
          language={selectedLanguage}
          languageOptions={languageOptions}
          onSelectLanguage={onSelectLanguage}
        />
      </div>
      <div className="w-[378px]">{footer}</div>
    </div>
  );
};

export const InterviewerComponent: React.FC<{
  interviewerOptions: Interviewer[];
  footer: React.ReactNode;
  selectedInterviewer: number | undefined;
  onSelectInterviewer: (index: number) => void;
  showModals: boolean;
  planStatus?: string;
  handleShowModals: () => void;
}> = ({
  interviewerOptions,
  footer,
  selectedInterviewer,
  onSelectInterviewer,
  showModals,
  planStatus,
  handleShowModals,
}) => {
  return (
    <div className="flex flex-col w-full max-w-[1122px] items-center justify-center mt-[38px] gap-14">
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={3}
        grabCursor={true}
        scrollbar={{ draggable: true }}
        spaceBetween={32}
        coverflowEffect={{
          rotate: 0,
        }}
        initialSlide={selectedInterviewer}
        // onActiveIndexChange={(swiper) =>
        //   onSelectInterviewer(swiper.activeIndex)
        // }
      >
        {interviewerOptions.map((interviewer, index) => (
          <SwiperSlide key={index}>
            <InterviewerCard
              key={index}
              name={interviewer.name}
              photo={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${interviewer.photo}`}
              title={interviewer.title}
              skillSet={interviewer.skillSet}
              selected={selectedInterviewer === index}
              disabled={planStatus?.includes("free") && index !== 0}
              onClick={() => onSelectInterviewer(index)}
            />
          </SwiperSlide>
        ))}
        {showModals && <StartModal handleShowModal={handleShowModals} />}
        <SwiperNavButtons />
      </Swiper>
      <div className="w-full px-14">{footer}</div>
    </div>
  );
};

const InterviewSetupCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");
  const t = useTranslations("interview.setup");
  const tError = useTranslations("errors");

  const { user } = useAuth();
  const [interviewroleLevel, setInterviewRoleLevel] = useState<Level>();
  const [interviewRole, setInterviewRole] = useState<Role>();
  const [interviewIndustry, setInterviewIndustry] = useState<Industry>();
  const [jobDescription, setJobDescription] = useState<string>("");
  const [companyInfo, setCompanyInfo] = useState<string>("");

  const [industryOptions, setIndustryOptions] = useState<Option[]>([]);
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [interviewers, setInterviwers] = useState<Interviewer[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [interviewLevelSelected, setInterviewLevelSelected] =
    useState<number>(0);
  const [questionsSelected, setQuestionsSelected] = useState<number[]>([0]);
  const [languageSelected, setLanguageSelected] = useState<Language>({
    id: "",
    label: "en",
    key: "gb",
    value: "English",
  });
  const [interviewerSelected, setInterviewerSelected] = useState<number>(0);
  const [showModals, setShowModals] = useState(false);

  const next = async () => {
    if (currentStep === 5) {
      try {
        if (
          interviewLevelSelected !== undefined &&
          questionsSelected.length > 0 &&
          interviewerSelected !== undefined &&
          interviewroleLevel !== undefined &&
          interviewRole !== undefined &&
          interviewIndustry !== undefined &&
          languageSelected !== undefined
        ) {
          if (getPlanStatus(user as User) === "freeTrial_expired") {
            toast.error(t("freeTrialExpired"));
            router.push("/settings?value=Billing");
            return;
          } else if (getPlanStatus(user as User) === "subscription_expired") {
            toast.error(t("subscriptionExpired"));
            router.push("/settings?value=Billing");
            return;
          }
          const req = await rest(
            interviewId
              ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`
              : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews`,
            {
              level: interviewroleLevel.id,
              role: interviewRole.id,
              industry: interviewIndustry.id,
              jobDescription: jobDescription,
              companyInfo: companyInfo,
              interviewLevel: levelSelect[interviewLevelSelected].title,
              focus: questionsSelected.map(
                (index) => questionSelect[index].title
              ),
              interviewer: interviewers[interviewerSelected].id,
              language: languageSelected.id,
            },
            { method: interviewId ? "PATCH" : "POST" }
          );
          router.push(`/interviewsetup/create?id=${req.doc.id}&type=interview`);
          setShowModals(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          toast.error(tError("requestRuntimeError"));
        }
      }
    } else {
      if (currentStep === 2 && interviewLevelSelected === undefined)
        toast.info(t("selectLevel"));
      else if (currentStep === 3 && questionsSelected.length === 0)
        toast.info(t("selectQuestions"));
      else if (currentStep === 4) {
        setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev));
      } else setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev));
    }
  };

  const prev = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleShowModals = () => setShowModals((prev) => !prev);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const handleLevelSelect = (index: number) => setInterviewLevelSelected(index);

  const handleQuestionSelect = (index: number) => {
    setQuestionsSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleLanguageSelect = (language: Language) => {
    setLanguageSelected(language);
  };

  const handleInterviewerSelect = (index: number) =>
    setInterviewerSelected(index);

  useEffect(() => {
    const getCreatedInterviews = async () => {
      const res = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/interviews/${interviewId}`,
        {},
        {
          method: "GET",
        }
      );

      setInterviewLevelSelected(
        levelSelect.findIndex((level) => level.title === res.interviewLevel)
      );
      setQuestionsSelected(
        res.focus.map((focus: string) =>
          questionSelect.findIndex((question) => question.title === focus)
        )
      );
      setInterviewerSelected(
        interviewers.findIndex(
          (interviewer) => interviewer.id === res.interviewer.id
        )
      );
      setLanguageSelected(
        languageOptions.find(
          (language) => language.id === res.language.id
        ) as Language
      );
      setCurrentStep(5);
    };

    if (interviewId) getCreatedInterviews();
  }, [interviewId, interviewers, languageOptions]);

  useEffect(() => {
    setInterviewRoleLevel(user?.onboarding?.targetRole?.level as Level);
    setInterviewRole(user?.onboarding?.targetRole?.role as Role);
    setInterviewIndustry(user?.onboarding?.industry as Industry);
    const userLanguage = languageOptions.find(
      (language) => language.label === user?.language
    );
    if (userLanguage) setLanguageSelected(userLanguage);
  }, [user, languageOptions]);

  useEffect(() => {
    if (currentStep === 5 && languageSelected) {
      getInterviewer({ language: languageSelected.label }).then((res) => {
        setInterviwers(res);
      });
    }
  }, [currentStep, languageSelected]);

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
    getLanguageOptions().then((options) => {
      setLanguageOptions(options);
    });
  }, []);

  const steps = [
    {
      label: t("roleStep.label"),
      body: ({ footer }: { footer: React.ReactNode }) => (
        <RoleComponent
          interviewRoleLevel={interviewroleLevel}
          setInterviewRoleLevel={setInterviewRoleLevel}
          interviewRole={interviewRole}
          setInterviewRole={setInterviewRole}
          interviewIndustry={interviewIndustry}
          setInterviewIndustry={setInterviewIndustry}
          interviewjobDescription={jobDescription}
          setJobDescription={setJobDescription}
          interviewcompanyInfo={companyInfo}
          setCompanyInfo={setCompanyInfo}
          footer={footer}
          industryOptions={industryOptions}
          levelOptions={levelOptions}
          roleOptions={roleOptions}
          isModalVisible={isModalVisible}
          onModalToggle={toggleModal}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold" dangerouslySetInnerHTML={{
          __html: t("roleStep.title").replace(/<span>/g, '<span class="playfair-display">')
        }} />
      ),
      description: t("roleStep.description"),
    },
    {
      label: t("levelStep.label"),
      body: ({ footer }: { footer: React.ReactNode }) => (
        <LevelComponent
          footer={footer}
          selectedCard={interviewLevelSelected}
          onSelectCard={handleLevelSelect}
          planStatus={getPlanStatus(user as User)}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold" dangerouslySetInnerHTML={{
          __html: t("levelStep.title").replace(/<span>/g, '<span class="playfair-display">')
        }} />
      ),
      description: t("levelStep.description"),
    },
    {
      label: t("questionsStep.label"),
      body: ({ footer }: { footer: React.ReactNode }) => (
        <QuestionsComponent
          footer={footer}
          selectedQuestions={questionsSelected}
          onSelectQuestion={handleQuestionSelect}
          planStatus={getPlanStatus(user as User)}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold" dangerouslySetInnerHTML={{
          __html: t("questionsStep.title").replace(/<span>/g, '<span class="playfair-display">')
        }} />
      ),
      description: t("questionsStep.description"),
    },
    {
      label: t("languageStep.label"),
      body: ({ footer }: { footer: React.ReactNode }) => (
        <LanguageComponent
          footer={footer}
          selectedLanguage={languageSelected}
          languageOptions={languageOptions}
          planStatus={getPlanStatus(user as User)}
          onSelectLanguage={handleLanguageSelect}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold" dangerouslySetInnerHTML={{
          __html: t("languageStep.title").replace(/<span>/g, '<span class="playfair-display">')
        }} />
      ),
      description: t("languageStep.description"),
    },
    {
      label: t("interviewerStep.label"),
      body: ({ footer }: { footer: React.ReactNode }) => (
        <InterviewerComponent
          interviewerOptions={interviewers}
          footer={footer}
          selectedInterviewer={interviewerSelected}
          onSelectInterviewer={handleInterviewerSelect}
          showModals={showModals}
          planStatus={getPlanStatus(user as User)}
          handleShowModals={handleShowModals}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold" dangerouslySetInnerHTML={{
          __html: t("interviewerStep.title").replace(/<span>/g, '<span class="playfair-display">')
        }} />
      ),
      description: t("interviewerStep.description"),
    },
  ];

  return (
    <>
      {user ? (
        <Stepper
          steps={[steps[currentStep - 1]]}
          activeStep={currentStep}
          activePage="interviewsetup"
          stepControl={{
            back: {
              position: currentStep === 5 ? "topLeft" : "bottomMiddle",
              variant: "primary",
              onClick: prev,
            },
            continue: {
              position: currentStep === 5 ? "topRight" : "bottomMiddle",
              variant: "defaultRing",
              onClick: next,
            },
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};
export default InterviewSetupCreate;
