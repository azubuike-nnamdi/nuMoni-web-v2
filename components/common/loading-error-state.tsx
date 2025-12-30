import LoadingSpinner from "@/components/ui/loading-spinner";

interface LoadingErrorStateProps {
  isLoading: boolean;
  hasError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

export default function LoadingErrorState({
  isLoading,
  hasError = false,
  loadingMessage = "Loading...",
  errorMessage = "Unable to load information",
  children,
}: LoadingErrorStateProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <LoadingSpinner size="lg" message={loadingMessage} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

