"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormComboboxMulti } from "@/components/ui/form-combobox-multi";
import { FormPhoneInput } from "@/components/ui/form-phone-input";
import { FormSelectTopLabel } from "@/components/ui/form-select";
import { FormTextareaTopLabel } from "@/components/ui/form-textarea";
import { Input } from "@/components/ui/input";
import { useSaveBusinessDetails } from "@/hooks/mutation/useSaveBusinessDetails";
import { useUploadDealsFile } from "@/hooks/mutation/useUploadFile";
import useGetCategoryList from "@/hooks/query/useGetCategoryList";
import { RegisterBusinessFormData, registerBusinessSchema } from "@/lib/schemas/business-registration-schema";
import { useBusinessRegistrationStore } from "@/stores/business-registration-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FileImage, RefreshCw, Trash2, Upload, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const timeOptions = [
  { value: "6:00 AM", label: "6:00 AM" },
  { value: "7:00 AM", label: "7:00 AM" },
  { value: "8:00 AM", label: "8:00 AM" },
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "2:00 PM", label: "2:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" },
  { value: "6:00 PM", label: "6:00 PM" },
  { value: "7:00 PM", label: "7:00 PM" },
  { value: "8:00 PM", label: "8:00 PM" },
  { value: "9:00 PM", label: "9:00 PM" },
  { value: "10:00 PM", label: "10:00 PM" },
  { value: "11:00 PM", label: "11:00 PM" },
  { value: "12:00 AM", label: "12:00 AM" },
  { value: "1:00 AM", label: "1:00 AM" },
  { value: "2:00 AM", label: "2:00 AM" },
  { value: "3:00 AM", label: "3:00 AM" },
  { value: "4:00 AM", label: "4:00 AM" },
  { value: "5:00 AM", label: "5:00 AM" },
];

