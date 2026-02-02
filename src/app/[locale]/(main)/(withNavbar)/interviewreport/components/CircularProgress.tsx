import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
}

export default function CircularProgress({ value }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="stroke-gray-200"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="10"
        />
        <circle
          className={cn("transition-all duration-300 ease-in-out", {
            "stroke-[#B42318]": value < 30,
            "stroke-[#c3794f]": value >= 30 && value < 70,
            "stroke-primary": value >= 70,
          })}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-secondary-foreground text-[10px] font-medium">
          Score
        </span>
        <span className="text-2xl font-semibold text-[#101828]">{value}%</span>
      </div>
    </div>
  );
}
