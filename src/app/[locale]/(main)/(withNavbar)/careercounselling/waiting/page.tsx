"use client";

import React from "react";
import { useRouter } from "@/lib/navigation";

import Loading from "@/components/Loading";

export default function AnalyzeWaitingPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/careercounselling");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen">
      <div className="flex flex-col gap-6 w-[592px] text-center">
        <Loading />
        <div className="flex flex-col gap-4">
          <span className="text-[#000000DE] text-2xl font-semibold">
            Congratulations! Your career journey is taking shape 🚀 as well as
            your report...
          </span>
          <span className="flex flex-col gap-4 px-[55px] text-secondary-foreground">
            <span>
              Your insights are being analyzed, and your personalized career
              report is on its way! 🚀
            </span>
            <span>
              We&apos;re compiling expert recommendations, career paths, and
              growth opportunities tailored just for you.
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col text-center">
        <span className="text-[#000000DE] text-base font-semibold">
          Analyzing will take some time. I don&apos;t want to stay here.
        </span>
        <u
          className="text-lg font-semibold hover:text-secondary-foreground cursor-pointer"
          onClick={handleClick}
        >
          Go to Counselling History Page
        </u>
      </div>
    </div>
  );
}
