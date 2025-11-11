import React from 'react';
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "react-feather";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Preferences {
    timezone: string;
    twoFactorAuth: boolean;
    autoHide: boolean;
    disableCSAT: boolean;
    manualHandoff: boolean;
    enableTranscript: boolean;
    emailTranscript: boolean;
    transcriptEmails: string;
}

interface PreferencesSectionProps {
    preferences: Preferences;
    setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
    preferences,
    setPreferences,
}) => {
    const handleSwitchChange = (key: keyof Preferences) => (checked: boolean) => {
        setPreferences(prev => ({ ...prev, [key]: checked }));
    };

    const handleSelectChange = (key: keyof Preferences) => (value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleTextChange = (key: keyof Preferences) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPreferences(prev => ({ ...prev, [key]: event.target.value }));
    };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Preferences</CardTitle>
        <p className="text-sm text-muted-foreground">These settings will be applied to the entire account.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        {/* Timezone */}
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Timezone</h4>
          <Select value={preferences.timezone} onValueChange={handleSelectChange('timezone')}>
            <SelectTrigger className="max-w-[400px]">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="(GMT-12:00) International Date Line West">(GMT-12:00) International Date Line West</SelectItem>
              <SelectItem value="(GMT-11:00) Coordinated Universal Time-11">(GMT-11:00) Coordinated Universal Time-11</SelectItem>
              <SelectItem value="(GMT-10:00) Hawaii">(GMT-10:00) Hawaii</SelectItem>
              <SelectItem value="(GMT-09:00) Alaska">(GMT-09:00) Alaska</SelectItem>
              <SelectItem value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</SelectItem>
              <SelectItem value="(GMT-07:00) Mountain Time (US & Canada)">(GMT-07:00) Mountain Time (US & Canada)</SelectItem>
              <SelectItem value="(GMT-06:00) Central Time (US & Canada)">(GMT-06:00) Central Time (US & Canada)</SelectItem>
              <SelectItem value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</SelectItem>
              <SelectItem value="(GMT-04:00) Atlantic Time (Canada)">(GMT-04:00) Atlantic Time (Canada)</SelectItem>
              <SelectItem value="(GMT-03:30) Newfoundland">(GMT-03:30) Newfoundland</SelectItem>
              <SelectItem value="(GMT-03:00) Brasilia">(GMT-03:00) Brasilia</SelectItem>
              <SelectItem value="(GMT-02:00) Mid-Atlantic">(GMT-02:00) Mid-Atlantic</SelectItem>
              <SelectItem value="(GMT-01:00) Azores">(GMT-01:00) Azores</SelectItem>
              <SelectItem value="(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</SelectItem>
              <SelectItem value="(GMT+01:00) Brussels, Copenhagen, Madrid, Paris">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</SelectItem>
              <SelectItem value="(GMT+02:00) Amman">(GMT+02:00) Amman</SelectItem>
              <SelectItem value="(GMT+02:00) Athens, Bucharest, Istanbul">(GMT+02:00) Athens, Bucharest, Istanbul</SelectItem>
              <SelectItem value="(GMT+02:00) Beirut">(GMT+02:00) Beirut</SelectItem>
              <SelectItem value="(GMT+02:00) Cairo">(GMT+02:00) Cairo</SelectItem>
              <SelectItem value="(GMT+02:00) Harare, Pretoria">(GMT+02:00) Harare, Pretoria</SelectItem>
              <SelectItem value="(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</SelectItem>
              <SelectItem value="(GMT+02:00) Jerusalem">(GMT+02:00) Jerusalem</SelectItem>
              <SelectItem value="(GMT+02:00) Windhoek">(GMT+02:00) Windhoek</SelectItem>
              <SelectItem value="(GMT+03:00) Kuwait, Riyadh">(GMT+03:00) Kuwait, Riyadh</SelectItem>
              <SelectItem value="(GMT+03:00) Baghdad">(GMT+03:00) Baghdad</SelectItem>
              <SelectItem value="(GMT+03:00) Moscow, St. Petersburg, Volgograd">(GMT+03:00) Moscow, St. Petersburg, Volgograd</SelectItem>
              <SelectItem value="(GMT+03:00) Nairobi">(GMT+03:00) Nairobi</SelectItem>
              <SelectItem value="(GMT+03:30) Tehran">(GMT+03:30) Tehran</SelectItem>
              <SelectItem value="(GMT+04:00) Abu Dhabi, Muscat">(GMT+04:00) Abu Dhabi, Muscat</SelectItem>
              <SelectItem value="(GMT+04:00) Baku">(GMT+04:00) Baku</SelectItem>
              <SelectItem value="(GMT+04:00) Tbilisi">(GMT+04:00) Tbilisi</SelectItem>
              <SelectItem value="(GMT+04:00) Yerevan">(GMT+04:00) Yerevan</SelectItem>
              <SelectItem value="(GMT+04:30) Kabul">(GMT+04:30) Kabul</SelectItem>
              <SelectItem value="(GMT+05:00) Islamabad, Karachi, Tashkent">(GMT+05:00) Islamabad, Karachi, Tashkent</SelectItem>
              <SelectItem value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</SelectItem>
              <SelectItem value="(GMT+05:45) Kathmandu">(GMT+05:45) Kathmandu</SelectItem>
              <SelectItem value="(GMT+06:00) Astana, Dhaka">(GMT+06:00) Astana, Dhaka</SelectItem>
              <SelectItem value="(GMT+06:30) Yangon (Rangoon)">(GMT+06:30) Yangon (Rangoon)</SelectItem>
              <SelectItem value="(GMT+07:00) Bangkok, Hanoi, Jakarta">(GMT+07:00) Bangkok, Hanoi, Jakarta</SelectItem>
              <SelectItem value="(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</SelectItem>
              <SelectItem value="(GMT+08:00) Perth">(GMT+08:00) Perth</SelectItem>
              <SelectItem value="(GMT+08:00) Taipei">(GMT+08:00) Taipei</SelectItem>
              <SelectItem value="(GMT+09:00) Osaka, Sapporo, Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</SelectItem>
              <SelectItem value="(GMT+09:00) Seoul">(GMT+09:00) Seoul</SelectItem>
              <SelectItem value="(GMT+09:30) Adelaide">(GMT+09:30) Adelaide</SelectItem>
              <SelectItem value="(GMT+09:30) Darwin">(GMT+09:30) Darwin</SelectItem>
              <SelectItem value="(GMT+10:00) Brisbane">(GMT+10:00) Brisbane</SelectItem>
              <SelectItem value="(GMT+10:00) Canberra, Melbourne, Sydney">(GMT+10:00) Canberra, Melbourne, Sydney</SelectItem>
              <SelectItem value="(GMT+10:00) Guam, Port Moresby">(GMT+10:00) Guam, Port Moresby</SelectItem>
              <SelectItem value="(GMT+10:00) Hobart">(GMT+10:00) Hobart</SelectItem>
              <SelectItem value="(GMT+11:00) Magadan, Solomon Is., New Caledonia">(GMT+11:00) Magadan, Solomon Is., New Caledonia</SelectItem>
              <SelectItem value="(GMT+12:00) Auckland, Wellington">(GMT+12:00) Auckland, Wellington</SelectItem>
              <SelectItem value="(GMT+12:00) Fiji, Kamchatka, Marshall Is.">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</SelectItem>
              <SelectItem value="(GMT+13:00) Nuku'alofa">(GMT+13:00) Nuku'alofa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Login Security */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base">Login Security</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Two-factor authentication is an extra layer of security for your user accounts. Instead of only entering a password to log in, they will also be required to enter a code. After you enable this feature, your users will receive a one-time code on their registered mobile phone number and/or registered email address to log in to their account.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Enable two-factor authentication for your user login. For certain countries, two-factor authentication via SMS is not available. <br /> Email can be selected as a backup option to receive the login code.</p>
            <Switch aria-label="Enable two-factor authentication" checked={preferences.twoFactorAuth} onCheckedChange={handleSwitchChange('twoFactorAuth')} />
          </div>
        </div>

        <Separator />

        {/* Auto-hide Conversations */}
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Auto-hide Conversations</h4>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Enable auto-hide for conversation marked closed by your agents.</p>
            <Switch aria-label="Enable auto-hide conversations" checked={preferences.autoHide} onCheckedChange={handleSwitchChange('autoHide')} />
          </div>
        </div>

        <Separator />

        {/* Disable CSAT */}
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Disable CSAT</h4>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Disable customer feedback templates for pending chats.</p>
            <Switch aria-label="Disable CSAT" checked={preferences.disableCSAT} onCheckedChange={handleSwitchChange('disableCSAT')} />
          </div>
        </div>

        <Separator />

        {/* Manual Bot to Human Handoff */}
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Manual Bot to Human Handoff</h4>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Enable agents and supervisors to manually take over a conversation from a bot.<br /><span className="font-bold">Note:</span> Agents and Supervisors must relogin for the changes to take effect.</p>
            <Switch aria-label="Enable manual bot to human handoff" checked={preferences.manualHandoff} onCheckedChange={handleSwitchChange('manualHandoff')} />
          </div>
        </div>

        <Separator />

        {/* Enable Conversation Transcript */}
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Enable Conversation Transcript</h4>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Conversation transcript is a record of a chat between a customer and an agent.</p>
            <Switch aria-label="Enable conversation transcript" checked={preferences.enableTranscript} onCheckedChange={handleSwitchChange('enableTranscript')} />
          </div>
        </div>

        <Separator />

        {/* Email Conversation Transcripts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-base">Email Conversation Transcripts</h4>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Automatically allow conversation transcripts to be sent to one or more email addresses when a conversation is closed by your agents. For your security, consider only using this feature with trusted email addresses.</p>
            <Switch aria-label="Enable email conversation transcripts" checked={preferences.emailTranscript} onCheckedChange={handleSwitchChange('emailTranscript')} />
          </div>
        </div>

        {/* Enter Email Addresses */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base">Enter Email Addresses</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Insert comma separated email address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea placeholder="john@example.com, peter@example.com" rows={4} value={preferences.transcriptEmails} onChange={handleTextChange('transcriptEmails')} disabled={!preferences.emailTranscript} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => console.log("Save Preferences", preferences)} className="bg-blue-500 hover:bg-blue-600 text-white font-normal">
          Save
        </Button>
      </CardFooter>
    </>
  );
};

export default PreferencesSection;
