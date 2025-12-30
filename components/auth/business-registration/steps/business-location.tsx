"use client";

import { Form } from "@/components/ui/form";
import { useSaveBusinessLocation } from "@/hooks/mutation/useSaveBusinessLocation";
import { useBusinessLocationHandlers } from "@/hooks/use-business-location-handlers";
import { BusinessLocationFormData, businessLocationSchema } from "@/lib/schemas/business-registration-schema";
import { useBusinessRegistrationStore } from "@/stores/business-registration-store";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import BusinessLocationHeader from "./components/business-location-header";
import BusinessLocationSubmitButton from "./components/business-location-submit-button";
import FormErrorsDisplay from "./components/form-errors-display";
import LocationSearchSection from "./components/location-search-section";

export default function BusinessLocation() {
  const {
    nextStep,
    isRegistered,
    currentStep
  } = useBusinessRegistrationStore();

  const { user } = useUserAuthStore();
  const { handleSaveBusinessLocation, isPending, isSuccess } = useSaveBusinessLocation();
  const hasNavigatedRef = useRef(false);

  const skipDocumentStep = isRegistered === "no";

  // Initialize form with React Hook Form and Zod
  const form = useForm<BusinessLocationFormData>({
    resolver: zodResolver(businessLocationSchema),
    mode: "onSubmit",
    defaultValues: {
      id: null,
      merchantId: user?.id || '',
      storeNo: '1',
      address: '',
      street: null,
      city: null,
      state: null,
      country: 'Nigeria',
      postalCode: '',
      latitude: 0,
      longitude: 0,
      active: true,
    },
  });

  // Watch form values for UI updates
  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');
  const address = form.watch('address');

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [selectedAddress, setSelectedAddress] = useState<string>(address || "");

  // Update selected location when form values change
  useEffect(() => {
    if (latitude && longitude) {
      setSelectedLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (address) {
      setSelectedAddress(address);
    }
  }, [address]);

  // Use custom hook for location handling logic
  const { handlePlaceSelect, handleLocationSelect } = useBusinessLocationHandlers({
    form: {
      setValue: form.setValue,
      trigger: form.trigger,
    },
    setSelectedLocation,
    setSelectedAddress,
  });

  const onSubmit = async (data: BusinessLocationFormData) => {
    // Call API - payload building is handled in the hook
    handleSaveBusinessLocation(data);
  };

  const handleFormError = (errors: unknown) => {
    console.error('Form validation errors:', errors);
  };

  // Advance to next step on successful API call using the store
  useEffect(() => {
    if (isSuccess && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      console.log('Location saved successfully. isRegistered:', isRegistered, 'currentStep:', currentStep);
      nextStep(); // Store handles step skipping logic (will skip to step 5 if not registered)
      console.log('After nextStep. New currentStep:', useBusinessRegistrationStore.getState().currentStep);
    }
  }, [isSuccess, nextStep, isRegistered, currentStep]);

  // Reset navigation flag when component mounts or when isSuccess becomes false
  useEffect(() => {
    if (!isSuccess) {
      hasNavigatedRef.current = false;
    }
  }, [isSuccess]);

  const formErrors = form.formState.errors;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-6">
        <BusinessLocationHeader />

        <LocationSearchSection
          onPlaceSelect={handlePlaceSelect}
          onLocationSelect={handleLocationSelect}
          selectedAddress={selectedAddress}
          selectedLocation={selectedLocation}
        />

        <FormErrorsDisplay errors={formErrors} />

        <BusinessLocationSubmitButton
          isLoading={isPending}
          disabled={isPending || !selectedLocation || !selectedAddress}
          skipDocumentStep={skipDocumentStep}
        />
      </form>
    </Form>
  );
}

