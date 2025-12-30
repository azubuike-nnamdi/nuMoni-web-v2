"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps = 3,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-5 h-2 rounded-full ${index + 1 <= currentStep
              ? "bg-theme-dark-green"
              : "bg-gray-300"
            }`}
        />
      ))}
    </div>
  );
}

