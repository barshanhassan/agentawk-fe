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

export default function ManageSection() {
  const workspaceId = "3";
  const loginUrl = ""

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
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
            <Input defaultValue="Ezconn" className="text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white" />
          </div>
        </div>
        <Separator />

        {/* Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Timezone</label>
          <div className="md:col-span-2">
            <Select defaultValue="America/Fortaleza">
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
            <Select defaultValue="monday">
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
          <Button className="px-6 py-1 text-sm btn-outline-primary" variant="outline">
            Save
          </Button>
        </div>
      </CardContent>
    </>
  );
}
