import { BranchIcon, DashboardIcon, RewardIcon } from "@/components/common/icon-svg";
import { dealIcon, emailIcon, graphDirectionIcon, instagramIcon, musicPauseIcon, phoneNotificationIcon, twitterIcon, whatsappIcon } from "@/constant/icons";
import { BRANCH_LEVEL_URL, DASHBOARD_URL, POS_URL, REWARD_TABLE_URL, TRANSACTIONS_URL } from "@/constant/routes";
import { PanelTopClose } from "lucide-react";

const navigationItems = [
  {
    name: 'Home',
    path: DASHBOARD_URL,
    icon: DashboardIcon
  },
  {
    name: 'Branch-Level',
    path: BRANCH_LEVEL_URL,
    icon: BranchIcon
  },
  {
    name: 'Reward Table',
    path: REWARD_TABLE_URL,
    icon: RewardIcon
  },
  {
    name: 'Transactions',
    path: TRANSACTIONS_URL,
    icon: PanelTopClose
  },
  {
    name: 'Point of Sale',
    path: POS_URL,
    icon: PanelTopClose
  }
  // {
  //   name: 'Points',
  //   path: POINTS_URL,
  //   icon: BarChart3
  // }
  // {
  //   name: 'Deals & Promos',
  //   path: DEALS_AND_PROMOS_URL,
  //   icon: DealIcon
  // }
]



// Data for "What You Can Do" section
const whatYouCanDoData = [
  {
    icon: dealIcon,
    alt: "Deal Icon",
    text: "Define rewards as a percentage, fixed amount, or by category"
  },
  {
    icon: graphDirectionIcon,
    alt: "Graph Direction Icon",
    text: "Set limits and caps to control total points issued"
  },
  {
    icon: musicPauseIcon,
    alt: "Pause Icon",
    text: "Pause and resume rewards when needed"
  },
  {
    icon: phoneNotificationIcon,
    alt: "Notification Icon",
    text: "Get notified when 75% of your reward budget is used"
  }
];

// Data for "Benefits" section
const benefitsData = [
  {
    icon: dealIcon,
    alt: "Control Icon",
    text: "Keep full control of your marketing spend"
  },
  {
    icon: graphDirectionIcon
    ,
    alt: "Motivation Icon",
    text: "Motivate customers to keep coming back"
  },
  {
    icon: musicPauseIcon,
    alt: "Fairness Icon",
    text: "Ensure rewards stay fair and sustainable"
  }
];

const tabs = [
  { id: "reward-table", label: "Reward Table" },
  // { id: "customers-score", label: "Customers Score" },
  { id: "customer", label: "Customer" },
  { id: "analytics-trends", label: "Analytics & Trends" },
  { id: "points-distributed", label: "Points Distributed" },
  { id: "points-redeemed", label: "Points Redeemed" }
];





const regions = [
  "Lagos", "Kogi", "Abuja", "Delta", "Bayelsa", "Rivers", "Kano", "Kaduna",
  "Ogun", "Oyo", "Osun", "Ondo", "Edo", "Enugu", "Anambra", "Imo", "Abia"
];





// Point Allocation Dashboard Data
const branches = [
  "Chicken Republic Ikeja",
  "Chicken Republic Vi",
  "Chicken Republic Abuja",
  "Chicken Republic Ketu",
  "Chicken Republic Surulere"
];



const timelineOptions = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "Custom Range"
];




// Social Media Platforms Configuration
const socialMediaPlatforms = [
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: whatsappIcon,
    color: 'text-green-600'
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: instagramIcon,
    color: 'text-pink-600'
  },
  {
    key: 'x',
    name: 'X(Twitter)',
    icon: twitterIcon,
    color: 'text-gray-600'
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: emailIcon, // Using email icon as fallback
    color: 'text-blue-700'
  },
  {
    key: 'snapchat',
    name: 'Snapchat',
    icon: emailIcon, // Using email icon as fallback
    color: 'text-yellow-600'
  },
  {
    key: 'website',
    name: 'Website',
    icon: emailIcon, // Using email icon as fallback
    color: 'text-gray-700'
  }
];



export {
  benefitsData,
  branches,
  navigationItems, regions,
  socialMediaPlatforms,
  tabs, timelineOptions,
  whatYouCanDoData,
};

