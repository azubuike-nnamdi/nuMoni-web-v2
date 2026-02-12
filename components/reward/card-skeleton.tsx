import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  variant?: "default" | "gradient";
}

export default function CardSkeleton({ variant = "default" }: Readonly<CardSkeletonProps>) {
  if (variant === "gradient") {
    return (
      <div className="relative overflow-hidden bg-linear-to-br from-green-800 to-green-900 text-white rounded-xl p-6 flex flex-col">
        {/* Background Icon Skeleton */}
        <div className="absolute -top-8 -right-16 opacity-30">
          <Skeleton className="w-[200px] h-[200px] rounded-full" />
        </div>

        <div className="relative z-10">
          <Skeleton className="h-4 w-20 mb-4 bg-white/20" />
        </div>
        <div className="relative z-10 flex-1 flex items-center mb-4">
          <Skeleton className="h-8 w-32 bg-white/20" />
        </div>
        <div className="relative z-10">
          <Skeleton className="h-px w-full mb-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
            <Skeleton className="h-4 w-32 bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-gray rounded-xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      <div className="flex-1 flex items-center mb-4">
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-px w-full mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
