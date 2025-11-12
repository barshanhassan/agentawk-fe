import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Added Switch import
import { useToast } from "@/hooks/use-toast";

// Define TypeScript interfaces
interface TimePickerProps {
  hour: string;
  minute: string;
  period: string;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  isDisabled?: boolean;
}

interface DayHours {
  enabled: boolean;
  startHour: string;
  startMinute: string;
  startPeriod: string;
  endHour: string;
  endMinute: string;
  endPeriod: string;
}

interface BusinessHoursState {
  allDayAvailability: boolean; // Added
  allDays: DayHours;
  perDay: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
}

interface DayRowProps {
  day: keyof BusinessHoursState['perDay'];
  label: string;
  hours: DayHours;
  onHoursChange: (part: keyof DayHours, value: string) => void;
  onEnabledChange: (enabled: boolean) => void;
}

interface BusinessHoursSectionProps {
  allDaysSelected: boolean;
  setAllDaysSelected: (selected: boolean) => void;
  businessHours: BusinessHoursState;
  setBusinessHours: (hours: BusinessHoursState) => void;
  allDayAvailability: boolean; // Added
  setAllDayAvailability: (selected: boolean) => void; // Added
}

const TimePicker: React.FC<TimePickerProps> = ({ hour, minute, period, onHourChange, onMinuteChange, onPeriodChange, isDisabled = false }) => (
  <div className="flex gap-2">
    <Select value={hour} onValueChange={onHourChange} disabled={isDisabled}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="HH" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0')).map(h => (
          <SelectItem key={h} value={h}>{h}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={minute} onValueChange={onMinuteChange} disabled={isDisabled}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="MM" />
      </SelectTrigger>
      <SelectContent>
        {['00', '15', '30', '45'].map(m => (
          <SelectItem key={m} value={m}>{m}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={period} onValueChange={onPeriodChange} disabled={isDisabled}>
      <SelectTrigger className="w-[95px]">
        <SelectValue placeholder="AM/PM" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AM">AM</SelectItem>
        <SelectItem value="PM">PM</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const DayRow: React.FC<DayRowProps> = ({ day, label, hours, onHoursChange, onEnabledChange }) => (
    <div className="p-4 border rounded-lg space-y-4 border border-input [border-color:hsl(var(--input))]">
        <div className="flex items-center space-x-3">
            <Checkbox
            id={`checkbox-${day}`}
            checked={hours.enabled}
            onCheckedChange={onEnabledChange}
            />
            <Label htmlFor={`checkbox-${day}`} className="text-sm font-bold capitalize">
            {label}
            </Label>
        </div>
        <div className="space-y-3">
            <div className="flex flex-col items-start justify-between space-y-2">
                <Label className="text-sm text-foreground">Start time</Label>
                <TimePicker
                    hour={hours.startHour}
                    minute={hours.startMinute}
                    period={hours.startPeriod}
                    onHourChange={(value) => onHoursChange('startHour', value)}
                    onMinuteChange={(value) => onHoursChange('startMinute',value)}
                    onPeriodChange={(value) => onHoursChange('startPeriod',value)}
                    isDisabled={!hours.enabled}
                />
            </div>
            <div className="flex flex-col items-start justify-between space-y-2">
                <Label className="text-sm text-foreground">End time</Label>
                <TimePicker
                    hour={hours.endHour}
                    minute={hours.endMinute}
                    period={hours.endPeriod}
                    onHourChange={(value) => onHoursChange('endHour', value)}
                    onMinuteChange={(value) => onHoursChange('endMinute', value)}
                    onPeriodChange={(value) => onHoursChange('endPeriod', value)}
                    isDisabled={!hours.enabled}
                />
            </div>
        </div>
    </div>
);


const BusinessHoursSection: React.FC<BusinessHoursSectionProps> = ({ allDaysSelected, setAllDaysSelected, businessHours, setBusinessHours, allDayAvailability, setAllDayAvailability }) => {
    const { toast } = useToast();

    const handleAllDaysHoursChange = (part: keyof DayHours, value: string) => {
        const newBusinessHours = {
            ...businessHours,
            allDays: {
                ...businessHours.allDays,
                [part]: value,
            },
        };
        setBusinessHours(newBusinessHours);
    };

    const handlePerDayHoursChange = (day: keyof BusinessHoursState['perDay'], part: keyof DayHours, value: string) => {
        const newBusinessHours = {
            ...businessHours,
            perDay: {
                ...businessHours.perDay,
                [day]: {
                    ...businessHours.perDay[day],
                    [part]: value,
                },
            },
        };
        setBusinessHours(newBusinessHours);
    };

    const handlePerDayEnabledChange = (day: keyof BusinessHoursState['perDay'], enabled: boolean) => {
        const newBusinessHours = {
            ...businessHours,
            perDay: {
                ...businessHours.perDay,
                [day]: {
                    ...businessHours.perDay[day],
                    enabled,
                },
            },
        };
        setBusinessHours(newBusinessHours);
    };

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Business Hours</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enable business hours to convey the working hours of your company. These are the hours when your business is closed and agents are not available to respond to support requests.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="all-day-availability-toggle">Enable 24/7 availability for all days</Label>
          <Switch
            id="all-day-availability-toggle"
            checked={allDayAvailability}
            onCheckedChange={setAllDayAvailability}
          />
        </div>

        {!allDayAvailability && ( // Conditional rendering for the RadioGroup and time selection
          <>
            <RadioGroup
              value={allDaysSelected ? "allDays" : "perDay"}
              onValueChange={(value) => setAllDaysSelected(value === "allDays")}
              className="flex space-x-4"
              disabled={allDayAvailability} // Disable radio group when 24/7 is active
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="allDays" id="allDays" />
                <Label htmlFor="allDays">All days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perDay" id="perDay" />
                <Label htmlFor="perDay">Per day</Label>
              </div>
            </RadioGroup>

            {allDaysSelected ? (
              <div className="p-4 border rounded-lg space-y-4 w-fit border border-input [border-color:hsl(var(--input))]">
                <Label className="text-sm font-bold">All days</Label>
                <div className="flex flex-col items-start justify-between space-y-2">
                    <Label className="text-sm">Start time</Label>
                    <TimePicker
                        hour={businessHours.allDays.startHour}
                        minute={businessHours.allDays.startMinute}
                        period={businessHours.allDays.startPeriod}
                        onHourChange={(value) => handleAllDaysHoursChange('startHour', value)}
                        onMinuteChange={(value) => handleAllDaysHoursChange('startMinute', value)}
                        onPeriodChange={(value) => handleAllDaysHoursChange('startPeriod', value)}
                        isDisabled={allDayAvailability} // Disable when 24/7 is active
                    />
                </div>
                <div className="flex flex-col items-start justify-between space-y-2">
                    <Label className="text-sm">End time</Label>
                    <TimePicker
                        hour={businessHours.allDays.endHour}
                        minute={businessHours.allDays.endMinute}
                        period={businessHours.allDays.endPeriod}
                        onHourChange={(value) => handleAllDaysHoursChange('endHour', value)}
                        onMinuteChange={(value) => handleAllDaysHoursChange('endMinute', value)}
                        onPeriodChange={(value) => handleAllDaysHoursChange('endPeriod', value)}
                        isDisabled={allDayAvailability} // Disable when 24/7 is active
                    />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {daysOfWeek.map(dayString => {
                  const day = dayString as keyof BusinessHoursState['perDay'];
                  return (
                    <DayRow
                      key={day}
                      day={day}
                      label={day.charAt(0).toUpperCase() + day.slice(1)} // Capitalize for display
                      hours={businessHours.perDay[day]}
                      onHoursChange={(part, value) => handlePerDayHoursChange(day, part, value)}
                      onEnabledChange={(enabled) => handlePerDayEnabledChange(day, enabled)}
                    />
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => {
            console.log("Save Business Hours", { ...businessHours, allDayAvailability });
            toast({
              title: "Settings Saved",
              description: "Business hours settings have been updated.",
            });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
        >
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default BusinessHoursSection;
