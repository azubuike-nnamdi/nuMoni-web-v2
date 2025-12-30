import { SignUpFormData } from '@/lib/schemas/signup-schema';
import { create } from 'zustand';

interface SignUpStore {
  currentStep: number;
  formData: Partial<SignUpFormData>;
  showWelcomeModal: boolean;
  showOtpBanner: boolean;
  otpResendTimer: number; // in seconds
  isOtpSent: boolean;
  currentOtpType: 'EMAIL' | 'MOBILE' | null; // Track which OTP type is being verified

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  setOtp: (otp: string) => void;
  setShowWelcomeModal: (show: boolean) => void;
  setShowOtpBanner: (show: boolean) => void;
  setOtpResendTimer: (seconds: number) => void;
  setIsOtpSent: (sent: boolean) => void;
  setCurrentOtpType: (type: 'EMAIL' | 'MOBILE' | null) => void;
  resetForm: () => void;
  submitForm: (data: SignUpFormData) => void;
}

const initialFormData: Partial<SignUpFormData> = {
  fullName: '',
  email: '',
  phoneNumber: '',
  otp: '',
  password: '',
  confirmPassword: '',
};

export const useSignUpStore = create<SignUpStore>((set, get) => ({
  currentStep: 1,
  formData: initialFormData,
  showWelcomeModal: false,
  showOtpBanner: false,
  otpResendTimer: 0,
  isOtpSent: false,
  currentOtpType: null,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  setOtp: (otp) => set((state) => ({
    formData: { ...state.formData, otp }
  })),

  setShowWelcomeModal: (show) => set({ showWelcomeModal: show }),

  setShowOtpBanner: (show) => set({ showOtpBanner: show }),

  setOtpResendTimer: (seconds) => set({ otpResendTimer: seconds }),

  setIsOtpSent: (sent) => set({ isOtpSent: sent }),

  setCurrentOtpType: (type) => set({ currentOtpType: type }),

  resetForm: () => set({
    currentStep: 1,
    formData: initialFormData,
    showWelcomeModal: false,
    showOtpBanner: false,
    otpResendTimer: 0,
    isOtpSent: false,
    currentOtpType: null,
  }),

  submitForm: (data) => {
    console.log('=== SIGN UP FORM SUBMISSION ===');
    console.log('Complete Payload:', JSON.stringify(data, null, 2));
    console.log('==============================');

    // Here you would typically send the data to your API
    // Example API call:
    // fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })

    // Show welcome modal after successful signup
    set({ showWelcomeModal: true });
  }
}));

