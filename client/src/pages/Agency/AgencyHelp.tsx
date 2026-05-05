import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessagesSquare, 
  BookOpen, 
  Clapperboard, 
  Terminal 
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
      icon: <MessagesSquare className="w-12 h-12 text-slate-700" />
    },
    {
      title: "Knowledge base",
      description: "Seeking additional help? Check out our articles that provide answers to your questions.",
      buttonText: "Read More",
      icon: <BookOpen className="w-12 h-12 text-slate-700" />
    },
    {
      title: "Tutorial Videos",
      description: "Looking to accelerate your learning? Check out our YouTube channel for tutorial videos with examples to help you learn faster.",
      buttonText: "Watch Now",
      icon: <Clapperboard className="w-12 h-12 text-slate-700" />
    },
    {
      title: "API Documentation",
      description: "Looking to integrate with external systems? Explore our API documentation.",
      buttonText: "Documentation",
      icon: <Terminal className="w-12 h-12 text-slate-700" />
    }
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {helpCards.map((card, i) => (
          <Card key={i} className={cn("shadow-xl flex flex-col items-center p-8 text-center transition-all", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700 hover:bg-[#334155]/20" : "bg-white border-slate-200 hover:bg-slate-50")}>
            <div className={cn("mb-8 p-0 rounded-lg transition-colors")}>
              {card.icon}
            </div>
            
            <CardContent className="p-0 flex-1 flex flex-col items-center">
              <h3 className={cn("text-[17px] font-bold mb-4 tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{card.title}</h3>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-10 max-w-[280px]">
                {card.description}
              </p>
              
              <button className={cn("w-full mt-auto py-2 px-4 rounded-md font-bold text-[13px] transition-all border",
                mode === "dark" ? "bg-green-600/10 hover:bg-green-600/20 text-green-400 border-green-500/50" : "bg-white hover:bg-green-50 text-green-600 border-green-500")}>
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
