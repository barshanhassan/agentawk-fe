import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Wallet, 
  PhoneCall, 
  Info,
  CreditCard,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AgencyVoiceWalletProps {
  workspace: any;
  onBack: () => void;
}

const AgencyVoiceWallet: React.FC<AgencyVoiceWalletProps> = ({ workspace, onBack }) => {
  const { mode } = useTheme();
  const { toast } = useToast();
  const isDark = mode === 'dark';

  const [balance, setBalance] = useState(0); 
  const [ppm, setPpm] = useState(0); 
  const [purchaseCredits, setPurchaseCredits] = useState(500); 
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setBalance(125);
      setPpm(0.05);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const minutes = Math.floor(balance / 60).toString().padStart(2, '0');
  const seconds = (balance % 60).toString().padStart(2, '0');
  
  const totalAmount = (purchaseCredits * ppm).toFixed(2);

  const handleBuy = () => {
    setIsPurchasing(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Purchase Successful",
        description: `Successfully added ${purchaseCredits} minutes to ${workspace?.name}'s wallet.`,
      });
      setBalance(prev => prev + (purchaseCredits * 60));
      setIsPurchasing(false);
    }, 1500);
  };

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
      {/* Header */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors",
        isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className={cn("p-2 rounded", isDark ? "bg-[#334155]" : "bg-slate-100")}>
            <Wallet className={cn("w-6 h-6", isDark ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Voice Wallet: {workspace?.name}</h1>
            <p className="text-gray-400 text-sm">Manage AI Voice Assistants credits and billing.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-4">
          <Card className={cn("border transition-colors h-full", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <CardHeader className="border-b border-slate-700/50 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-primary" /> Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs text-gray-500 animate-pulse">Fetching balance...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-4">
                    <div className="text-center">
                      <span className="text-5xl font-bold">{minutes}</span>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Minutes</p>
                    </div>
                    <span className="text-4xl text-gray-600">:</span>
                    <div className="text-center">
                      <span className="text-5xl font-bold">{seconds}</span>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Seconds</p>
                    </div>
                  </div>
                  
                  <div className={cn("px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border",
                    isDark ? "bg-primary/10 text-primary border-primary/20" : "bg-primary/5 text-primary border-primary/10")}>
                    Available Credits
                  </div>

                  <div className="flex items-start gap-2 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-[11px] text-gray-400 leading-relaxed">
                    <Info className="w-4 h-4 text-yellow-500 shrink-0" />
                    <p>Credits are used for AI Voice calls. 1 minute of AI Voice processing costs 1 credit. Credits do not expire as long as the workspace is active.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Purchase Card */}
        <div className="lg:col-span-8">
          <Card className={cn("border transition-colors h-full", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <CardHeader className="border-b border-slate-700/50 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" /> Buy Voice Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Select Credits Amount</label>
                    <p className="text-xs text-gray-500 mt-1">Choose between 100 and 10,000 minutes</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{purchaseCredits}</span>
                    <span className="text-sm text-gray-500 ml-2 font-medium">Minutes</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Slider 
                    value={[purchaseCredits]} 
                    min={100} 
                    max={10000} 
                    step={100}
                    onValueChange={(vals) => setPurchaseCredits(vals[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-slate-700/50 pt-8">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-medium">Total Amount to Pay</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-emerald-500">${totalAmount}</span>
                    <span className="text-sm text-gray-500 font-medium">USD</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Price per minute: ${ppm.toFixed(2)}</p>
                </div>

                <div className="flex flex-col gap-4">
                   <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-14"
                    onClick={handleBuy}
                    disabled={isPurchasing || isLoading}
                   >
                     {isPurchasing ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                         Processing...
                       </div>
                     ) : (
                       <><Zap className="w-5 h-5 mr-2 fill-white" /> Complete Purchase</>
                     )}
                   </Button>
                   <p className="text-[10px] text-center text-gray-500 px-4">
                     By clicking "Complete Purchase", you agree to our terms of service. The amount will be charged to your saved payment method.
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyVoiceWallet;
