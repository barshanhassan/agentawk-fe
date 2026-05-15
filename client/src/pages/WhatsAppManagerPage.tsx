import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Moved this import here
import { format } from "date-fns";
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
import PreviewV2 from "@/components/PreviewV2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SiWhatsapp } from "react-icons/si";


export default function WhatsAppManagerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Profile from backend
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["/api/whatsapp/profile"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/whatsapp/profile");
      return res.json();
    }
  });

  // State for Business Profile fields
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("My business name");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");

  // Sync state with fetched data
  React.useEffect(() => {
    if (profileResponse?.phoneNumber) {
      const p = profileResponse.phoneNumber;
      setDisplayName(p.verified_name || "");
      setWhatsAppNumber(p.phone_number || "");
      // Other fields would be synced here if they existed in wa_phone_numbers
    }
  }, [profileResponse]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", "/api/whatsapp/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/profile"] });
      toast({ title: "Settings Saved", description: "WhatsApp profile has been updated." });
    }
  });

  const handleSave = (field: string, value: any) => {
    updateMutation.mutate({ [field]: value });
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState("business-profile");

  // Dummy states for badges
  const [isConnected, setIsConnected] = useState(true);
  const [accountHealth, setAccountHealth] = useState(0.1);


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
  const [icebreakers, setIcebreakers] = useState<string[]>([""]); // For Ice Breakers recipients

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
    <div className="p-4 pt-8 pb-4 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
        
        {/* 1. Integrated Header Section */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-blue-50/20 dark:bg-transparent space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/10 shadow-inner">
              <SiWhatsapp size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">WhatsApp Manager</h1>
              <p className="text-[11px] font-medium text-slate-500">Manage business profile, automations and call settings</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Tabs Navigation */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("business-profile")}
                className={cn(
                    "px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200",
                    activeTab === "business-profile"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
              >
                Business Profile
              </button>
              <button
                onClick={() => setActiveTab("automations")}
                className={cn(
                    "px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200",
                    activeTab === "automations"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
              >
                Automations
              </button>
              <button
                onClick={() => setActiveTab("calls")}
                className={cn(
                    "px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200",
                    activeTab === "calls"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
              >
                Calls
              </button>
            </div>

            {/* Status Badges Row */}
          {activeTab === "business-profile" && (
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-xl text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                <span className="text-slate-400">Number:</span>
                <span className="text-blue-600 dark:text-blue-400">{whatsAppNumber}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-xl text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                <span className="text-slate-400">Limit:</span>
                <span>1K Customers/24hr</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-slate-400 cursor-help hover:text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">24h conversation limit</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {(() => {
                const statusText = isConnected ? 'Connected' : 'Disconnected';
                const dotColor = isConnected ? 'bg-emerald-500' : 'bg-rose-500';
                return (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-xl text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                    <span className="text-slate-400">Status:</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`} />
                      <span>{statusText}</span>
                    </div>
                  </div>
                );
              })()}
              {(() => {
                let healthStatus, healthColor;
                if (accountHealth < 0.33) { healthStatus = "Green"; healthColor = "text-emerald-600 dark:text-emerald-400"; }
                else if (accountHealth < 0.66) { healthStatus = "Yellow"; healthColor = "text-amber-600 dark:text-amber-400"; }
                else { healthStatus = "Red"; healthColor = "text-rose-600 dark:text-rose-400"; }
                return (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-xl text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                    <span className="text-slate-400">Health:</span>
                    <span className={healthColor}>{healthStatus}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

        {/* 2. Main Content Body */}
        <div className="p-5 overflow-visible bg-slate-50/30 dark:bg-transparent">
          <div className="w-full">
        {activeTab === "business-profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Business Profile Form */}
            <div className="space-y-6">
              {/* Profile Photo */}
              {/* Profile Photo */}
              <Card className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[14px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Profile Photo</CardTitle>
                  <p className="text-[11px] font-medium text-slate-400">This will be visible on your business profile</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="flex flex-col space-y-4 items-center max-w-md w-full">
                    <div
                      className="group flex flex-col items-center justify-center w-full aspect-square max-w-[180px] border-2 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:border-slate-700 transition-all duration-300 relative overflow-hidden"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('profilePhotoInput')?.click()}
                    >
                      {profilePhotoPreviewUrl ? (
                        <>
                          <img src={profilePhotoPreviewUrl} alt="Profile Preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <UploadCloud className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                          <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Upload Photo</p>
                            <p className="text-[9px] text-slate-400">Drag or drop picture</p>
                          </div>
                        </div>
                      )}
                      <input
                        id="profilePhotoInput"
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 text-center leading-relaxed max-w-[280px]">
                      Recommended size: 640x640px (max 5MB) in JPG or PNG format. Minimum 192x192px.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-slate-50/50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-100 dark:border-slate-800/50">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Profile photo settings have been updated.",
                      });
                    }}
                    className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[10px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 border-0 hover:bg-blue-700 uppercase tracking-widest"
                    variant="default"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              {/* Business Name */}
              <Card className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[14px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Business Name</CardTitle>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">The display name customers see on your profile. Ensure it follows regulations.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Display Name</label>
                    <div className="relative group">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value.slice(0, 75))}
                        className="h-10 text-[12px] font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                        placeholder="Enter business name"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {displayName.length}/75
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-slate-50/50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-100 dark:border-slate-800/50">
                  <Button
                    onClick={() => handleSave("displayName", displayName)}
                    className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[10px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 border-0 hover:bg-blue-700 uppercase tracking-widest disabled:opacity-50"
                    disabled={!displayName.trim() || updateMutation.isPending}
                    variant="default"
                  >
                    {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                    Save Name
                  </Button>
                </CardFooter>
              </Card>

              {/* Business Information */}
              <Card className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[14px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Business Information</CardTitle>
                  <p className="text-[11px] font-medium text-slate-400">Additional details for your business profile</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Category</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-9 text-[11px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                          {categoryOptions.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-[11px] rounded-lg">{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Email Address</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.slice(0, 128))}
                        placeholder="business@example.com"
                        className="h-9 text-[11px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Description (Optional)</label>
                    <div className="relative group">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 512))}
                        placeholder="Tell us about your business"
                        className="min-h-[80px] text-[11px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                      <span className="absolute right-3 bottom-2 text-[9px] font-semibold text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {description.length}/512
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Business Address</label>
                    <div className="relative group">
                      <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value.slice(0, 512))}
                        placeholder="Enter full business address"
                        className="min-h-[60px] text-[11px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                      <span className="absolute right-3 bottom-2 text-[9px] font-semibold text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {address.length}/512
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">About / Status</label>
                      <Input
                        value={about}
                        onChange={(e) => setAbout(e.target.value.slice(0, 139))}
                        placeholder="Short status"
                        className="h-9 text-[11px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Website URL</label>
                      <Input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value.slice(0, 256))}
                        placeholder="https://example.com"
                        className="h-9 text-[11px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end bg-slate-50/50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-100 dark:border-slate-800/50">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Business information settings have been updated.",
                      });
                    }}
                    className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[10px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 border-0 hover:bg-blue-700 uppercase tracking-widest"
                    variant="default"
                  >
                    Save Information
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right Side: WhatsApp Preview */}
            <Card className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm h-fit self-start flex flex-col overflow-hidden sticky top-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-[14px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight">WhatsApp Profile Preview</CardTitle>
                <p className="text-[11px] font-medium text-slate-400">Live preview of your profile appearance</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-4 h-[520px] overflow-hidden">
                <div className="w-full max-w-[260px] transform scale-[0.85] transition-transform">
                  <PreviewV2
                    mode="profile"
                    profilePfpUrl={profilePhotoPreviewUrl ? profilePhotoPreviewUrl : undefined}
                    profileName={displayName}
                    profileDescription={description}
                    profileCategory={category}
                    profileAddress={address}
                    profileEmail={email}
                    profileWebsite={website}
                    profileAbout={about}
                    profilePhoneNumber={whatsAppNumber}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Info className="w-3 h-3 text-slate-400" />
                  <p className="text-[9px] font-medium text-slate-400">Preview may slightly differ from real interface</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "automations" && (
          <Card className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-[14px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Conversational Components</CardTitle>
              <p className="text-[11px] font-medium text-slate-400">Enhance conversation experience with automation and AI tools.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Welcome Message */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Welcome Message</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Receive a webhook when people start a chat with your business.</p>
                </div>
                <Switch aria-label="Toggle welcome message" className="data-[state=checked]:bg-blue-600" />
              </div>

              {/* Ice Breakers */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Ice Breakers</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Common questions that people can easily ask you in one tap.</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  onClick={() => setShowIceBreakersModal(true)}>
                  Configure
                </Button>
              </div>

              {/* Commands */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Commands</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Keywords that trigger specific actions for the WhatsApp bot.</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  onClick={() => setShowCommandsModal(true)}>
                  Configure
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-slate-50/50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-100 dark:border-slate-800/50">
              <Button
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Automation settings have been updated.",
                  });
                }}
                className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[10px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 border-0 hover:bg-blue-700 uppercase tracking-widest"
                variant="default"
              >
                Save Automations
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "calls" && (
          <Card className="bg-white dark:bg-slate-900/50 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-[14px] font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Call Settings</CardTitle>
              <p className="text-[11px] font-medium text-slate-400">Manage business availability and call preferences.</p>
            </CardHeader>
            <CardContent className="space-y-1 p-3">
              {/* Allow voice calls */}
              <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Allow voice calls</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Enable making and receiving calls. Allows call buttons in messages.</p>
                </div>
                <Switch aria-label="Allow voice calls" className="data-[state=checked]:bg-blue-600" />
              </div>

              {/* Allow people to request a callback for missed calls */}
              <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Callback Requests</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Let people request a call back if you're unable to answer.</p>
                </div>
                <Switch aria-label="Allow people to request a callback" className="data-[state=checked]:bg-blue-600" />
              </div>

              {/* Display call buttons */}
              <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Display call buttons</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Control visibility of call buttons in your business messages.</p>
                </div>
                <Switch aria-label="Display call buttons" className="data-[state=checked]:bg-blue-600" />
              </div>

              {/* Available call hours */}
              <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Available Call Hours</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Set regular calling hours for your business.</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  onClick={() => setShowAvailableCallHoursModal(true)}>
                  Configure
                </Button>
              </div>

              {/* Temporarily unavailable call hours */}
              <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Holiday / Special Hours</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Set custom times when your business is unable to receive calls.</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  onClick={() => setShowUnavailableCallHoursModal(true)}>
                  Create New
                </Button>
              </div>

              {/* Display Configured Unavailable Periods */}
              {unavailablePeriods.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-base">Configured Unavailable Periods</h4>
                  <div className="border rounded-md p-4 space-y-3">
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
            <CardFooter className="flex justify-end bg-slate-50/50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-100 dark:border-slate-800/50">
              <Button
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Call settings have been updated.",
                  });
                }}
                className="h-8 px-4 rounded-lg bg-blue-600 text-white font-semibold text-[10px] shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-95 border-0 hover:bg-blue-700 uppercase tracking-widest"
                variant="default"
              >
                Save Call Settings
              </Button>
            </CardFooter>
          </Card>
        )}
        </div>
      </div>
    </div>

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
            <Button onClick={handleSaveAvailableCallHours} className="btn-outline-primary font-normal" variant="outline">Save</Button>
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
            <Button onClick={handleCreateUnavailableCallHours} className="btn-outline-primary font-normal" variant="outline" disabled={!isUnavailablePeriodFormValid()}>Create</Button>
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
                  <label className="text-sm font-medium mb-2 block">Icebreakers (up to 4)<span className="text-red-500 pl-0.5">*</span></label>
                  <div className="space-y-2">
                    {icebreakers.map((icebreaker, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Where are you located?"
                            value={icebreaker}
                            onChange={(e) => {
                              const newIcebreakers = [...icebreakers];
                              newIcebreakers[index] = e.target.value.slice(0, 80);
                              setIcebreakers(newIcebreakers);
                            }}
                            className="border-input pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {icebreaker.length}/80
                          </span>
                        </div>
                        {icebreakers.length > 1 && (
                          <button
                            onClick={() => {
                              const newIcebreakers = icebreakers.filter((_, i) => i !== index);
                              setIcebreakers(newIcebreakers);
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
                  {icebreakers.length < 4 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs"
                      disabled={icebreakers.some(p => p.trim() === "")}
                      onClick={() => {
                        setIcebreakers([...icebreakers, ""]);
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Add another icebreaker
                    </Button>
                  )}
                </div>

              </div>
            </div>

            {/* Right: Icebreakers Preview */}
            <div>
              <h3 className="font-semibold text-lg mb-1">Icebreakers Preview</h3>
              <div className="h-full max-h-[62vh] w-full max-w-[31vh] flex flex-col items-center">
                <PreviewV2
                  mode="chat"
                  icebreakers={icebreakers}
                  showPlaceholderMessageInTemplate={false}
                />
                <p className="text-[10px] py-1">Preview may not reflect the exact WhatsApp interface</p>
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
                className="gap-2 font-normal btn-outline-primary"
                onClick={() => {
                  console.log("Save Ice Breakers");
                  setShowIceBreakersModal(false);
                }}
                disabled={icebreakers.some(p => p.trim() === "")}
                variant="outline"
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
                              <label className="text-sm font-medium text-foreground">Command Text<span className="text-red-500 pl-0.5">*</span></label>
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
                          <label className="text-sm font-medium text-foreground">Command Description<span className="text-red-500 pl-0.5">*</span></label>
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

            {/* Right: Commands Preview */}
            <div>
              <h3 className="font-semibold text-lg mb-1">Commands Preview</h3>
              <div className="h-full max-h-[62vh] w-full max-w-[31vh] flex flex-col items-center">
                <PreviewV2
                  mode="chat"
                  commands={commands}
                  showPlaceholderMessageInTemplate={false}
                />
                <p className="text-[10px] py-1">Preview may not reflect the exact WhatsApp interface</p>
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
                className="gap-2 font-normal btn-outline-primary"
                onClick={() => {
                  console.log("Save Commands");
                  setShowCommandsModal(false);
                }}
                disabled={commands.some(cmd => !cmd.commandText.trim() || !cmd.commandDescription.trim())}
                variant="outline"
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