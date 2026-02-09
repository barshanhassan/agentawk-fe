import React from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SmsCallsSection() {
  return (
    <div className="p-6">
      <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
               <Phone className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">SMS & Calls</h3>
              <p className="text-sm text-muted-foreground">
                Integrate your Twilio account to unlock 2-Way interactive dynamic conversations
              </p>
            </div>
          </div>
          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
            Add new
          </Button>
        </div>

        {/* Content */}
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 py-24">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
            <Phone className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold">Connect your Twilio account now</h2>
          <p className="text-muted-foreground max-w-md">
            Integrate this communication channel to automate conversations.
          </p>
          <div className="pt-2">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 min-w-[150px]">
              Connect now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
