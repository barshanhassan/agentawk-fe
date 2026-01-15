import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ThemeSection() {
    const { mode, setMode, primaryColor, setPrimaryColor } = useTheme();

    const colors = [
        { name: "Blue", value: "217 91% 60%" }, // Default
        { name: "Indigo", value: "239 84% 67%" },
        { name: "Violet", value: "258 90% 66%" },
        { name: "Purple", value: "271 91% 65%" },
        { name: "Fuchsia", value: "292 84% 61%" },
        { name: "Pink", value: "330 81% 60%" },
        { name: "Cyan", value: "189 94% 43%" },
        { name: "Slate", value: "215 25% 50%" },
    ];

    return (
        <>
            <CardHeader>
                <CardTitle className="text-lg">Theme</CardTitle>
                <CardDescription>
                    Customize the look and feel of the application.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Theme Mode */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">Theme</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                        <div
                            className={`
                  relative flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${mode === "light"
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-muted hover:border-muted-foreground/50 bg-card"}
                `}
                            onClick={() => setMode("light")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600">
                                    <Sun size={20} />
                                </div>
                                <div className="font-medium">Light Mode</div>
                            </div>
                            {mode === "light" && <div className="h-4 w-4 rounded-full bg-primary" />}
                        </div>

                        <div
                            className={`
                  relative flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${mode === "dark"
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-muted hover:border-muted-foreground/50 bg-card"}
                `}
                            onClick={() => setMode("dark")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    <Moon size={20} />
                                </div>
                                <div className="font-medium">Dark Mode</div>
                            </div>
                            {mode === "dark" && <div className="h-4 w-4 rounded-full bg-primary" />}
                        </div>
                    </div>
                </div>

                {/* Primary Color */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">Primary Color</Label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const isSelected = primaryColor === color.value;
                            return (
                                <button
                                    key={color.name}
                                    onClick={() => setPrimaryColor(color.value)}
                                    className={`
                      group relative h-10 w-10 rounded-full flex items-center justify-center transition-all
                      ${isSelected ? "ring-2 ring-offset-2 ring-offset-background" : "hover:scale-110"}
                    `}
                                    style={{
                                        backgroundColor: `hsl(${color.value})`,
                                        boxShadow: isSelected ? `0 0 0 2px hsl(${color.value})` : 'none',
                                        borderColor: isSelected ? 'transparent' : undefined
                                    }}
                                    title={color.name}
                                >
                                    {isSelected && <Check className="h-5 w-5 text-white drop-shadow-md" />}
                                    <span className="sr-only">{color.name}</span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        This color will be used for buttons, links, and active states.
                    </p>
                </div>

            </CardContent>
        </>
    );
}
