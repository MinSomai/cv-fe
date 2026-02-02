"use client";

import React, { useState, useEffect } from "react";

import { useAuth } from "@/providers/Auth";
import { getInterviews } from "@/utils/data";
import InterviewWelcomePage from "./_components/Welcome/WelcomePage";
import InterviewHistoryPage from "./_components/History/HistoryPage";

export type Interview = {
  id: string;
  position: {
    role: string;
    level: string;
    industry: string;
  };
  interviewer: {
    photo: string;
    name: string;
  };
  level: string;
  categories: string[];
  date: string;
  status: string;
  reportReady: string;
  keyStrengths: string[];
  growthOpportunities: string[];
};

export default function CareerCounsellingPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>();
  const [isPageRendered, setIsPageRendered] = useState(false);

  const handlePageRender = () => {
    setIsPageRendered((prev) => !prev);
  };

  useEffect(() => {
    getInterviews({
      limit: 0,
      page: 1,
      where: "interviewhistorypage",
    }).then((res) => {
      setInterviews(res.interviews);
    });
  }, [isPageRendered]);

  return (
    <>
      {user && (
        <div className="flex flex-col h-full w-full">
          {interviews ? (
            interviews.length > 0 ? (
              <InterviewHistoryPage
                interviews={interviews}
                pageRender={handlePageRender}
              />
            ) : (
              <InterviewWelcomePage />
            )
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
