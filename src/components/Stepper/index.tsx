"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button, LinkButton } from "@/components/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import StepHead from "./StepHead";

type Props = {
  steps: {
    label: string;
    body: React.FC<{ footer: React.ReactNode }>;
    title: React.ReactNode;
    description: React.ReactNode;
    topImage?: React.ReactNode;
  }[];
  className?: string;
  showStatus?: boolean;
  stepControl?: {
    back: {
      position: "topLeft" | "bottomMiddle";
      variant?: string;
      disabled?: boolean;
      hidden?: boolean;
      onClick?: () => void;
    };
    continue: {
      position: "topRight" | "bottomMiddle";
      variant?: string;
      disabled?: boolean;
      hidden?: boolean;
      onClick?: () => void;
    };
  };
  activeStep?: number;
  activePage?: string;
  //   transition: TransitionOption
};

const Stepper: React.FC<Props> = ({
  steps,
  className,
  showStatus,
  stepControl,
  activeStep,
  activePage,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full",
        {
          "bg-[#FAFBFE]":
            activePage === "careercounselling" && activeStep === 13,
        },
        className
      )}
    >
      <StepHead
        labels={["Role", "Level", "Questions", "Language", "Interviewer"]}
        activeStep={activeStep}
        activePage={activePage}
        className="flex items-center justify-center"
      />
      <div
        className={cn("flex flex-col flex-1 custom-scrollbar overflow-y-auto", {
          "bg-[#FAFBFE] items-center pt-[100px]":
            activePage === "interviewsetup",
          "items-center justify-center":
            activePage === "careercounselling" && activeStep === 13,
        })}
      >
        <div className="flex flex-col items-center justify-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center justify-center w-full",
                {
                  "gap-10":
                    activePage === "careercounselling" &&
                    activeStep &&
                    activeStep < 13,
                }
              )}
            >
              <div className="flex flex-col items-center justify-center text-center gap-2">
                {step.title}
                <span className="text-[#475467] text-center">
                  {step.description}
                </span>
              </div>
              {step.body({
                footer: stepControl && (
                  <div
                    className={cn(
                      "flex flex-row justify-between w-full gap-2",
                      stepControl.continue.position === "bottomMiddle" &&
                        "flex-col justify-center"
                    )}
                  >
                    <div
                      className={cn(
                        "flex flex-row justify-end",
                        stepControl.continue.position === "topRight" &&
                          "order-2",
                        stepControl.continue.position === "bottomMiddle" &&
                          "flex-col justify-center"
                      )}
                    >
                      <Button
                        onClick={stepControl.continue.onClick}
                        variant={
                          activePage === "interviewsetup" ||
                          (activePage === "careercounselling" &&
                            activeStep &&
                            activeStep === 13)
                            ? "defaultRing"
                            : "secondary"
                        }
                        className={cn("font-semibold", {
                          "w-[193px]":
                            (stepControl.continue.position === "topRight" &&
                              activePage === "interviewsetup") ||
                            (activePage === "careercounselling" &&
                              activeStep &&
                              activeStep === 13),
                          "font-semibold bg-transparent shadow-none text-[#0E131D] items-center gap-1 hover:text-[#4f5052] flex flex-row":
                            activePage === "careercounselling" &&
                            activeStep &&
                            activeStep < 13,
                          hidden: stepControl.continue.hidden,
                        })}
                        disabled={stepControl.continue.disabled}
                      >
                        Continue
                        {activePage === "careercounselling" &&
                          activeStep &&
                          activeStep < 13 && <ArrowRight size={20} />}
                      </Button>
                    </div>
                    <div
                      className={cn(
                        "flex flex-row justify-start",
                        stepControl.back.position === "topLeft" && " order-1",
                        stepControl.back.position === "bottomMiddle" &&
                          "flex-col justify-center"
                      )}
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        className={cn(
                          "font-semibold bg-transparent shadow-none text-[#0E131D] items-center gap-1 hover:text-[#4f5052]",
                          {
                            "flex flex-row": activePage === "careercounselling",
                            hidden: stepControl.back.hidden,
                          }
                        )}
                        onClick={stepControl.back.onClick}
                      >
                        {activePage === "careercounselling" && (
                          <ArrowLeft size={20} />
                        )}
                        {activePage === "interviewsetup" ||
                        (activePage === "careercounselling" &&
                          activeStep &&
                          activeStep === 13)
                          ? `Go Back`
                          : `Previous Question`}
                      </Button>
                    </div>
                  </div>
                ),
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Stepper;
