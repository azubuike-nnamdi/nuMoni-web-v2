interface BusinessLocationHeaderProps {
  title?: string;
  description?: string;
}

export default function BusinessLocationHeader({
  title = "Business Location",
  description = "Let customers know where to find you.",
}: BusinessLocationHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

