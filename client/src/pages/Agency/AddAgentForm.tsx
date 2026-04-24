import React from 'react';
import { Users, Info, AlertTriangle, Globe, User, Shield, Mail, Phone, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface AddAgentFormProps {
  onCancel: () => void;
}

const AddAgentForm: React.FC<AddAgentFormProps> = ({ onCancel }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className={cn(
      "min-h-screen p-6 font-sans transition-colors duration-300",
      isDark ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900"
    )}>
      <Card className={cn(
        "max-w-6xl mx-auto shadow-xl border transition-colors",
        isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200"
      )}>
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className={cn("p-2 rounded", isDark ? "bg-[#334155]" : "bg-slate-100")}>
              <Users className={cn("w-6 h-6", isDark ? "text-white" : "text-primary")} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Add agent</h1>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                Add team agent and manage Workspace access.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                <Input className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="First name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                <Input className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="Last name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                <Input className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                <Select>
                  <SelectTrigger className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? "bg-[#1e293b] border-slate-700 text-white" : ""}>
                    <SelectItem value="admin">Agency Owner</SelectItem>
                    <SelectItem value="super_user">Super User</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-lg">🇺🇸</span>
                  </div>
                  <Input className={cn("pl-12", isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="(407) 231-1234" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-lg">🇺🇸</span>
                  </div>
                  <Input className={cn("pl-12", isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="(407) 231-1234" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                <Select>
                  <SelectTrigger className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")}>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? "bg-[#1e293b] border-slate-700 text-white" : ""}>
                    <SelectItem value="en">English (U.S)</SelectItem>
                    <SelectItem value="pt">Português (Brasil)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2-Factor Auth Section */}
          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">2-Factor authentication</h3>
            <div className="flex items-start gap-4">
              <Switch className="mt-1" />
              <div>
                <p className="text-sm font-semibold">Require 2-Factor Authentication</p>
                <p className={cn("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  This will force the agent to enable 2-Factor Authentication on their next login.
                </p>
              </div>
            </div>
          </div>

          {/* Premium Support Section */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Premium Support</h3>
              <div className="flex items-center gap-4">
                <Switch />
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Can access Premium Support</p>
                  <Info size={14} className="text-slate-500 cursor-pointer" />
                </div>
              </div>

              {/* Warning Alert */}
              <div className={cn(
                "p-4 rounded-md border",
                isDark ? "bg-yellow-900/20 border-yellow-900/50" : "bg-yellow-50 border-yellow-100"
              )}>
                <div className="flex gap-3">
                  <AlertTriangle className={cn("w-5 h-5 shrink-0 mt-0.5", isDark ? "text-yellow-500" : "text-yellow-600")} />
                  <div className="text-xs">
                    <p className={cn("font-bold mb-1", isDark ? "text-yellow-500" : "text-yellow-800")}>
                      You have 0 agent(s) subscribed to Premium Support.
                    </p>
                    <p className={isDark ? "text-yellow-500/80" : "text-yellow-700"}>
                      Your current plan includes Premium Support access for 2 agent(s). Additional agent access is available for just $15/month each.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-10 md:mt-0 pt-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email to access premium support</label>
                <Input className={cn(isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="a@b.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone number to access premium support</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-lg opacity-50">🇺🇸</span>
                  </div>
                  <Input className={cn("pl-12", isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="(407) 231-1234" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp to access premium support</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-lg opacity-50">🇺🇸</span>
                  </div>
                  <Input className={cn("pl-12", isDark ? "bg-[#0f172a] border-slate-700" : "")} placeholder="(407) 231-1234" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-slate-800">
            <Button variant="outline" onClick={onCancel} className={cn(isDark ? "bg-transparent border-slate-700 hover:bg-slate-800" : "")}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white px-8">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAgentForm;
