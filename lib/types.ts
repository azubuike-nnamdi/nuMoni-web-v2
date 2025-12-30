import { ComponentType, ReactNode } from "react";


type TanstackProviderProps = {
  children: ReactNode
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
}

type DashboardProps = {
  brandName?: string;
  merchantId?: string;
  logoUrl?: string;
  qrCodeUrl?: string;
  qrTitle?: string;
  qrDescription?: string;
  summaryContent?: ReactNode;
  onAccountSettings?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

type GenerateOtpPayload = {
  username: string;
  usertype: string;
  otptype: string;

}

type ValidateOtpPayload = {
  username: string;
  usertype: string;
  otptype: string;
  otp: string;
}

type BrandSummaryProps = {
  title?: string;
  subtitle?: string;
  onboardedBranches?: number;
  availableBrandPoints?: string;
  totalCustomers?: string;
}

type QRCodeCardProps = {
  qrCodeUrl?: string;
  title?: string;
  description?: string;
  onDownload?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

type BrandProfileProps = {
  brandName?: string;
  merchantId?: string;
  logoUrl?: string;
  onAccountSettings?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isVerified?: boolean;
}

type SummaryItem = {
  label: string;
  value: string;
  color: 'green' | 'red' | 'gray';
}

type MainBranchSummaryProps = {
  title?: string;
  items?: SummaryItem[];
}

type BranchSummaryData = {
  id: string;
  merchantName: string;
  merchantId: string;
  merchantLogo: string;
  status: 'active' | 'closed' | 'pending';
  todayTransactions: {
    allocatedBudget: number;
    amountSpent: number;
    fees: number;
  };
}

type Branch = {
  branchId: string;
  merchantId: string;
  name: string;
  logo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  totalAmountRecieved?: number;
  totalPayout?: number;
  fees?: number;
}

type GetBranchesResponse = {
  data: Branch[];
  success: boolean;
  count: number;
  message: string;
  accessedBy: string;
}

type SocialMediaData = {
  whatsApp?: string | null;
  instagram?: string | null;
  x?: string | null;
  linkedin?: string | null;
  snapchat?: string | null;
  website?: string | null;
}


type ActiveBranchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

type RewardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  icon?: ReactNode;
  iconColor?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
  title: string;
  description: string;
  subDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  secondaryButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  primaryButtonColor?: string;
  secondaryButtonColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

type Customer = {
  totalTransactions: number;
  totalSpent: number;
  mostShoppedBranch: string;
  customerId: string;
  customerName: string;
  rank?: number;
}

type CustomerAnalyticsData = {
  totalTransactions: number;
  totalSpent: number;
  mostShoppedBranch: string;
  customerId: string;
  customerUserId: string;
  customerName: string;
}

type CustomerAnalyticsResponse = {
  topLoyalCustomers: CustomerAnalyticsData[];
  totalCustomers: number;
}

type BranchAnalyticsData = {
  branchId: string;
  branchName: string;
  logo: string;
  totalPointsIssued: number;
}

type CustomerCardProps = {
  customer: Customer;
  rank?: number;
}

type CustomerSectionProps = {
  title: string;
  customers: Customer[];
}


type RewardRulesSectionProps = {
  earnMethod: string;
  minSpending: string;
  setMinSpending: (value: string) => void;
  maxSpending: string;
  setMaxSpending: (value: string) => void;
  rewardPercentage: string;
  setRewardPercentage: (value: string) => void;
  rewardRules: Array<{ min: string, max: string, percentage: string }>;
  setRewardRules: (rules: Array<{ min: string, max: string, percentage: string }>) => void;
  showTable: boolean;
  setShowTable: (show: boolean) => void;
}

type RewardCapSectionProps = {
  rewardCap: string;
  setRewardCap: (value: string) => void;
}

type MilestoneTargetSectionProps = {
  milestoneTarget: string;
  setMilestoneTarget: (value: string) => void;
}

type ReceiveMethodSectionProps = {
  receiveMethod: string;
  setReceiveMethod: (value: string) => void;
}

type ExpirationSectionProps = {
  pointExpiration: string;
  setPointExpiration: (value: string) => void;
}

type DateSectionProps = {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

type signInPayload = {
  username: string;
  password: string;
  usertype: string;
  deviceId: string;
}

type AuthUser = {
  id: string;
  username: string;
  usertype: string;
  roles: string[];
  token: string;
  refreshToken: string;
  regLevel?: number;
}

type AuthUserStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logoutInProgress: boolean;

  // Actions
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setLogoutInProgress: (inProgress: boolean) => void;
}

type CreateRewardsPayload = {
  merchantId: string;
  rewardType: string;
  rules: Array<{
    minSpend: number;
    maxSpend: number;
    rewardValue: number;
  }>;
  rewardCap: number;
  distributionType: string;
  milestoneTarget: number;
  pointExpirationDays: number;
  status: string;
  startDate: string | null;
  endDate: string | null;

}

type UpdateBranchManagerPayload = {
  branchId: string;
  name: string;
  email: string;
  phone: string;
}


type AdminNavigationItem = {
  name: string;
  path?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  children?: AdminNavigationItem[];
  badge?: string;
}

type RewardRule = {
  minSpend: number;
  maxSpend: number;
  rewardValue: number;
};

type Rewards = {
  id: string;
  merchantId: string;
  rewardType: string;
  rules: Array<RewardRule>;
  rewardCap: number;
  distributionType: string;
  milestoneTarget: number;
  pointExpirationDays: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

// Axios error type for API error handling
type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};

// Error display component props
type ErrorDisplayProps = {
  error?: string;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
};

// Point analytics component props
type PointAnalyticsProps = {
  isPending: boolean;
  rewardTableData: Rewards | null;
  errorMessage?: string;
  isError: boolean;
  onRetry?: () => void;
};

type singleBranchDetails = {
  lga: string;
  openingTime: string;
  latitude: string;
  description: string;
  linkedin: string | null;
  instagram: string | null;
  managerProfilePhoto: string;
  snapchat: string | null;
  emailAddress: string;
  closingTime: string;
  merchantId: string;
  logo: string;
  minimumPaymentAmount: string;
  bankAccountNumber: string;
  id: string;
  state: string;
  longitude: string;
  bankAccountName: string;
  bankCode: string;
  images: string[];
  website: string;
  address: string;
  whatsApp: string;
  managerId: string;
  phoneNumber: string;
  totalAmountRecieved: number;
  totalPayout: number;
  fees: number;
  name: string;
  x: string | null;
  region: string;
  status: string;
  managerDetails: {
    name: string;
    email: string;
    phone: string;
  }
}

type BankPayload = {
  secret: string;
  clientId: string;
}

type BankToken = {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  expirationTime?: number;
}

type VerifyBankPayload = {
  bankCode: string;
  accountNumber: string;
}

type VerifyPayOnUsBankPayload = {
  institutionCode: string;
  accountNumber: string;
  businessId: string;
}

type ChangeBranchStatusPayload = {
  branchId: string;
  status: string;
}

type BranchManagerPayload = {
  name: string
  email: string
  phone: string
}


type UpdateRewardRuleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleData: Rewards | null;
}


// Transaction data type based on API response
type Transaction = {
  transactionViewId: string;
  customerId: string;
  merchantId: string;
  merchantName: string;
  merchantImageURl: string | null;
  customername: string;
  customerImageURl: string | null;
  createdDt: string;
  type: string;
  transactionId: string;
  transactionNo: string | null;
  status: string | null;
  trnType: 'C' | 'D';
  amount: number;
}

type InfoItem = {
  label: string;
  value: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isBadge?: boolean;
};

type AccountInformationProps = {
  registrationDate: string;
  lastLogin: string;
  accountType: string;
  accountStatus: "Verified" | "Pending" | "Suspended";
  identityType: string;
  identityNumber: string;
  businessNumber: string;
  maxPointsIssued: string;
}

type Bank = {
  code: string;
  name: string;
}

type VerifyBankNamePayload = {
  institutionCode: string;
  accountNumber: string;
}

type MutationErrorType = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
}

