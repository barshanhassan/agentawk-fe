import React from 'react';
import { 
  ChevronLeft, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Globe, 
  Clock, 
  History,
  FileText,
  Smartphone,
  Send,
  MessageCircle,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface WorkspaceUsageViewProps {
  workspace: any;
  onBack: () => void;
}

const WorkspaceUsageView: React.FC<WorkspaceUsageViewProps> = ({ workspace, onBack }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  // Mock usage data based on Byte_front structure
  const usage = {
    subscription: {
      next_billing_at: "2025-05-11"
    },
    current_usage: {
      agents: { total_agents: 4, free_agents: 1, amount: 30.00 },
      channels: { total_channels: 2, free_channels: 1, amount: 10.00 },
      contacts: { current_total: 1250, total_contacts: 5000, amount: 25.00 },
      domain: { amount: 0.00 },
      voice_credits: { credits_used: 125 }, // seconds
      total: 65.00
    },
    history: [
      { id: 1, end_date: "2025-04-11", currency: "$", agents: { amount: 30 }, contacts: { amount: 25 }, channels: { amount: 10 }, domain: { amount: 0 }, total: 65, media: true },
      { id: 2, end_date: "2025-03-11", currency: "$", agents: { amount: 30 }, contacts: { amount: 20 }, channels: { amount: 10 }, domain: { amount: 0 }, total: 60, media: true },
    ]
  };

  const channelStats = [
    { name: "Support WhatsApp", type: "WhatsApp", incoming: 124, outgoing: 89, icon: <MessageCircle className="w-5 h-5 text-green-500" /> },
    { name: "Marketing SMS", type: "SMS", incoming: 0, outgoing: 450, icon: <MessageSquare className="w-5 h-5 text-blue-500" /> },
    { name: "Info Bot", type: "Telegram", incoming: 56, outgoing: 56, icon: <Send className="w-5 h-5 text-sky-500" /> },
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
      {/* Header */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors",
        isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className={cn("p-2 rounded", isDark ? "bg-[#334155]" : "bg-slate-100")}>
            <BarChart3 className={cn("w-6 h-6", isDark ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Usage for {workspace?.name}</h1>
            <p className="text-gray-400 text-sm">Review your resource consumption and billing history.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Usage Stats */}
        <div className="lg:col-span-8 space-y-6">
          <Card className={cn("border transition-colors", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <CardHeader className="border-b border-slate-700/50 pb-4">
               <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" /> Current Period Usage
                  </CardTitle>
                  <div className="text-xs text-gray-400">
                    Next billing: {usage.subscription.next_billing_at}
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-100")}>
                  {/* Agents */}
                  <tr className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-sm">Agents</p>
                          <p className="text-xs text-gray-400">Total agents in workspace</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Total</p>
                      <p className="text-lg font-bold">{usage.current_usage.agents.total_agents}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Included</p>
                      <p className="text-sm font-medium">{usage.current_usage.agents.free_agents}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Amount</p>
                      <p className="text-lg font-bold text-primary">${usage.current_usage.agents.amount.toFixed(2)}</p>
                    </td>
                  </tr>
                  {/* Contacts */}
                  <tr className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-semibold text-sm">Contacts</p>
                          <p className="text-xs text-gray-400">Active and stored contacts</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Current</p>
                      <p className="text-lg font-bold">{usage.current_usage.contacts.current_total}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Peak</p>
                      <p className="text-sm font-medium">{usage.current_usage.contacts.total_contacts}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Amount</p>
                      <p className="text-lg font-bold text-primary">${usage.current_usage.contacts.amount.toFixed(2)}</p>
                    </td>
                  </tr>
                  {/* Total Row */}
                  <tr className={isDark ? "bg-[#0f172a]" : "bg-slate-50"}>
                    <td colSpan={3} className="px-6 py-4">
                      <p className="font-bold">Total Amount for Current Period</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-2xl font-bold text-primary">${usage.current_usage.total.toFixed(2)}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Channel Stats */}
          <Card className={cn("border transition-colors", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <CardHeader className="border-b border-slate-700/50 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Channel Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                {channelStats.map((stat, i) => (
                  <div key={i} className="p-6 space-y-4 hover:bg-slate-800/10 transition-colors">
                    <div className="flex items-center gap-3">
                      {stat.icon}
                      <div>
                        <p className="font-bold text-sm">{stat.name}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">{stat.type}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold">{stat.incoming}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Incoming</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{stat.outgoing}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Outgoing</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-4 space-y-6">
          <Card className={cn("border transition-colors h-full", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <CardHeader className="border-b border-slate-700/50 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" /> Usage History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700/50">
                {usage.history.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-800/10 transition-colors space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.end_date}</span>
                      <span className="text-sm font-bold text-primary">{item.currency}{item.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Agents: {item.currency}{item.agents.amount}</span>
                      <span>Contacts: {item.currency}{item.contacts.amount}</span>
                    </div>
                    {item.media && (
                      <button className="text-[10px] flex items-center gap-1 text-blue-500 hover:underline font-bold uppercase tracking-wider mt-1">
                        <FileText size={12} /> Download PDF Invoice
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {usage.history.length === 0 && (
                <div className="p-8 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-gray-600 mx-auto" />
                  <p className="text-sm text-gray-500 font-medium">No history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceUsageView;
