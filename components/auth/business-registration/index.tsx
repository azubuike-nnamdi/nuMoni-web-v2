"use client";

import ProgressIndicator from "@/components/auth/progress-indicator";
import { numoniLogoDark } from "@/constant/icons";
import { useBusinessRegistrationStore } from "@/stores/business-registration-store";
import { useUserAuthStore } from "@/stores/user-auth-store";
import Image from "next/image";
import { useEffect } from "react";
import BusinessCollectionAccount from "./steps/business-collection-account";
import BusinessDocument from "./steps/business-document";
import BusinessLocation from "./steps/business-location";
import BusinessOperationType from "./steps/business-operation-type";
import RegisterBusiness from "./steps/register-business";

export default function BusinessRegistration() {
  const { currentStep, isRegistered, setCurrentStep } = useBusinessRegistrationStore();
  const { user } = useUserAuthStore();

  // Check if user has regLevel and set appropriate step
  useEffect(() => {
    const regLevel = user?.regLevel;
    if (regLevel === 1 && currentStep !== 3) {
      setCurrentStep(3);
    } else if (regLevel === 2 && currentStep !== 4) {
      setCurrentStep(4);
    } else if (regLevel === 3 && currentStep !== 5) {
      setCurrentStep(5);
    }
  }, [user, currentStep, setCurrentStep]);

  // Total steps is 4 if not registered (skip document step), 5 if registered
  const totalSteps = isRegistered === "no" ? 4 : 5;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-xl mb-6">
        <div className="flex items-center justify-between mb-6">
          <Image
            src={numoniLogoDark}
            alt="nuMoni Logo"
            width={100}
            height={40}
            className="h-8 w-auto"
          />
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border-l-4 border-t-4 border-green-200 p-6 sm:p-8">
        {currentStep === 1 && (
          <BusinessOperationType />
        )}
        {currentStep === 2 && (
          <RegisterBusiness />
        )}
        {currentStep === 3 && (
          <BusinessLocation />
        )}
        {currentStep === 4 && (isRegistered === "yes" || user?.regLevel === 2) && (
          <BusinessDocument />
        )}
        {currentStep === 5 && (
          <BusinessCollectionAccount />
        )}
      </div>
    </div>
  );
}
