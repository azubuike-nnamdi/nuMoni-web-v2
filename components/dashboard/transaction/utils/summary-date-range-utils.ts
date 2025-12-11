import { SummaryDateRangeOption } from "../components/summary-date-range-filter";
import { formatDateDDMMYYYY } from "./date-range-utils";

// Helper function to get date range based on option (for summary, no custom duration)
export const getSummaryDateRange = (option: SummaryDateRangeOption): { fromDate: string; toDate: string } => {
  const today = new Date();
  const currentDate = formatDateDDMMYYYY(today);

  switch (option) {
    case 'Today':
      return {
        fromDate: currentDate,
        toDate: currentDate,
      };

    case 'Yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        fromDate: formatDateDDMMYYYY(yesterday),
        toDate: currentDate,
      };
    }

    case 'This Week': {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return {
        fromDate: formatDateDDMMYYYY(sevenDaysAgo),
        toDate: currentDate,
      };
    }

    case 'This Month': {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        fromDate: formatDateDDMMYYYY(firstDayOfMonth),
        toDate: currentDate,
      };
    }

    case 'Last Month': {
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return {
        fromDate: formatDateDDMMYYYY(firstDayOfLastMonth),
        toDate: currentDate,
      };
    }

    default:
      return {
        fromDate: currentDate,
        toDate: currentDate,
      };
  }
};

