"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ContentCard/ContentCard";
import { Button } from "@/components/Button";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  HeartIcon as ActivityHeart,
  LineChart,
  Target,
  List,
  FileAudioIcon as Recording,
  Verified,
  MessageCircleMoreIcon,
  FeatherIcon,
} from "lucide-react";
import AnxietyOverviewChart from "./AnxietyOverviewChart";
import EmotionalAnalysis from "./EmotionalAnalysis";
import KeyInsightCard from "./KeyInsightCard";
import Image from "next/image";
import { useAuth } from "@/providers/Auth";
import { InterviewReport } from "@/utils/types";
import { IconList } from "@/components/IconList";
import MetricsGrid from "./MetricsGrid";

interface InterviewDetailedProps {
  interviewReport: InterviewReport;
}
type MetricKeys = "relevance" | "structure" | "language";

const METRIC_LABELS: Record<MetricKeys, string> = {
  relevance: "Relevance",
  structure: "Structure",
  language: "Language",
};

export default function InterviewDetailed({
  interviewReport,
  interviewId, // Add the new string parameter here
}: InterviewDetailedProps & { interviewId: string }) {
  const { user } = useAuth();
  const [isAnswerExpanded, setIsAnswerExpanded] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedQuestionData, setSelectedQuestionData] = useState(
    interviewReport.analytics?.detailedQuestions?.[0] ?? {
      id: "",
      question: "",
      answer: "",
      analyzedData: {
        questionType: "",
        score: 0,
        summary: "",
        improvedAnswer: "",
        potentialIncrease: 0,
      },
    }
  );
  const [videoUrl, setVideoUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const longAnswer = selectedQuestionData?.answer ?? "";

  const verbalCommunicationData = () => {
    return {
      verbalCommunication:
        interviewReport.analytics?.metrics?.verbalCommunication,
    };
  };
  const onSetSelectedQuestion = useCallback(
    (id: string) => {
      const index =
        interviewReport.analytics?.detailedQuestions?.findIndex(
          (q) => q.id === id
        ) ?? 0;
      setSelectedQuestionIndex(index);
      setSelectedQuestionData(
        interviewReport.analytics?.detailedQuestions?.[index] ??
          selectedQuestionData
      );
      console.log(selectedQuestionData);
    },
    [selectedQuestionData, interviewReport.analytics?.detailedQuestions]
  );

  const formatMetricFields = (
    analyzedData: Partial<Record<MetricKeys, string | null>> | undefined
  ): string[] => {
    if (!analyzedData) return [];

    return (Object.keys(METRIC_LABELS) as MetricKeys[])
      .map((key) => {
        const value = analyzedData[key];
        return value ? `${METRIC_LABELS[key]}: ${value}` : null;
      })
      .filter((item): item is string => item !== null);
  };

  useEffect(() => {
    setVideoUrl(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/videos/get-video-stream?userId=${user?.id}&interviewId=${interviewId}&startTime=${selectedQuestionData.answerStart}&endTime=${selectedQuestionData.answerEnd}`
    );
  }, [selectedQuestionData, interviewId, user]);

  useEffect(() => {
    // When videoUrl changes, reload the video element
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Questions Column */}
      <div className="col-span-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xl border-b p-3 flex justify-between">
              <span>Questions</span>
              <span className="text-gray-500">
                {interviewReport.analytics?.detailedQuestions?.length ?? 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {interviewReport.analytics?.detailedQuestions?.map((q) => (
                <div
                  key={q.id}
                  className={`cursor-pointer rounded-lg p-4 transition-colors ${
                    q.id === selectedQuestionData.id
                      ? "bg-[#465ff1] text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => q.id && onSetSelectedQuestion(q.id)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs
                        ${
                          q.id === selectedQuestionData.id
                            ? "text-[#667085]"
                            : "black"
                        }`}
                    >
                      {q.analyzedData?.questionType}
                    </span>
                    <span
                      className={`inline-flex rounded-full ${
                        q.analyzedData?.score && q.analyzedData.score >= 50
                          ? "bg-[#ecfdf3]"
                          : "bg-[#fef3f2]"
                      } px-2 py-1 text-xs font-medium ${
                        q.id === selectedQuestionData.id &&
                        q.analyzedData?.score &&
                        q.analyzedData.score >= 50
                          ? "text-[#039855]"
                          : q.id === selectedQuestionData.id &&
                            q.analyzedData?.score &&
                            q.analyzedData.score < 50
                          ? "text-[#b42318]"
                          : q.analyzedData?.score && q.analyzedData.score >= 50
                          ? "text-[#039855]"
                          : "text-[#b42318]"
                      }`}
                    >
                      Score {q.analyzedData?.score}%
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      q.id === selectedQuestionData.id
                        ? "text-white"
                        : "text-[#344054]"
                    }`}
                  >
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                className="flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-[#667085]">Page 1 of 10</div>
              <Button
                variant="outline"
                size="icon"
                className="flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Answer Column */}
      <div className="col-span-6">
        {selectedQuestionData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl border-b p-3">
                  <span>Answer</span>
                </CardTitle>
              </CardHeader>
              <div className="flex items-center justify-center w-full overflow-hidden rounded-lg px-3">
                <video
                  ref={videoRef}
                  controls
                  preload="auto"
                  autoPlay={false}
                  className="rounded-lg w-full object-cover"
                >
                  {videoUrl && <source src={videoUrl} type="video/webm" />}
                </video>
              </div>
              <CardContent>
                <div className="text-lg font-semibold text-[#344054] my-6">
                  {`Q${selectedQuestionIndex + 1}.`}{" "}
                  {selectedQuestionData.question}
                </div>
                <div className="flex gap-4 border-b pb-4">
                  <button className="text-sm font-medium text-[#344054] border-b-2 border-[#465ff1] pb-2">
                    My Answer
                  </button>
                  <button className="text-sm text-[#667085] pb-2">
                    Metrics
                  </button>
                  <button className="text-sm text-[#667085] pb-2">
                    Keywords
                  </button>
                  <span className="ml-auto inline-flex rounded-full bg-[#ecfdf3] px-2 py-1 text-sm font-medium text-[#039855]">
                    {selectedQuestionData.analyzedData?.score}%
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div
                    className={`relative ${
                      !isAnswerExpanded ? "max-h-24 overflow-hidden" : ""
                    }`}
                  >
                    <p className="text-sm text-[#667085]">{longAnswer}</p>
                    {!isAnswerExpanded && (
                      <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-white to-transparent" />
                    )}
                  </div>
                  <button
                    className="text-sm text-[#465ff1]"
                    onClick={() => setIsAnswerExpanded(!isAnswerExpanded)}
                  >
                    {isAnswerExpanded ? "Hide full answer" : "See full answer"}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="mt-6 space-y-6">
                    <IconList
                      headerIcon={Verified}
                      itemIcon={[Target, List, MessageCircleMoreIcon]}
                      title="Content Analysis"
                      items={formatMetricFields({
                        relevance:
                          selectedQuestionData.analyzedData?.relevance ?? null,
                        structure:
                          selectedQuestionData.analyzedData?.structure ?? null,
                        language:
                          selectedQuestionData.analyzedData?.language ?? null,
                      })}
                      color="#039855"
                    />
                    <MetricsGrid
                      metrics={{
                        verbalCommunication:
                          selectedQuestionData.questionMetrics
                            ?.verbalCommunication,
                      }}
                    />

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-[#344054]">
                          Improved Answer
                        </h4>
                        <span className="inline-flex rounded-full bg-[#ecfdf3] px-2 py-1 text-sm font-medium text-[#039855] border border-[#ABEFC6]">
                          {selectedQuestionData.analyzedData?.potentialIncrease}
                          %
                        </span>
                      </div>
                      <Card className="rounded-2xl border border-gray-200 bg-white">
                        <CardContent className="p-4">
                          <p className="text-sm text-[#465ff1]">
                            {selectedQuestionData.analyzedData?.improvedAnswer}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-[#344054] mb-4">
                        Key Insights
                      </h4>
                      <div className="space-y-4">
                        {selectedQuestionData.questionKeyInsights?.map(
                          (insight, index) => (
                            <KeyInsightCard
                              key={index}
                              icon={FeatherIcon}
                              title={insight.title || ""}
                              category={insight.category || ""}
                              description={insight.description || ""}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Non-verbal Insights Column */}
      <Card className="col-span-3 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-xl border-b p-3">
            <span>Non-Verbal Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <KeyInsightCard
            className="!h-fit"
            icon={Star}
            title="Summary"
            description={selectedQuestionData.analyzedData?.summary || ""}
          />
          <MetricsGrid
            metrics={{
              physicalPresence:
                selectedQuestionData.questionMetrics?.physicalPresence,
            }}
          />
          <MetricsGrid
            metrics={{
              emotionalCues:
                selectedQuestionData.questionMetrics?.emotionalCues,
            }}
          />

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ActivityHeart className="h-5 w-5 text-[#465ff1]" />
              <CardTitle className="text-sm font-medium text-[#344054]">
                Anxiety Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div>
                  <AnxietyOverviewChart />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <LineChart className="h-5 w-5 text-[#465ff1]" />
              <CardTitle className="text-sm font-medium text-[#344054]">
                Emotion Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionalAnalysis
                values={selectedQuestionData.questionEmotionalAnalysis}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
