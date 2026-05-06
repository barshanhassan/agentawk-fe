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
import { useTranslation } from 'react-i18next';

const AgencyHelp = () => {
  const { mode } = useTheme();
  const { t } = useTranslation();
  
  const helpCards = [
    {
      title: t("agency.help.chat.title"),
      description: t("agency.help.chat.desc"),
      buttonText: t("agency.help.chat.btn"),
      icon: <MessagesSquare className="w-12 h-12 text-slate-700" />
    },
    {
      title: t("agency.help.kb.title"),
      description: t("agency.help.kb.desc"),
      buttonText: t("common.readMore"),
      icon: <BookOpen className="w-12 h-12 text-slate-700" />
    },
    {
      title: t("agency.help.tutorials.title"),
      description: t("agency.help.tutorials.desc"),
      buttonText: t("agency.help.tutorials.btn"),
      icon: <Clapperboard className="w-12 h-12 text-slate-700" />
    },
    {
      title: t("agency.help.api.title"),
      description: t("agency.help.api.desc"),
      buttonText: t("agency.help.api.btn"),
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
