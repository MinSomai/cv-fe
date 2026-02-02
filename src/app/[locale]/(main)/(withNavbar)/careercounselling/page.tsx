"use client";

import React, { useEffect, useState } from "react";

import { useAuth } from "@/providers/Auth";
import { getConsultations } from "@/utils/data";
import CareerCounsellingWelcomePage from "./_components/Welcome/WelcomePage";
import CareerCounsellingHistoryPage from "./_components/History/HistoryPage";

export type Consultation = {
  id: string;
  title: string;
  interviewStatus: string;
  reportStatus: string;
  interviewDate: string;
  interviewer: {
    photo: string;
    name: string;
  };
  careerStage: string;
  educationLevel: string;
  recommendations: string[];
  careerPathways: {
    org: number;
    hr: number;
    manager: number;
  };
};

export default function CareerCounsellingPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>();
  const [isPageRendered, setIsPageRendered] = useState(false);

  const handlePageRender = () => {
    setIsPageRendered((prev) => !prev);
  };

  useEffect(() => {
    getConsultations({
      limit: 0,
      page: 1,
      where: "counsellinghistorypage",
    }).then((res) => {
      setConsultations(res.consultations);
    });
  }, [isPageRendered]);

  return (
    <>
      {user && (
        <div className="flex flex-col h-full w-full">
          {consultations ? (
            consultations.length > 0 ? (
              <CareerCounsellingHistoryPage
                consultations={consultations}
                pageRender={handlePageRender}
              />
            ) : (
              <CareerCounsellingWelcomePage />
            )
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
