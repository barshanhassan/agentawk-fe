import { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, MoreVertical, Download, FileText } from "react-feather";
import { Calendar, ChevronsUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, MessageSquare, Mic, Play, Pause, SkipForward, SkipBack, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomDropdown from "@/components/CustomDropdown";
import { format } from "date-fns";
import React from "react";

interface SortEntry {
  id: string;
  column: string;
  direction: "asc" | "desc";
}

interface Conversation {
  id: string;
  customerNumber: string;
  customer: string;
  agent: string;
  agentId: string;
  startTime: string;
  duration: string;
  status: "Active" | "Queued" | "In Progress" | "Completed" | "Pending" | "Expired" | "Spammed" | "Forwarded";
  messages: number;
  timeline: string;
  sentiment: string;
  sentimentSummary: string;
}

interface CallLog {
  id: string;
  contact: string;
  contactNumber: string;
  agent: string;
  agentId: string;
  direction: "Inbound" | "Outbound";
  startTime: string;
  duration: string;
  status: "Completed" | "Missed" | "Declined" | "Failed" | "In Progress";
  sentiment: string;
  sentimentSummary: string;
  recording: boolean;
}

const initialConversations: Conversation[] = [
  // Today's conversations (November 4, 2025)
  {
    id: "C001",
    customerNumber: "+1234567890",
    customer: "Alice Johnson",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2025-11-04 10:30 AM",
    duration: "5m 23s",
    status: "Completed",
    messages: 12,
    timeline: "10:30 AM - 10:35 AM",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied with resolution",
  },
  {
    id: "C002",
    customerNumber: "+1234567891",
    customer: "Bob Smith",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2025-11-04 11:15 AM",
    duration: "3m 45s",
    status: "Active",
    messages: 8,
    timeline: "11:15 AM - 11:19 AM",
    sentiment: "Neutral",
    sentimentSummary: "Ongoing conversation",
  },
  {
    id: "C003",
    customerNumber: "+1234567892",
    customer: "Carol White",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2025-11-04 09:20 AM",
    duration: "12m 10s",
    status: "Completed",
    messages: 24,
    timeline: "09:20 AM - 09:32 AM",
    sentiment: "Positive",
    sentimentSummary: "Issue resolved successfully",
  },
  // Yesterday's conversations (November 3, 2025)
  {
    id: "C004",
    customerNumber: "+1234567893",
    customer: "David Brown",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2025-11-03 02:45 PM",
    duration: "8m 15s",
    status: "Completed",
    messages: 16,
    timeline: "02:45 PM - 02:53 PM",
    sentiment: "Negative",
    sentimentSummary: "Customer frustrated with service",
  },
  {
    id: "C005",
    customerNumber: "+1234567894",
    customer: "Eva Martinez",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2025-11-03 09:30 AM",
    duration: "4m 30s",
    status: "Completed",
    messages: 10,
    timeline: "09:30 AM - 09:34 AM",
    sentiment: "Positive",
    sentimentSummary: "Quick resolution",
  },
  // Last week's conversations (October 28-31, 2025)
  {
    id: "C006",
    customerNumber: "+1234567895",
    customer: "Frank Wilson",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2025-10-31 03:15 PM",
    duration: "6m 45s",
    status: "Completed",
    messages: 14,
    timeline: "03:15 PM - 03:21 PM",
    sentiment: "Neutral",
    sentimentSummary: "Standard inquiry",
  },
  {
    id: "C007",
    customerNumber: "+1234567896",
    customer: "Grace Lee",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2025-10-30 11:45 AM",
    duration: "7m 20s",
    status: "Completed",
    messages: 18,
    timeline: "11:45 AM - 11:52 AM",
    sentiment: "Positive",
    sentimentSummary: "Customer appreciated support",
  },
  {
    id: "C008",
    customerNumber: "+1234567897",
    customer: "Henry Taylor",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2025-10-29 01:30 PM",
    duration: "9m 10s",
    status: "Completed",
    messages: 20,
    timeline: "01:30 PM - 01:39 PM",
    sentiment: "Negative",
    sentimentSummary: "Technical issue reported",
  },
  {
    id: "C009",
    customerNumber: "+1234567898",
    customer: "Ivy Chen",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2025-10-28 10:15 AM",
    duration: "5m 45s",
    status: "Completed",
    messages: 12,
    timeline: "10:15 AM - 10:20 AM",
    sentiment: "Positive",
    sentimentSummary: "Billing inquiry resolved",
  },
  // Last month's conversations (October 1-27, 2025)
  {
    id: "C010",
    customerNumber: "+1234567899",
    customer: "Jack Wilson",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2025-10-27 02:30 PM",
    duration: "4m 20s",
    status: "Completed",
    messages: 8,
    timeline: "02:30 PM - 02:34 PM",
    sentiment: "Neutral",
    sentimentSummary: "Quick support",
  },
  {
    id: "C011",
    customerNumber: "+1234567800",
    customer: "Karen Davis",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2025-10-15 09:45 AM",
    duration: "11m 30s",
    status: "Completed",
    messages: 22,
    timeline: "09:45 AM - 09:56 AM",
    sentiment: "Positive",
    sentimentSummary: "Complex issue resolved",
  },
  {
    id: "C012",
    customerNumber: "+1234567801",
    customer: "Leo Martinez",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2025-10-10 03:20 PM",
    duration: "7m 15s",
    status: "Completed",
    messages: 16,
    timeline: "03:20 PM - 03:27 PM",
    sentiment: "Negative",
    sentimentSummary: "Service delay reported",
  },
  {
    id: "C013",
    customerNumber: "+1234567802",
    customer: "Mia Thompson",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2025-10-05 11:30 AM",
    duration: "6m 40s",
    status: "Completed",
    messages: 14,
    timeline: "11:30 AM - 11:36 AM",
    sentiment: "Positive",
    sentimentSummary: "Product inquiry",
  },
  {
    id: "C014",
    customerNumber: "+1234567803",
    customer: "Noah Garcia",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2025-10-01 01:15 PM",
    duration: "5m 50s",
    status: "Completed",
    messages: 12,
    timeline: "01:15 PM - 01:20 PM",
    sentiment: "Neutral",
    sentimentSummary: "Account update",
  },
  // Last quarter's conversations (July-September 2025)
  {
    id: "C015",
    customerNumber: "+1234567804",
    customer: "Olivia Brown",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2025-09-15 10:45 AM",
    duration: "8m 25s",
    status: "Completed",
    messages: 18,
    timeline: "10:45 AM - 10:53 AM",
    sentiment: "Positive",
    sentimentSummary: "Service upgrade",
  },
  {
    id: "C016",
    customerNumber: "+1234567805",
    customer: "Paul Wilson",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2025-08-20 02:30 PM",
    duration: "6m 15s",
    status: "Completed",
    messages: 14,
    timeline: "02:30 PM - 02:36 PM",
    sentiment: "Negative",
    sentimentSummary: "Billing dispute",
  },
  {
    id: "C017",
    customerNumber: "+1234567806",
    customer: "Quinn Lee",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2025-07-10 09:15 AM",
    duration: "7m 40s",
    status: "Completed",
    messages: 16,
    timeline: "09:15 AM - 09:22 AM",
    sentiment: "Positive",
    sentimentSummary: "Technical support",
  },
  {
    id: "C018",
    customerNumber: "+1234567807",
    customer: "Rachel Kim",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2025-07-05 03:45 PM",
    duration: "5m 30s",
    status: "Completed",
    messages: 12,
    timeline: "03:45 PM - 03:50 PM",
    sentiment: "Neutral",
    sentimentSummary: "Product inquiry",
  },
  // Last year's conversations (2024)
  {
    id: "C019",
    customerNumber: "+1234567808",
    customer: "Sam Taylor",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2024-12-15 11:30 AM",
    duration: "9m 20s",
    status: "Completed",
    messages: 20,
    timeline: "11:30 AM - 11:39 AM",
    sentiment: "Positive",
    sentimentSummary: "Year-end support",
  },
  {
    id: "C020",
    customerNumber: "+1234567809",
    customer: "Tina White",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2024-11-20 02:15 PM",
    duration: "7m 45s",
    status: "Completed",
    messages: 16,
    timeline: "02:15 PM - 02:22 PM",
    sentiment: "Negative",
    sentimentSummary: "Service complaint",
  },
  {
    id: "C021",
    customerNumber: "+1234567810",
    customer: "Uma Patel",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2024-10-10 10:30 AM",
    duration: "6m 15s",
    status: "Completed",
    messages: 14,
    timeline: "10:30 AM - 10:36 AM",
    sentiment: "Positive",
    sentimentSummary: "Account setup",
  },
  {
    id: "C022",
    customerNumber: "+1234567811",
    customer: "Victor Chen",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2024-09-05 03:20 PM",
    duration: "5m 40s",
    status: "Completed",
    messages: 12,
    timeline: "03:20 PM - 03:25 PM",
    sentiment: "Neutral",
    sentimentSummary: "Product inquiry",
  },
  {
    id: "C023",
    customerNumber: "+1234567812",
    customer: "Wendy Davis",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2024-08-15 09:45 AM",
    duration: "8m 30s",
    status: "Completed",
    messages: 18,
    timeline: "09:45 AM - 09:53 AM",
    sentiment: "Positive",
    sentimentSummary: "Service upgrade",
  },
  {
    id: "C024",
    customerNumber: "+1234567813",
    customer: "Xavier Lee",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2024-07-20 02:30 PM",
    duration: "6m 20s",
    status: "Completed",
    messages: 14,
    timeline: "02:30 PM - 02:36 PM",
    sentiment: "Negative",
    sentimentSummary: "Billing dispute",
  },
  {
    id: "C025",
    customerNumber: "+1234567814",
    customer: "Yara Wilson",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2024-06-10 11:15 AM",
    duration: "7m 45s",
    status: "Completed",
    messages: 16,
    timeline: "11:15 AM - 11:22 AM",
    sentiment: "Positive",
    sentimentSummary: "Technical support",
  },
  {
    id: "C026",
    customerNumber: "+1234567815",
    customer: "Zane Brown",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2024-05-05 03:45 PM",
    duration: "5m 30s",
    status: "Completed",
    messages: 12,
    timeline: "03:45 PM - 03:50 PM",
    sentiment: "Neutral",
    sentimentSummary: "Product inquiry",
  },
  {
    id: "C027",
    customerNumber: "+1234567816",
    customer: "Ava Martinez",
    agent: "Emma Davis",
    agentId: "agent-003",
    startTime: "2024-04-15 10:30 AM",
    duration: "9m 20s",
    status: "Completed",
    messages: 20,
    timeline: "10:30 AM - 10:39 AM",
    sentiment: "Positive",
    sentimentSummary: "Year-end support",
  },
  {
    id: "C028",
    customerNumber: "+1234567817",
    customer: "Ben Taylor",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    startTime: "2024-03-20 02:15 PM",
    duration: "7m 45s",
    status: "Completed",
    messages: 16,
    timeline: "02:15 PM - 02:22 PM",
    sentiment: "Negative",
    sentimentSummary: "Service complaint",
  },
  {
    id: "C029",
    customerNumber: "+1234567818",
    customer: "Chloe White",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    startTime: "2024-02-10 10:30 AM",
    duration: "6m 15s",
    status: "Completed",
    messages: 14,
    timeline: "10:30 AM - 10:36 AM",
    sentiment: "Positive",
    sentimentSummary: "Account setup",
  },
  {
    id: "C030",
    customerNumber: "+1234567819",
    customer: "Dylan Chen",
    agent: "Mike Chen",
    agentId: "agent-002",
    startTime: "2024-01-05 03:20 PM",
    duration: "5m 40s",
    status: "Completed",
    messages: 12,
    timeline: "03:20 PM - 03:25 PM",
    sentiment: "Neutral",
    sentimentSummary: "Product inquiry",
  },
];

const initialCallLogs: CallLog[] = [
  // Today's calls (November 4, 2025)
  {
    id: "CALL001",
    contact: "Alice Johnson",
    contactNumber: "+1234567890",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-11-04 10:30 AM",
    duration: "5m 23s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied with resolution",
    recording: true,
  },
  {
    id: "CALL002",
    contact: "Bob Smith",
    contactNumber: "+1234567891",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Outbound",
    startTime: "2025-11-04 11:15 AM",
    duration: "3m 45s",
    status: "Completed",
    sentiment: "Neutral",
    sentimentSummary: "Standard inquiry handled",
    recording: true,
  },
  {
    id: "CALL003",
    contact: "Carol White",
    contactNumber: "+1234567892",
    agent: "Emma Davis",
    agentId: "agent-003",
    direction: "Inbound",
    startTime: "2025-11-04 09:20 AM",
    duration: "12m 10s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer appreciated support",
    recording: true,
  },
  {
    id: "CALL004",
    contact: "David Brown",
    contactNumber: "+1234567893",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    direction: "Outbound",
    startTime: "2025-11-04 02:45 PM",
    duration: "8m 15s",
    status: "Completed",
    sentiment: "Negative",
    sentimentSummary: "Customer frustrated with service",
    recording: false,
  },
  {
    id: "CALL005",
    contact: "Eva Martinez",
    contactNumber: "+1234567894",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-11-04 09:30 AM",
    duration: "4m 30s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Quick resolution",
    recording: true,
  },
  // Yesterday's calls (November 3, 2025)
  {
    id: "CALL006",
    contact: "Frank Wilson",
    contactNumber: "+1234567895",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Outbound",
    startTime: "2025-11-03 03:15 PM",
    duration: "6m 45s",
    status: "Completed",
    sentiment: "Neutral",
    sentimentSummary: "Standard inquiry",
    recording: true,
  },
  {
    id: "CALL007",
    contact: "Grace Lee",
    contactNumber: "+1234567896",
    agent: "Emma Davis",
    agentId: "agent-003",
    direction: "Inbound",
    startTime: "2025-11-03 11:45 AM",
    duration: "7m 20s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer appreciated support",
    recording: true,
  },
  {
    id: "CALL008",
    contact: "Henry Taylor",
    contactNumber: "+1234567897",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    direction: "Outbound",
    startTime: "2025-11-03 01:30 PM",
    duration: "2m 15s",
    status: "Missed",
    sentiment: "Neutral",
    sentimentSummary: "Call not answered",
    recording: false,
  },
  {
    id: "CALL009",
    contact: "Iris Anderson",
    contactNumber: "+1234567898",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-11-03 10:00 AM",
    duration: "9m 50s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL010",
    contact: "Jack Thompson",
    contactNumber: "+1234567899",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Outbound",
    startTime: "2025-11-03 04:20 PM",
    duration: "5m 30s",
    status: "Completed",
    sentiment: "Neutral",
    sentimentSummary: "Standard inquiry",
    recording: true,
  },
  // Last week calls (October 29-30, 2025)
  {
    id: "CALL011",
    contact: "Karen White",
    contactNumber: "+1234567900",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-10-30 02:00 PM",
    duration: "11m 15s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL012",
    contact: "Leo Martinez",
    contactNumber: "+1234567901",
    agent: "Emma Davis",
    agentId: "agent-003",
    direction: "Outbound",
    startTime: "2025-10-30 09:45 AM",
    duration: "3m 20s",
    status: "Declined",
    sentiment: "Negative",
    sentimentSummary: "Call declined by customer",
    recording: false,
  },
  {
    id: "CALL013",
    contact: "Mia Johnson",
    contactNumber: "+1234567902",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Inbound",
    startTime: "2025-10-29 03:30 PM",
    duration: "6m 45s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL014",
    contact: "Noah Davis",
    contactNumber: "+1234567903",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    direction: "Outbound",
    startTime: "2025-10-29 11:20 AM",
    duration: "2m 10s",
    status: "Failed",
    sentiment: "Neutral",
    sentimentSummary: "Call failed",
    recording: false,
  },
  {
    id: "CALL015",
    contact: "Olivia Brown",
    contactNumber: "+1234567904",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-10-29 01:15 PM",
    duration: "8m 30s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  // Two weeks ago (October 22-23, 2025)
  {
    id: "CALL016",
    contact: "Peter Wilson",
    contactNumber: "+1234567905",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Outbound",
    startTime: "2025-10-23 10:30 AM",
    duration: "4m 50s",
    status: "Completed",
    sentiment: "Neutral",
    sentimentSummary: "Standard inquiry",
    recording: true,
  },
  {
    id: "CALL017",
    contact: "Quinn Taylor",
    contactNumber: "+1234567906",
    agent: "Emma Davis",
    agentId: "agent-003",
    direction: "Inbound",
    startTime: "2025-10-23 02:45 PM",
    duration: "7m 15s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL018",
    contact: "Rachel Anderson",
    contactNumber: "+1234567907",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    direction: "Outbound",
    startTime: "2025-10-22 09:00 AM",
    duration: "5m 40s",
    status: "Completed",
    sentiment: "Negative",
    sentimentSummary: "Customer frustrated",
    recording: false,
  },
  {
    id: "CALL019",
    contact: "Samuel Lee",
    contactNumber: "+1234567908",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-10-22 04:10 PM",
    duration: "10m 25s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL020",
    contact: "Tina Harris",
    contactNumber: "+1234567909",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Outbound",
    startTime: "2025-10-22 11:30 AM",
    duration: "3m 55s",
    status: "Missed",
    sentiment: "Neutral",
    sentimentSummary: "Call not answered",
    recording: false,
  },
  // Three weeks ago (October 15, 2025)
  {
    id: "CALL021",
    contact: "Uma Patel",
    contactNumber: "+1234567910",
    agent: "Emma Davis",
    agentId: "agent-003",
    direction: "Inbound",
    startTime: "2025-10-15 01:20 PM",
    duration: "6m 10s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL022",
    contact: "Victor Chen",
    contactNumber: "+1234567911",
    agent: "Alex Rodriguez",
    agentId: "agent-004",
    direction: "Outbound",
    startTime: "2025-10-15 10:45 AM",
    duration: "4m 30s",
    status: "Completed",
    sentiment: "Neutral",
    sentimentSummary: "Standard inquiry",
    recording: true,
  },
  {
    id: "CALL023",
    contact: "Wendy Garcia",
    contactNumber: "+1234567912",
    agent: "Sarah Johnson",
    agentId: "agent-001",
    direction: "Inbound",
    startTime: "2025-10-15 03:00 PM",
    duration: "9m 20s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
  {
    id: "CALL024",
    contact: "Xavier Lopez",
    contactNumber: "+1234567913",
    agent: "Mike Chen",
    agentId: "agent-002",
    direction: "Outbound",
    startTime: "2025-10-15 11:15 AM",
    duration: "2m 45s",
    status: "Failed",
    sentiment: "Negative",
    sentimentSummary: "Call failed",
    recording: false,
  },
  {
    id: "CALL025",
    contact: "Yara Martinez",
    contactNumber: "+1234567914",
    agent: "Emma Davis",
    agentId: "agent-003",
    direction: "Inbound",
    startTime: "2025-10-15 02:30 PM",
    duration: "7m 50s",
    status: "Completed",
    sentiment: "Positive",
    sentimentSummary: "Customer satisfied",
    recording: true,
  },
];

export default function ConversationsLogs() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [callLogs, setCallLogs] = useState<CallLog[]>(initialCallLogs);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [dateRangePreset, setDateRangePreset] = useState("last-7-days");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string[]>([]);
  const [sorts, setSorts] = useState<SortEntry[]>([]);
  const [callSorts, setCallSorts] = useState<SortEntry[]>([]);
  const [activeTab, setActiveTab] = useState("conversations");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);
  const speedDropdownRef = useRef<HTMLDivElement>(null);
  const [conversationDetailsOpen, setConversationDetailsOpen] = useState(false);
  const [callDetailsOpen, setCallDetailsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingCallId, setCurrentPlayingCallId] = useState<string | null>(null);
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const getAudioUrl = (callId: string) => {
    return "https://index-tts.github.io/examples_part2/IndexTTS/Speaker_2.wav";
  };

  const statusOptions = [
    { id: "Active", name: "Active" },
    { id: "Queued", name: "Queued" },
    { id: "In Progress", name: "In Progress" },
    { id: "Completed", name: "Completed" },
    { id: "Pending", name: "Pending" },
    { id: "Expired", name: "Expired" },
    { id: "Spammed", name: "Spammed" },
    { id: "Forwarded", name: "Forwarded" },
  ];

  const directionOptions = [
    { id: "Inbound", name: "Inbound" },
    { id: "Outbound", name: "Outbound" },
  ];

  const callStatusOptions = [
    { id: "Completed", name: "Completed" },
    { id: "Missed", name: "Missed" },
    { id: "Declined", name: "Declined" },
    { id: "Failed", name: "Failed" },
    { id: "In Progress", name: "In Progress" },
  ];

  const kpiData = {
    totalConversations: 156,
    queued: 12,
    active: 8,
    completed: 128,
    resolutionRate: "82%",
  };

  const callKpiData = {
    totalCalls: 245,
    completed: 198,
    inboundCalls: 120,
    outboundCalls: 125,
    avgDuration: "6m 45s",
  };

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    const data = activeTab === "conversations" ? getFilteredAndSortedData() : getFilteredAndSortedCallLogs();
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(c => c.id)));
    }
  };

  const renderSortIcon = (column: string) => {
    const sort = sorts.find(s => s.column === column);
    const isActive = !!sort;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (!sort) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (sort.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDown size={14} className={color} /></div>;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRowsDropdownOpen(false);
      }
      if (speedDropdownRef.current && !speedDropdownRef.current.contains(event.target as Node)) {
        setSpeedDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    const setAudioEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', setAudioEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', setAudioEnded);
    };
  }, []);

  const playAudio = (callId: string) => {
    const audio = audioRef.current;
    if (audio) {
      const url = getAudioUrl(callId);
      if (audio.src !== url) {
        audio.src = url;
        audio.load();
      }
      audio.playbackRate = playbackSpeed;
      audio.play().then(() => {
        setIsPlaying(true);
        setCurrentPlayingCallId(callId);
      }).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPauseClick = (call: CallLog) => {
    if (expandedCallId === call.id) {
      // If the same call is clicked again
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio(call.id);
      }
    } else {
      // If a different call is clicked, or no call is expanded
      if (currentPlayingCallId) { // Check if any call was playing/expanded
        resetPlayerState(); // Reset everything for the previous call
      }
      setExpandedCallId(call.id); // Expand the new call's sub-row
      playAudio(call.id); // Play the new call
    }
  };

  const handleNext = () => {
    const currentCallLogs = getFilteredAndSortedCallLogs();
    const currentIndex = currentCallLogs.findIndex(call => call.id === currentPlayingCallId);
    if (currentIndex !== -1 && currentIndex < currentCallLogs.length - 1) {
      const nextCall = currentCallLogs[currentIndex + 1];
      if (nextCall.recording) {
        playAudio(nextCall.id);
      } else {
        // Find next available recording
        for (let i = currentIndex + 1; i < currentCallLogs.length; i++) {
          if (currentCallLogs[i].recording) {
            playAudio(currentCallLogs[i].id);
            return;
          }
        }
        // If no next recording, stop playback
        pauseAudio();
        setCurrentPlayingCallId(null);
      }
    } else {
      // If at the end, stop playback
      pauseAudio();
      setCurrentPlayingCallId(null);
    }
  };

  const handlePrevious = () => {
    const currentCallLogs = getFilteredAndSortedCallLogs();
    const currentIndex = currentCallLogs.findIndex(call => call.id === currentPlayingCallId);
    if (currentIndex > 0) {
      const prevCall = currentCallLogs[currentIndex - 1];
      if (prevCall.recording) {
        playAudio(prevCall.id);
      } else {
        // Find previous available recording
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (currentCallLogs[i].recording) {
            playAudio(currentCallLogs[i].id);
            return;
          }
        }
        // If no previous recording, stop playback
        pauseAudio();
        setCurrentPlayingCallId(null);
      }
    } else {
      // If at the beginning, stop playback
      pauseAudio();
      setCurrentPlayingCallId(null);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = parseFloat(e.target.value);
      setCurrentTime(audio.currentTime);
    }
  };

  const resetPlayerState = () => {
    pauseAudio();
    setCurrentPlayingCallId(null);
    setExpandedCallId(null);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleColumnSort = (column: string) => {
    const existingSort = sorts.find(s => s.column === column);
    if (existingSort) {
      if (existingSort.direction === "asc") {
        setSorts([{ id: existingSort.id, column, direction: "desc" }]);
      } else {
        setSorts([]);
      }
    } else {
      setSorts([{ id: Date.now().toString(), column, direction: "asc" }]);
    }
  };

  const handleCallColumnSort = (column: string) => {
    const existingSort = callSorts.find(s => s.column === column);
    if (existingSort) {
      if (existingSort.direction === "asc") {
        setCallSorts([{ id: existingSort.id, column, direction: "desc" }]);
      } else {
        setCallSorts([]);
      }
    } else {
      setCallSorts([{ id: Date.now().toString(), column, direction: "asc" }]);
    }
  };

  const renderCallSortIcon = (column: string) => {
    const sort = callSorts.find(s => s.column === column);
    const isActive = !!sort;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (!sort) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (sort.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronDown size={14} className={color} /></div>;
  };

  const getFilteredAndSortedData = () => {
    let data = [...conversations];

    // Apply search
    if (search) {
      data = data.filter(item =>
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.agent.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      data = data.filter(item => selectedStatus.includes(item.status));
    }

    // Apply date range filter
    const currentDate = new Date(2025, 10, 4); // November 4, 2025
    currentDate.setHours(0, 0, 0, 0); // Set to start of day

    if (dateRangePreset !== "custom") {
      data = data.filter(item => {
        // Parse date from "2025-11-04 10:30 AM" format
        const dateStr = item.startTime.split(" ").slice(0, 1)[0]; // Get "2025-11-04"
        const itemDate = new Date(dateStr);
        itemDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

        switch (dateRangePreset) {
          case "last-7-days":
            const sevenDaysAgo = new Date(currentDate);
            sevenDaysAgo.setDate(currentDate.getDate() - 7);
            return itemDate >= sevenDaysAgo && itemDate <= currentDate;

          case "last-14-days":
            const fourteenDaysAgo = new Date(currentDate);
            fourteenDaysAgo.setDate(currentDate.getDate() - 14);
            return itemDate >= fourteenDaysAgo && itemDate <= currentDate;

          case "last-30-days":
            const thirtyDaysAgo = new Date(currentDate);
            thirtyDaysAgo.setDate(currentDate.getDate() - 30);
            return itemDate >= thirtyDaysAgo && itemDate <= currentDate;

          case "this-month":
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            return itemDate >= firstDayOfMonth && itemDate <= currentDate;

          case "this-quarter":
            const currentQuarter = Math.floor(currentDate.getMonth() / 3);
            const firstDayOfQuarter = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
            return itemDate >= firstDayOfQuarter && itemDate <= currentDate;

          default:
            return true;
        }
      });
    } else if (customDateRange?.from && customDateRange?.to) {
      data = data.filter(item => {
        // Parse date from "2025-11-04 10:30 AM" format
        const dateStr = item.startTime.split(" ").slice(0, 1)[0]; // Get "2025-11-04"
        const itemDate = new Date(dateStr);
        itemDate.setHours(0, 0, 0, 0); // Set to start of day

        const fromDate = new Date(customDateRange.from!);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(customDateRange.to!);
        toDate.setHours(23, 59, 59, 999); // Include the entire end date

        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Apply sorting - Excel-style multi-level sort
    if (sorts.length > 0) {
      data.sort((a, b) => {
        for (const sort of sorts) {
          const aVal = a[sort.column as keyof Conversation];
          const bVal = b[sort.column as keyof Conversation];

          let comparison = 0;
          if (typeof aVal === "string" && typeof bVal === "string") {
            comparison = sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          } else if (typeof aVal === "number" && typeof bVal === "number") {
            comparison = sort.direction === "asc" ? aVal - bVal : bVal - aVal;
          }

          // If values are different, return the comparison result
          if (comparison !== 0) {
            return comparison;
          }
          // If values are equal, continue to next sort criterion
        }
        return 0; // All criteria are equal
      });
    }

    return data;
  };

  const getFilteredAndSortedCallLogs = () => {
    let data = [...callLogs];

    // Apply search
    if (search) {
      data = data.filter(item =>
        item.contact.toLowerCase().includes(search.toLowerCase()) ||
        item.agent.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply direction filter
    if (selectedDirection.length > 0) {
      data = data.filter(item => selectedDirection.includes(item.direction));
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      data = data.filter(item => selectedStatus.includes(item.status));
    }

    // Apply date range filter
    const currentDate = new Date(2025, 10, 4); // November 4, 2025
    currentDate.setHours(0, 0, 0, 0); // Set to start of day

    if (dateRangePreset !== "custom") {
      data = data.filter(item => {
        // Parse date from "2025-11-04 10:30 AM" format
        const dateStr = item.startTime.split(" ").slice(0, 1)[0]; // Get "2025-11-04"
        const itemDate = new Date(dateStr);
        itemDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

        switch (dateRangePreset) {
          case "last-7-days":
            const sevenDaysAgo = new Date(currentDate);
            sevenDaysAgo.setDate(currentDate.getDate() - 7);
            return itemDate >= sevenDaysAgo && itemDate <= currentDate;

          case "last-14-days":
            const fourteenDaysAgo = new Date(currentDate);
            fourteenDaysAgo.setDate(currentDate.getDate() - 14);
            return itemDate >= fourteenDaysAgo && itemDate <= currentDate;

          case "last-30-days":
            const thirtyDaysAgo = new Date(currentDate);
            thirtyDaysAgo.setDate(currentDate.getDate() - 30);
            return itemDate >= thirtyDaysAgo && itemDate <= currentDate;

          case "this-month":
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            return itemDate >= firstDayOfMonth && itemDate <= currentDate;

          case "this-quarter":
            const currentQuarter = Math.floor(currentDate.getMonth() / 3);
            const firstDayOfQuarter = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
            return itemDate >= firstDayOfQuarter && itemDate <= currentDate;

          default:
            return true;
        }
      });
    } else if (customDateRange?.from && customDateRange?.to) {
      data = data.filter(item => {
        // Parse date from "2025-11-04 10:30 AM" format
        const dateStr = item.startTime.split(" ").slice(0, 1)[0]; // Get "2025-11-04"
        const itemDate = new Date(dateStr);
        itemDate.setHours(0, 0, 0, 0); // Set to start of day

        const fromDate = new Date(customDateRange.from!);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(customDateRange.to!);
        toDate.setHours(23, 59, 59, 999); // Include the entire end date

        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Apply sorting - Excel-style multi-level sort
    if (callSorts.length > 0) {
      data.sort((a, b) => {
        for (const sort of callSorts) {
          const aVal = a[sort.column as keyof CallLog];
          const bVal = b[sort.column as keyof CallLog];

          let comparison = 0;
          if (typeof aVal === "string" && typeof bVal === "string") {
            comparison = sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          } else if (typeof aVal === "number" && typeof bVal === "number") {
            comparison = sort.direction === "asc" ? aVal - bVal : bVal - aVal;
          } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
            comparison = sort.direction === "asc" ? (aVal === bVal ? 0 : aVal ? 1 : -1) : (aVal === bVal ? 0 : aVal ? -1 : 1);
          }

          // If values are different, return the comparison result
          if (comparison !== 0) {
            return comparison;
          }
          // If values are equal, continue to next sort criterion
        }
        return 0; // All criteria are equal
      });
    }

    return data;
  };

  const handleExportSelectedAsCSV = () => {
    if (selectedRows.size === 0) {
      return;
    }

    const selectedConversations = conversations.filter(c => selectedRows.has(c.id));

    const escapeCSV = (value: string | number) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ["Customer Number", "Customer Name", "Started Time", "Duration", "Agent Name", "Agent ID", "Status", "Number of Messages", "Conversation Timeline", "Sentiment", "Sentiment Summary"];

    const rows = selectedConversations.map(conv => [
      escapeCSV(conv.customerNumber),
      escapeCSV(conv.customer),
      escapeCSV(conv.startTime),
      escapeCSV(conv.duration),
      escapeCSV(conv.agent),
      escapeCSV(conv.agentId),
      escapeCSV(conv.status),
      escapeCSV(conv.messages),
      escapeCSV(conv.timeline),
      escapeCSV(conv.sentiment),
      escapeCSV(conv.sentimentSummary),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `conversations_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSingleAsCSV = (conv: Conversation) => {
    const escapeCSV = (value: string | number) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ["Customer Number", "Customer Name", "Started Time", "Duration", "Agent Name", "Agent ID", "Status", "Number of Messages", "Conversation Timeline", "Sentiment", "Sentiment Summary"];

    const row = [
      escapeCSV(conv.customerNumber),
      escapeCSV(conv.customer),
      escapeCSV(conv.startTime),
      escapeCSV(conv.duration),
      escapeCSV(conv.agent),
      escapeCSV(conv.agentId),
      escapeCSV(conv.status),
      escapeCSV(conv.messages),
      escapeCSV(conv.timeline),
      escapeCSV(conv.sentiment),
      escapeCSV(conv.sentimentSummary),
    ];

    const csvContent = [
      headers.join(","),
      row.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `conversation_${conv.id}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSelectedCallLogsAsCSV = () => {
    if (selectedRows.size === 0) {
      return;
    }

    const selectedCallLogs = callLogs.filter(c => selectedRows.has(c.id));

    const escapeCSV = (value: string | number | boolean) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ["Contact Number", "Contact Name", "Started Time", "Duration", "Agent Name", "Agent ID", "Direction", "Status", "Sentiment", "Sentiment Summary", "Recording"];

    const rows = selectedCallLogs.map(call => [
      escapeCSV(call.contactNumber),
      escapeCSV(call.contact),
      escapeCSV(call.startTime),
      escapeCSV(call.duration),
      escapeCSV(call.agent),
      escapeCSV(call.agentId),
      escapeCSV(call.direction),
      escapeCSV(call.status),
      escapeCSV(call.sentiment),
      escapeCSV(call.sentimentSummary),
      escapeCSV(call.recording),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `call_logs_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewConversationDetails = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversationDetailsOpen(true);
  };

  const handleViewCallDetails = (call: CallLog) => {
    setSelectedCallLog(call);
    setCallDetailsOpen(true);
  };

  const handleExportSingleCallLogAsCSV = (call: CallLog) => {
    const escapeCSV = (value: string | number | boolean) => {
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ["Contact Number", "Contact Name", "Started Time", "Duration", "Agent Name", "Agent ID", "Direction", "Status", "Sentiment", "Sentiment Summary", "Recording"];

    const row = [
      escapeCSV(call.contactNumber),
      escapeCSV(call.contact),
      escapeCSV(call.startTime),
      escapeCSV(call.duration),
      escapeCSV(call.agent),
      escapeCSV(call.agentId),
      escapeCSV(call.direction),
      escapeCSV(call.status),
      escapeCSV(call.sentiment),
      escapeCSV(call.sentimentSummary),
      escapeCSV(call.recording),
    ];

    const csvContent = [
      headers.join(","),
      row.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `call_log_${call.id}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paginatedData = getFilteredAndSortedData().slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(getFilteredAndSortedData().length / rowsPerPage);

  const paginatedCallLogs = getFilteredAndSortedCallLogs().slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const callLogsTotal = getFilteredAndSortedCallLogs().length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <audio ref={audioRef} className="hidden" />
        <h1 className="text-3xl font-bold">Logs</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 border hover-elevate [border-color:hsl(var(--input))]"
              onClick={() => {
                // Refresh logic here
              }}
            >
              <RefreshCw size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center space-x-1 bg-slate-200/75 dark:bg-slate-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("conversations")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "conversations"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
          >
            Conversation Logs
          </button>
          <button
            onClick={() => setActiveTab("calls")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "calls"
              ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
              : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
              }`}
          >
            Call Logs
          </button>
        </div>

        {/* Conversation Logs Tab */}
        {activeTab === "conversations" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Conversations</p>
                    <p className="text-2xl font-bold">{kpiData.totalConversations}</p>
                    <p className="text-xs text-muted-foreground">Conversations</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Queued</p>
                    <p className="text-2xl font-bold">{kpiData.queued}</p>
                    <p className="text-xs text-muted-foreground">Waiting</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{kpiData.active}</p>
                    <p className="text-xs text-muted-foreground">In progress</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{kpiData.completed}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Resolution Rate</p>
                    <p className="text-2xl font-bold">{kpiData.resolutionRate}</p>
                    <p className="text-xs text-muted-foreground">Success rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-3">
              {/* Left side: Search, Date Range, and Status */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-80" style={{ height: "38px" }}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 text-sm w-full border border-input rounded-md bg-background focus:outline-none transition-color h-full"
                  />
                </div>

                {/* Date Range Preset */}
                <Select value={dateRangePreset} onValueChange={setDateRangePreset}>
                  <SelectTrigger className="w-[160px] hover-elevate" style={{ height: "38px" }}>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)]">
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom Date Range */}
                {dateRangePreset === "custom" && (
                  <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2 font-normal h-10 hover-elevate [border-color:hsl(var(--input))]">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {customDateRange
                            ? customDateRange.to
                              ? `${(customDateRange.from ? format(customDateRange.from, 'dd/MMM/yyyy') : "")} - ${(customDateRange.to ? format(customDateRange.to, 'dd/MMM/yyyy') : "")}`
                              : (customDateRange.from ? format(customDateRange.from, 'dd/MMM/yyyy') : "")
                            : "Select Date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={customDateRange?.from}
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Status Filter */}
                <CustomDropdown
                  options={statusOptions}
                  selected={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Status"
                  width="160px"
                />
              </div>
            </div>

            {/* Table */}
            <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
              <CardContent className="pt-2">
                {/* Bulk Actions Toolbar */}
                {selectedRows.size > 0 && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <span className="text-sm text-foreground">{selectedRows.size} selected</span>
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={handleExportSelectedAsCSV}
                        className="p-1 hover:bg-accent dark:hover:bg-slate-700 rounded transition-colors"
                        title="Export as CSV"
                      >
                        <Download size={14} className="text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  </div>
                )}

                <div className={`overflow-x-auto ${selectedRows.size > 0 ? 'mt-3' : 'mt-6'}`}>
                  <table className="w-full text-xs">
                    <thead className="select-none">
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                          <Checkbox
                            checked={selectedRows.size > 0 && selectedRows.size === getFilteredAndSortedData().length}
                            onCheckedChange={toggleAllRows}
                          />
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("customer")}
                        >
                          <div className="flex items-center gap-2">
                            Customer
                            {renderSortIcon("customer")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("agent")}
                        >
                          <div className="flex items-center gap-2">
                            Agent
                            {renderSortIcon("agent")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("startTime")}
                        >
                          <div className="flex items-center gap-2">
                            Start Time
                            {renderSortIcon("startTime")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("duration")}
                        >
                          <div className="flex items-center gap-2">
                            Duration
                            {renderSortIcon("duration")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("status")}
                        >
                          <div className="flex items-center gap-2">
                            Status
                            {renderSortIcon("status")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleColumnSort("messages")}
                        >
                          <div className="flex items-center gap-2">
                            Messages
                            {renderSortIcon("messages")}
                          </div>
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-muted-foreground">
                            No results
                          </td>
                        </tr>
                      ) : (
                        paginatedData.map((conv) => (
                          <tr key={conv.id} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-3">
                              <Checkbox
                                checked={selectedRows.has(conv.id)}
                                onCheckedChange={() => toggleRowSelection(conv.id)}
                              />
                            </td>
                            <td className="py-2 px-3">{conv.customer}</td>
                            <td className="py-2 px-3">{conv.agent}</td>
                            <td className="py-2 px-3">{conv.startTime}</td>
                            <td className="py-2 px-3">{conv.duration}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${conv.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                conv.status === "Active" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                  conv.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                    conv.status === "Queued" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                      conv.status === "Pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                        conv.status === "Forwarded" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                          conv.status === "Expired" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                            conv.status === "Spammed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                              "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                                }`}>
                                {conv.status}
                              </span>
                            </td>
                            <td className="py-2 px-3">{conv.messages}</td>
                            <td className="py-2 px-3 flex justify-start">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 hover:bg-muted rounded">
                                    <MoreVertical size={14} className="text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewConversationDetails(conv)}>
                                    <FileText size={14} className="mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleExportSingleAsCSV(conv)}>
                                    <Download size={14} className="mr-2" />
                                    Export Log
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare size={14} className="mr-2" />
                                    Export Chat
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 text-xs">
                  <span className="text-muted-foreground">{getFilteredAndSortedData().length} results</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Rows per page:</span>
                    <div className="relative w-15" ref={dropdownRef}>
                      <button
                        type="button"
                        className="flex items-center justify-between px-3 py-2 text-left bg-background dark:bg-background border border-input dark:border-slate-700 rounded-md shadow-sm hover:bg-accent dark:hover:bg-slate-700 focus:outline-none text-foreground transition-colors"
                        onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                      >
                        <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                        <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                      </button>
                      {rowsDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-background dark:bg-background rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border border-border dark:border-slate-700 overflow-hidden">
                          <ul className="py-1">
                            {[10, 25, 50].map(option => (
                              <li
                                key={option}
                                className="px-3 py-2 text-xs cursor-pointer hover:bg-muted dark:hover:bg-slate-700"
                                onClick={() => {
                                  setRowsPerPage(option);
                                  setRowsDropdownOpen(false);
                                  setPage(1);
                                }}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <span className="text-muted-foreground">Page {page} of {totalPages || 1}</span>
                    <div className="flex gap-1">
                      <button
                        className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors"
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                      >
                        <ChevronsLeft size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted dark:hover:bg-slate-700 rounded disabled:opacity-50 transition-colors"
                        disabled={page === totalPages}
                        onClick={() => setPage(totalPages)}
                      >
                        <ChevronsRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call Logs Tab */}
        {activeTab === "calls" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Calls</p>
                    <p className="text-2xl font-bold">{callKpiData.totalCalls}</p>
                    <p className="text-xs text-muted-foreground">All calls</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{callKpiData.completed}</p>
                    <p className="text-xs text-muted-foreground">Successful</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Inbound Calls</p>
                    <p className="text-2xl font-bold">{callKpiData.inboundCalls}</p>
                    <p className="text-xs text-muted-foreground">Received</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Outbound Calls</p>
                    <p className="text-2xl font-bold">{callKpiData.outboundCalls}</p>
                    <p className="text-xs text-muted-foreground">Initiated</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg. Duration</p>
                    <p className="text-2xl font-bold">{callKpiData.avgDuration}</p>
                    <p className="text-xs text-muted-foreground">Per call</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-3">
              {/* Left side: Search, Date Range, Direction, Status */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-80" style={{ height: "38px" }}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search calls..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 text-sm w-full border border-input rounded-md bg-background focus:outline-none transition-color h-full"
                  />
                </div>
                {/* Date Range Preset */}
                <Select value={dateRangePreset} onValueChange={setDateRangePreset}>
                  <SelectTrigger className="w-[160px] hover-elevate" style={{ height: "38px" }}>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)]">
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom Date Range */}
                {dateRangePreset === "custom" && (
                  <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2 font-normal h-10 hover-elevate [border-color:hsl(var(--input))]">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {customDateRange
                            ? customDateRange.to
                              ? `${(customDateRange.from ? format(customDateRange.from, 'dd/MMM/yyyy') : "")} - ${(customDateRange.to ? format(customDateRange.to, 'dd/MMM/yyyy') : "")}`
                              : (customDateRange.from ? format(customDateRange.from, 'dd/MMM/yyyy') : "")
                            : "Select Date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={customDateRange?.from}
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Direction Filter */}
                <CustomDropdown
                  options={directionOptions}
                  selected={selectedDirection}
                  onChange={setSelectedDirection}
                  placeholder="Direction"
                  width="160px"
                />

                {/* Status Filter */}
                <CustomDropdown
                  options={callStatusOptions}
                  selected={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Status"
                  width="160px"
                />
              </div>
            </div>

            {/* Table */}
            <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
              <CardContent className="pt-2">
                {/* Bulk Actions Toolbar */}
                {selectedRows.size > 0 && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <span className="text-sm text-foreground">{selectedRows.size} selected</span>
                    <div className="flex gap-2 ml-auto">
                      <button onClick={handleExportSelectedCallLogsAsCSV} className="p-1 hover:bg-blue-100 rounded" title="Export as CSV">
                        <Download size={14} className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                )}

                <div className={`overflow-x-auto ${selectedRows.size > 0 ? 'mt-3' : 'mt-6'}`}>
                  <table className="w-full text-xs">
                    <thead className="select-none">
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                          <Checkbox
                            checked={selectedRows.size > 0 && selectedRows.size === getFilteredAndSortedCallLogs().length}
                            onCheckedChange={toggleAllRows}
                          />
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("contact")}
                        >
                          <div className="flex items-center gap-2">
                            Contact
                            {renderCallSortIcon("contact")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("agent")}
                        >
                          <div className="flex items-center gap-2">
                            Agent
                            {renderCallSortIcon("agent")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("direction")}
                        >
                          <div className="flex items-center gap-2">
                            Direction
                            {renderCallSortIcon("direction")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("startTime")}
                        >
                          <div className="flex items-center gap-2">
                            Start Time
                            {renderCallSortIcon("startTime")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("duration")}
                        >
                          <div className="flex items-center gap-2">
                            Duration
                            {renderCallSortIcon("duration")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("status")}
                        >
                          <div className="flex items-center gap-2">
                            Status
                            {renderCallSortIcon("status")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("sentiment")}
                        >
                          <div className="flex items-center gap-2">
                            Sentiment
                            {renderCallSortIcon("sentiment")}
                          </div>
                        </th>
                        <th
                          className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                          onClick={() => handleCallColumnSort("recording")}
                        >
                          <div className="flex items-center gap-2">
                            Recording
                            {renderCallSortIcon("recording")}
                          </div>
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCallLogs.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center py-8 text-muted-foreground">
                            No results
                          </td>
                        </tr>
                      ) : (
                        paginatedCallLogs.map((call) => (
                          <React.Fragment key={call.id}>
                            <tr className={`${expandedCallId === call.id ? '' : 'border-b'} hover:bg-muted/50`}>
                              <td className="py-2 px-3">
                                <Checkbox
                                  checked={selectedRows.has(call.id)}
                                  onCheckedChange={() => toggleRowSelection(call.id)}
                                />
                              </td>
                              <td className="py-2 px-3">{call.contact}</td>
                              <td className="py-2 px-3">{call.agent}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${call.direction === "Inbound" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                  }`}>
                                  {call.direction}
                                </span>
                              </td>
                              <td className="py-2 px-3">{call.startTime}</td>
                              <td className="py-2 px-3">{call.duration}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${call.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                  call.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                    call.status === "Missed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                      call.status === "Declined" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                        call.status === "Failed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                          "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                                  }`}>
                                  {call.status}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${call.sentiment === "Positive" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                  call.sentiment === "Negative" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  }`}>
                                  {call.sentiment}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${call.recording ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                    }`}>
                                    {call.recording ? "Yes" : "No"}
                                  </span>
                                  {call.recording && (
                                    <button
                                      className="p-1 hover:bg-muted rounded"
                                      onClick={() => expandedCallId === call.id ? resetPlayerState() : handlePlayPauseClick(call)}
                                      title={expandedCallId === call.id ? "Close Player" : "Play"}
                                    >
                                      {expandedCallId === call.id ? (
                                        <X size={14} className="text-muted-foreground" />
                                      ) : (
                                        <Play size={14} className="text-muted-foreground" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-3 flex justify-start">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1 hover:bg-muted rounded">
                                      <MoreVertical size={14} className="text-muted-foreground" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => handleViewCallDetails(call)}>
                                      <FileText size={14} className="mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExportSingleCallLogAsCSV(call)}>
                                      <Download size={14} className="mr-2" />
                                      Export Log
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mic size={14} className="mr-2" />
                                      Export Recording
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                            {expandedCallId === call.id && (
                              <tr className="border-b bg-muted/20">
                                <td colSpan={10} className="pb-2 px-3">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                      <button
                                        onClick={handlePrevious}
                                        className="p-1 hover:bg-muted rounded-full disabled:opacity-50"
                                        disabled={
                                          (() => {
                                            const currentCallLogs = getFilteredAndSortedCallLogs();
                                            const currentIndex = currentCallLogs.findIndex(c => c.id === currentPlayingCallId);
                                            if (currentIndex <= 0) return true;
                                            for (let i = currentIndex - 1; i >= 0; i--) {
                                              if (currentCallLogs[i].recording) return false;
                                            }
                                            return true;
                                          })()
                                        }
                                      >
                                        <SkipBack size={20} />
                                      </button>
                                      <button
                                        onClick={() => handlePlayPauseClick(call)}
                                        className="p-1 hover:bg-muted rounded-full"
                                      >
                                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                      </button>
                                      <button
                                        onClick={handleNext}
                                        className="p-1 hover:bg-muted rounded-full disabled:opacity-50"
                                        disabled={
                                          (() => {
                                            const currentCallLogs = getFilteredAndSortedCallLogs();
                                            const currentIndex = currentCallLogs.findIndex(c => c.id === currentPlayingCallId);
                                            if (currentIndex === -1 || currentIndex >= currentCallLogs.length - 1) return true;
                                            for (let i = currentIndex + 1; i < currentCallLogs.length; i++) {
                                              if (currentCallLogs[i].recording) return false;
                                            }
                                            return true;
                                          })()
                                        }
                                      >
                                        <SkipForward size={20} />
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-4 flex-1 mx-8">
                                      <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span>
                                      <input
                                        type="range"
                                        min="0"
                                        max={duration}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary slider-thumb-blue-round"
                                      />
                                      <span className="text-sm text-muted-foreground">{formatTime(duration)}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <div className="relative w-[78px]" ref={speedDropdownRef}>
                                        <button
                                          type="button"
                                          className="flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors w-full"
                                          onClick={() => setSpeedDropdownOpen(!speedDropdownOpen)}
                                        >
                                          <span className="truncate text-xs font-normal">{playbackSpeed}x</span>
                                          <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                                        </button>
                                        {speedDropdownOpen && (
                                          <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                                            <ul className="py-1">
                                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(option => (
                                                <li
                                                  key={option}
                                                  className="px-3 py-2 text-xs cursor-pointer hover:bg-muted"
                                                  onClick={() => {
                                                    handleSpeedChange(option);
                                                    setSpeedDropdownOpen(false);
                                                  }}
                                                >
                                                  {option}x
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 text-xs">
                  <span className="text-muted-foreground">{callLogsTotal} results</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Rows per page:</span>
                    <div className="relative w-15" ref={dropdownRef}>
                      <button
                        type="button"
                        className="flex items-center justify-between px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors"
                        onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                      >
                        <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                        <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                      </button>
                      {rowsDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-background rounded-md shadow-md border border-border">
                          <ul className="py-1">
                            {[10, 25, 50].map(option => (
                              <li
                                key={option}
                                className="px-3 py-2 text-xs cursor-pointer hover:bg-muted"
                                onClick={() => {
                                  setRowsPerPage(option);
                                  setRowsDropdownOpen(false);
                                  setPage(1);
                                }}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <span className="text-muted-foreground">Page {page} of {Math.ceil(callLogsTotal / rowsPerPage) || 1}</span>
                    <div className="flex gap-1">
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(1)}
                      >
                        <ChevronsLeft size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === Math.ceil(callLogs.length / rowsPerPage)}
                        onClick={() => setPage(page + 1)}
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        className="p-1 hover:bg-muted rounded disabled:opacity-50"
                        disabled={page === Math.ceil(callLogs.length / rowsPerPage)}
                        onClick={() => setPage(Math.ceil(callLogs.length / rowsPerPage))}
                      >
                        <ChevronsRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Conversation Details Modal */}
      <Dialog open={conversationDetailsOpen} onOpenChange={setConversationDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="mb-2">
            <DialogTitle>Conversation Details</DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Conversation Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Customer Name</label>
                    <p className="mt-1 text-sm">{selectedConversation.customer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Agent Name</label>
                    <p className="mt-1 text-sm">{selectedConversation.agent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Start Time</label>
                    <p className="mt-1 text-sm">{selectedConversation.startTime}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Duration</label>
                    <p className="mt-1 text-sm">{selectedConversation.duration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${selectedConversation.status === "Completed" ? "bg-green-100 text-green-700" :
                        selectedConversation.status === "Active" ? "bg-blue-100 text-blue-700" :
                          selectedConversation.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            selectedConversation.status === "Queued" ? "bg-yellow-100 text-yellow-700" :
                              selectedConversation.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                selectedConversation.status === "Forwarded" ? "bg-yellow-100 text-yellow-700" :
                                  selectedConversation.status === "Expired" ? "bg-red-100 text-red-700" :
                                    selectedConversation.status === "Spammed" ? "bg-red-100 text-red-700" :
                                      "bg-gray-100 text-gray-700"
                        }`}>
                        {selectedConversation.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Number of Messages</label>
                    <p className="mt-1 text-sm">{selectedConversation.messages}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Sentiment</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${selectedConversation.sentiment === "Positive" ? "bg-green-100 text-green-700" :
                        selectedConversation.sentiment === "Negative" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                        {selectedConversation.sentiment}
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-foreground">Sentiment Summary</label>
                    <p className="mt-1 text-sm">{selectedConversation.sentimentSummary}</p>
                  </div>
                </div>
              </div>

              {/* Right side - Conversation Timeline */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Conversation Timeline</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Timeline Events */}
                  <div className="relative pl-6">
                    {/* Timeline line */}
                    <div className="absolute left-[0.45rem] top-2 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Timeline Events */}
                    <div className="space-y-6">
                      {/* Conversation Started */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Customer initiated conversation</div>
                        <div className="text-xs text-gray-500 mt-1">10:30:15 AM</div>
                        <div className="text-xs text-gray-600 mt-1">First message received from customer</div>
                      </div>

                      {/* Bot Response */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Bot auto-response sent</div>
                        <div className="text-xs text-gray-500 mt-1">10:30:18 AM</div>
                        <div className="text-xs text-gray-600 mt-1">Automated greeting and initial assistance</div>
                      </div>

                      {/* Customer Response */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Customer replied</div>
                        <div className="text-xs text-gray-500 mt-1">10:30:45 AM</div>
                        <div className="text-xs text-gray-600 mt-1">Customer sent a reply message</div>
                      </div>

                      {/* Transferred to Agent */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Escalated to agent</div>
                        <div className="text-xs text-gray-500 mt-1">10:31:02 AM</div>
                        <div className="text-xs text-gray-600 mt-1">Bot escalated to human agents</div>
                      </div>

                      {/* Agent Joined */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Chat was assigned to agent</div>
                        <div className="text-xs text-gray-500 mt-1">10:31:15 AM</div>
                        <div className="text-xs text-gray-600 mt-1">Chat Assigned to Sarah Johnson</div>
                      </div>

                      {/* Agent Messages */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Agent provided assistance</div>
                        <div className="text-xs text-gray-500 mt-1">10:31:20 AM to 10:34:45 AM</div>
                        <div className="text-xs text-gray-600 mt-1">8 messages exchanged</div>
                      </div>

                      {/* Issue Resolved */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Issue resolved</div>
                        <div className="text-xs text-gray-500 mt-1">10:34:50 AM</div>
                        <div className="text-xs text-gray-600 mt-1">Customer confirmed satisfaction with resolution</div>
                      </div>

                      {/* Conversation Completed */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 z-10"></div>
                        <div className="text-sm font-medium text-gray-900">Conversation completed</div>
                        <div className="text-xs text-gray-500 mt-1">10:35:23 AM</div>
                        <div className="text-xs text-gray-600 mt-1">Agent marked conversation as resolved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setConversationDetailsOpen(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))] font-normal"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Details Modal */}
      <Dialog open={callDetailsOpen} onOpenChange={setCallDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader>
          {selectedCallLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Contact Name</label>
                  <p className="mt-1 text-sm">{selectedCallLog.contact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Agent Name</label>
                  <p className="mt-1 text-sm">{selectedCallLog.agent}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Direction</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${selectedCallLog.direction === "Inbound" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                      {selectedCallLog.direction}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Start Time</label>
                  <p className="mt-1 text-sm">{selectedCallLog.startTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Duration</label>
                  <p className="mt-1 text-sm">{selectedCallLog.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${selectedCallLog.status === "Completed" ? "bg-green-100 text-green-700" :
                      selectedCallLog.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        selectedCallLog.status === "Missed" ? "bg-red-100 text-red-700" :
                          selectedCallLog.status === "Declined" ? "bg-red-100 text-red-700" :
                            selectedCallLog.status === "Failed" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-700"
                      }`}>
                      {selectedCallLog.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Sentiment</label>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${selectedCallLog.sentiment === "Positive" ? "bg-green-100 text-green-700" :
                      selectedCallLog.sentiment === "Negative" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                      {selectedCallLog.sentiment}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground">Sentiment Summary</label>
                  <p className="mt-1 text-sm">{selectedCallLog.sentimentSummary}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground">Call Recording</label>
                  <div className="mt-2">
                    {/* 50/50 chance to show available vs unavailable recording */}
                    {Math.random() > 0 ? (
                      <audio
                        controls
                        className="w-full h-12"
                        style={{ maxWidth: '100%' }}
                      >
                        <source src="/api/placeholder-audio.mp3" type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <p className="text-sm text-muted-foreground">Call Recording Unavailable</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              onClick={() => setCallDetailsOpen(false)}
              variant="outline"
              className="border-input [border-color:hsl(var(--input))] font-normal"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

