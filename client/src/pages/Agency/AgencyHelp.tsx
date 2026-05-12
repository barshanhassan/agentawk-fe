import React, { useEffect } from 'react';
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

  const dark = mode === 'dark';
  const bg     = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

  // Force hide browser scrollbar for this page
  useEffect(() => {
    const targets: { el: HTMLElement; orig: string }[] = [];

    const hide = (el: HTMLElement | null) => {
      if (!el) return;
      targets.push({ el, orig: el.style.overflowY });
      el.style.overflowY = 'hidden';
    };

    hide(document.documentElement as HTMLElement);
    hide(document.body);

    let node = document.querySelector('main') as HTMLElement | null;
    while (node) {
      hide(node);
      node = node.parentElement as HTMLElement | null;
    }

    return () => {
      targets.forEach(({ el, orig }) => { el.style.overflowY = orig; });
    };
  }, []);
  
  const helpCards = [
    {
      title: t("agency.help.chat.title"),
      description: t("agency.help.chat.desc"),
      buttonText: t("agency.help.chat.btn"),
      icon: <MessagesSquare className="w-8 h-8 text-primary" />
    },
    {
      title: t("agency.help.kb.title"),
      description: t("agency.help.kb.desc"),
      buttonText: t("common.readMore"),
      icon: <BookOpen className="w-8 h-8 text-primary" />
    },
    {
      title: t("agency.help.tutorials.title"),
      description: t("agency.help.tutorials.desc"),
      buttonText: t("agency.help.tutorials.btn"),
      icon: <Clapperboard className="w-8 h-8 text-primary" />
    },
    {
      title: t("agency.help.api.title"),
      description: t("agency.help.api.desc"),
      buttonText: t("agency.help.api.btn"),
      icon: <Terminal className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <div className={cn("h-screen w-full font-sans transition-colors duration-300 p-8", bg)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {helpCards.map((cardItem, i) => (
          <Card key={i} className={cn("group shadow-sm flex flex-col items-center p-10 text-center transition-all duration-300 rounded-3xl border", 
            dark ? "bg-[#0f1829] border-slate-800 hover:border-primary/30 hover:bg-slate-900/40" : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50")}>
            
            <div className={cn("mb-10 p-5 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner", 
              dark ? "bg-primary/10 shadow-primary/5" : "bg-primary/5 shadow-primary/5")}>
              {cardItem.icon}
            </div>
            
            <CardContent className="p-0 flex-1 flex flex-col items-center w-full">
              <h3 className={cn("text-[15px] font-black uppercase tracking-widest mb-4", text)}>
                {cardItem.title}
              </h3>
              <p className={cn("text-[13px] font-medium leading-relaxed mb-10 max-w-[240px]", sub)}>
                {cardItem.description}
              </p>
              
              <button className={cn("w-full mt-auto py-3 px-6 rounded-xl font-black uppercase tracking-[0.1em] text-[11px] transition-all border shadow-lg shadow-primary/5",
                dark 
                  ? "bg-primary/10 hover:bg-primary text-primary hover:text-white border-primary/20" 
                  : "bg-white hover:bg-primary text-primary hover:text-white border-primary/20")}>
                {cardItem.buttonText}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgencyHelp;