type TransactionData = {
  id: string;
  transactionId: string | null;
  transactionType: string;
  operationType: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  customerId: string;
  customerName: string | null;
  customerImageUrl: string | null;
  merchantId: string;
  merchantName: string | null;
  businessImagePath: string | null;
  walletType: string | null;
  sourceTable: string;
  balanceBeforeTransaction: number | null;
  balanceAfterTransaction: number | null;
  referenceTransactionId: string | null;
  fee: number | null;
  trnType: string | null;
  dealId: string | null;
  dealName: string | null;
  dealType: string | null;
  unitsPurchased: number | null;
  branchId: string | null;
  branchName: string;
  invoiceRefId: string | null;
  invoiceNo: string;
  transactionReferenceId: string;
  numoniTransactionRefId: string | null;
  transactionNo: string | null;
  amountByWallet: number | null;
  amountBrandWallet: number | null;
  numoniPoints: number | null;
  brandPoints: number | null;
  amountPaid: number;
  settledAmount: number | null;
  issuedPoints: number | null;
  beneficiaryAccountNumber: string | null;
  beneficiaryAccountName: string | null;
  bankCode: string | null;
  bankName: string | null;
  paymentGateway: string | null;
  transferResponseCode: string | null;
  transactionCategory: string;
  title: string;
  paymentDt: string | null;
  createdDt: string | null;
  updatedDt: string | null;
  incoming: boolean;
  outgoing: boolean;
}

type PointOfSaleData = {
  id: string;
  posId: string;
  posName: string;
  merchantId: string;
  branchId: string;
  bankName: string;
  accountNo: string;
  accountHolderName: string;
  bankCode: string;
  bankTransferCode: string;
  location: string;
  address: string;
  status: string;
  posQRCode: string;
  createDate: string;
  updatedDate: string;
  merchantLogo: string;
  merchantName: string;
  merchantUserId: string;
}

export type { AccountInformationProps, ActiveBranchModalProps, AdminNavigationItem, AuthUser, AuthUserStore, AxiosError, Bank, BankPayload, BankToken, Branch, BranchAnalyticsData, BranchManagerPayload, BranchSummaryData, BrandProfileProps, BrandSummaryProps, ChangeBranchStatusPayload, CreateRewardsPayload, Customer, CustomerAnalyticsData, CustomerAnalyticsResponse, CustomerCardProps, CustomerSectionProps, DashboardProps, DateSectionProps, ErrorDisplayProps, ExpirationSectionProps, GenerateOtpPayload, GetBranchesResponse, InfoItem, MainBranchSummaryProps, MetricCardProps, MilestoneTargetSectionProps, MutationErrorType, PointAnalyticsProps, PointOfSaleData, QRCodeCardProps, ReceiveMethodSectionProps, RewardCapSectionProps, RewardModalProps, RewardRule, RewardRulesSectionProps, Rewards, SidebarProps, signInPayload, singleBranchDetails, SocialMediaData, TanstackProviderProps, Transaction, TransactionData, UpdateBranchManagerPayload, UpdateRewardRuleModalProps, ValidateOtpPayload, VerifyBankNamePayload, VerifyBankPayload, VerifyPayOnUsBankPayload };

