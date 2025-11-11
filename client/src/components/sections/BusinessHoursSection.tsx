import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TimePicker = ({ hour, minute, period, onHourChange, onMinuteChange, onPeriodChange, isDisabled = false }) => (
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

const DayRow = ({ day, label, hours, onHoursChange, onEnabledChange }) => (
    <div className="space-y-4">
        <div className="flex items-center space-x-3">
            <Checkbox
            id={`checkbox-${day}`}
            checked={hours.enabled}
            onCheckedChange={onEnabledChange}
            />
            <Label htmlFor={`checkbox-${day}`} className="text-sm font-medium capitalize">
            {label}
            </Label>
        </div>
        <div className="pl-8 space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Start time</Label>
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
            <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">End time</Label>
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


const BusinessHoursSection = ({ allDaysSelected, setAllDaysSelected, businessHours, setBusinessHours }) => {

    const handleAllDaysHoursChange = (part, value) => {
        setBusinessHours(prev => ({
            ...prev,
            allDays: { ...prev.allDays, [part]: value }
        }));
    };

    const handlePerDayHoursChange = (day, part, value) => {
        setBusinessHours(prev => ({
            ...prev,
            perDay: {
                ...prev.perDay,
                [day]: { ...prev.perDay[day], [part]: value }
            }
        }));
    };

    const handlePerDayEnabledChange = (day, enabled) => {
        setBusinessHours(prev => ({
            ...prev,
            perDay: {
                ...prev.perDay,
                [day]: { ...prev.perDay[day], enabled }
            }
        }));
    };

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
        <RadioGroup
          value={allDaysSelected ? "allDays" : "perDay"}
          onValueChange={(value) => setAllDaysSelected(value === "allDays")}
          className="flex space-x-4"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm">Start time</Label>
                <TimePicker
                    hour={businessHours.allDays.startHour}
                    minute={businessHours.allDays.startMinute}
                    period={businessHours.allDays.startPeriod}
                    onHourChange={(value) => handleAllDaysHoursChange('startHour', value)}
                    onMinuteChange={(value) => handleAllDaysHoursChange('startMinute', value)}
                    onPeriodChange={(value) => handleAllDaysHoursChange('startPeriod', value)}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label className="text-sm">End time</Label>
                <TimePicker
                    hour={businessHours.allDays.endHour}
                    minute={businessHours.allDays.endMinute}
                    period={businessHours.allDays.endPeriod}
                    onHourChange={(value) => handleAllDaysHoursChange('endHour', value)}
                    onMinuteChange={(value) => handleAllDaysHoursChange('endMinute', value)}
                    onPeriodChange={(value) => handleAllDaysHoursChange('endPeriod', value)}
                />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(businessHours.perDay).map(day => (
              <DayRow
                key={day}
                day={day}
                label={day}
                hours={businessHours.perDay[day]}
                onHoursChange={(part, value) => handlePerDayHoursChange(day, part, value)}
                onEnabledChange={(enabled) => handlePerDayEnabledChange(day, enabled)}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => console.log("Save Business Hours", businessHours)} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default BusinessHoursSection;
