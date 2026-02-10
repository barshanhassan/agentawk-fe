import React, { useState } from "react";
import { ExternalLink, ChevronLeft, MoreVertical, Trash2, Copy, Clock, Plug, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [hasAccounts, setHasAccounts] = useState(true); // Set to true to show connected accounts
  const [hasApiAccounts, setHasApiAccounts] = useState(true); // Set to true to show API accounts
  const [showAddNumberDialog, setShowAddNumberDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [newNumberData, setNewNumberData] = useState({
    phoneNumber: "",
    purposeType: "automated" as "automated" | "notification",
  });
  const [isSavingNumber, setIsSavingNumber] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<any>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteNumberDialog, setShowDeleteNumberDialog] = useState(false);
  const [numberToDelete, setNumberToDelete] = useState<any>(null);
  const [isDeletingNumber, setIsDeletingNumber] = useState(false);

  const { toast } = useToast();

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

  const handleAddNumberClick = (account: any) => {
    setSelectedAccount(account);
    setNewNumberData({ phoneNumber: "", purposeType: "automated" });
    setShowAddNumberDialog(true);
  };

  const handleCloseAddNumberDialog = () => {
    setShowAddNumberDialog(false);
    setSelectedAccount(null);
    setNewNumberData({ phoneNumber: "", purposeType: "automated" });
    setIsSavingNumber(false);
  };

  const handleSaveNewNumber = async () => {
    // Validation
    if (!newNumberData.phoneNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSavingNumber(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/whatsapp/account/add-number', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     account_id: selectedAccount.id,
      //     phone_number: newNumberData.phoneNumber,
      //     purpose_type: newNumberData.purposeType,
      //   }),
      // });
      // const data = await response.json();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock new number for demonstration
      const mockNewNumber = {
        id: Date.now(),
        display_phone_number: newNumberData.phoneNumber,
        verified_name: `New Number - ${newNumberData.purposeType}`,
        name_status: "PENDING",
        status: "ACTIVE",
        allow_in_feeder: false,
        auto_reply_automation_id: null,
      };

      // Update the accounts state
      setAccounts(prev => prev.map(account => {
        if (account.id === selectedAccount.id) {
          return {
            ...account,
            phone_numbers: [...account.phone_numbers, mockNewNumber],
          };
        }
        return account;
      }));

      toast({
        title: "Success",
        description: "Phone number added successfully!",
      });

      handleCloseAddNumberDialog();
    } catch (error) {
      console.error("Error adding number:", error);
      toast({
        title: "Error",
        description: "Failed to add phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingNumber(false);
    }
  };

  const handleDeleteAccountClick = (account: any) => {
    setAccountToDelete(account);
    setShowDeleteAccountDialog(true);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    setIsDeletingAccount(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/whatsapp/account/${accountToDelete.id}`, {
      //   method: 'DELETE',
      // });
      // await response.json();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove account from state
      setAccounts(prev => prev.filter(account => account.id !== accountToDelete.id));

      toast({
        title: "Success",
        description: "Account deleted successfully!",
      });

      setShowDeleteAccountDialog(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleDeleteNumberClick = (number: any, account: any) => {
    setNumberToDelete({ number, account });
    setShowDeleteNumberDialog(true);
  };

  const handleConfirmDeleteNumber = async () => {
    if (!numberToDelete) return;

    setIsDeletingNumber(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/whatsapp/number/${numberToDelete.number.id}`, {
      //   method: 'DELETE',
      // });
      // await response.json();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove number from account
      setAccounts(prev => prev.map(account => {
        if (account.id === numberToDelete.account.id) {
          return {
            ...account,
            phone_numbers: account.phone_numbers.filter(
              (num: any) => num.id !== numberToDelete.number.id
            ),
          };
        }
        return account;
      }));

      toast({
        title: "Success",
        description: "Phone number deleted successfully!",
      });

      setShowDeleteNumberDialog(false);
      setNumberToDelete(null);
    } catch (error) {
      console.error("Error deleting number:", error);
      toast({
        title: "Error",
        description: "Failed to delete phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingNumber(false);
    }
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">WhatsApp</h2>
            <p className="text-sm text-muted-foreground">
              Connect your WhatsApp accounts to the platform.
            </p>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-800" />
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
                  <div className="p-4">
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
                  <Separator className="bg-gray-200 dark:bg-slate-800" />

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
                          onClick={() => handleDeleteAccountClick(account)}
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
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteNumberClick(number, account)}
                                  >
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
                    <button
                      onClick={() => handleAddNumberClick(account)}
                      className="block border p-2 w-full text-center text-sm text-blue-600 font-medium bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 border-blue-200 dark:border-blue-900 rounded transition-colors"
                    >
                      Add new number
                    </button>
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

      {/* Add Number Dialog */}
      <Dialog open={showAddNumberDialog} onOpenChange={setShowAddNumberDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Phone Number</DialogTitle>
            <DialogDescription>
              Add a new phone number to {selectedAccount?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="font-semibold">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="e.g., +1 234 567 8900"
                value={newNumberData.phoneNumber}
                onChange={(e) =>
                  setNewNumberData({ ...newNumberData, phoneNumber: e.target.value })
                }
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Enter the phone number in international format (e.g., +1 234 567 8900)
              </p>
            </div>

            {/* Purpose Selection */}
            <div className="space-y-3">
              <Label className="font-semibold">Purpose *</Label>
              <RadioGroup
                value={newNumberData.purposeType}
                onValueChange={(value: "automated" | "notification") =>
                  setNewNumberData({ ...newNumberData, purposeType: value })
                }
                className="grid grid-cols-2 gap-4"
              >
                {/* Automated Option */}
                <div>
                  <RadioGroupItem
                    value="automated"
                    id="automated"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="automated"
                    className="flex flex-col items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/30 cursor-pointer transition-all h-full"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold text-sm">AUTOMATED</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        For AI messaging and automated conversations
                      </p>
                    </div>
                  </Label>
                </div>

                {/* Notification Option */}
                <div>
                  <RadioGroupItem
                    value="notification"
                    id="notification"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="notification"
                    className="flex flex-col items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/30 cursor-pointer transition-all h-full"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold text-sm">NOTIFICATION</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        For voice calls and SMS notifications
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseAddNumberDialog}
              disabled={isSavingNumber}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewNumber}
              disabled={isSavingNumber}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSavingNumber ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
      <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle>Delete WhatsApp Account</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{accountToDelete?.name}</span>?
              <br /><br />
              This action cannot be undone. All phone numbers and configurations associated with this account will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAccount}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDeleteAccount();
              }}
              disabled={isDeletingAccount}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeletingAccount ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Number Confirmation Dialog */}
      <AlertDialog open={showDeleteNumberDialog} onOpenChange={setShowDeleteNumberDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle>Delete Phone Number</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete the phone number{" "}
              <span className="font-semibold">{numberToDelete?.number?.display_phone_number}</span>?
              <br /><br />
              This action cannot be undone. All conversations and configurations for this number will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingNumber}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDeleteNumber();
              }}
              disabled={isDeletingNumber}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeletingNumber ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Number"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
}
