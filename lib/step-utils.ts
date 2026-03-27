export const getStepDescription = (step: number): string => {
  switch (step) {
    case 1: return "Add a new branch or location under your organization's structure.";
    case 2: return "Provide the contact details and address for this branch.";
    case 3: return "Assign a manager and set the operating hours for this branch.";
    case 4: return "Configure the payment and point-of-sale settings for this branch.";
    case 5: return "Review your branch details and confirm to complete setup.";
    default: return "Complete the steps to finish setting up your new branch.";
  }
};


