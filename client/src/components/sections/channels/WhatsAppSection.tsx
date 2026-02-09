import React, { useState } from "react";
import { MessageCircle, ExternalLink, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WhatsAppSection() {
  const [view, setView] = useState<"list" | "coex_manage" | "api_manage" | "qr_manage" | "qr_create">("list");

  return (
    <div className="p-6">
      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp Business App "Coex" */}
          <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-green-500" />
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
                <MessageCircle className="h-6 w-6 text-green-500" />
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
                <MessageCircle className="h-6 w-6 text-green-500" />
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
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-10 w-10 text-green-500" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Whatsapp Business Apps</h3>
                  <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] px-1 py-0 h-5">Beta</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  WhatsApp Coexistence "Coex" allows a single WhatsApp number to be used simultaneously with WhatsApp Business Mobile App and Official API.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setView("list")}>
              Back
            </Button>
          </div>

          {/* Content */}
          <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
              <MessageCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold">WhatsApp is not connected yet</h2>
            <p className="text-muted-foreground max-w-md">
              Connect your WhatsApp Business account now to get started.
            </p>
            <div className="pt-2">
              <Button 
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 min-w-[150px]"
              >
                Connect now
              </Button>
            </div>
          </div>
        </div>
      )}

      {view === "api_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-10 w-10 text-green-500" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">WhatsApp Business API</h3>
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  The WhatsApp Business API is a platform provided by WhatsApp that enables medium and large businesses to communicate with their customers at scale.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setView("list")}>
              Back
            </Button>
          </div>

          {/* Content */}
          <div className="border rounded-lg p-12 shadow-sm bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-4 py-24">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
              <MessageCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold">WhatsApp is not connected yet</h2>
            <p className="text-muted-foreground max-w-md">
              Connect your WhatsApp Business account now to get started.
            </p>
            <div className="pt-2">
              <Button 
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 min-w-[150px]"
              >
                Connect now
              </Button>
            </div>
          </div>
        </div>
      )}

      {view === "qr_manage" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-10 w-10 text-green-500" />
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
              <MessageCircle className="h-12 w-12 text-green-500" />
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
              <MessageCircle className="h-10 w-10 text-green-500" />
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
