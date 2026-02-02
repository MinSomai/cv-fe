"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";

import Stepper from "@/components/Stepper";

import {
  ApproachSelect,
  CareerJourney,
  Challenge,
  Education,
  Engaging,
  Hope,
  ImportantDecisions,
  InfluenceChoice,
  LongTermGoal,
  PreferredWorkStyle,
  SolveProblem,
  WorkSetting,
} from "./CareerAssessmentComponents";
import {
  careerjourneyselect,
  educationselect,
  engagingselect,
  longtermgoalsselect,
  workstyleselect,
  solveproblemselect,
  importantdecisionsselect,
  hopeselect,
  influencechoiceselect,
  worksettingselect,
  challengeselect,
  approachselect,
  getLanguageOptions,
} from "@/utils/data";

import { getInterviewer } from "@/utils/data";
import { InterviewerComponent } from "../../../interviewsetup/_components/Create/InterviewSetupCreate";
import { Interviewer, Language } from "@/utils/types";
import { BillingPlan } from "@/payload-types";
import { useAuth } from "@/providers/Auth";
import { useNavbar } from "@/providers/NavbarProvider";
import { rest } from "@/lib/rest";
import { toast } from "sonner";

type DragCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function CareerCounsellingCreate() {
  const { user } = useAuth();
  const { setIsNavbarClose } = useNavbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");
  const tError = useTranslations("errors");

  const [currentStep, setCurrentStep] = useState(1);
  const [careerJourneySelect, setCareerJourneySelect] = useState<number>();
  const [educationSelect, setEducationSelect] = useState<number>();
  const [engagingSelect, setEngagingSelect] = useState<number[]>([]);
  const [golasSelect, setGoalsSelect] = useState<DragCard[]>([]);
  const [solveProblemSelect, setSolveProblemSelect] = useState<number>();
  const [workStyleSelect, setWorkStyleSelect] = useState<DragCard[]>([]);
  const [influenceChoiceSelect, setInfluenceChoiceSelect] = useState<number[]>(
    []
  );
  const [workSettingSelect, setWorkSettingSelect] = useState<number>();
  const [importantDecisionsSelect, setImportantDecisionsSelect] =
    useState<number>();
  const [challengeSelect, setChallengeSelect] = useState<number[]>([]);
  const [hopeSelect, setHopeSelect] = useState<number[]>([]);
  const [approachSelect, setApproachSelect] = useState<number>();

  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

  const interviewersRef = useRef<Interviewer[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [languageSelected, setLanguageSelected] = useState<Language>({
    id: "",
    label: "en",
    key: "gb",
    value: "English",
  });
  const [interviewerSelected, setInterviewerSelected] = useState<number>();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const next = async () => {
    if (currentStep === 12) {
      // Check if user has Explorer plan - only show upgrade modal for Explorer users
      const isExplorerPlan =
        user?.interviewPlan &&
        (user?.interviewPlan as BillingPlan).name
          .toLowerCase()
          .includes("explorer");

      if (isExplorerPlan) {
        setIsUpgradeModalVisible(true);
      } else {
        setCurrentStep((prev) => (prev < 13 ? prev + 1 : prev));
      }
      // if (!isUpgradeModalVisible) setIsUpgradeModalVisible(true);
      // else {
      //   setIsUpgradeModalVisible(false);
      //   setCurrentStep((prev) => (prev < 13 ? prev + 1 : prev));
      // }
    } else if (currentStep === 13) {
      try {
        if (
          careerJourneySelect !== undefined &&
          educationSelect !== undefined &&
          solveProblemSelect !== undefined &&
          workSettingSelect !== undefined &&
          importantDecisionsSelect !== undefined &&
          approachSelect !== undefined &&
          interviewerSelected !== undefined
        ) {
          const req = await rest(
            interviewId
              ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`
              : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews`,
            {
              careerJourney: careerjourneyselect[careerJourneySelect].title,
              educationLevel: educationselect[educationSelect].title,
              engaging: engagingselect
                .filter((_, i) => engagingSelect.includes(i))
                .map((item) => item.title),
              longTermGoals: golasSelect.map((item) => item.title),
              solveProblems: solveproblemselect[solveProblemSelect].title,
              preferredWork: workStyleSelect.map((item) => item.title),
              influenceChoices: influencechoiceselect
                .filter((_, i) => influenceChoiceSelect.includes(i))
                .map((item) => item.title),
              workSetting: worksettingselect[workSettingSelect].title,
              importantDecisions:
                importantdecisionsselect[importantDecisionsSelect].title,
              challenges: challengeselect
                .filter((_, i) => challengeSelect.includes(i))
                .map((item) => item.title),
              hopeToAchieve: hopeselect
                .filter((_, i) => hopeSelect.includes(i))
                .map((item) => item.title),
              approach: approachselect[approachSelect].title,
              interviewer: interviewersRef.current[interviewerSelected].id,
              language: languageSelected.id,
              status: "Not Started",
            },
            { method: interviewId ? "PATCH" : "POST" }
          );
          router.push(
            `/careercounselling/create?id=${req.doc.id}&type=careercounselling`
          );
          setIsConfirmModalVisible(true);
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
      setCurrentStep((prev) => (prev < 13 ? prev + 1 : prev));
    }
  };
  const prev = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const toggleModal = () => {
    setIsUpgradeModalVisible((prev) => !prev);
  };

  const handleCareerJourneySelect = (index: number) => {
    setCareerJourneySelect(index);
    setTimeout(() => {
      next();
    }, 500);
  };

  const handleEducationSelect = (index: number) => {
    setEducationSelect(index);
    setTimeout(() => {
      next();
    }, 500);
  };

  const handleEngagingSelect = (index: number) => {
    setEngagingSelect((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleGoalsDrag = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(golasSelect);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGoalsSelect(items);
  };

  const handleSolveProblemSelect = (index: number) => {
    setSolveProblemSelect(index);
    setTimeout(() => {
      next();
    }, 500);
  };

  const handleWorkStyleDrag = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(workStyleSelect);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkStyleSelect(items);
  };

  const handleImportantDecisionsSelect = (index: number) => {
    setImportantDecisionsSelect(index);
    setTimeout(() => {
      next();
    }, 500);
  };

  const handleHopeSelected = (index: number) => {
    setHopeSelect((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleInfluenceChoiceSelect = (index: number) => {
    setInfluenceChoiceSelect((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleWorkSettingSelect = (index: number) => {
    setWorkSettingSelect(index);
    setTimeout(() => {
      next();
    }, 500);
  };

  const handleChallengeSelect = (index: number) => {
    setChallengeSelect((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleApproachSelect = (index: number) => {
    setApproachSelect(index);
    setTimeout(() => {
      next();
    }, 500);
  };

  const handleInterviewerSelect = (index: number) =>
    setInterviewerSelected(index);

  const handleShowModals = () => setIsConfirmModalVisible((prev) => !prev);

  const handleSaveLater = async () => {
    if (
      careerJourneySelect !== undefined &&
      educationSelect !== undefined &&
      solveProblemSelect !== undefined &&
      workSettingSelect !== undefined &&
      importantDecisionsSelect !== undefined &&
      approachSelect !== undefined
    ) {
      await rest(
        interviewId
          ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`
          : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews`,
        {
          careerJourney: careerjourneyselect[careerJourneySelect].title,
          educationLevel: educationselect[educationSelect].title,
          engaging: engagingselect
            .filter((_, i) => engagingSelect.includes(i))
            .map((item) => item.title),
          longTermGoals: golasSelect.map((item) => item.title),
          solveProblems: solveproblemselect[solveProblemSelect].title,
          preferredWork: workStyleSelect.map((item) => item.title),
          influenceChoices: influencechoiceselect
            .filter((_, i) => influenceChoiceSelect.includes(i))
            .map((item) => item.title),
          workSetting: worksettingselect[workSettingSelect].title,
          importantDecisions:
            importantdecisionsselect[importantDecisionsSelect].title,
          challenges: challengeselect
            .filter((_, i) => challengeSelect.includes(i))
            .map((item) => item.title),
          hopeToAchieve: hopeselect
            .filter((_, i) => hopeSelect.includes(i))
            .map((item) => item.title),
          approach: approachselect[approachSelect].title,
          language: languageSelected.id,
          status: "Not Ready",
        },
        { method: interviewId ? "PATCH" : "POST" }
      );
      router.push(`/careercounselling`);
    }
  };

  useEffect(() => {
    const getCreatedInterviews = async () => {
      const res = await rest(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/counsellingInterviews/${interviewId}`,
        {},
        {
          method: "GET",
        }
      );

      setCareerJourneySelect(
        careerjourneyselect.findIndex(
          (journey) => journey.title === res.careerJourney
        )
      );
      setEducationSelect(
        educationselect.findIndex(
          (education) => education.title === res.educationLevel
        )
      );
      setEngagingSelect(
        res.engaging.map((item: string) =>
          engagingselect.findIndex((i) => i.title === item)
        )
      );
      setGoalsSelect(
        res.longTermGoals.map((title: string) => {
          const item = longtermgoalsselect.find((goal) => goal.title === title);
          return item
            ? { ...item, icon: item.icon({ colorful: false }) }
            : item;
        })
      );
      setSolveProblemSelect(
        solveproblemselect.findIndex(
          (problem) => problem.title === res.solveProblems
        )
      );
      setWorkStyleSelect(
        res.preferredWork.map((title: string) => {
          const item = workstyleselect.find((item) => item.title === title);
          return item
            ? { ...item, icon: item.icon({ colorful: false }) }
            : item;
        })
      );
      setInfluenceChoiceSelect(
        res.influenceChoices.map((title: string) =>
          influencechoiceselect.findIndex((item) => item.title === title)
        )
      );
      setWorkSettingSelect(
        worksettingselect.findIndex(
          (setting) => setting.title === res.workSetting
        )
      );
      setImportantDecisionsSelect(
        importantdecisionsselect.findIndex(
          (decision) => decision.title === res.importantDecisions
        )
      );
      setChallengeSelect(
        res.challenges.map((title: string) =>
          challengeselect.findIndex((item) => item.title === title)
        )
      );
      setHopeSelect(
        res.hopeToAchieve.map((title: string) =>
          hopeselect.findIndex((item) => item.title === title)
        )
      );
      setApproachSelect(
        approachselect.findIndex((approach) => approach.title === res.approach)
      );
      if (res.status !== "Not Ready" && res.interviewer) {
        setInterviewerSelected(
          interviewersRef.current.findIndex(
            (interviewer) => interviewer.id === res.interviewer.id
          )
        );
        setCurrentStep(13);
      } else {
        setCurrentStep(12);
      }
    };
    if (interviewId) getCreatedInterviews();
  }, [interviewId]);

  useEffect(() => {
    const userLanguage = languageOptions.find(
      (language) => language.label === user?.language
    );
    if (userLanguage) setLanguageSelected(userLanguage);
  }, [user, languageOptions]);

  useEffect(() => {
    if (currentStep === 13 && languageSelected) {
      getInterviewer({ language: languageSelected.label }).then((res) => {
        setInterviewers(res);
      });
    }
  }, [currentStep, languageSelected]);

  useEffect(() => {
    interviewersRef.current = interviewers;
  }, [interviewers]);

  useEffect(() => {
    setIsNavbarClose(true);
  }, [setIsNavbarClose]);

  useEffect(() => {
    setGoalsSelect(
      longtermgoalsselect.map((item) => ({
        ...item,
        icon: item.icon({ colorful: false }),
      }))
    );
    setWorkStyleSelect(
      workstyleselect.map((item) => ({
        ...item,
        icon: item.icon({ colorful: false }),
      }))
    );
    getLanguageOptions().then((options) => {
      setLanguageOptions(options);
    });
  }, []);

  const steps = [
    {
      label: "Career Journey",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <CareerJourney
          footer={footer}
          selectedCard={careerJourneySelect}
          onSelectCard={handleCareerJourneySelect}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          Where are you in your{" "}
          <span className="playfair-display">career journey</span>?
        </h1>
      ),
      description: "Choose one",
    },
    {
      label: "Education",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <Education
          footer={footer}
          selectedCard={educationSelect}
          onSelectCard={handleEducationSelect}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          What is your highset level of{" "}
          <span className="playfair-display">education</span>?
        </h1>
      ),
      description: "Choose one",
    },
    {
      label: "Engaging",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <Engaging
          footer={footer}
          selectedCard={engagingSelect}
          onSelectCard={handleEngagingSelect}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          Which activities do you find most naturally{" "}
          <span className="playfair-display">engaging</span>?
        </h1>
      ),
      description:
        "Select all that apply. These reflect what you enjoy, not just what you currently do",
    },
    {
      label: "Long-term Career Goals",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <LongTermGoal
          footer={footer}
          longTermGoals={golasSelect}
          handleOnDragEnd={handleGoalsDrag}
        />
      ),
      title: (
        <h1 className="w-[1061px] text-[32px] font-semibold">
          When thinking about your{" "}
          <span className="playfair-display">long-term career goals,</span> how
          would you rank the following factors in order of{" "}
          <span className="playfair-display">importance to you</span>?
        </h1>
      ),
      description: "Drag to rank (1 = Most Important, 5 = Least Important)",
    },
    {
      label: "Solve problems",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <SolveProblem
          footer={footer}
          selectedCard={solveProblemSelect}
          onSelectCard={handleSolveProblemSelect}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          When{" "}
          <span className="playfair-display">solving complex problems</span>,
          which approach do you most naturally take?
        </h1>
      ),
      description: "Choose one",
    },
    {
      label: "Preferred Work Styles",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <PreferredWorkStyle
          footer={footer}
          workStyleGoals={workStyleSelect}
          handleOnDragEnd={handleWorkStyleDrag}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          Rank your <span className="playfair-display">top 3</span> preferred
          work styles?
        </h1>
      ),
      description: "Drag to rank your top 3",
    },
    {
      label: "Influence Choice",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <InfluenceChoice
          footer={footer}
          selectedCard={influenceChoiceSelect}
          onSelectCard={handleInfluenceChoiceSelect}
        />
      ),
      title: (
        <h1 className="w-[882px] text-[32px] font-semibold">
          Today, what are the main considerations{" "}
          <span className="playfair-display">influencing your choices</span>{" "}
          regarding your career path?
        </h1>
      ),
      description: "Choose up to 3",
    },
    {
      label: "Work Setting",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <WorkSetting
          footer={footer}
          selectedCard={workSettingSelect}
          onSelectCard={handleWorkSettingSelect}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          What kind of <span className="playfair-display">work setting </span>do
          you see yourself <span className="playfair-display">thriving</span>{" "}
          in?
        </h1>
      ),
      description: "Choose one",
    },
    {
      label: "Important Decisions",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <ImportantDecisions
          footer={footer}
          selectedCard={importantDecisionsSelect}
          onSelectCard={handleImportantDecisionsSelect}
        />
      ),
      title: (
        <h1 className="w-[911px] text-[32px] font-semibold">
          When faced with{" "}
          <span className="playfair-display">important decisions</span> about
          your{" "}
          <span className="playfair-display">
            education, career, or future,
          </span>{" "}
          how do you tend to respond?
        </h1>
      ),
      description: "Choose one",
    },
    {
      label: "Challenge",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <Challenge
          footer={footer}
          selectedCard={challengeSelect}
          onSelectCard={handleChallengeSelect}
        />
      ),
      title: (
        <h1 className="w-[812px] text-[32px] font-semibold">
          What <span className="playfair-display">challenges or barriers</span>{" "}
          are you currently facing or anticipate encountering in reaching{" "}
          <span className="playfair-display">your career goals</span>?
        </h1>
      ),
      description: "Choose up to 3",
    },
    {
      label: "Hope to Achieve",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <Hope
          footer={footer}
          selectedCard={hopeSelect}
          onSelectCard={handleHopeSelected}
        />
      ),
      title: (
        <h1 className="w-[791px] text-[32px] font-semibold">
          Looking ahead, what do{" "}
          <span className="playfair-display">you hope to achieve</span> in your
          career over the next 10 years?
        </h1>
      ),
      description: "Choose up to 2",
    },
    {
      label: "Approach Describe",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <ApproachSelect
          footer={footer}
          selectedCard={approachSelect}
          onSelectCard={handleApproachSelect}
          isModalVisible={isUpgradeModalVisible}
          handleModal={toggleModal}
          saveLaterClick={handleSaveLater}
          nextClick={next}
        />
      ),
      title: (
        <h1 className="w-[749px] text-[32px] font-semibold">
          When receiving feedback about your work or performance,{" "}
          <span className="playfair-display">
            which approach best describes
          </span>{" "}
          you?
        </h1>
      ),
      description: "Choose one",
    },
    {
      label: "Interviewer",
      body: ({ footer }: { footer: React.ReactNode }) => (
        <InterviewerComponent
          interviewerOptions={interviewers}
          footer={footer}
          selectedInterviewer={interviewerSelected}
          onSelectInterviewer={handleInterviewerSelect}
          showModals={isConfirmModalVisible}
          handleShowModals={handleShowModals}
        />
      ),
      title: (
        <h1 className="text-[32px] font-semibold">
          Select your career path expert
        </h1>
      ),
      description: "",
    },
  ];

  return (
    <>
      {user ? (
        <Stepper
          steps={[steps[currentStep - 1]]}
          activeStep={currentStep}
          activePage="careercounselling"
          stepControl={{
            back: {
              position: "topLeft",
              variant: "primary",
              hidden: currentStep === 1 ? true : false,
              onClick: prev,
            },
            continue: {
              position: "topRight",
              variant: "defaultRing",
              hidden:
                currentStep === 1 && careerJourneySelect !== undefined
                  ? false
                  : currentStep === 2 && educationSelect !== undefined
                  ? false
                  : currentStep === 3 && engagingSelect.length > 0
                  ? false
                  : currentStep === 4 || currentStep === 6
                  ? false
                  : currentStep === 5 && solveProblemSelect !== undefined
                  ? false
                  : currentStep === 7 && influenceChoiceSelect.length > 0
                  ? false
                  : currentStep === 8 && workSettingSelect !== undefined
                  ? false
                  : currentStep === 9 && importantDecisionsSelect !== undefined
                  ? false
                  : currentStep === 10 && challengeSelect.length > 0
                  ? false
                  : currentStep === 11 && hopeSelect.length > 0
                  ? false
                  : currentStep === 12 && approachSelect !== undefined
                  ? false
                  : currentStep === 13 && interviewerSelected !== undefined
                  ? false
                  : true,
              onClick: next,
            },
          }}
          className="pt-10 gap-10 px-24"
        />
      ) : (
        <></>
      )}
    </>
  );
}
