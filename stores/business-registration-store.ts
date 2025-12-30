import { create } from 'zustand';

interface BusinessRegistrationStore {
  currentStep: number;
  isRegistered: string; // Track registration status to determine total steps ("yes" | "no")
  salesChannels: string[]; // Temporarily store sales channels for step 2 API call

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsRegistered: (status: string) => void;
  setSalesChannels: (channels: string[]) => void;
  clearSalesChannels: () => void; // Clear after API call

  // Reset
  resetForm: () => void;
}

export const useBusinessRegistrationStore = create<BusinessRegistrationStore>((set, get) => ({
  currentStep: 1,
  isRegistered: '',
  salesChannels: [],

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, isRegistered } = get();

    // If on step 3 and not registered, skip to step 5 (collection account, skipping document step 4)
    if (currentStep === 3 && isRegistered === "no") {
      set({ currentStep: 5 });
      return;
    }

    // If on step 3 and registered, go to step 4 (document step)
    // If on step 4 and registered, go to step 5 (collection account)
    // Otherwise, increment normally
    const totalSteps = isRegistered === "no" ? 4 : 5; // 4 steps if not registered (skip document step), 5 if registered
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setIsRegistered: (status) => set({ isRegistered: status }),
  setSalesChannels: (channels) => set({ salesChannels: channels }),
  clearSalesChannels: () => set({ salesChannels: [] }),

  resetForm: () => set({
    currentStep: 1,
    isRegistered: '',
    salesChannels: [],
  }),
}));

