interface CardErrorStateProps {
  errorMessage?: string;
  onRetry?: () => void;
}

export default function CardErrorState({ errorMessage, onRetry }: Readonly<CardErrorStateProps>) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
      <div className="text-red-500 text-sm mb-2">⚠️ Error loading data</div>
      <div className="text-xs text-gray-500 mb-3">
        {errorMessage || 'Failed to load data'}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
