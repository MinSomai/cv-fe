import {
  FileText,
  Brain,
  CheckCircle2,
  ListChecks,
  ThumbsUp,
  Verified,
} from "lucide-react";
import { KeyInsightCard } from "@/app/[locale]/(main)/(withNavbar)/interviewreport/components";
import { IconList } from "@/components/IconList";

interface CareerProfileProps {
  data: {
    hollandCode: {
      code: string;
      social: number;
      enterprising: number;
      conventional: number;
    };
    meaning: string[];
    bestFitFields: string[];
    cognitiveApproach: string;
  };
}

export function CareerProfile({ data }: CareerProfileProps) {
  return (
    <div>
      <div className="bg-[#465ff1] text-white rounded-lg p-4 mb-4 text-center">
        <h2 className="text-2xl font-bold">Your Career Profile</h2>
      </div>

      <h3 className="mb-2 text-lg font-semibold">
        HOLLAND CODE (RIASEC) ANALYSIS
      </h3>
      <p className="mb-4 border border-gray-200 rounded-2xl p-4">
        Your <strong>{data.hollandCode.code}</strong> profile demonstrates
        primary
        <strong> Social orientation ({data.hollandCode.social}%)</strong>,
        secondary
        <strong>
          {" "}
          Enterprising tendencies ({data.hollandCode.enterprising}%)
        </strong>
        , and tertiary
        <strong>
          {" "}
          Conventional inclinations ({data.hollandCode.conventional}%)
        </strong>
      </p>

      <div className="grid grid-cols-[40%_30%_30%]">
        <div className="pr-4">
          <KeyInsightCard
            icon={FileText}
            title="What This Means For You"
            description={data.meaning.join("\n")}
          />
        </div>
        <div className="pr-4">
          <IconList
            headerIcon={Verified}
            itemIcon={ThumbsUp}
            title="Best-Fit Career Fields"
            className="!h-full"
            items={data.bestFitFields}
            color="#039855"
          />
        </div>
        <div>
          <KeyInsightCard
            icon={Brain}
            title="Cognitive & Learning Approach"
            description={data.cognitiveApproach}
          />
        </div>
      </div>
    </div>
  );
}
