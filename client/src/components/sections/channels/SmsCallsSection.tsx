import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Trash2, 
  MoreVertical, 
  Plug, 
  Eye, 
  EyeOff, 
  Phone, 
  Cpu, 
  Check, 
  X,
  Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockSmsAccounts = [
  {
    id: 1,
    name: "Main Twilio Account",
    sid: "AC1234567890abcdef1234567890abcdef",
    token: "abcdef1234567890abcdef1234567890",
    status: "VERIFIED",
    sip: {
      username: "sip_user_1",
      password: "sip_password_1",
      visible: false
    },
    numbers: [
      {
        id: 1,
        number: "+1 234 567 8900",
        type: "automated", // automated or notification
        status: "VERIFIED",
        forward_type: "NONE", // NONE, NUMBER, AGENT, TEAM
        forward_to: "",
      },
      {
        id: 2,
        number: "+1 987 654 3210",
        type: "notification",
        status: "VERIFIED",
        forward_type: "NUMBER",
        forward_to: "+1 555 000 1111",
      }
    ]
  },
];

export default function SmsCallsSection() {
  const [view, setView] = useState<"list" | "manage">("list");
  const [hasAccounts, setHasAccounts] = useState(true);
  const [accounts, setAccounts] = useState(mockSmsAccounts);

  const toggleSipVisibility = (accountId: number, field: 'username' | 'password') => {
      // In a real app, logic to toggle visibility
      console.log("Toggle visibility", accountId, field);
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">SMS & Calls</h2>
            <p className="text-sm text-muted-foreground">
              Connect your Twilio account for SMS and Call automation.
            </p>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/sms.svg" alt="SMS" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">SMS & Calls</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                Integrate your Twilio account to unlock 2-Way interactive dynamic conversations.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("manage")}
              >
                Manage
              </Button>
            </div>
          </div>
        </div>
        </div>
      )}

      {view === "manage" && (
        <div className="space-y-6">
          <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/automations/sms.svg" alt="SMS" className="h-10 w-10 mr-2" />
                <div>
                  <h3 className="text-lg font-medium">SMS & Calls</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrate your Twilio account to unlock 2-Way interactive dynamic conversations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                  onClick={() => setHasAccounts(true)}
                >
                  Add new
                </Button>
                <Button variant="outline" onClick={() => setView("list")}>
                  Back
                </Button>
              </div>
            </div>
            <Separator className="bg-gray-200 dark:bg-slate-800" />

            {/* Content */}
            {!hasAccounts ? (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 py-24">
                <div className="bg-gradient-to-tr from-red-50 to-red-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-full">
                  <img src="/images/automations/sms.svg" alt="SMS" className="h-12 w-12" />
                </div>
                <h2 className="text-lg font-semibold">Connect your Twilio account now</h2>
                <p className="text-muted-foreground max-w-md text-sm">
                  Integrate this communication channel to automate conversations.
                </p>
                <div className="pt-2">
                  <Button 
                    className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]"
                    onClick={() => setHasAccounts(true)}
                  >
                    Connect now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 divide-y">
                {accounts.map((account) => (
                  <div key={account.id} className="pb-6">
                    <div className="flex items-start gap-10">
                      {/* Left Logo */}
                      <div>
                        <div className="border rounded-md px-5 py-10 bg-white dark:bg-slate-800">
                           <img width="80" height="80" src="/images/automations/twilio.webp" alt="Twilio" onError={(e) => e.currentTarget.src='/images/automations/sms.svg'} />
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="flex flex-col gap-5 w-full">
                         {/* Name */}
                         <div className="grid grid-cols-4 items-center">
                           <div className="font-bold col-span-1 text-sm">Name</div>
                           <div className="col-span-3 flex space-x-4">
                             <input 
                               value={account.name} 
                               className="px-3 py-2 border rounded-md disabled:opacity-50 grow text-sm" 
                               type="text" 
                               disabled
                             />
                             <div className="self-center flex items-center gap-2">
                                <Badge variant="outline" className={`text-xs ${account.status === 'VERIFIED' ? 'text-green-600 border-green-600' : 'text-red-500'}`}>
                                  {account.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                           </div>
                         </div>

                         {/* SID */}
                         <div className="grid grid-cols-4 items-center">
                           <div className="font-bold col-span-1 text-sm">Account SID</div>
                           <div className="col-span-3">
                             <input 
                               value={account.sid} 
                               className="w-full px-3 py-2 border rounded-md disabled:opacity-50 text-sm" 
                               type="text" 
                               disabled
                             />
                           </div>
                         </div>

                         {/* Token */}
                         <div className="grid grid-cols-4 items-center">
                           <div className="font-bold col-span-1 text-sm">Account Token</div>
                           <div className="col-span-3">
                             <input 
                               value={'*******************' + account.token.slice(-4)} 
                               className="w-full px-3 py-2 border rounded-md disabled:opacity-50 bg-slate-50 dark:bg-slate-800 text-sm" 
                               type="text" 
                               disabled 
                             />
                           </div>
                         </div>

                         {/* SIP Section */}
                         {account.sip && (
                           <>
                             <div className="grid grid-cols-4 items-center">
                               <div className="font-bold col-span-1 text-sm">SIP Username</div>
                               <div className="col-span-3 flex items-center gap-4">
                                 <input 
                                   value={account.sip.username} 
                                   className="w-full px-3 py-2 border rounded-md disabled:opacity-50 bg-slate-50 dark:bg-slate-800 text-sm" 
                                   type="text" 
                                   disabled 
                                 />
                                 <div className="flex gap-2">
                                   <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <Eye className="h-4 w-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <Copy className="h-4 w-4" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                             <div className="grid grid-cols-4 items-center">
                               <div className="font-bold col-span-1 text-sm">SIP Password</div>
                               <div className="col-span-3 flex items-center gap-4">
                                 <input 
                                   value="****************" 
                                   className="w-full px-3 py-2 border rounded-md disabled:opacity-50 bg-slate-50 dark:bg-slate-800 text-sm" 
                                   type="password" 
                                   disabled 
                                 />
                                 <div className="flex gap-2">
                                   <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <Eye className="h-4 w-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <Copy className="h-4 w-4" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           </>
                         )}

                         <Separator className="my-4 bg-gray-200 dark:bg-slate-800" />

                         {/* Phone Numbers */}
                         <div className="grid grid-cols-4">
                           <div className="font-bold col-span-1 mt-3 text-sm">Phone Numbers</div>
                           <div className="col-span-3 space-y-4">
                             {account.numbers.map((number) => (
                               <div key={number.id} className="py-2">
                                 <div className="grid grid-cols-2 gap-6 items-center">
                                   <div className="col-span-1">
                                     <input 
                                       type="text" 
                                       readOnly 
                                       value={number.number} 
                                       className="w-full px-3 py-2 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm" 
                                     />
                                   </div>
                                   <ul className="col-span-1 flex space-x-4 items-center">
                                     <li>
                                       {number.type === 'automated' ? (
                                         <Cpu className="h-5 w-5 text-gray-500" />
                                       ) : (
                                         <Phone className="h-5 w-5 text-gray-500" />
                                       )}
                                     </li>
                                     <li>
                                       <Badge variant="outline" className={`text-xs ${number.status === 'VERIFIED' ? 'text-green-600 border-green-600' : 'text-red-500'}`}>
                                         {number.status}
                                       </Badge>
                                     </li>
                                     <li>
                                       <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                                         <Trash2 className="h-4 w-4" />
                                       </Button>
                                     </li>
                                   </ul>
                                 </div>

                                 {/* Call Forwarding (Partial Implementation) */}
                                 {number.status === 'VERIFIED' && (
                                   <div className="mt-4 grid grid-cols-2 gap-4">
                                     <div>
                                        <Label className="text-sm font-semibold mb-1 block">Forward calls to</Label>
                                        <Select defaultValue={number.forward_type}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="NONE">None</SelectItem>
                                            <SelectItem value="NUMBER">Number</SelectItem>
                                            <SelectItem value="AGENT">Agent</SelectItem>
                                            <SelectItem value="TEAM">Team</SelectItem>
                                          </SelectContent>
                                        </Select>
                                     </div>
                                     
                                     {number.forward_type === 'NONE' && (
                                       <div className="flex items-center space-x-2 mt-6">
                                         <div className="grow bg-yellow-50 border border-yellow-200 p-2 text-yellow-700 text-xs font-semibold rounded flex items-center gap-2">
                                           <span>⚠</span> Call forwarding disabled
                                         </div>
                                         <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                                       </div>
                                     )}

                                      {number.forward_type === 'NUMBER' && (
                                       <div className="flex items-center space-x-2 mt-6">
                                          <div className="grow">
                                            <input type="text" className="w-full px-3 py-2 border rounded-md text-sm" value={number.forward_to} placeholder="Enter number" />
                                          </div>
                                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                                       </div>
                                     )}
                                   </div>
                                 )}
                               </div>
                             ))}
                             
                             <div className="pt-2">
                               <button className="text-sm font-semibold text-blue-600 hover:underline">Add new number</button>
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
