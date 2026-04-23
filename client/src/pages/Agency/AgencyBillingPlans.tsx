import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  AlertTriangle,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useTheme } from "@/contexts/ThemeContext";

const AgencyBillingPlans = () => {
  const { mode } = useTheme();
  const plans = [
    { 
      name: "Free", 
      price: "$0", 
      limit: "Limit of 50 contacts.", 
      feature: "Completely FREE" 
    },
    { 
      name: "Premium", 
      price: "$19", 
      limit: "Limit of 1000 contacts.", 
      feature: "All features from Premium Workspaces." 
    },
    { 
      name: "Ignite", 
      price: "$299", 
      limit: "Limit of 3000 contacts.", 
      feature: "All features from Premium Workspaces." 
    },
    { 
      name: "Enterprise", 
      price: "$599", 
      limit: "A special plan designed just for resellers!", 
      feature: "All features from Premium Workspaces.",
      isCurrent: true,
      nextPayment: "2026-05-11"
    },
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <CreditCard className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-tight">Billing Plan</h1>
            <p className="text-gray-400 text-sm font-medium">Manage your subscription</p>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan, i) => (
          <Card key={i} className={cn(
            "shadow-xl flex flex-col justify-between overflow-hidden transition-all",
            mode === "dark" ? "bg-[#1e293b] border-slate-800" : "bg-white border-slate-200",
            plan.isCurrent ? (mode === "dark" ? "ring-2 ring-primary/50" : "ring-2 ring-primary") : ""
          )}>
            <CardHeader className="pb-2">
              <h3 className={cn("text-lg font-bold uppercase tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>{plan.name}</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className={cn("text-4xl font-black", mode === "dark" ? "text-white" : "text-slate-900")}>{plan.price}</span>
                <span className="text-gray-400 text-sm font-bold">/Month</span>
              </div>
              <div className="space-y-1">
                <p className={cn("text-[13px] font-bold", mode === "dark" ? "text-gray-200" : "text-slate-700")}>{plan.limit}</p>
                <p className="text-[13px] text-gray-500 font-medium">{plan.feature}</p>
              </div>

              {plan.isCurrent ? (
                <div className="pt-4 space-y-4">
                  <button className={cn("w-full py-2 rounded font-bold text-sm border shadow-sm transition-colors", 
                    mode === "dark" ? "bg-[#334155] text-gray-300 border-slate-600" : "bg-primary text-white border-primary")}>
                    Current Plan
                  </button>
                  <div className="text-center">
                    <p className={cn("text-[12px] font-bold", mode === "dark" ? "text-gray-200" : "text-slate-800")}>Next Payment Date : {plan.nextPayment}</p>
                    <button className="text-[12px] text-red-500 font-bold hover:underline mt-2 uppercase tracking-wider">Cancel Subscription</button>
                  </div>
                </div>
              ) : (
                <div className="pt-4">
                   <button className={cn("w-full py-2 rounded font-bold text-sm border shadow-sm transition-colors",
                     mode === "dark" ? "bg-transparent text-gray-400 border-slate-700 hover:bg-slate-800" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100")}>
                     Upgrade
                   </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Section */}
      <div className={cn("border p-6 rounded-lg flex gap-4 transition-colors", 
        mode === "dark" ? "bg-yellow-100/5 border-yellow-500/20" : "bg-yellow-50 border-yellow-200")}>
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
        <div className="space-y-2">
          <h4 className="text-yellow-600 font-bold text-sm uppercase tracking-wider">Heads up!</h4>
          <p className={cn("text-sm leading-relaxed font-medium", mode === "dark" ? "text-yellow-600/80" : "text-yellow-800/80")}>
            We know it's a bit annoying, but our plans don't support downgrades. 😟
          </p>
          <p className={cn("text-sm leading-relaxed font-medium", mode === "dark" ? "text-yellow-600/80" : "text-yellow-800/80")}>
            If you really need to downgrade, you'll have to create a brand-new account and start from scratch, yep, content and all. We're truly sorry for the hassle, we wish it were easier too! 💙
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgencyBillingPlans;
