import { numoniLogoDark } from "@/constant/icons";
import Image from "next/image";
import QRCodeDisplay from "./qr-code-display";

interface PrintableQRCodeProps {
  value: string | null | undefined;
  title: string;
  description: string;
  size?: number;
}

export default function PrintableQRCode({
  value,
  title,
  description,
  size = 300
}: PrintableQRCodeProps) {
  return (
    <div className="p-8 text-center">
      {/* Logo at the top */}
      <div className="flex justify-center mb-6">
        <Image
          src={numoniLogoDark}
          alt="nuMoni Logo"
          width={120}
          height={28}
          className="h-7 w-auto"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="flex justify-center mb-4">
        <QRCodeDisplay
          value={value || ""}
          size={size}
          className="rounded-lg"
        />
      </div>
      <p className="text-lg text-gray-600 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
