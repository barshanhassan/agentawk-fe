import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Lock, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface PasswordErrors {
  currentPassword: string;
  newPassword: string;
  retypePassword: string;
}

const ChangePasswordSection = () => {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({ currentPassword: "", newPassword: "", retypePassword: "" });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [show, setShow] = useState<{ [k: string]: boolean }>({});

  // ── Design tokens ─────────────────────────────────────────
  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"      : "text-slate-900";
  const sub        = dark ? "text-slate-500"  : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const inputCls = cn(
    "w-full h-11 rounded-xl text-[13px] font-bold transition-all px-4 pr-12 border outline-none",
    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  );

  const primaryBtn =
    "h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2";

  const labelCls = cn("block text-[10px] font-black uppercase tracking-widest", sub);

  const rules = [
    { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
    { label: "Upper case letter [A-Z]", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    { label: "Number [0-9]", test: (p: string) => /\d/.test(p) },
  ];

  const validatePassword = (password: string): string => {
    const failed = rules.filter((r) => !r.test(password)).map((r) => r.label);
    return failed.join(", ");
  };

  useEffect(() => {
    const newPasswordError = newPassword ? validatePassword(newPassword) : "";
    const retypePasswordError = retypePassword && newPassword !== retypePassword ? "Passwords do not match" : "";
    setErrors((prev) => ({ ...prev, newPassword: newPasswordError, retypePassword: retypePasswordError }));
    setIsSaveDisabled(
      !currentPassword || !newPassword || !retypePassword || newPasswordError !== "" || retypePasswordError !== ""
    );
  }, [currentPassword, newPassword, retypePassword]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/users/change-password", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Password Changed", description: "Your password has been successfully updated." });
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (isSaveDisabled) return;
    mutation.mutate({ currentPassword, newPassword });
  };

  const PasswordField = ({
    id,
    label,
    value,
    onChange,
    error,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
  }) => (
    <div className="space-y-2">
      <label className={labelCls}>{label}</label>
      <div className="relative max-w-sm">
        <input
          id={id}
          type={show[id] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputCls, error && "!border-rose-500 focus:!ring-rose-500/30")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [id]: !s[id] }))}
          className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", sub, "hover:text-primary")}
        >
          {show[id] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}
    </div>
  );

  return (
    <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
          <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Change Password</h1>
              <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                Update the password for your user account.
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled || mutation.isPending}
            className={primaryBtn}
          >
            {mutation.isPending && <Loader2 size={12} className="animate-spin" />}
            Save
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Requirements */}
          <div className={cn("rounded-[1.5rem] border p-6 space-y-3", softBg, softBorder)}>
            <p className={cn("text-[11px] font-black uppercase tracking-widest text-primary")}>
              Password Requirements
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rules.map((r) => {
                const ok = newPassword ? r.test(newPassword) : false;
                return (
                  <div key={r.label} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                        ok ? "bg-emerald-500/15 text-emerald-500" : cn(dark ? "bg-slate-800" : "bg-slate-200", sub)
                      )}
                    >
                      {ok ? <Check size={10} /> : <X size={10} />}
                    </div>
                    <span className={cn("text-[12px] font-bold", ok ? "text-emerald-600 dark:text-emerald-400" : sub)}>
                      {r.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className={cn("rounded-[1.5rem] border p-6 space-y-5", softBg, softBorder)}>
            <PasswordField
              id="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              error={errors.currentPassword}
            />
            <PasswordField
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              error={errors.newPassword}
            />
            <PasswordField
              id="retype-password"
              label="Retype New Password"
              value={retypePassword}
              onChange={setRetypePassword}
              error={errors.retypePassword}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordSection;
