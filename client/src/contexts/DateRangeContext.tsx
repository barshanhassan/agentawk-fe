import React, { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

interface DateRangeContextType {
  dateRange: string;
  setDateRange: (range: string) => void;
  customDate: DateRange | undefined;
  setCustomDate: (date: DateRange | undefined) => void;
  isCustomDateOpen: boolean;
  setIsCustomDateOpen: (open: boolean) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState("last-7-days");
  const [customDate, setCustomDate] = useState<DateRange | undefined>(undefined);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  return (
    <DateRangeContext.Provider
      value={{
        dateRange,
        setDateRange,
        customDate,
        setCustomDate,
        isCustomDateOpen,
        setIsCustomDateOpen,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within DateRangeProvider");
  }
  return context;
}

