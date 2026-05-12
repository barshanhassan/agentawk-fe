import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatConversationTime(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  // User requested to remove invalid date handling fallback.

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 23) {
    // Show relative time
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffHours)}h ago`;
  } else {
    // Show date DD-MM-YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

export function formatMessageDate(date: Date | string) {
  if (!date) return "";
  let d = new Date(date);

  /* 
   * User requested to remove invalid date handling fallback to allow bugs to be visible.
   * If parsing fails, this will result in NaN calculations downstream.
   */

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const check = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffTime = today.getTime() - check.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatMessageTime(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Fallback to original string if invalid

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}
