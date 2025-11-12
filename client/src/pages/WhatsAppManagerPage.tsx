import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Moved this import here
import { format } from "date-fns";
import ProfilePreview from "@/components/ProfilePreview"; // Import the new ProfilePreview component
import TemplatePreview from "@/components/TemplatePreview";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Add Tooltip imports
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Added Popover imports
import { UploadCloud, Trash2, Plus, X } from "react-feather"; // For drag and drop icon, Edit2 icon, and Check icon
import { Info, Calendar, ChevronDown } from "lucide-react"; // Add Info icon import
import { Switch } from "@/components/ui/switch"; // Import Switch component
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Added Dialog components
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { Label } from "@/components/ui/label"; // Added Label
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Added RadioGroup imports
import { useToast } from "@/hooks/use-toast";

export default function WhatsAppManagerPage() {
  const { toast } = useToast();
  // State for Business Profile fields
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("My business name"); // Default value as per requirement
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // State for active tab
  const [activeTab, setActiveTab] = useState("business-profile");

  // Dummy states for badges
  const [isConnected, setIsConnected] = useState(Math.random() < 0.5);
  const [accountHealth, setAccountHealth] = useState(Math.random());

  // Helper TimePicker Component
  interface TimePickerProps {
    hour: string;
    minute: string;
    period: string;
    onHourChange: (value: string) => void;
    onMinuteChange: (value: string) => void;
    onPeriodChange: (value: string) => void;
    isDisabled?: boolean;
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

  // State for Available Call Hours Modal
  const [showAvailableCallHoursModal, setShowAvailableCallHoursModal] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [allDaysSelected, setAllDaysSelected] = useState(true); // Added for radio buttons

  interface DailyCallHours {
    enabled: boolean;
    startHour: string;
    startMinute: string;
    startPeriod: string;
    endHour: string;
    endMinute: string;
    endPeriod: string;
  }

  const initialDayHours: DailyCallHours = {
    enabled: false,
    startHour: '09', startMinute: '00', startPeriod: 'AM',
    endHour: '05', endMinute: '00', endPeriod: 'PM',
  };

  const initialAllCallHours: DailyCallHours = {
    enabled: true,
    startHour: '09', startMinute: '00', startPeriod: 'AM',
    endHour: '05', endMinute: '00', endPeriod: 'PM',
  };

  const [allCallHours, setAllCallHours] = useState<DailyCallHours>(initialAllCallHours); // For "All days" radio option

  const initialDailyCallHours: Record<string, DailyCallHours> = {
    Monday: { ...initialDayHours },
    Tuesday: { ...initialDayHours },
    Wednesday: { ...initialDayHours },
    Thursday: { ...initialDayHours },
    Friday: { ...initialDayHours },
    Saturday: { ...initialDayHours },
    Sunday: { ...initialDayHours },
  };
  const [dailyCallHours, setDailyCallHours] = useState<Record<string, DailyCallHours>>(initialDailyCallHours);

  // State for Unavailable Call Hours Modal
  const [showUnavailableCallHoursModal, setShowUnavailableCallHoursModal] = useState(false);
  const [unavailableStartDate, setUnavailableStartDate] = useState<Date | undefined>(undefined);
  const [unavailableEndDate, setUnavailableEndDate] = useState<Date | undefined>(undefined);
  const [unavailableStartDatePickerOpen, setUnavailableStartDatePickerOpen] = useState(false);
  const [unavailableEndDatePickerOpen, setUnavailableEndDatePickerOpen] = useState(false);
  const [unavailableStartTime, setUnavailableStartTime] = useState({ hour: '', minute: '', period: '' });
  const [unavailableEndTime, setUnavailableEndTime] = useState({ hour: '', minute: '', period: '' });
  const [unavailableReason, setUnavailableReason] = useState('');

  const [showIceBreakersModal, setShowIceBreakersModal] = useState(false);
  const [showCommandsModal, setShowCommandsModal] = useState(false);

  interface Command {
    id: number;
    commandText: string;
    commandDescription: string;
  }
  const [commands, setCommands] = useState<Command[]>([{ id: Date.now(), commandText: "", commandDescription: "" }]);

  const handleCommandChange = (index: number, field: keyof Command, value: string) => {
    const newCommands = [...commands];
    newCommands[index] = { ...newCommands[index], [field]: value };
    setCommands(newCommands);
  };

  const addCommand = () => {
    if (commands.length < 5) {
      setCommands([...commands, { id: Date.now(), commandText: "", commandDescription: "" }]);
    }
  };

  const removeCommand = (id: number) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
  };
  const [templatePhoneNumbers, setTemplatePhoneNumbers] = useState<string[]>([""]); // For Ice Breakers recipients

  interface UnavailablePeriod {
    id: number;
    startDate: Date;
    endDate: Date;
    startTime: { hour: string; minute: string; period: string; };
    endTime: { hour: string; minute: string; period: string; };
    reason?: string;
  }
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([]); // State to store unavailable periods

  const categoryOptions = [
    "Automotive", "Beauty", "Apparel", "Education", "Entertainment",
    "Event Planning", "Finance", "Grocery", "Government", "Hotel",
    "Health", "Nonprofit", "Professional Services", "Retail", "Travel",
    "Restaurant", "Other"
  ];

  // Handle profile photo drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setProfilePhotoFile(files[0]);
      setProfilePhotoPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setProfilePhotoFile(files[0]);
      setProfilePhotoPreviewUrl(URL.createObjectURL(files[0]));
    }
  };


  const handleSaveAvailableCallHours = () => {
    if (allDay) {
      // If 24/7 is enabled, no further validation needed for specific hours
      console.log("Saving Available Call Hours (24/7):", { allDay: true });
    } else if (allDaysSelected) {
      // Validate "All days" single time range
      const { startHour, startMinute, startPeriod, endHour, endMinute, endPeriod } = allCallHours;
      const startTime24 = (parseInt(startHour) % 12) + (startPeriod === 'PM' ? 12 : 0);
      const endTime24 = (parseInt(endHour) % 12) + (endPeriod === 'PM' ? 12 : 0);

      if (startTime24 > endTime24 || (startTime24 === endTime24 && parseInt(startMinute) >= parseInt(endMinute))) {
        toast({
          title: "Invalid Time Range",
          description: "Start time must be before end time for all days.",
          variant: "destructive",
        });
        return;
      }
      console.log("Saving Available Call Hours (All days):", { allDay: false, allDaysSelected: true, allCallHours });
    } else {
      // Validate "Per day" time ranges
      const enabledDays = Object.keys(dailyCallHours).filter(day => dailyCallHours[day].enabled);
      if (enabledDays.length === 0) {
        toast({
          title: "Missing Fields",
          description: "Please select at least one day or enable 24/7 availability.",
          variant: "destructive",
        });
        return;
      }

      for (const day of enabledDays) {
        const hours = dailyCallHours[day];
        const startTime24 = (parseInt(hours.startHour) % 12) + (hours.startPeriod === 'PM' ? 12 : 0);
        const endTime24 = (parseInt(hours.endHour) % 12) + (hours.endPeriod === 'PM' ? 12 : 0);

        if (startTime24 > endTime24 || (startTime24 === endTime24 && parseInt(hours.startMinute) >= parseInt(hours.endMinute))) {
          toast({
            title: "Invalid Time Range",
            description: `For ${day}, start time must be before end time.`,
            variant: "destructive",
          });
          return;
        }
      }
      console.log("Saving Available Call Hours (Per day):", { allDay: false, allDaysSelected: false, dailyCallHours });
    }

    toast({
      title: "Settings Saved",
      description: "Available call hours have been updated.",
    });
    setShowAvailableCallHoursModal(false);
    // Reset state
    setAllDay(false);
    setAllDaysSelected(true); // Reset to "All days" radio option
    setAllCallHours(initialAllCallHours);
    setDailyCallHours(initialDailyCallHours);
  };

  const isUnavailablePeriodFormValid = () => {
    if (!unavailableStartDate || !unavailableEndDate || !unavailableStartTime.hour || !unavailableStartTime.minute || !unavailableStartTime.period || !unavailableEndTime.hour || !unavailableEndTime.minute || !unavailableEndTime.period) {
      return false;
    }

    // Basic validation for start date not being after end date
    if (unavailableStartDate && unavailableEndDate && unavailableStartDate > unavailableEndDate) {
      return false;
    }

    // Basic validation for start time not being after end time if dates are the same
    if (unavailableStartDate?.toDateString() === unavailableEndDate?.toDateString()) {
      const startHour24 = (parseInt(unavailableStartTime.hour) % 12) + (unavailableStartTime.period === 'PM' ? 12 : 0);
      const endHour24 = (parseInt(unavailableEndTime.hour) % 12) + (unavailableEndTime.period === 'PM' ? 12 : 0);

      if (startHour24 > endHour24 || (startHour24 === endHour24 && parseInt(unavailableStartTime.minute) >= parseInt(unavailableEndTime.minute))) {
        return false;
      }
    }
    return true;
  };

  const handleCreateUnavailableCallHours = () => {
    if (!isUnavailablePeriodFormValid()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and ensure valid date/time ranges.",
        variant: "destructive",
      });
      return;
    }

    const newPeriod = {
      id: Date.now(), // Unique ID for the period
      startDate: unavailableStartDate!,
      endDate: unavailableEndDate!,
      startTime: unavailableStartTime,
      endTime: unavailableEndTime,
      reason: unavailableReason,
    };

    setUnavailablePeriods((prev) => [...prev, newPeriod]);

    // Here you would typically send this data to a backend
    console.log("Creating Unavailable Call Hours:", {
      unavailableStartDate: unavailableStartDate?.toLocaleDateString(),
      unavailableEndDate: unavailableEndDate?.toLocaleDateString(),
      unavailableStartTime: `${unavailableStartTime.hour}:${unavailableStartTime.minute} ${unavailableStartTime.period}`,
      unavailableEndTime: `${unavailableEndTime.hour}:${unavailableEndTime.minute} ${unavailableEndTime.period}`,
      unavailableReason,
    });
    toast({
      title: "Unavailable Period Created",
      description: "Temporarily unavailable call hours have been set.",
    });
    setShowUnavailableCallHoursModal(false);
    // Reset state
    setUnavailableStartDate(undefined);
    setUnavailableEndDate(undefined);
    setUnavailableStartTime({ hour: '', minute: '', period: '' });
    setUnavailableEndTime({ hour: '', minute: '', period: '' });
    setUnavailableReason('');
  }; // Added missing closing brace for handleCreateUnavailableCallHours
  const handleDeleteUnavailablePeriod = (id: number) => {
    setUnavailablePeriods((prev) => prev.filter((period) => period.id !== id));
    toast({
      title: "Unavailable Period Deleted",
      description: "The selected unavailable call hour has been removed.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">WhatsApp Manager</h1>

      <div className="space-y-4">
        <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("business-profile")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "business-profile"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab("automations")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "automations"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Automations
          </button>
          <button
            onClick={() => setActiveTab("calls")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "calls"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Calls
          </button>
        </div>
        {/* WhatsApp Account Status Badges */}
        {activeTab === "business-profile" && (
          <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
            {/* WhatsApp Number Badge */}
            <div className="flex items-center space-x-2 text-sm px-2 py-1 bg-blue-100 rounded-md w-fit">
              <span className="text-sm font-medium text-foreground">WhatsApp Number:</span>
              <span className="text-sm text-foreground">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2 text-sm px-2 py-1 bg-blue-100 rounded-md w-fit">
              <span className="text-sm font-medium text-foreground">Message limit:</span>
              <span className="text-sm text-foreground">1K Customers/24hr</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-normal w-[16rem] whitespace-normal">The number of business-initiated conversations you can start in a 24 hour rolling period.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {(() => {
              const bgColor = isConnected ? 'bg-green-100' : 'bg-red-100';
              const textColor = isConnected ? 'text-green-800' : 'text-red-800';
              const statusText = isConnected ? 'Connected' : 'Disconnected';
              return (
                <div className={`flex items-center space-x-2 text-sm px-2 py-1 ${bgColor} rounded-md w-fit`}>
                  <span className="text-sm font-medium text-foreground">Account Status:</span>
                  <span className={`text-sm text-foreground`}>{statusText}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="break-normal w-[16rem] whitespace-normal">Phone number is associated with this account and working properly</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })()}
            {(() => {
              let healthStatus, bgColor, textColor;
              if (accountHealth < 0.33) {
                healthStatus = "Green";
                bgColor = "bg-green-100";
                textColor = "text-green-800";
              } else if (accountHealth < 0.66) {
                healthStatus = "Yellow";
                bgColor = "bg-yellow-100";
                textColor = "text-yellow-800";
              } else {
                healthStatus = "Red";
                bgColor = "bg-red-100";
                textColor = "text-red-800";
              }
              return (
                <div className={`flex items-center space-x-2 text-sm px-2 py-1 ${bgColor} rounded-md w-fit`}>
                  <span className="text-sm font-medium text-foreground">Account Health:</span>
                  <span className={`text-sm text-foreground`}>{healthStatus}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="break-normal w-[16rem] whitespace-normal">Account health is based on how messages have been received by the recipients over the last 7 days. It is determined by a combination of quality signals from conversations between business and users. Examples include user feedback signals like blocks, reports and the reasons users provide when they block a business.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })()}
          </div>
        )}
        {activeTab === "business-profile" && (
          <div className="grid grid-cols-2 flex gap-6">
            {/* Left Side: Business Profile Form */}
            <div className="space-y-6">
              {/* Profile Photo */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Photo</CardTitle>
                  <p className="text-sm text-muted-foreground">This will be visible on your business profile</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="flex flex-col space-y-4 items-center max-w-md">
                    <div
                      className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('profilePhotoInput')?.click()}
                    >
                      {profilePhotoPreviewUrl ? (
                        <img src={profilePhotoPreviewUrl} alt="Profile Preview" className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-gray-400" />
                          <p className="text-sm text-gray-500">Drag or drop picture</p>
                        </>
                      )}
                      <input
                        id="profilePhotoInput"
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Recommended WhatsApp Business profile photo size: 640 x 640 pixels (max 5 MB) in JPG or PNG format, with a minimum of 192 x 192 pixels
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Profile photo settings have been updated.",
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>

              {/* Display Name */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Display Name</CardTitle>
                  <p className="text-sm text-muted-foreground">The WhatsApp Business display name is your business name that customers see on your WhatsApp Business profile. Ensure that your name follows WhatsApp's regulations.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Display Name</label>
                    <Input
                      value={displayName}
                      disabled
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Display name settings have been updated.",
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-normal" disabled>
                    Save
                  </Button>
                </CardFooter>
              </Card>

              {/* Business Information */}
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Add some details about your Business</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Description (optional)</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about your business"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Address (optional)</label>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="The address of your business"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">About (optional)</label>
                    <Textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="A short description about your business"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="business@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Website</label>
                    <Input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourbusiness.com"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Business information settings have been updated.",
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right Side: WhatsApp Template Preview */}
            <div className="max-h-[70vh] w-full">
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">WhatsApp Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full flex-1">
                  <ProfilePreview
                    profilePhotoUrl={profilePhotoPreviewUrl}
                    displayName={displayName}
                    about={about}
                    category={category}
                    email={email}
                    website={website} />                                                            
                </CardContent>
              </Card>        
            </div>
          </div>
        )}

        {activeTab === "automations" && (
          <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
            <CardHeader>
              <CardTitle className="text-lg">Conversational Components</CardTitle>
              <p className="text-sm text-muted-foreground">Automation that can enhance conversational experience. Using AI can help make these components more efficient.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Welcome Message */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-base mb-1">Welcome Message</h4>
                  <p className="text-sm text-muted-foreground">Receive a webhook when people start a chat with your business.</p>
                </div>
                <Switch aria-label="Toggle welcome message" />
              </div>

              {/* Ice Breakers */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-base mb-1">Ice Breakers</h4>
                  <p className="text-sm text-muted-foreground">These are common questions that people can easily ask you.</p>
                </div>
                <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
                  onClick={() => setShowIceBreakersModal(true)}>
                  Edit
                </Button>
              </div>

              {/* Commands */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-base mb-1">Commands</h4>
                  <p className="text-sm text-muted-foreground">These are special keywords that tell the WhatsApp bot what to do.</p>
                </div>
                <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
                  onClick={() => setShowCommandsModal(true)}>
                  Edit
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Automation settings have been updated.",
                  });
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "calls" && (
          <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
          <CardHeader>
            <CardTitle className="text-lg">Call Settings</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your business's call settings and availability.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Allow voice calls */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-base mb-1">Allow voice calls</h4>
                <p className="text-sm text-muted-foreground">Make and receive calls with this phone number. Turning on voice calls will allow you to call or request to call people on WhatsApp and send messages that include a call button.</p>
              </div>
              <Switch aria-label="Allow voice calls" />
            </div>

            {/* Allow people to request a callback for missed calls */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-base mb-1">Allow people to request a callback for missed calls</h4>
                <p className="text-sm text-muted-foreground">If you're unable to answer a call, let people request a call back from you.</p>
              </div>
              <Switch aria-label="Allow people to request a callback" />
            </div>

            {/* Display call buttons */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-base mb-1">Display call buttons</h4>
                <p className="text-sm text-muted-foreground">Even if this feature is turned off, people could still call this number from a message containing a call button.</p>
              </div>
              <Switch aria-label="Display call buttons" />
            </div>

            {/* Available call hours */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-base mb-1">Available call hours</h4>
                <p className="text-sm text-muted-foreground">Set regular calling hours for your business. If you don’t set your call hours, people will always be able to call you.</p>
              </div>
              <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
                onClick={() => setShowAvailableCallHoursModal(true)}>
                Setup
              </Button>
            </div>

            {/* Temporarily unavailable call hours */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-base mb-1">Temporarily unavailable call hours</h4>
                <p className="text-sm text-muted-foreground">Set custom times, like holidays or special events, when your business is unable to receive calls.</p>
              </div>
              <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]"
                onClick={() => setShowUnavailableCallHoursModal(true)}>
                Create New
              </Button>
            </div>

            {/* Display Configured Unavailable Periods */}
            {unavailablePeriods.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-base">Configured Unavailable Periods</h4>
                <div className="border rounded-md p-4 space-y-3 max-h-[20rem] overflow-y-auto">
                  {unavailablePeriods.map((period) => (
                    <div key={period.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {format(period.startDate, 'dd/MMM/yyyy')} {period.startTime.hour}:{period.startTime.minute} {period.startTime.period}
                          {' - '}
                          {format(period.endDate, 'dd/MMM/yyyy')} {period.endTime.hour}:{period.endTime.minute} {period.endTime.period}                        </p>
                        {period.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {period.reason}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUnavailablePeriod(period.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Call settings have been updated.",
                });
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      </div> {/* Closes the div with className="space-y-4" */}

      {/* Available Call Hours Modal */}
      <Dialog open={showAvailableCallHoursModal} onOpenChange={setShowAvailableCallHoursModal}>
        <DialogContent className={`${!allDay && !allDaysSelected ? "max-w-[45rem] w-fit" : "max-w-[22.5rem]"}`}>
          <DialogHeader className="mb-2">
            <DialogTitle>Setup Available Call Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Configure the days and times your business is available for calls.</p>

            <div className="flex items-center space-x-2">
              <Switch
                id="all-day-toggle"
                checked={allDay}
                onCheckedChange={setAllDay}
              />
              <Label htmlFor="all-day-toggle">24/7 Availability</Label>
            </div>

            {!allDay && (
              <>
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
                  <div className="p-4 border rounded-lg space-y-4 w-fit border border-input [border-color:hsl(var(--input))]">
                    <Label className="text-sm font-bold">All days</Label>
                    <div className="flex flex-col items-start justify-between space-y-2">
                      <Label className="text-sm">Start time</Label>
                      <TimePicker
                        hour={allCallHours.startHour}
                        minute={allCallHours.startMinute}
                        period={allCallHours.startPeriod}
                        onHourChange={(value) => setAllCallHours(prev => ({ ...prev, startHour: value }))}
                        onMinuteChange={(value) => setAllCallHours(prev => ({ ...prev, startMinute: value }))}
                        onPeriodChange={(value) => setAllCallHours(prev => ({ ...prev, startPeriod: value }))}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between space-y-2">
                      <Label className="text-sm">End time</Label>
                      <TimePicker
                        hour={allCallHours.endHour}
                        minute={allCallHours.endMinute}
                        period={allCallHours.endPeriod}
                        onHourChange={(value) => setAllCallHours(prev => ({ ...prev, endHour: value }))}
                        onMinuteChange={(value) => setAllCallHours(prev => ({ ...prev, endMinute: value }))}
                        onPeriodChange={(value) => setAllCallHours(prev => ({ ...prev, endPeriod: value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 max-h-[40vh] overflow-y-scroll pt-0.5">
                    {Object.keys(dailyCallHours).map((day) => (
                      <div key={day} className="p-4 border rounded-lg space-y-4 border border-input [border-color:hsl(var(--input))]">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`checkbox-${day}`}
                            checked={dailyCallHours[day].enabled}
                            onCheckedChange={(checked) => {
                              setDailyCallHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], enabled: checked as boolean },
                              }));
                            }}
                          />
                          <Label htmlFor={`checkbox-${day}`} className="text-sm font-bold">
                            {day}
                          </Label>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col items-start justify-between space-y-2">
                            <Label className="text-sm text-foreground">Start time</Label>
                            <TimePicker
                              hour={dailyCallHours[day].startHour}
                              minute={dailyCallHours[day].startMinute}
                              period={dailyCallHours[day].startPeriod}
                              onHourChange={(value) =>
                                setDailyCallHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], startHour: value },
                                }))
                              }
                              onMinuteChange={(value) =>
                                setDailyCallHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], startMinute: value },
                                }))
                              }
                              onPeriodChange={(value) =>
                                setDailyCallHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], startPeriod: value },
                                }))
                              }
                              isDisabled={!dailyCallHours[day].enabled}
                            />
                          </div>
                          <div className="flex flex-col items-start justify-between space-y-2">
                            <Label className="text-sm text-foreground">End time</Label>
                            <TimePicker
                              hour={dailyCallHours[day].endHour}
                              minute={dailyCallHours[day].endMinute}
                              period={dailyCallHours[day].endPeriod}
                              onHourChange={(value) =>
                                setDailyCallHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], endHour: value },
                                }))
                              }
                              onMinuteChange={(value) =>
                                setDailyCallHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], endMinute: value },
                                }))
                              }
                              onPeriodChange={(value) =>
                                setDailyCallHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], endPeriod: value },
                                }))
                              }
                              isDisabled={!dailyCallHours[day].enabled}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowAvailableCallHoursModal(false)} variant="outline" className="border-input font-normal [border-color:hsl(var(--input))]">Cancel</Button>
            <Button onClick={handleSaveAvailableCallHours} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unavailable Call Hours Modal */}
      <Dialog open={showUnavailableCallHoursModal} onOpenChange={setShowUnavailableCallHoursModal}>
        <DialogContent className="max-w-[24rem]">
          <DialogHeader>
            <DialogTitle>Create New Unavailable Period</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="unavailable-start-date" className="text-sm font-medium text-foreground">Start Date<span className="text-red-500 pl-0.5">*</span></Label>
              <Popover open={unavailableStartDatePickerOpen} onOpenChange={setUnavailableStartDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate"
                  >
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {unavailableStartDate ? unavailableStartDate.toLocaleDateString() : <span>Pick a date</span>}
                    </div>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={unavailableStartDate}
                    onSelect={(date: Date | undefined) => {
                      setUnavailableStartDate(date);
                      if (unavailableEndDate && date && date > unavailableEndDate) {
                        setUnavailableEndDate(undefined);
                      }
                      setUnavailableStartDatePickerOpen(false);
                    }}
                    disabled={unavailableEndDate ? { after: unavailableEndDate } : undefined}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex flex-col space-y-1">
              <Label htmlFor="unavailable-start-time" className="text-sm font-medium text-foreground">Start Time<span className="text-red-500 pl-0.5">*</span></Label>
              <div className="flex gap-2">
                <Select value={unavailableStartTime.hour} onValueChange={(value) => setUnavailableStartTime(t => ({ ...t, hour: value }))}>
                  <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0')).map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={unavailableStartTime.minute} onValueChange={(value) => setUnavailableStartTime(t => ({ ...t, minute: value }))}>
                  <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, '0')).map(minute => (
                      <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={unavailableStartTime.period} onValueChange={(value) => setUnavailableStartTime(t => ({ ...t, period: value }))}>
                  <SelectTrigger className="w-[95px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <Label htmlFor="unavailable-end-date" className="text-sm font-medium text-foreground">End Date<span className="text-red-500 pl-0.5">*</span></Label>
              <Popover open={unavailableEndDatePickerOpen} onOpenChange={setUnavailableEndDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-between text-left font-normal border-input [border-color:hsl(var(--input))] hover-elevate"
                  >
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {unavailableEndDate ? unavailableEndDate.toLocaleDateString() : <span>Pick a date</span>}
                    </div>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={unavailableEndDate}
                    onSelect={(date: Date | undefined) => {
                      setUnavailableEndDate(date);
                      if (unavailableStartDate && date && date < unavailableStartDate) {
                        setUnavailableStartDate(undefined);
                      }
                      setUnavailableEndDatePickerOpen(false);
                    }}
                    disabled={unavailableStartDate ? { before: unavailableStartDate } : undefined}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="unavailable-end-time" className="text-sm font-medium text-foreground">End Time<span className="text-red-500 pl-0.5">*</span></Label>
              <div className="flex gap-2">
                <Select value={unavailableEndTime.hour} onValueChange={(value) => setUnavailableEndTime(t => ({ ...t, hour: value }))}>
                  <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0')).map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={unavailableEndTime.minute} onValueChange={(value) => setUnavailableEndTime(t => ({ ...t, minute: value }))}>
                  <SelectTrigger className="w-[80px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, '0')).map(minute => (
                      <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={unavailableEndTime.period} onValueChange={(value) => setUnavailableEndTime(t => ({ ...t, period: value }))}>
                  <SelectTrigger className="w-[95px] border border-input [border-color:hsl(var(--input))] hover-elevate">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="unavailable-reason" className="text-sm font-medium text-foreground">Reason (optional)</Label>
              <div className="relative">
                <Textarea
                  id="unavailable-reason"
                  value={unavailableReason}
                  onChange={(e) => setUnavailableReason(e.target.value.slice(0, 100))}
                  placeholder="e.g., Public Holiday, Team Meeting"
                  className="pr-12"
                />
                <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">
                  {unavailableReason.length}/100
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowUnavailableCallHoursModal(false)} variant="outline" className="border-input font-normal [border-color:hsl(var(--input))]">Cancel</Button>
            <Button onClick={handleCreateUnavailableCallHours} className="bg-blue-500 hover:bg-blue-600 text-white font-normal" disabled={!isUnavailablePeriodFormValid()}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ice Breakers Modal */}
      <Dialog open={showIceBreakersModal} onOpenChange={setShowIceBreakersModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Ice Breakers</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4">
            {/* Left: Form */}
            <div className="flex-1 !max-h-[62vh] overflow-y-auto pr-2 -ml-1">
              <div className="space-y-6 pl-1 pb-1">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ice Breaker Details</h3>
                  <p className="text-sm text-muted-foreground">Configure your ice breakers here.</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Icebreakers (up to 5)<span className="text-red-500 pl-0.5">*</span></label>
                  <div className="space-y-2">
                    {templatePhoneNumbers.map((phone, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Where are you located?"
                          value={phone}
                          onChange={(e) => {
                            const newNumbers = [...templatePhoneNumbers];
                            newNumbers[index] = e.target.value;
                            setTemplatePhoneNumbers(newNumbers);
                          }}
                          className="border-input flex-1"
                        />
                        {templatePhoneNumbers.length > 1 && (
                          <button
                            onClick={() => {
                              const newNumbers = templatePhoneNumbers.filter((_, i) => i !== index);
                              setTemplatePhoneNumbers(newNumbers);
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors border-[]"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add another recipient button */}
                  {templatePhoneNumbers.length < 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs"
                      disabled={templatePhoneNumbers.some(p => p.trim() === "")}
                      onClick={() => {
                        setTemplatePhoneNumbers([...templatePhoneNumbers, ""]);
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Add another icebreaker
                    </Button>
                  )}
                </div>

              </div>
            </div>

            {/* Right: Template Preview */}
            <div className="!max-h-[62vh] flex-shrink-0 !max-w-[31vh] w-full">
              <div className="flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-1">Icebreakers Preview</h3>
                <TemplatePreview
                  headerText={""}
                  bodyText={""}
                  footerText={""}
                  selectedMediaFile={null}
                  templateButtons={[]}
                  variableSamples={{}}
                  showMessage={false}
                  containerClassName="flex-1 flex items-center justify-center min-h-0"
                  phoneClassName="h-full aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowIceBreakersModal(false)}
                className="border-input [border-color:hsl(var(--input))] font-normal"
              >
                Close
              </Button>
              <Button
                className="gap-2 font-normal bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  console.log("Save Ice Breakers");
                  setShowIceBreakersModal(false);
                }}
                disabled={templatePhoneNumbers.some(p => p.trim() === "")}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Commands Modal */}
      <Dialog open={showCommandsModal} onOpenChange={setShowCommandsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Commands</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4">
            {/* Left: Form */}
            <div className="flex-1 !max-h-[62vh] overflow-y-auto pr-2 -ml-1">
              <div className="space-y-6 pl-1 pb-1">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Command Details</h3>
                  <p className="text-sm text-muted-foreground">Configure your commands here.</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Commands (up to 5)<span className="text-red-500 pl-0.5">*</span></label>
                  <div className="space-y-4">
                    {commands.map((command, index) => (
                      <div key={command.id} className="flex flex-col gap-4 p-4 border rounded-lg border border-input [border-color:hsl(var(--input))]">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex justify-between items-end">
                              <label className="text-sm font-medium text-foreground">Command Text (32 chars)<span className="text-red-500 pl-0.5">*</span></label>
                              {commands.length > 1 && (
                                <button onClick={() => removeCommand(command.id)} className="text-muted-foreground hover:text-foreground transition-colors ml-4 mt-1">
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Enter command text..."
                                value={command.commandText}
                                onChange={(e) => handleCommandChange(index, 'commandText', e.target.value.slice(0, 32))}
                                className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                {command.commandText.length}/32
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Command Description (256 chars)<span className="text-red-500 pl-0.5">*</span></label>
                          <div className="relative">
                            <Textarea
                              placeholder="Enter command description..."
                              value={command.commandDescription}
                              onChange={(e) => handleCommandChange(index, 'commandDescription', e.target.value.slice(0, 256))}
                              className="pr-12 border border-input [border-color:hsl(var(--input))] hover-elevate"
                            />
                            <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">
                              {command.commandDescription.length}/256
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs"
                      disabled={commands.length >= 5 || commands.some(cmd => !cmd.commandText.trim() || !cmd.commandDescription.trim())}
                      onClick={addCommand}
                    >
                      <Plus size={14} className="mr-1" />
                      Add another command
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Template Preview */}
            <div className="!max-h-[62vh] flex-shrink-0 !max-w-[31vh] w-full">
              <div className="flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-1">Commands Preview</h3>
                <TemplatePreview
                  headerText={""}
                  bodyText={""}
                  footerText={""}
                  selectedMediaFile={null}
                  templateButtons={[]}
                  variableSamples={{}}
                  showMessage={false}
                  containerClassName="flex-1 flex items-center justify-center min-h-0"
                  phoneClassName="h-full aspect-[9/18] bg-black rounded-3xl p-3 shadow-lg flex flex-col overflow-hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCommandsModal(false)}
                className="border-input [border-color:hsl(var(--input))] font-normal"
              >
                Close
              </Button>
              <Button
                className="gap-2 font-normal bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  console.log("Save Commands");
                  setShowCommandsModal(false);
                }}
                disabled={commands.some(cmd => !cmd.commandText.trim() || !cmd.commandDescription.trim())}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}