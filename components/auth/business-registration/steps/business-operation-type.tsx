"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBusinessRegistrationStore } from "@/stores/business-registration-store";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function BusinessOperationType() {
  const {
    setIsRegistered,
    setSalesChannels,
    nextStep
  } = useBusinessRegistrationStore();

  const [isRegistered, setIsRegisteredLocal] = useState<string>("");
  const [salesChannels, setSalesChannelsLocal] = useState<string[]>([]);

  const handleRegistrationChange = (value: string) => {
    setIsRegisteredLocal(value);
    setIsRegistered(value); // Store isRegistered for navigation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistered && salesChannels.length > 0) {
      // Store salesChannels temporarily for step 2 API call
      setSalesChannels(salesChannels);
      // Advance to next step (API will be called in register-business step)
      nextStep();
    }
  };

  const toggleSalesChannel = (channel: string) => {
    const newChannels = salesChannels.includes(channel)
      ? salesChannels.filter((c) => c !== channel)
      : [...salesChannels, channel];
    setSalesChannelsLocal(newChannels);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">Business Operation Type</h2>
        <p className="text-gray-600 text-sm">
          Select the option that best describes your sales channel.
        </p>
      </div>

      {/* Business Registration Status */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 block">
          Is Your Business Officially Registered? <span className="text-red-500">*</span>
        </label>
        <RadioGroup
          value={isRegistered}
          onValueChange={handleRegistrationChange}
          className="flex gap-4"
        >
          <label className="flex-1 flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-1">No</span>
              <span className="text-sm text-gray-700">I&apos;m not fully registered yet</span>
            </div>
            <RadioGroupItem value="no" />
          </label>
          <label className="flex-1 flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-1">Yes</span>
              <span className="text-sm text-gray-700">I have CAC and required documents</span>
            </div>
            <RadioGroupItem value="yes" />
          </label>
        </RadioGroup>
      </div>

      {/* Sales Channels */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 block">
          How Do You Sell? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex-1 flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-1">Online</span>
              <span className="text-sm text-gray-700">
                I run my business and deliveries from home or online platforms.
              </span>
            </div>
            <Checkbox
              checked={salesChannels.includes("online")}
              onCheckedChange={() => toggleSalesChannel("online")}
            />
          </label>
          <label className="flex-1 flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-1">Offline</span>
              <span className="text-sm text-gray-700">
                I have a physical store customers can visit.
              </span>
            </div>
            <Checkbox
              checked={salesChannels.includes("offline")}
              onCheckedChange={() => toggleSalesChannel("offline")}
            />
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isRegistered || salesChannels.length === 0}
        className="w-full bg-theme-dark-green text-white py-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Go To Business Name And Details
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

