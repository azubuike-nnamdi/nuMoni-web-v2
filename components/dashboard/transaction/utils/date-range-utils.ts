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
      const yesterdayStr = formatDateDDMMYYYY(yesterday);
      return {
        fromDate: yesterdayStr,
        toDate: yesterdayStr,
      };
    }

    case 'This Week': {
      const startOfWeek = new Date(today);
      const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = startOfWeek.getDate() - day; // adjust when day is sunday
      startOfWeek.setDate(diff); // Set to Sunday
      return {
        fromDate: formatDateDDMMYYYY(startOfWeek),
        toDate: currentDate,
      };
    }

    case 'This Month': {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        fromDate: formatDateDDMMYYYY(firstDayOfMonth),
        toDate: formatDateDDMMYYYY(lastDayOfMonth),
      };
    }

    case 'Last Month': {
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        fromDate: formatDateDDMMYYYY(firstDayOfLastMonth),
        toDate: formatDateDDMMYYYY(lastDayOfLastMonth),
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

