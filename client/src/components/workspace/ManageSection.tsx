import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Copy,
  Globe,
  Calendar,
  Building2,
  Save,
  Lock,
  Link2,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  QrCode,
  Clock,
  AlertCircle,
  Info
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ManageSection() {
  const workspaceId = "3";
  const loginUrl = "";

  // State for editable fields
  const [workspaceName, setWorkspaceName] = useState("Ezconn");
  const [timezone, setTimezone] = useState("America/Fortaleza");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("monday");

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const { toast } = useToast();

  // Get current time in selected timezone
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Character count for workspace name
  const nameCharCount = workspaceName.length;
  const maxNameLength = 50;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleReset = () => {
    setWorkspaceName("Ezconn");
    setTimezone("America/Fortaleza");
    setFirstDayOfWeek("monday");
    setHasUnsavedChanges(false);
    toast({
      title: "Reset Complete",
      description: "Settings restored to last saved values",
    });
  };

  const handleSave = () => {
    const settings = {
      workspaceId,
      name: workspaceName,
      timezone,
      firstDayOfWeek,
    };

    console.log("Saving workspace settings:", settings);
    setHasUnsavedChanges(false);

    toast({
      title: "Success",
      description: "Workspace settings saved successfully!",
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    setHasUnsavedChanges(true);
    if (field === 'name') setWorkspaceName(value);
    if (field === 'timezone') setTimezone(value);
    if (field === 'firstDay') setFirstDayOfWeek(value);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b pb-6">
        <Settings className="w-8 h-8 text-black dark:text-white" />
        <div className="flex-1 space-y-1">
          <CardTitle className="text-lg font-semibold">Workspace Settings</CardTitle>
          <CardDescription>Manage your Workspace settings</CardDescription>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(workspaceId)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy ID
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quick copy workspace ID</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {hasUnsavedChanges && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Revert to last saved values</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">Unsaved Changes</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">You have unsaved changes. Click "Save Changes" to apply them.</p>
            </div>
          </div>
        )}

        {/* Workspace ID - Read Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Workspace ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Unique identifier for your workspace. This cannot be changed.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="relative">
              <Input
                value={workspaceId}
                readOnly
                className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed text-sm text-gray-900 dark:text-gray-400 border-gray-200 dark:border-slate-700 pr-10"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span>Configured</span>
            </div>
          </div>
        </div>
        <Separator />

        {/* Workspace Name - Editable */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Workspace Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  The display name for your workspace. This will be visible to all users.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Input
              value={workspaceName}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              maxLength={maxNameLength}
              placeholder="e.g., My Company Workspace"
              className="text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
            />
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-500">
                <Info className="w-3 h-3" />
                <span>Use a clear, descriptive name</span>
              </div>
              <span className={`${nameCharCount > maxNameLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                {nameCharCount}/{maxNameLength}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span>Valid workspace name</span>
            </div>
          </div>
        </div>
        <Separator />

        {/* Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Timezone
              <span className="text-red-500 ml-1">*</span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Your workspace timezone affects scheduling, reports, and time displays.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Select value={timezone} onValueChange={(val) => handleFieldChange('timezone', val)}>
              <SelectTrigger className="w-full text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                <SelectItem value="America/Fortaleza" className="dark:focus:bg-slate-800 dark:text-white">
                  Fortaleza (America/Fortaleza)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Current Time Display */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Current Time in Selected Timezone
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {getCurrentTime()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              <span>Timezone offset: UTC-3</span>
            </div>
          </div>
        </div>
        <Separator />

        {/* First Day of Week */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              First Day of Week
              <span className="text-red-500 ml-1">*</span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Choose which day starts your calendar week. Recommended: Monday for business use.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Select value={firstDayOfWeek} onValueChange={(val) => handleFieldChange('firstDay', val)}>
              <SelectTrigger className="w-full text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select first day" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                <SelectItem value="monday" className="dark:focus:bg-slate-800 dark:text-white">
                  Monday
                </SelectItem>
                <SelectItem value="sunday" className="dark:focus:bg-slate-800 dark:text-white">
                  Sunday
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Mini Calendar Preview */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-lg">
              <p className="text-xs font-medium text-purple-900 dark:text-purple-100 mb-2">
                Calendar Preview
              </p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {(firstDayOfWeek === 'monday'
                  ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                  : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                ).map((day, i) => (
                  <div
                    key={day}
                    className={`text-xs py-1 rounded ${i === 0 ? 'bg-purple-200 dark:bg-purple-800 font-semibold' : 'bg-white dark:bg-slate-800'} text-purple-900 dark:text-purple-100`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              <span>Recommended for business: Monday</span>
            </div>
          </div>
        </div>
        <Separator />

        {/* Login URL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Login URL
              <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                Optional
              </span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Custom login URL for your workspace. Leave empty to use default.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={loginUrl}
                readOnly
                placeholder="No login URL configured"
                className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed text-sm text-gray-900 dark:text-gray-400 border-gray-200 dark:border-slate-700"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(loginUrl)}
                className="whitespace-nowrap text-sm px-3 btn-outline-primary gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>

            {loginUrl && (
              <>
                {/* QR Code Section */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQR(!showQR)}
                    className="gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    {showQR ? 'Hide' : 'Show'} QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(loginUrl, '_blank')}
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Test URL
                  </Button>
                </div>

                {showQR && (
                  <div className="p-4 bg-white dark:bg-slate-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center gap-3">
                    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Scan to access workspace on mobile
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              {loginUrl ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>URL configured</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-yellow-500" />
                  <span>Not configured</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Separator />

        {/* Save Button with validation status */}
        <div className="flex justify-end items-center gap-4 pt-2">
          <div className="text-sm text-gray-500">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                All changes saved
              </span>
            )}
          </div>
          <Button
            className="px-6 py-1 text-sm btn-outline-primary gap-2"
            variant="outline"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </>
  );
}
