import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  BookOpen, 
  Video, 
  FileCode 
} from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyHelp = () => {
  const { mode } = useTheme();
  
  const helpCards = [
    {
      title: "Live Chat Support",
      description: "Live Chat Support is exclusively available to paid plan users, Monday through Friday, from 12:00 PM to 8:00 PM (UTC).",
      buttonText: "Live Chat with Support",
      icon: <MessageSquare className="w-12 h-12 text-gray-400" />
    },
    {
      title: "Knowledge base",
      description: "Seeking additional help? Check out our articles that provide answers to your questions.",
      buttonText: "Read More",
      icon: <BookOpen className="w-12 h-12 text-gray-400" />
    },
    {
      title: "Tutorial Videos",
      description: "Looking to accelerate your learning? Check out our YouTube channel for tutorial videos with examples to help you learn faster.",
      buttonText: "Watch Now",
      icon: <Video className="w-12 h-12 text-gray-400" />
    },
    {
      title: "API Documentation",
      description: "Looking to integrate with external systems? Explore our API documentation.",
      buttonText: "Documentation",
      icon: <FileCode className="w-12 h-12 text-gray-400" />
    }
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {helpCards.map((card, i) => (
          <Card key={i} className={cn("shadow-xl flex flex-col items-center p-8 text-center transition-all", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700 hover:bg-[#334155]/20" : "bg-white border-slate-200 hover:bg-slate-50")}>
            <div className={cn("mb-8 p-4 rounded-lg transition-colors", 
              mode === "dark" ? "bg-[#0f172a]/50" : "bg-slate-50")}>
              {card.icon}
            </div>
            
            <CardContent className="p-0 flex-1 flex flex-col items-center">
              <h3 className={cn("text-xl font-bold mb-4 uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{card.title}</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10 max-w-[240px]">
                {card.description}
              </p>
              
              <button className={cn("w-full mt-auto py-2.5 px-4 rounded font-bold text-sm transition-colors border shadow-sm",
                mode === "dark" ? "bg-[#334155] hover:bg-[#475569] text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200")}>
                {card.buttonText}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgencyHelp;
