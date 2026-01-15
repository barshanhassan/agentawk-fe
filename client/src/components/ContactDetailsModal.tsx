import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (!contact) return null;

    const displayName = contact.displayName || contact.name || "Unknown";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const avatarColor = getAvatarColor(displayName);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw] flex flex-col p-0 gap-0">
                <div className="flex justify-end p-4 absolute right-0 top-0 z-10">
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-muted">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-row items-start justify-start flex-1 h-full w-full gap-4 p-8">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className={`text-2xl ${avatarColor}`}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left py-2">
                        <h2 className="text-lg font-semibold">{displayName}</h2>
                        {contact.phoneNumber && (
                            <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
