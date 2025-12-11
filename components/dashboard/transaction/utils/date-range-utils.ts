export type DateRangeOption = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Last Month' | 'All Time' | 'Custom Duration';

// Helper function to format date as dd-mm-yyyy
export const formatDateDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to get date range based on option
export const getDateRange = (
  option: DateRangeOption,
  customStartDate?: Date,
  customEndDate?: Date
): { fromDate: string; toDate: string } => {
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

    case 'All Time':
      return {
        fromDate: currentDate,
        toDate: currentDate,
      };

    case 'Custom Duration':
      if (customStartDate && customEndDate) {
        return {
          fromDate: formatDateDDMMYYYY(customStartDate),
          toDate: formatDateDDMMYYYY(customEndDate),
        };
      }
      return {
        fromDate: currentDate,
        toDate: currentDate,
      };

    default:
      return {
        fromDate: currentDate,
        toDate: currentDate,
      };
  }
};

