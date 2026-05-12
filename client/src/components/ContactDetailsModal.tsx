import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
import {
    X, Search, Plus, User, ClipboardList, BarChart3, Calendar, Phone,
    MousePointerClick, ChevronRight, MoreHorizontal, MessageSquare,
    Image as ImageIcon, Key, Clock, Trash2, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ContactDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contact: {
        name?: string;
        displayName?: string;
        phoneNumber?: string;
        [key: string]: any;
    } | null;
}

export default function ContactDetailsModal({
    open,
    onOpenChange,
    contact,
}: ContactDetailsModalProps) {
    const [activeSection, setActiveSection] = useState("contacts");

    if (!contact) return null;

    const displayName = contact.displayName || contact.name || "Unknown";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const avatarColor = getAvatarColor(displayName);

    const sidebarSections = [
        { id: "contacts", label: "CONTACTS", icon: User, count: 1 },
        { id: "tasks", label: "TASKS", icon: ClipboardList, count: 0 },
        { id: "opportunities", label: "OPPORTUNITIES", icon: BarChart3, count: 0 },
        { id: "bookings", label: "BOOKINGS", icon: Calendar, count: 0 },
        { id: "calls", label: "CALLS", icon: Phone, count: 0 },
        { id: "adclicks", label: "AD CLICKS", icon: MousePointerClick, count: null },
    ];

    // Applied tags (Center Column - specific to this contact)
    const appliedTags = [
        "vip1", "random-trigger", "random-1", "random-2", "cal.com", "deleteone", "walkthrough", "wa", "lead_100k", "support", "sales"
    ];

    // System Fields (Right Column)
    const systemFields = [
        { label: "Phone", icon: Phone },
        { label: "Email", icon: Mail },
        { label: "Address", icon: null },
        { label: "Title", icon: null },
        { label: "Gender", icon: User },
        { label: "Language", icon: null },
        { label: "Locale", icon: null },
        { label: "Timezone", icon: null },
    ];

    // Custom Fields (Right Column)
    const customFields = [
        { label: "RespostaGPT", value: "Payload" },
        { label: "Ultimo Imovel", value: "RespostaVision" },
        { label: "Date time", value: "booking_date_time" },
        { label: "user_confirm", value: "user_email" },
        { label: "booking id", value: "booking_reschedule" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw] flex flex-col p-0 gap-0 bg-background overflow-hidden border-none shadow-2xl">

                {/* Global Close Button */}
                <div className="absolute top-3 right-3 z-50">
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-full hover:bg-muted">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-1 overflow-hidden h-full">
                    {/* LEFT COLUMN: Sidebar Navigation */}
                    <div className="w-[260px] border-r bg-muted/30 flex flex-col">
                        {/* Profile Summary Header */}
                        <div className="p-6 pb-2">
                            <div className="flex items-center gap-3 mb-6">
                                <Avatar className="h-10 w-10 border border-border">
                                    <AvatarFallback className={`text-sm font-medium ${avatarColor} text-white`}>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <h2 className="text-sm font-semibold truncate">{displayName}</h2>
                                    <p className="text-xs text-muted-foreground truncate">Add description, URL...</p>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-mono">
                                        <Key className="h-3 w-3" /> 123453
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="px-3 space-y-0.5">
                                {sidebarSections.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    return (
                                        <div key={section.id}>
                                            <button
                                                onClick={() => setActiveSection(section.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${isActive
                                                    ? "bg-white dark:bg-accent shadow-sm font-medium text-foreground"
                                                    : "text-muted-foreground hover:bg-white/50 dark:hover:bg-accent/50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className={`h-4 w-4 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                                                    <span>{section.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {section.count !== null && (
                                                        <span className="text-[10px] font-mono">{section.count}</span>
                                                    )}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <Search className="h-3 w-3" />
                                                        <Plus className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Nested Active Item (e.g. current contact) */}
                                            {isActive && section.id === "contacts" && (
                                                <div className="mt-1 ml-4 pl-3 border-l text-sm">
                                                    <div className="flex items-center justify-between py-1.5 px-2 bg-accent/50 rounded-md">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <Avatar className="h-5 w-5">
                                                                <AvatarFallback className={`text-[9px] ${avatarColor}`}>
                                                                    {initials}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="truncate">{displayName}</span>
                                                        </div>
                                                        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* MIDDLE COLUMN: Main Profile Data */}
                    <div className="flex-1 flex flex-col border-r bg-background">
                        {/* Header Status Bar - Replicating screenshot nicely */}
                        <div className="h-14 border-b flex items-center justify-between px-8 bg-background">
                            {/* Left: Upload Info */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Uploaded from a file on 2025-03-07 07:15 am</span>
                            </div>
                            {/* Right: Actions */}
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete contact
                                </Button>
                                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                                    <Key className="h-3.5 w-3.5" /> 123459
                                </span>
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="px-8 py-6 space-y-0">
                                {/* Using a clean definition list style grid */}

                                {/* Contact Picture */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-center">
                                    <label className="text-sm font-medium text-muted-foreground">Contact picture</label>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className={avatarColor}>
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>

                                {/* First Name */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-center">
                                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                    <div>
                                        <Input
                                            value="Chaney"
                                            className="h-8 w-full max-w-xs border-transparent shadow-none hover:border-input focus:border-ring px-0 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-center">
                                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                    <div>
                                        <Input
                                            value="Carey"
                                            className="h-8 w-full max-w-xs border-transparent shadow-none hover:border-input focus:border-ring px-0 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-center">
                                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                                    <div className="text-sm">Female</div>
                                </div>

                                {/* Phone Section */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-start">
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Phone className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-sm font-semibold">Phone</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">+971 673299673</span>
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-sm px-1.5 h-5 text-[10px]">Primary</Badge>
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400 rounded-sm px-1.5 h-5 text-[10px]">Opted-In</Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp Section */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-start">
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-sm font-semibold">WhatsApp</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">+971 673299673</span>
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-sm px-1.5 h-5 text-[10px]">Primary</Badge>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                                                <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 pl-0 text-xs text-muted-foreground">
                                            <span>Live Chat:</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Section */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-start">
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400">
                                            <Mail className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-sm font-semibold">Email</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium">carey-chaney@crm.local</span>
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-sm px-1.5 h-5 text-[10px]">Primary</Badge>
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400 rounded-sm px-1.5 h-5 text-[10px]">Opted-In</Badge>
                                            <Badge variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-sm px-1.5 h-5 text-[10px] cursor-pointer">Set opt-out</Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* data_oportunidade */}
                                <div className="grid grid-cols-[180px_1fr] py-4 border-b border-border/50 items-center">
                                    <label className="text-sm font-bold text-foreground">data_oportunidade</label>
                                    <div className="text-sm">2025-10-28</div>
                                </div>

                                {/* Applied Tags */}
                                <div className="grid grid-cols-[180px_1fr] py-6 items-start">
                                    <label className="text-sm font-bold text-foreground pt-1">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {appliedTags.map((tag, idx) => {
                                            const colors = [
                                                "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
                                                "bg-slate-800 text-white border-slate-700 dark:bg-white dark:text-slate-900",
                                                "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900",
                                                "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900",
                                                "bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-900"
                                            ];
                                            const colorClass = idx === 1 ? colors[1] : colors[idx % 5 === 1 ? 2 : idx % 5 === 0 ? 0 : idx % 5 === 2 ? 3 : 4];

                                            return (
                                                <div key={idx} className={`text-[11px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${colorClass}`}>
                                                    {tag}
                                                    <X className="h-3 w-3 cursor-pointer opacity-40 hover:opacity-100" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                            </div>
                        </ScrollArea>
                    </div>

                    {/* RIGHT COLUMN: System & Custom Fields */}
                    <div className="w-[300px] bg-muted/10 border-l flex flex-col">
                        <div className="h-14 border-b flex items-center justify-between px-4 bg-muted/20">
                            <Button variant="ghost" size="sm" className="hidden">Back</Button>
                            <div className="w-full text-right">
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-auto p-0">
                                    ← View contact history
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                {/* SYSTEM FIELDS Panel */}
                                <div>
                                    <div className="flex items-center justify-between py-2 mb-2">
                                        <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider">SYSTEM FIELDS</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {systemFields.map((field, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <div className="w-[100px] h-8 flex items-center bg-background border rounded px-2 text-xs text-muted-foreground shadow-sm">
                                                    {field.icon && <field.icon className="h-3 w-3 mr-2 opacity-50" />}
                                                    <span className="truncate">{field.label}</span>
                                                </div>
                                                <Select>
                                                    <SelectTrigger className="h-8 text-xs flex-1 bg-background shadow-sm">
                                                        <SelectValue placeholder="Empty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="empty">Empty</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-border/60" />

                                {/* CUSTOM FIELDS Panel */}
                                <div>
                                    <div className="flex items-center justify-between py-2 mb-2">
                                        <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider">CUSTOM FIELDS <span className="text-muted-foreground/50 font-normal ml-1">52</span></h3>
                                        <Search className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-3">
                                        {customFields.map((field, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <div className="w-[100px] h-8 flex items-center bg-background border rounded px-2 text-xs text-muted-foreground shadow-sm truncate">
                                                    <span className="truncate">{field.label}</span>
                                                </div>
                                                <Input value={field.value} className="h-8 text-xs flex-1 bg-background shadow-sm" readOnly />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-border/60" />

                                {/* TAGS Panel */}
                                <div>
                                    <div className="flex items-center justify-between py-2 mb-2">
                                        <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider">TAGS <span className="text-muted-foreground/50 font-normal ml-1">47</span></h3>
                                        <Search className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {["named", "marketing", "sales", "vip", "support", "new-lead"].map((t) => (
                                                <Button key={t} variant="outline" size="sm" className="h-7 text-xs justify-between bg-background font-normal text-muted-foreground shadow-sm">
                                                    {t} <ChevronRight className="h-3 w-3 rotate-90 opacity-50" />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
