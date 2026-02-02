import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ContentCard/ContentCard";
import {
  Rocket,
  Brain,
  FeatherIcon,
  MessageSquare,
  Mic,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Feather,
} from "lucide-react";
import { IconList } from "@/components/IconList";
import MetricsGrid from "./MetricsGrid";
import AnswerScores from "./AnswerScores";
import EmotionalAnalysis from "./EmotionalAnalysis";
import KeyInsightCard from "./KeyInsightCard";
import Image from "next/image";
import { InterviewReport } from "@/utils/types";

interface InterviewGeneralProps {
  interviewReport: InterviewReport;
}

export default function InterviewGeneral({
  interviewReport,
}: InterviewGeneralProps) {
  return (
    <div className="space-y-6">
      {/* Celebration Banner */}
      <Card className="bg-[#465ff1] text-white">
        <CardContent className="relative flex items-center justify-center gap-4 p-6">
          <Image
            src="/interview-report/congratulate.svg"
            alt=""
            layout="fill"
            className="absolute z-0 rounded-2xl top-0 left-0 h-full w-full"
          />
          <div className="h-[120px] w-[132px]">
            <Image
              src="/Fast-Internet.svg"
              alt="Celebration illustration"
              width={132}
              height={120}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              🚀 You&apos;re on fire, {interviewReport.interviewee.name}!
            </h2>
            <p className="flex flex-row mt-1 text-white/90">
              You&apos;ve&nbsp;<p className="font-semibold">improved by</p>
              &nbsp;
              {interviewReport.analytics?.summary?.improvement}% since your last
              interview.
            </p>
            <p className="mt-1 text-white/90 font-semibold">
              🏆 Your Goal: {interviewReport.interviewee.goal}
            </p>
          </div>
        </CardContent>
      </Card>
      <MetricsGrid
        metrics={interviewReport.analytics?.metrics}
        className="grid grid-cols-3 gap-6"
      />

      <div className="grid grid-cols-2 gap-6">
        <IconList
          headerIcon={Brain}
          itemIcon={CheckCircle2}
          title="Key Strengths"
          items={interviewReport.analytics?.keyStrengths || []}
          color="#039855"
        />
        <IconList
          headerIcon={AlertCircle}
          itemIcon={ArrowUpRight}
          title="Growth Opportunities"
          items={interviewReport.analytics?.growthOpportunities || []}
          color="#b42318"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#344054]">Answer Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <AnswerScores
              detailedQuestions={
                interviewReport.analytics?.detailedQuestions || []
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#344054]">Emotional Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionalAnalysis
              values={interviewReport.analytics?.emotionalAnalysis}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {interviewReport.analytics?.keyInsights?.map((insight, index) => {
              const IconMap = {
                Presence: FeatherIcon,
                "Non-verbal": FeatherIcon,
                Verbal: FeatherIcon,
                Language: FeatherIcon,
              };
              const Icon =
                IconMap[insight.category as keyof typeof IconMap] ||
                MessageSquare;

              return (
                <KeyInsightCard
                  key={index}
                  icon={Icon}
                  title={insight.title || ""}
                  category={insight.category || ""}
                  description={insight.description || ""}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
