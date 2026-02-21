import { cn } from "@/lib/utils";

interface RingProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function getScoreColor(score: number) {
  if (score >= 70) return "text-score-high";
  if (score >= 40) return "text-score-medium";
  return "text-score-low";
}

export function getScoreStroke(score: number) {
  if (score >= 70) return "hsl(160, 84%, 39%)";
  if (score >= 40) return "hsl(38, 92%, 50%)";
  return "hsl(347, 77%, 50%)";
}

export function RingProgress({ value, size = 48, strokeWidth = 4, className, showLabel = true }: RingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreStroke(value)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <span className={cn("absolute text-xs font-bold", getScoreColor(value))}>
          {value}
        </span>
      )}
    </div>
  );
}
