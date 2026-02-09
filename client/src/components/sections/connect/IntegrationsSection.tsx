import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Plug, 
  ExternalLink, 
  ArrowLeftRight, 
  AudioLines,
  Cloud, 
  ChevronRight,
  Aperture,
  Pause, 
  MessageSquare, 
  FileText, 
  Database, 
  DollarSign, 
  Infinity, 
  Sparkles, 
  Fish, 
  Flame 
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  hasToggle: boolean;
  actionLabel: string;
  isBeta?: boolean;
}

export default function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "azure-tts",
      name: "Microsoft Text-To-Speech",
      description: "Seamlessly link your Azure Text-To-Speech application to create lifelike voices for pre-recorded calls, audio messages across channels, and pre-recorded voice files or canned responses.",
      icon: <AudioLines className="w-10 h-10 text-blue-500" />,
      connected: true,
      hasToggle: true,
      actionLabel: "Connect"
    },
    {
      id: "cloudinary",
      name: "Cloudinary",
      description: "Integrate Cloudinary for streamlined image uploads to Cloudinary folders. Organize and optimize your visual marketing with ease, delivering captivating content to your audience and enhancing engagement.",
      icon: <Cloud className="w-10 h-10 text-blue-400" />,
      connected: false,
      hasToggle: true,
      actionLabel: "Connect"
    },
    {
      id: "activecampaign",
      name: "ActiveCampaign",
      description: "Integrate ActiveCampaign to add contacts to ActiveCampaign.",
      icon: (
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white" />
        </div>
      ),
      connected: false,
      hasToggle: true,
      actionLabel: "Connect"
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Enter your OpenAI API to provide more tailored and accurate responses about your business, product and services. Automatically convert speech to text using Whisper Voice to Text technology.",
      icon: <Aperture className="w-10 h-10 text-green-600" />,
      connected: true,
      hasToggle: true,
      actionLabel: "Connect"
    },
    {
      id: "make",
      name: "Make.com",
      description: "Integrate with over 1600 external apps and effortlessly create and automate tasks using one robust visual platform, Make.com.",
      icon: (
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl mb-1">m</span>
        </div>
      ),
      connected: false,
      hasToggle: false,
      actionLabel: "More info"
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      description: "Integrate to quickly generate AI voices in multiple languages.",
      icon: <Pause className="w-10 h-10 text-black dark:text-white" />,
      connected: true,
      hasToggle: true,
      actionLabel: "Connect"
    },
    {
      id: "cal",
      name: "Cal.com",
      description: "Integrate your Cal.com account and manage your calendar from the Smart flows.",
      icon: (
        <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold tracking-tighter">
            Cal
        </div>
      ),
      connected: false,
      hasToggle: false,
      actionLabel: "Manage Account"
    },
    {
      id: "dify",
      name: "Dify.ai",
      description: "Connect and manage dify.ai chatbots",
      icon: <MessageSquare className="w-10 h-10 text-blue-500" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage"
    },
    {
      id: "llmwhisperer",
      name: "LLMWhisperer",
      description: "Connect to convert any document into plain text.",
      icon: <FileText className="w-10 h-10 text-orange-500" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Connect"
    },
    {
      id: "baserow",
      name: "Baserow.io",
      description: "Integrate external database for data manipulation",
      icon: <Database className="w-10 h-10 text-blue-500" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage"
    },
    {
      id: "woovi",
      name: "Pix - Woovi.com",
      description: "Integrate with Woovi.com to manage Pix charges",
      icon: <DollarSign className="w-10 h-10 text-green-500" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage",
      isBeta: true
    },
    {
      id: "meta",
      name: "Conversions API",
      description: "Track conversations initiated from your ads for WhatsApp, Instagram and Messenger.",
      icon: <Infinity className="w-10 h-10 text-blue-600" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage",
      isBeta: true
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Enter your Anthropic API to provide more tailored AI responses.",
      icon: (
        <div className="w-10 h-10 border-2 border-black dark:border-white rounded-lg flex items-center justify-center font-bold text-lg">
            AI
        </div>
      ),
      connected: false,
      hasToggle: false,
      actionLabel: "Connect"
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Enter your Google Gemini API to provide more tailored and accurate responses.",
      icon: <Sparkles className="w-10 h-10 text-blue-500" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage"
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      description: "Enter your DeepSeek API to provide more tailored and accurate responses.",
      icon: <Fish className="w-10 h-10 text-blue-600" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage"
    },
    {
      id: "firecrawl",
      name: "FireCrawl",
      description: "Enter your FireCrawl API to crawl your website for your AI Agents to learn from.",
      icon: <Flame className="w-10 h-10 text-orange-500" />,
      connected: false,
      hasToggle: false,
      actionLabel: "Manage"
    }
  ]);

  const toggleIntegration = (id: string, checked: boolean) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: checked } : i));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-row items-center gap-4 pb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <Plug className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">Unlock the full potential of your account by seamlessly integrating with external application.</p>
        </div>
      </div>
      
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {integrations.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div className="">
                {item.icon}
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 space-y-3 pt-4">
              <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-4 leading-relaxed">
                {item.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="border-t pt-4 flex items-center justify-between">
              <div>
                {item.isBeta ? (
                   <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50">Beta</Badge>
                ) : item.hasToggle ? (
                  <Switch 
                    checked={item.connected} 
                    onCheckedChange={(c) => toggleIntegration(item.id, c)} 
                  />
                ) : (
                  <div className="w-8" /> 
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeftRight className="w-4 h-4" />
                {item.actionLabel}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
