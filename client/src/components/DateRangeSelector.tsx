import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function DateRangeSelector({ onDateRangeChange }: DateRangeSelectorProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    onDateRangeChange?.(range);
  };

  const quickSelects = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last Month", days: 30 },
    { label: "Last 3 Months", days: 90 },
    { label: "This Year", days: 365 },
  ];

  const handleQuickSelect = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    handleDateChange({ from, to });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
            data-testid="button-date-range"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} -{" "}
                  {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="flex gap-2">
        {quickSelects.map((select) => (
          <Button
            key={select.label}
            variant="outline"
            size="sm"
            onClick={() => handleQuickSelect(select.days)}
            data-testid={`button-${select.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {select.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
