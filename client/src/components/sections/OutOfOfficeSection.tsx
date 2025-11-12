
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const OutOfOfficeSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('weekdays');
  const [weekdaysMessage, setWeekdaysMessage] = useState('');
  const [weekdaysEnabled, setWeekdaysEnabled] = useState(false);
  const [weekendMessage, setWeekendMessage] = useState('');
  const [weekendEnabled, setWeekendEnabled] = useState(false);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Out of Office</CardTitle>
        <p className="text-sm text-muted-foreground">Set your out of office message here. This message is automatically sent to customers outside your business hours.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('weekdays')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekdays'
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Weekdays
          </button>
          <button
            onClick={() => setActiveTab('weekend')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekend'
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Weekend
          </button>
        </div>

        {activeTab === 'weekdays' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Enabled for weekdays</p>
              <Switch
                checked={weekdaysEnabled}
                onCheckedChange={setWeekdaysEnabled}
              />
            </div>
            <Textarea
              placeholder="Enter message here"
              rows={4}
              value={weekdaysMessage}
              onChange={(e) => setWeekdaysMessage(e.target.value)}
              disabled={!weekdaysEnabled}
            />
          </div>
        )}

        {activeTab === 'weekend' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Enabled for weekend</p>
              <Switch
                checked={weekendEnabled}
                onCheckedChange={setWeekendEnabled}
              />
            </div>
            <Textarea
              placeholder="Enter message here"
              rows={4}
              value={weekendMessage}
              onChange={(e) => setWeekendMessage(e.target.value)}
              disabled={!weekendEnabled}
            />
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => {
            console.log("Save Out of Office Settings");
            toast({
              title: "Settings Saved",
              description: "Out of Office settings have been updated.",
            });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-normal"
        >
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default OutOfOfficeSection;