export default function RegisterBusiness() {
  const {
    isRegistered,
    salesChannels,
    clearSalesChannels,
    nextStep,
  } = useBusinessRegistrationStore();

  const { handleSaveBusinessDetails, isPending, isSuccess } = useSaveBusinessDetails();
  const { handleUploadDealsFile } = useUploadDealsFile();
  const [isUploadingPhotoState, setIsUploadingPhotoState] = useState(false);

  // Initialize form with React Hook Form and Zod
  const form = useForm<RegisterBusinessFormData>({
    resolver: zodResolver(registerBusinessSchema),
    mode: "onChange",
    defaultValues: {
      logo: null,
      businessName: "",
      businessCategories: [],
      businessDescription: "",
      businessPhone: "",
      businessEmail: "",
      businessPhoto: [],
      businessOpenHours: "",
      businessClosingHours: "",
    },
  });

  // Watch the selected opening time
  const selectedOpeningTime = useWatch({
    control: form.control,
    name: "businessOpenHours"
  });


  // Fetch categories from API
  const { data: categoriesData, isPending: isLoadingCategories } = useGetCategoryList();

  // Transform API response to combobox options format
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.data?.data) return [];

    // Handle both array and object responses
    const categories = Array.isArray(categoriesData.data.data)
      ? categoriesData.data.data
      : categoriesData.data.data?.categories || [];

    return categories.map((category: string | { id?: string; name?: string; value?: string; label?: string }) => {
      if (typeof category === 'string') {
        return {
          value: category.toLowerCase().replace(/\s+/g, '-'),
          label: category,
        };
      }
      return {
        value: category.id || category.value || category.name || '',
        label: category.label || category.name || category.id || '',
      };
    });
  }, [categoriesData]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const loadingToast = toast.loading("Uploading logo...");

      try {
        const formData = new FormData();
        formData.append('file', file);

        const imageUrl = await handleUploadDealsFile(formData, 'images');

        if (imageUrl) {
          form.setValue('logo', imageUrl);
          // Logo updated in form state
        }
        toast.dismiss(loadingToast);
      } catch {
        toast.dismiss(loadingToast);
        // Error toast is already shown by the hook's onError handler
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsUploadingPhotoState(true);
      const loadingToast = toast.loading(`Uploading ${files.length} photo(s)...`);

      try {
        const uploadedUrls: string[] = [];
        const currentPhotos = form.getValues('businessPhoto') || [];

        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          const imageUrl = await handleUploadDealsFile(formData, 'images');
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          }
        }

        if (uploadedUrls.length > 0) {
          const updatedPhotos = [...currentPhotos, ...uploadedUrls];
          form.setValue('businessPhoto', updatedPhotos);
          // Business photos updated in form state
        }
        toast.dismiss(loadingToast);
      } catch {
        toast.dismiss(loadingToast);
        // Error toast is already shown by the hook's onError handler
      } finally {
        setIsUploadingPhotoState(false);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    const currentPhotos = form.getValues('businessPhoto') || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    form.setValue('businessPhoto', updatedPhotos);
  };

  const handleReuploadPhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPhotoState(true);
      const loadingToast = toast.loading("Re-uploading photo...");

      try {
        const formData = new FormData();
        formData.append('file', file);
        const imageUrl = await handleUploadDealsFile(formData, 'images');

        if (imageUrl) {
          const currentPhotos = form.getValues('businessPhoto') || [];
          const updatedPhotos = [...currentPhotos];
          updatedPhotos[index] = imageUrl;
          form.setValue('businessPhoto', updatedPhotos);
          // Business photos updated in form state
        }
        toast.dismiss(loadingToast);
      } catch {
        toast.dismiss(loadingToast);
      } finally {
        setIsUploadingPhotoState(false);
      }
    }
  };

  const getFileInfo = (url: string) => {
    const fileName = url.split('/').pop() || 'image';
    const extension = fileName.split('.').pop()?.toUpperCase() || 'JPG';
    return { fileName, extension };
  };

  const onSubmit = async (data: RegisterBusinessFormData) => {
    // Call API with business details and operation type data
    handleSaveBusinessDetails({
      businessDetails: data,
      operationType: {
        isRegistered: isRegistered || "",
        salesChannels: salesChannels || [],
      },
    });
  };

  // Advance to next step on successful API call and clear temporary data
  useEffect(() => {
    if (isSuccess) {
      clearSalesChannels(); // Clear salesChannels after API call succeeds
      nextStep();
    }
  }, [isSuccess, nextStep, clearSalesChannels]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[600px] w-full">
        <div className="shrink-0 mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Register Your Business</h2>
          <p className="text-gray-600 text-sm">
            Fill in the necessary information to start registration.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">

          {/* Logo Upload */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
              {form.watch('logo') ? (
                <Image src={form.watch('logo') || ''} alt="Logo" className="w-full h-full object-cover" width={96} height={96} />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-sm text-theme-dark-green hover:underline">
                <Upload className="w-4 h-4" />
                Tap To Upload Logo
              </div>
            </label>
            <p className="text-xs text-gray-500 text-center">
              Help Customers Find You With A Logo (Optional)
            </p>
          </div>

          {/* Business Name */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.G Beauty Store And Gadgets"
                    className="w-full px-4 py-6 rounded-lg border border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Categories */}
          <FormComboboxMulti
            control={form.control}
            name="businessCategories"
            label="Business Categories"
            placeholder="Choose From Options"
            options={categoryOptions}
            required
            isLoading={isLoadingCategories}
            searchPlaceholder="Search categories..."
            emptyMessage="No categories found."
          />

          {/* Business Description */}
          <FormTextareaTopLabel
            control={form.control}
            name="businessDescription"
            label="Business Description"
            placeholder="Tell Customers What You Sell Or The Services You Offer."
            required
            rows={4}
            resize="none"
          />

          {/* Business Mobile Number */}
          <FormPhoneInput
            control={form.control}
            name="businessPhone"
            label="Business Mobile Number"
            required
            placeholder="08012345678"
          />

          {/* Business Email */}
          <FormField
            control={form.control}
            name="businessEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Business Email Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="E.G Johndoe@Gmail.Com"
                    className="w-full px-4 py-6 rounded-lg border border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Opening and Closing Hours */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelectTopLabel
              control={form.control}
              name="businessOpenHours"
              label="Business Opening Time"
              options={timeOptions}
              placeholder="Choose Time"
              required
            />

            <FormSelectTopLabel
              control={form.control}
              name="businessClosingHours"
              label="Business Closing Time"
              options={timeOptions}
              placeholder={selectedOpeningTime ? "Choose Closing Time" : "Select Opening Time First"}
              disabled={!selectedOpeningTime}
              required
            />
          </div>

          {/* Business Photo */}
          <FormField
            control={form.control}
            name="businessPhoto"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-lg font-semibold text-gray-900">
                    Business Photo <span className="text-red-500">*</span>
                  </FormLabel>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhotoState}
                      multiple
                      className="hidden"
                      id="business-photo-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('business-photo-upload')?.click()}
                      disabled={isUploadingPhotoState}
                    >
                      <Upload className="w-4 h-4" />
                      Upload More Images
                    </Button>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload A Picture That Shows Your Business — For Example, Your Store, Office, Or The Products You Sell.
                </p>
                {field.value && field.value.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {field.value.map((photoUrl, index) => {
                      const { fileName, extension } = getFileInfo(photoUrl);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                        >
                          <div className="shrink-0">
                            <FileImage className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {fileName.length > 30 ? `${fileName.substring(0, 30)}...` : fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              78 kB • {extension}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => handleReuploadPhoto(index, e)}
                                disabled={isUploadingPhotoState}
                                className="hidden"
                                id={`reupload-photo-${index}`}
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById(`reupload-photo-${index}`)?.click()}
                                disabled={isUploadingPhotoState}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Re-upload photo"
                              >
                                <RefreshCw className="w-4 h-4 text-gray-600" />
                              </button>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              disabled={isUploadingPhotoState}
                              className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                              aria-label="Delete photo"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {(!field.value || field.value.length === 0) && (
                  <FormControl>
                    <label className={`cursor-pointer flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 ${isUploadingPhotoState ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhotoState}
                        multiple
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {isUploadingPhotoState ? "Uploading..." : "Tap to upload from device"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Jpeg and png files supported. Max file size 3mb
                      </span>
                    </label>
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="shrink-0 flex gap-4 pt-4 border-t border-gray-200">

          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-theme-dark-green text-white py-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            isLoading={isPending}
            loadingText="Saving..."
          >
            Go To Business Location
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

