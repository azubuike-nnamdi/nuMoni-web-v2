import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  value: string | null | undefined;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function QRCodeDisplay({
  value,
  size,
  className = "",
  style = {}
}: QRCodeDisplayProps) {
  // Validate that value is not null/undefined and is a string
  if (!value || typeof value !== 'string') {
    return (
      <div className={`bg-white p-2 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-sm">Invalid QR Code Data</div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-2 flex items-center justify-center ${className}`}>
      <QRCode
        value={value}
        size={size}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
          ...style
        }}
      />
    </div>
  );
}
