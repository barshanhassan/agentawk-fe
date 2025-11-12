import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProfilePreview from "@/components/ProfilePreview"; // Import the new ProfilePreview component
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Add Tooltip imports
import { UploadCloud } from "react-feather"; // For drag and drop icon, Edit2 icon, and Check icon
import { Info } from "lucide-react"; // Add Info icon import
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
  const [unavailableStartDate, setUnavailableStartDate] = useState('');
  const [unavailableEndDate, setUnavailableEndDate] = useState('');
  const [unavailableStartTime, setUnavailableStartTime] = useState('00:00');
  const [unavailableEndTime, setUnavailableEndTime] = useState('23:59');
  const [unavailableReason, setUnavailableReason] = useState('');

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

  const handleCreateUnavailableCallHours = () => {
    if (!unavailableStartDate || !unavailableEndDate || !unavailableStartTime || !unavailableEndTime) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    // Here you would typically send this data to a backend
    console.log("Creating Unavailable Call Hours:", {
      unavailableStartDate,
      unavailableEndDate,
      unavailableStartTime,
      unavailableEndTime,
      unavailableReason,
    });
    toast({
      title: "Unavailable Period Created",
      description: "Temporarily unavailable call hours have been set.",
    });
    setShowUnavailableCallHoursModal(false);
    // Reset state
    setUnavailableStartDate('');
    setUnavailableEndDate('');
    setUnavailableStartTime('00:00');
    setUnavailableEndTime('23:59');
    setUnavailableReason('');
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
                <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]">
                  Edit
                </Button>
              </div>

              {/* Commands */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-base mb-1">Commands</h4>
                  <p className="text-sm text-muted-foreground">These are special keywords that tell the WhatsApp bot what to do.</p>
                </div>
                <Button variant="ghost" size="sm" className="hover-elevate h-7 text-xs [border-color:hsl(var(--input))]">
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
            <Button onClick={() => setShowAvailableCallHoursModal(false)} variant="outline" className="border-input font-normal">Cancel</Button>
            <Button onClick={handleSaveAvailableCallHours} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unavailable Call Hours Modal */}
      <Dialog open={showUnavailableCallHoursModal} onOpenChange={setShowUnavailableCallHoursModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Unavailable Period</DialogTitle>
            <p className="text-sm text-muted-foreground">Set a period when your business will be temporarily unavailable for calls.</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex-1">
              <Label htmlFor="unavailable-start-date" className="text-sm font-medium text-foreground">Start Date<span className="text-red-500 pl-0.5">*</span></Label>
              <Input
                id="unavailable-start-date"
                type="date"
                value={unavailableStartDate}
                onChange={(e) => setUnavailableStartDate(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <Label htmlFor="unavailable-start-time" className="text-sm font-medium text-foreground">Start Time<span className="text-red-500 pl-0.5">*</span></Label>
              <Input
                id="unavailable-start-time"
                type="time"
                value={unavailableStartTime}
                onChange={(e) => setUnavailableStartTime(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <Label htmlFor="unavailable-end-date" className="text-sm font-medium text-foreground">End Date<span className="text-red-500 pl-0.5">*</span></Label>
              <Input
                id="unavailable-end-date"
                type="date"
                value={unavailableEndDate}
                onChange={(e) => setUnavailableEndDate(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <Label htmlFor="unavailable-end-time" className="text-sm font-medium text-foreground">End Time<span className="text-red-500 pl-0.5">*</span></Label>
              <Input
                id="unavailable-end-time"
                type="time"
                value={unavailableEndTime}
                onChange={(e) => setUnavailableEndTime(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="unavailable-reason" className="text-sm font-medium text-foreground">Reason (optional)</Label>
              <Textarea
                id="unavailable-reason"
                value={unavailableReason}
                onChange={(e) => setUnavailableReason(e.target.value)}
                placeholder="e.g., Public Holiday, Team Meeting"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={() => setShowUnavailableCallHoursModal(false)} variant="outline" className="border-input font-normal">Cancel</Button>
            <Button onClick={handleCreateUnavailableCallHours} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}