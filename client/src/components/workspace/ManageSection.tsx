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
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ManageSection() {
  const workspaceId = "3";
  const loginUrl = "";

  // State for editable fields
  const [workspaceName, setWorkspaceName] = useState("Ezconn");
  const [timezone, setTimezone] = useState("America/Fortaleza");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("monday");

  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the workspace settings
    const settings = {
      workspaceId,
      name: workspaceName,
      timezone,
      firstDayOfWeek,
    };
    
    console.log("Saving workspace settings:", settings);
    
    // Show success message
    toast({
      title: "Success",
      description: "Workspace settings saved successfully!",
    });
    
    // TODO: Replace with actual API call
    // Example:
    // await fetch('/api/workspace/settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings)
    // });
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Settings className="w-8 h-8 text-black dark:text-white" />
        <div className="space-y-1">
          <CardTitle className="text-lg">Workspace Settings</CardTitle>
          <CardDescription>Manage your Workspace settings</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800" />
      <CardContent className="space-y-6 pt-6">
        {/* Workspace ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Workspace Id</label>
          <div className="md:col-span-2">
            <Input
              value={workspaceId}
              readOnly
              className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed text-sm text-gray-900 dark:text-gray-400 border-gray-200 dark:border-slate-700"
            />
          </div>
        </div>
        <Separator />

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <div className="md:col-span-2">
            <Input 
              value={workspaceName} 
              onChange={(e) => setWorkspaceName(e.target.value)} 
              className="text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white" 
            />
          </div>
        </div>
        <Separator />

        {/* Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Timezone</label>
          <div className="md:col-span-2">
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="w-full text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                <SelectItem value="America/Fortaleza" className="dark:focus:bg-slate-800 dark:text-white">
                  Fortaleza (America/Fortaleza)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />

        {/* First day of week */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">First day of week</label>
          <div className="md:col-span-2">
            <Select value={firstDayOfWeek} onValueChange={setFirstDayOfWeek}>
              <SelectTrigger className="w-full text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select first day" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 dark:border-slate-800">
                <SelectItem value="monday" className="dark:focus:bg-slate-800 dark:text-white">Monday</SelectItem>
                <SelectItem value="sunday" className="dark:focus:bg-slate-800 dark:text-white">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />

        {/* Login URL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Login URL</label>
          <div className="md:col-span-2 flex items-center gap-2">
            <Input
              value={loginUrl}
              readOnly
              className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed text-sm text-gray-900 dark:text-gray-400 border-gray-200 dark:border-slate-700"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(loginUrl)}
              className="whitespace-nowrap text-sm px-3 btn-outline-primary"
            >
              Copy
            </Button>
          </div>
        </div>
        <Separator />

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button 
            className="px-6 py-1 text-sm btn-outline-primary" 
            variant="outline"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </>
  );
}
