import { useTheme } from "@/contexts/ThemeContext";
import { Check, Moon, Sun, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ThemeSection() {
  const { mode, setMode, primaryColor, setPrimaryColor } = useTheme();
  const dark = mode === "dark";

  const colors = [
    { name: "Blue", value: "217 91% 60%" },
    { name: "Indigo", value: "239 84% 67%" },
    { name: "Violet", value: "258 90% 66%" },
    { name: "Purple", value: "271 91% 65%" },
    { name: "Fuchsia", value: "292 84% 61%" },
    { name: "Pink", value: "330 81% 60%" },
    { name: "Cyan", value: "189 94% 43%" },
    { name: "Slate", value: "215 25% 50%" },
  ];

  // ── Design tokens ─────────────────────────────────────────
  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"      : "text-slate-900";
  const sub        = dark ? "text-slate-500"  : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const modeOptions = [
    { id: "light" as const, label: "Light Mode", icon: Sun },
    { id: "dark" as const, label: "Dark Mode", icon: Moon },
  ];

  return (
    <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
          <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Theme</h1>
              <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                Customize the look and feel of the application.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Appearance */}
          <div className={cn("rounded-[1.5rem] border p-6 space-y-5", softBg, softBorder)}>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">Appearance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {modeOptions.map((opt) => {
                const Icon = opt.icon;
                const selected = mode === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-[1.25rem] border cursor-pointer transition-all",
                      selected
                        ? "border-primary bg-primary/5"
                        : cn(softBorder, dark ? "bg-slate-900/40 hover:border-primary/40" : "bg-white hover:border-primary/40")
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          selected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <span className={cn("text-[13px] font-black", text)}>{opt.label}</span>
                    </div>
                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check size={13} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Color */}
          <div className={cn("rounded-[1.5rem] border p-6 space-y-5", softBg, softBorder)}>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">Primary Color</h4>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const isSelected = primaryColor === color.value;
                return (
                  <button
                    key={color.name}
                    onClick={() => setPrimaryColor(color.value)}
                    className={cn(
                      "group relative h-11 w-11 rounded-2xl flex items-center justify-center transition-all",
                      isSelected ? "ring-2 ring-offset-2 scale-105" : "hover:scale-110",
                      dark ? "ring-offset-[#0f1829]" : "ring-offset-white"
                    )}
                    style={{
                      backgroundColor: `hsl(${color.value})`,
                      ...(isSelected ? { boxShadow: `0 0 0 2px hsl(${color.value})` } : {}),
                    }}
                    title={color.name}
                  >
                    {isSelected && <Check className="h-5 w-5 text-white drop-shadow-md" />}
                    <span className="sr-only">{color.name}</span>
                  </button>
                );
              })}
            </div>
            <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
              This color will be used for buttons, links, and active states across the app.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
