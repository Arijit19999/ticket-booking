import { RESERVATION_DURATION_MS } from "../constants";

interface CountdownTimerProps {
  timeLeft: number | null;
}

export function CountdownTimer({ timeLeft }: CountdownTimerProps) {
  if (timeLeft === null) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(100,116,139,0.2)"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-slate-500 font-medium">--:--</span>
          </div>
        </div>
        <p className="text-xs text-slate-500">Select a seat to start</p>
      </div>
    );
  }

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const progress = timeLeft / RESERVATION_DURATION_MS;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - progress);

  const isUrgent = totalSeconds <= 60;
  const isWarning = totalSeconds <= 120 && totalSeconds > 60;

  const ringColor = isUrgent ? "#ef4444" : isWarning ? "#f59e0b" : "#6366f1";

  const textColor = isUrgent
    ? "text-red-400"
    : isWarning
      ? "text-amber-400"
      : "text-indigo-300";

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div
        className={`relative w-20 h-20 ${isUrgent ? "animate-countdown-pulse" : ""}`}
      >
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="rgba(100,116,139,0.15)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={ringColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold tabular-nums ${textColor}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <p
        className={`text-xs font-medium ${isUrgent ? "text-red-400" : "text-slate-400"}`}
      >
        {isUrgent ? "Hurry! Time running out" : "Reservation timer"}
      </p>
    </div>
  );
}
