import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ContentCard/ContentCard";
import {
  BarChart2,
  Users,
  Smile,
  AlignHorizontalJustifyStartIcon,
  LayoutGrid,
  Target,
  LucideMapPinned,
  Briefcase,
} from "lucide-react";
import { useCallback } from "react";

function MetricValue({
  value,
  typed,
}: {
  value: string | number;
  typed: boolean;
}) {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(value);
  const stringValue = typeof value === "string" ? value : `${numericValue}`;
  const isNumeric = !isNaN(numericValue);
  let type = "";
  let bgColor = "bg-gray-100";
  let textColor = "text-[#344054]";
  let borderColor = "border-[#ABEFC6]";

  if (stringValue === "Positive") {
    bgColor = "bg-[#ecfdf3]";
    textColor = "text-[#039855]";
    borderColor = "border-[#ABEFC6]";
  } else if (stringValue === "Low") {
    bgColor = "bg-[#fef3f2]";
    textColor = "text-[#b42318]";
    borderColor = "border-[#FECDCA]";
  } else {
    bgColor = "bg-[#FFFAEB]";
    textColor = "text-[#B54708]";
    borderColor = "border-[#FEDF89]";
  }
  if (isNumeric) {
    if (numericValue <= 49) {
      type = "Low";
      bgColor = "bg-[#fef3f2]";
      textColor = "text-[#b42318]";
      borderColor = "border-[#FECDCA]";
    } else if (numericValue <= 60) {
      type = "Medium";
      bgColor = "bg-[#FFFAEB]";
      textColor = "text-[#B54708]";
      borderColor = "border-[#FEDF89]";
    } else {
      type = "High";
      bgColor = "bg-[#ecfdf3]";
      textColor = "text-[#039855]";
      borderColor = "border-[#ABEFC6]";
    }
  }

  return (
    <span
      className={`rounded-full ${bgColor} ${textColor} border ${borderColor} px-2 py-1 text-sm font-medium whitespace-nowrap`}
    >
      {typed ? type + " " : ""}
      {typeof value === "number"
        ? stringValue.indexOf(".", 1) === -1
          ? stringValue + "%"
          : stringValue
        : stringValue}
    </span>
  );
}

interface MetricsGridProps {
  metrics: any;
  isTyped?: boolean;
  className?: string;
}

export default function MetricsGrid({
  metrics,
  isTyped = false,
  className,
}: MetricsGridProps) {
  const metricsObjectsKeys = Object.keys(metrics);

  const metricsMap: Record<string, any> = {
    verbalCommunication: { title: "Verbal Communication", icon: BarChart2 },
    physicalPresence: { title: "Physical Presence", icon: Users },
    emotionalCues: { title: "Emotional Cues", icon: Smile },
    careerPathwaysMatch: { title: "Career Pathways Match", icon: Briefcase },
    environmentAlignment: {
      title: "Environment Alignment",
      icon: AlignHorizontalJustifyStartIcon,
    },
    careerAlignment: { title: "Career Alignment", icon: Target },
    skillsAssesment: { title: "Skills Assessment", icon: Briefcase },
    careerDecisionsAreDrivenBy: {
      title: "Career Decisions are Driven by",
      icon: LucideMapPinned,
    },
  };

  const titleStyle = {
    fontWeight: 600,
  };

  const contentStyle = {
    color: "rgba(71, 84, 103, 1)",
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
  };
  const addTodo = useCallback((stringKeyMetric: string) => {
    const words = stringKeyMetric
      .replace(/([A-Z])/g, " $1") // Insert space before capital letters
      .replace(/^./, (char) => char.toUpperCase()) // Capitalize first letter
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ") // Split into words
      .filter((word) => word.length > 0);

    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, []);

  return (
    <div className={className}>
      {metricsObjectsKeys.map((metric, index) => {
        const eachMetricsObjectKey = Object.keys(metrics[metric]);

        const formattedStringTitleForEachObjectKey = addTodo(metric);

        const metricInfo = metricsMap[metric] || {
          title: formattedStringTitleForEachObjectKey,
          icon: LayoutGrid,
        };
        const Icon = metricInfo.icon;
        const currentMetricObject = metrics[metric];

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Icon className="h-5 w-5 text-[#465ff1]" />
              <div className="flex flex-1 items-center justify-between">
                <CardTitle style={titleStyle}>
                  {formattedStringTitleForEachObjectKey}
                </CardTitle>
                {currentMetricObject.overallScore && (
                  <span className="text-lg font-semibold text-[#465ff1]">
                    {currentMetricObject.overallScore}%
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {eachMetricsObjectKey
                  .slice(1, eachMetricsObjectKey.length)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span style={contentStyle}>{addTodo(item)}</span>
                      <MetricValue
                        value={currentMetricObject[item]}
                        typed={isTyped}
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
