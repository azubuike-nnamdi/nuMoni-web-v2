"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReceiveMethodSectionProps } from "@/lib/types";


export default function ReceiveMethodSection({ receiveMethod, setReceiveMethod }: Readonly<ReceiveMethodSectionProps>) {
  // console.log('receiveMethod', receiveMethod);
  return (
    <div className="space-y-3">
      <label htmlFor="receiveMethod" className="text-sm font-semibold text-gray-900">
        Choose How Customers Are Rewarded <span className="text-red-500">*</span>
      </label>
      <RadioGroup value={receiveMethod} onValueChange={setReceiveMethod} className="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          className={`flex-1 flex items-start space-x-2 sm:space-x-3 border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 min-h-[70px] sm:min-h-[80px] ${receiveMethod === "INSTANT"
            ? "border-green-500"
            : "border-gray-300 hover:border-gray-400"
            }`}
          onClick={() => setReceiveMethod("INSTANT")}
        >
          <div className="space-y-1 flex flex-row gap-2 w-full">
            <div className="text-left flex-1">
              <label htmlFor="instantly" className={`text-sm font-medium cursor-pointer ${receiveMethod === "INSTANT" ? "text-green-600" : "text-gray-900"
                }`}>
                Instantly
              </label>
              <p className="text-xs text-gray-600">Users are instantly rewarded and are able to spend the reward immediately.</p>
            </div>
            <RadioGroupItem
              value="INSTANT"
              id="instantly"
              className={`mt-1 shrink-0 ${receiveMethod === "INSTANT"
                ? "border-green-500 data-[state=checked]:bg-green-500"
                : ""
                }`}
            />
          </div>
        </button>
        <button
          className={`flex-1 flex items-start space-x-2 sm:space-x-3 border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 min-h-[70px] sm:min-h-[80px] ${receiveMethod === "LATER"
            ? "border-green-500"
            : "border-gray-300 hover:border-gray-400"
            }`}
          onClick={() => setReceiveMethod("LATER")}
        >
          <div className="space-y-1 flex flex-row gap-2 w-full">
            <div className="text-left flex-1">
              <label htmlFor="milestone" className={`text-sm font-medium cursor-pointer ${receiveMethod === "LATER" ? "text-green-600" : "text-gray-900"
                }`}>
                Milestone
              </label>
              <p className="text-xs text-gray-600">Users get their rewards instantly however they are unable to spend until they reach the milestone target.</p>
            </div>
            <RadioGroupItem
              value="LATER"
              id="milestone"
              className={`mt-1 shrink-0 ${receiveMethod === "LATER"
                ? "border-green-500 data-[state=checked]:bg-green-500"
                : ""
                }`}
            />
          </div>
        </button>
      </RadioGroup>
    </div>
  );
}
