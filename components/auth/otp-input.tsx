"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export default function OTPInput({ value, onChange, length = 6, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Sync external value with internal state
    if (value && value.length === length) {
      setOtp(value.split(""));
    } else if (!value) {
      setOtp(Array(length).fill(""));
    }
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow single digit
    if (newValue.length > 1) {
      return;
    }

    // Only allow alphanumeric characters
    if (newValue && !/^[A-Za-z0-9]$/.test(newValue)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = newValue.toUpperCase();
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange(otpString);

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const pastedArray = pastedData.split("").filter((char) => /^[A-Za-z0-9]$/.test(char));

    if (pastedArray.length > 0) {
      const newOtp = [...otp];
      pastedArray.forEach((char, i) => {
        if (index + i < length) {
          newOtp[index + i] = char.toUpperCase();
        }
      });
      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Focus the next empty input or the last input
      const nextIndex = Math.min(index + pastedArray.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          disabled={disabled}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-theme-dark-green focus:ring-0"
        />
      ))}
    </div>
  );
}

