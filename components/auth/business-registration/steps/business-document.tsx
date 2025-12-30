"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSaveBusinessDocuments } from "@/hooks/mutation/useSaveBusinessDocuments";
import { useUploadDealsFile } from "@/hooks/mutation/useUploadFile";
import { BusinessDocumentFormData, businessDocumentSchema } from "@/lib/schemas/business-registration-schema";
import { useBusinessRegistrationStore } from "@/stores/business-registration-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function BusinessDocument() {
  const {
    nextStep,
  } = useBusinessRegistrationStore();

  const { handleSaveBusinessDocuments, isPending, isSuccess } = useSaveBusinessDocuments();
  const { handleUploadDealsFile, isPending: isUploading } = useUploadDealsFile();

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const hasNavigatedRef = useRef(false);

  // Initialize form with React Hook Form and Zod
  const form = useForm<BusinessDocumentFormData>({
    resolver: zodResolver(businessDocumentSchema),
    mode: "onSubmit",
    defaultValues: {
      identificationType: undefined,
      registrationNumber: "",
      tin: "",
      cacDocument: null,
    },
  });

  const handleFileUpload = (fieldName: keyof BusinessDocumentFormData) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingField(fieldName);
      const loadingToast = toast.loading("Uploading document...");

      try {
        const formData = new FormData();
        formData.append('file', file);
        const fileUrl = await handleUploadDealsFile(formData, 'documents');

        if (fileUrl) {
          form.setValue(fieldName, fileUrl, { shouldValidate: true });
          toast.dismiss(loadingToast);
          toast.success("Document uploaded successfully");
        }
      } catch {
        toast.dismiss(loadingToast);
        toast.error("Failed to upload document");
      } finally {
        setUploadingField(null);
      }
    }
  };

  const handleRemoveDocument = (fieldName: keyof BusinessDocumentFormData) => {
    form.setValue(fieldName, null, { shouldValidate: true });
  };

  const handleReuploadDocument = (fieldName: keyof BusinessDocumentFormData) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingField(fieldName);
      const loadingToast = toast.loading("Re-uploading document...");

      try {
        const formData = new FormData();
        formData.append('file', file);
        const fileUrl = await handleUploadDealsFile(formData, 'documents');

        if (fileUrl) {
          form.setValue(fieldName, fileUrl, { shouldValidate: true });
          toast.dismiss(loadingToast);
          toast.success("Document re-uploaded successfully");
        }
      } catch {
        toast.dismiss(loadingToast);
        toast.error("Failed to re-upload document");
      } finally {
        setUploadingField(null);
      }
    }
  };

  const getFileInfo = (url: string) => {
    const fileName = url.split('/').pop() || 'document';
    const extension = fileName.split('.').pop()?.toUpperCase() || 'PDF';
    return { fileName, extension };
  };

  const onSubmit = async (data: BusinessDocumentFormData) => {
    // Map form data to API payload structure
    const payload = {
      identificationType: data.identificationType,
      identificationTypeNumber: data.registrationNumber,
      businessRegNo: data.registrationNumber,
      tinNo: data.tin || undefined,
      cacDocumentPath: data.cacDocument || null,
      reqCertificatePath: null,
      tinPath: null, // Removed from form
      menuPath: null, // Removed from form
      verifiedNin: false,
      verifiedTinNo: false,
      verifiedCac: false,
    };

    // Call API
    handleSaveBusinessDocuments(payload);
  };

  const handleFormError = (errors: unknown) => {
    console.error('Form validation errors:', errors);
  };

  // Advance to next step on successful API call
  useEffect(() => {
    if (isSuccess && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      nextStep();
    }
  }, [isSuccess, nextStep]);

  // Reset navigation flag when component mounts or when isSuccess becomes false
  useEffect(() => {
    if (!isSuccess) {
      hasNavigatedRef.current = false;
    }
  }, [isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="flex flex-col h-full max-h-[600px] w-full">
        <div className="shrink-0 mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Business Document</h2>
          <p className="text-gray-600 text-sm">
            Once verified, you&apos;ll earn a Verified Merchant badge.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">

          {/* Identification Type */}
          <FormField
            control={form.control}
            name="identificationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Identification Type <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : value);
                    }}
                    className="w-full px-4 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose Type From Options</option>
                    <option value="nin">NIN (National Identification Number)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Registration Number */}
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Business Registration Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.G., RC1234567 Or BN8765432"
                    className="w-full px-4 py-6 rounded-lg border border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload CAC Document */}
          <FormField
            control={form.control}
            name="cacDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Upload CAC Document <span className="text-red-500">*</span>
                </FormLabel>
                {field.value ? (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="shrink-0">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getFileInfo(field.value).fileName.length > 30
                          ? `${getFileInfo(field.value).fileName.substring(0, 30)}...`
                          : getFileInfo(field.value).fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFileInfo(field.value).extension}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={handleReuploadDocument("cacDocument")}
                          disabled={uploadingField === "cacDocument"}
                          className="hidden"
                          id="reupload-cac-document"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('reupload-cac-document')?.click()}
                          disabled={uploadingField === "cacDocument"}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Re-upload document"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument("cacDocument")}
                        disabled={uploadingField === "cacDocument"}
                        className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Delete document"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <FormControl>
                    <label className={`cursor-pointer flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 ${uploadingField === "cacDocument" ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={handleFileUpload("cacDocument")}
                        disabled={uploadingField === "cacDocument"}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploadingField === "cacDocument" ? "Uploading..." : "Tap to upload from device"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Jpeg, png, pdf files supported. Max file size 3mb
                      </span>
                    </label>
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Tax Identification Number */}
          <FormField
            control={form.control}
            name="tin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Tax Identification Number (TIN)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.G., 01234567-0001"
                    className="w-full px-4 py-6 rounded-lg border border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="shrink-0 flex items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">

          <Button
            type="submit"
            disabled={isPending || isUploading}
            className="flex-1 bg-theme-dark-green text-white py-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            isLoading={isPending}
            loadingText="Saving..."
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

