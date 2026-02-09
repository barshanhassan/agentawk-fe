import React, { useState } from "react";
import { ExternalLink, ChevronLeft, MoreVertical, Trash2, Copy, Clock, Plug, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

// Mock data for demonstration
const mockAccounts = [
  {
    id: 1,
    name: "My Business Account",
    status: "ACTIVE",
    business_verification_status: "verified",
    phone_numbers: [
      {
        id: 1,
        display_phone_number: "+1 234 567 8900",
        verified_name: "My Business",
        name_status: "APPROVED",
        status: "ACTIVE",
        allow_in_feeder: true,
        auto_reply_automation_id: null,
      },
    ],
    capi: null,
  },
];

const mockApiAccounts = [
  {
    id: 1,
    name: "Tech Solutions Inc",
    waba_id: "123456789",
    currency: "USD",
    status: "ACTIVE",
    business_verification_status: "verified",
    phone_numbers: [
      {
        id: 1,
        display_phone_number: "+1 555 123 4567",
        verified_name: "Tech Solutions",
        name_status: "APPROVED",
        status: "ACTIVE",
        allow_in_feeder: true,
        auto_reply_automation_id: null,
      },
      {
        id: 2,
        display_phone_number: "+1 555 987 6543",
        verified_name: "Tech Support",
        name_status: "PENDING",
        status: "ACTIVE",
        allow_in_feeder: false,
        auto_reply_automation_id: null,
      },
    ],
    capi: {
      dataset_id: "DS123456",
    },
  },
];

export default function WhatsAppSection() {
  const [view, setView] = useState<"list" | "coex_manage" | "api_manage" | "qr_manage" | "qr_create">("list");
  const [accounts, setAccounts] = useState(mockAccounts);
  const [hasAccounts, setHasAccounts] = useState(false); // Set to true to show connected accounts
  const [hasApiAccounts, setHasApiAccounts] = useState(false); // Set to true to show API accounts

  const toggleFeeder = (numberId: number, accountId: number) => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        return {
          ...account,
          phone_numbers: account.phone_numbers.map(number => {
            if (number.id === numberId) {
              return { ...number, allow_in_feeder: !number.allow_in_feeder };
            }
            return number;
          }),
        };
      }
      return account;
    }));
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp Business App "Coex" */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">WhatsApp Business App "Coex"</h3>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] px-1 py-0 h-5">Beta</Badge>
            </div>
            
            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                Link your existing WhatsApp Business App phone number and continue using it on your mobile while managing conversations in real-time in our platform.
              </p>
              
              <div>
                <p className="font-medium text-foreground mb-1">Before you connect...</p>
                <ul className="space-y-2">
                  <li>
                    You should be using WhatsApp Business App already for your business i.e. your number is connected to the WhatsApp Business App.
                  </li>
                  <li>
                    You must be using the latest version of WhatsApp mobile application in your phone.
                  </li>
                  <li>
                    Currently, Meta is not allowing businesses to onboard via Coex from select countries. Check that your country is NOT listed in this list <a href="#" className="text-blue-600 hover:underline">link</a>.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("coex_manage")}
              >
                Manage
              </Button>
            </div>
          </div>

          {/* Card 2: WhatsApp Business API */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">WhatsApp Business API</h3>
              </div>
              <ExternalLink className="h-4 w-4 text-blue-500" />
            </div>
            
            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                The WhatsApp Business API is a platform provided by WhatsApp that enables medium and large businesses to communicate with their customers at scale.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("api_manage")}
              >
                Manage
              </Button>
            </div>
          </div>

          {/* Card 3: WhatsApp QR Code */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-6 w-6" />
                <h3 className="font-semibold text-sm">WhatsApp QR Code</h3>
              </div>
            </div>
            
            <div className="space-y-4 text-xs text-muted-foreground flex-grow">
              <p>
                Our native QR Code WhatsApp Web integration makes it easy and intuitive to connect your WhatsApp number to the platform.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("qr_manage")}
              >
                Manage
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {view === "coex_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-10 w-10" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">WhatsApp Business Apps</h3>
                    <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] px-1 py-0 h-5">Beta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    WhatsApp Coexistence "Coex" allows a single WhatsApp number to be used simultaneously with WhatsApp Business Mobile App and Official API.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setView("list")}>
                Back
              </Button>
            </div>
          </div>

          {/* Content - Empty State or Connected Accounts */}
          {!hasAccounts ? (
            <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-12 w-12" />
              </div>
              <h2 className="text-lg font-semibold">No integration found</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Connect your WhatsApp Business account now to get started.
              </p>
              <div className="pt-2">
                <Button 
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 min-w-[150px]"
                  onClick={() => setHasAccounts(true)}
                >
                  Connect now
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {accounts.map((account) => (
                <div key={account.id} className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
                  {/* Account Header */}
                  <div className="p-4 border-b dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-8 w-8" />
                        <div>
                          <div className="font-medium">WhatsApp Business Apps</div>
                          <p className="text-sm text-muted-foreground">
                            WhatsApp Coexistence "Coex" allows a single WhatsApp number to be used simultaneously with WhatsApp Business Mobile App and Official API.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.status === "FAILED" && (
                          <Badge variant="destructive" className="text-xs">Failed</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">Coex</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Account Body */}
                  <div className="p-4 space-y-4">
                    {/* Business Name and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="font-bold">{account.name}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <a 
                          href="https://developers.facebook.com/docs/whatsapp/pricing/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          Pricing
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a 
                          href="https://business.facebook.com/settings/whatsapp-business-accounts/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          Access BM
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="text-xs px-2 py-1 h-auto"
                        >
                          Delete Account
                        </Button>
                        {account.capi ? (
                          <Button 
                            variant="default" 
                            size="sm"
                            className="text-xs px-2 py-1 h-auto bg-blue-600 hover:bg-blue-700"
                          >
                            <i className="fa-brands fa-meta mr-2"></i>
                            Conversions API
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs px-2 py-1 h-auto"
                          >
                            <i className="fa-brands fa-meta mr-2"></i>
                            Conversions API
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Phone Numbers */}
                    {account.phone_numbers.map((number) => (
                      <div key={number.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              ["AVAILABLE_WITHOUT_REVIEW", "APPROVED"].includes(number.name_status) 
                                ? "bg-green-600" 
                                : "bg-gray-400"
                            }`} />
                            <span className="text-sm">{number.display_phone_number}</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-sm">{number.verified_name}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            {number.status === "ACTIVE" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Auto reply
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Templates
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete number
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      toggleFeeder(number.id, account.id);
                                    }}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center">
                                        <Plug className="mr-2 h-4 w-4" />
                                        AI Feeder
                                      </div>
                                      <Switch 
                                        checked={number.allow_in_feeder}
                                        onCheckedChange={() => toggleFeeder(number.id, account.id)}
                                      />
                                    </div>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            {["LOCKED", "FAILED"].includes(number.status) && (
                              <Badge variant="destructive" className="text-xs">
                                {number.status === "LOCKED" ? "Blocked" : "Error"}
                              </Badge>
                            )}
                            {number.status === "DISCONNECTED" && (
                              <Badge variant="outline" className="text-xs text-red-500 border-red-400">
                                Disconnected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Number */}
                    <a 
                      href="#" 
                      className="block border p-2 w-full text-center text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    >
                      Add new number
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "api_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-10 w-10" />
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp Business API</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integrate your WhatsApp Business account to unlock 2-Way interactive dynamic conversations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                  onClick={() => setHasApiAccounts(true)}
                >
                  Add new
                </Button>
                <Button variant="outline" onClick={() => setView("list")}>
                  Back
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {!hasApiAccounts ? (
            <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-12 w-12" />
              </div>
              <h2 className="text-lg font-semibold">No integration found</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Connect your WhatsApp Business account now to get started.
              </p>
              <div className="pt-2">
                <Button 
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 min-w-[150px]"
                  onClick={() => setHasApiAccounts(true)}
                >
                  Connect now
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
              {mockApiAccounts.map((account) => (
                <div key={account.id} className="border-b last:border-b-0">
                  {/* Account Header Table */}
                  <div className="bg-slate-50 dark:bg-slate-800/50">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-semibold text-sm px-4 pt-5 pb-1 w-1/4">
                            WA Business Account Name
                          </th>
                          <th className="text-left font-semibold text-sm px-4 pt-5 pb-1 w-1/4">
                            Templates
                          </th>
                          <th className="text-left font-semibold text-sm px-4 pt-5 pb-1 w-1/4">
                            Action
                          </th>
                          <th className="text-left font-semibold text-sm px-4 pt-5 pb-1 w-1/4">
                            Extra
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 pb-5 pt-1">
                            <div className="flex items-center gap-2">
                              <span>{account.name}</span>
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          </td>
                          <td className="px-4 pb-5 pt-1">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1 h-auto bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                            >
                              Templates
                            </Button>
                          </td>
                          <td className="px-4 pb-5 pt-1">
                            <div className="flex items-center gap-4">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-1 h-auto text-red-500 border-red-400 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                              {account.capi ? (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                                >
                                  <i className="fa-brands fa-meta mr-2"></i>
                                  Conversions API
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto"
                                >
                                  <i className="fa-brands fa-meta mr-2"></i>
                                  Conversions API
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 pb-5 pt-1">
                            <div className="flex items-center gap-4 text-sm">
                              <a 
                                href="https://business.facebook.com/settings/whatsapp-business-accounts/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                              >
                                Manage
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <a 
                                href="https://business.whatsapp.com/products/platform-pricing" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                              >
                                Pricing
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Phone Numbers Table */}
                  <div className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-semibold text-sm px-4 py-3 w-1/4">Display Name</th>
                          <th className="text-left font-semibold text-sm px-4 py-3 w-1/4">Phone Number</th>
                          <th className="text-left font-semibold text-sm px-4 py-3 w-1/4">Status</th>
                          <th className="text-right font-semibold text-sm px-4 py-3 w-1/4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {account.phone_numbers.map((number) => (
                          <tr key={number.id} className="border-b last:border-b-0">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {number.name_status === "APPROVED" ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span>{number.verified_name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">{number.display_phone_number}</td>
                            <td className="px-4 py-4">
                              {number.status === "ACTIVE" ? (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                  Active
                                </Badge>
                              ) : number.status === "DISCONNECTED" ? (
                                <Badge variant="outline" className="text-xs text-red-500 border-red-400">
                                  Disconnected
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {number.status}
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-4">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <div className="flex items-center justify-between w-full gap-3">
                                        <div className="flex items-center gap-2">
                                          <Plug className="h-4 w-4" />
                                          <span>AI Feeder</span>
                                        </div>
                                        <Switch checked={number.allow_in_feeder} />
                                      </div>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "qr_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-10 w-10" />
              <div>
                <h3 className="font-semibold text-lg">WhatsApp QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your WhatsApp number.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                onClick={() => setView("qr_create")}
              >
                Create an Instance
              </Button>
              <Button variant="outline" onClick={() => setView("list")}>
                Back
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
              <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-12 w-12" />
            </div>
            <h2 className="text-lg font-semibold">No instance found</h2>
            <div className="pt-2">
              <Button 
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 min-w-[150px]"
                onClick={() => setView("qr_create")}
              >
                Create an Instance
              </Button>
            </div>
          </div>
        </div>
      )}

      {view === "qr_create" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/automations/whatsapp.svg" alt="WhatsApp" className="h-10 w-10" />
              <div>
                <h3 className="font-semibold text-lg">WhatsApp QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your WhatsApp number.
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instance Name</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-xl"
                  placeholder="" 
                />
                <Button variant="outline" onClick={() => setView("qr_manage")}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create</Button>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check1" className="mt-1" />
                <label htmlFor="check1" className="text-sm text-muted-foreground">
                  I declare that I take responsibility for the proper use of the platform, in accordance with <a href="#" className="text-blue-600 hover:underline">WhatsApp's Terms of Use</a>. I will not send SPAM, as I am aware of the risk of my number being banned from WhatsApp. I understand that the platform has no responsibility for the content of the messages sent or for the consequences of improper use. Furthermore, I confirm that the content of my messages complies with WhatsApp's Terms of Use, and I fully acknowledge my responsibility in this regard.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check2" className="mt-1" />
                <label htmlFor="check2" className="text-sm text-muted-foreground">
                  I acknowledge and agree that this purchase is final and non-refundable under any circumstances.
                </label>
              </div>
               <div className="flex items-start gap-2">
                <input type="checkbox" id="check3" className="mt-1" />
                <label htmlFor="check3" className="text-sm text-muted-foreground">
                  I acknowledge and agree that this purchase is final and non-refundable under any circumstances.
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
