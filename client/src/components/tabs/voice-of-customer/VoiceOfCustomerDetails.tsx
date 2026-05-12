import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";

type SortDirection = "asc" | "desc" | "default";

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export default function VoiceOfCustomerDetails() {
  const [searchAgent, setSearchAgent] = useState("");
  const [searchConversation, setSearchConversation] = useState("");
  const [agentPage, setAgentPage] = useState(1);
  const [conversationPage, setConversationPage] = useState(1);
  const [rowsPerPageAgent, setRowsPerPageAgent] = useState(10);
  const [rowsPerPageConversation, setRowsPerPageConversation] = useState(10);
  const [agentSort, setAgentSort] = useState<SortState>({ column: null, direction: "default" });
  const [conversationSort, setConversationSort] = useState<SortState>({ column: null, direction: "default" });
  const agentDropdownRef = useRef<HTMLDivElement>(null);
  const conversationDropdownRef = useRef<HTMLDivElement>(null);
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [conversationDropdownOpen, setConversationDropdownOpen] = useState(false);

  // Mock data for Agent Sentiment Performance
  const agentPerformanceData = [
    { agentName: "John Smith", agentId: "A001", team: "Sales", date: "2024-10-30", total: 45 },
    { agentName: "Sarah Johnson", agentId: "A002", team: "Support", date: "2024-10-30", total: 52 },
    { agentName: "Mike Davis", agentId: "A003", team: "Sales", date: "2024-10-30", total: 38 },
    { agentName: "Emily Brown", agentId: "A004", team: "Support", date: "2024-10-30", total: 61 },
    { agentName: "David Wilson", agentId: "A005", team: "Sales", date: "2024-10-30", total: 42 },
  ];

  // Mock data for Customer Sentiment Analysis
  const customerSentimentData = [
    { conversationId: "C001", agent: "John Smith", team: "Sales", sentiment: "Positive", date: "2024-10-30", channel: "Chat" },
    { conversationId: "C002", agent: "Sarah Johnson", team: "Support", sentiment: "Neutral", date: "2024-10-30", channel: "Email" },
    { conversationId: "C003", agent: "Mike Davis", team: "Sales", sentiment: "Negative", date: "2024-10-30", channel: "Phone" },
    { conversationId: "C004", agent: "Emily Brown", team: "Support", sentiment: "Positive", date: "2024-10-30", channel: "Chat" },
    { conversationId: "C005", agent: "David Wilson", team: "Sales", sentiment: "Positive", date: "2024-10-30", channel: "Email" },
  ];

  // Handle sort for agent table
  const handleAgentSort = (column: string) => {
    setAgentSort((prev) => {
      if (prev.column === column) {
        if (prev.direction === "default") return { column, direction: "asc" };
        if (prev.direction === "asc") return { column, direction: "desc" };
        return { column: null, direction: "default" };
      }
      return { column, direction: "asc" };
    });
  };

  // Handle sort for conversation table
  const handleConversationSort = (column: string) => {
    setConversationSort((prev) => {
      if (prev.column === column) {
        if (prev.direction === "default") return { column, direction: "asc" };
        if (prev.direction === "asc") return { column, direction: "desc" };
        return { column: null, direction: "default" };
      }
      return { column, direction: "asc" };
    });
  };

  // Render sort icon for headers
  const renderSortIcon = (column: string, currentSort: SortState) => {
    const isActive = currentSort.column === column;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (currentSort.column !== column) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (currentSort.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    if (currentSort.direction === "desc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronDown size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
  };

  // Sort and filter agent data
  const getSortedAgentData = () => {
    let sorted = [...agentPerformanceData];

    if (agentSort.column && agentSort.direction !== "default") {
      sorted.sort((a, b) => {
        const aVal = a[agentSort.column as keyof typeof a];
        const bVal = b[agentSort.column as keyof typeof b];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return agentSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return agentSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return sorted.filter(item =>
      searchAgent === "" ||
      item.agentName.toLowerCase().includes(searchAgent.toLowerCase()) ||
      item.agentId.toLowerCase().includes(searchAgent.toLowerCase())
    );
  };

  // Sort and filter conversation data
  const getSortedConversationData = () => {
    let sorted = [...customerSentimentData];

    if (conversationSort.column && conversationSort.direction !== "default") {
      sorted.sort((a, b) => {
        const aVal = a[conversationSort.column as keyof typeof a];
        const bVal = b[conversationSort.column as keyof typeof b];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return conversationSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return sorted.filter(item =>
      searchConversation === "" ||
      item.conversationId.toLowerCase().includes(searchConversation.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchConversation.toLowerCase())
    );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target as Node)) {
        setAgentDropdownOpen(false);
      }
      if (conversationDropdownRef.current && !conversationDropdownRef.current.contains(event.target as Node)) {
        setConversationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Agent Sentiment Performance Table */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Agent Sentiment Performance</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by agent name or ID..."
                value={searchAgent}
                onChange={(e) => setSearchAgent(e.target.value)}
                className="pl-10 h-9 text-sm w-full border border-input rounded-md bg-background focus:outline-none  transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleAgentSort("agentName")}
                  >
                    <div className="flex items-center gap-2">
                      Agent Name(ID)
                      {renderSortIcon("agentName", agentSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleAgentSort("team")}
                  >
                    <div className="flex items-center gap-2">
                      Team
                      {renderSortIcon("team", agentSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleAgentSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {renderSortIcon("date", agentSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleAgentSort("total")}
                  >
                    <div className="flex items-center gap-2">
                      Total
                      {renderSortIcon("total", agentSort)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedAgentData().length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getSortedAgentData().map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{item.agentName} ({item.agentId})</td>
                      <td className="py-2 px-3">{item.team}</td>
                      <td className="py-2 px-3">{item.date}</td>
                      <td className="py-2 px-3">{item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{getSortedAgentData().length} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={agentDropdownRef}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none  text-foreground transition-colors"
                  onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">
                    {rowsPerPageAgent}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </button>
                {agentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-background rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] animate-in fade-in-80">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className={`flex items-center px-3 py-2 text-xs cursor-pointer select-none transition-colors rounded-md hover:bg-accent`}
                          onClick={() => {
                            setRowsPerPageAgent(option);
                            setAgentDropdownOpen(false);
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-muted-foreground">Page 1 of 1</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronRight size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Sentiment Analysis Table */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Customer Sentiment Analysis</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by conversation ID or agent..."
                value={searchConversation}
                onChange={(e) => setSearchConversation(e.target.value)}
                className="pl-10 h-9 text-sm w-full border border-input rounded-md bg-background focus:outline-none  transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="select-none">
                <tr className="border-b">
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleConversationSort("conversationId")}
                  >
                    <div className="flex items-center gap-2">
                      Conversation (ID)
                      {renderSortIcon("conversationId", conversationSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleConversationSort("agent")}
                  >
                    <div className="flex items-center gap-2">
                      Agent
                      {renderSortIcon("agent", conversationSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleConversationSort("team")}
                  >
                    <div className="flex items-center gap-2">
                      Team
                      {renderSortIcon("team", conversationSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleConversationSort("sentiment")}
                  >
                    <div className="flex items-center gap-2">
                      Sentiment
                      {renderSortIcon("sentiment", conversationSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleConversationSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {renderSortIcon("date", conversationSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleConversationSort("channel")}
                  >
                    <div className="flex items-center gap-2">
                      Channel
                      {renderSortIcon("channel", conversationSort)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedConversationData().length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getSortedConversationData().map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{item.conversationId}</td>
                      <td className="py-2 px-3">{item.agent}</td>
                      <td className="py-2 px-3">{item.team}</td>
                      <td className="py-2 px-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor:
                              item.sentiment === "Positive"
                                ? "#dcfce7"
                                : item.sentiment === "Neutral"
                                  ? "#fed7aa"
                                  : "#fee2e2",
                            color:
                              item.sentiment === "Positive"
                                ? "#166534"
                                : item.sentiment === "Neutral"
                                  ? "#92400e"
                                  : "#991b1b",
                          }}
                        >
                          {item.sentiment}
                        </span>
                      </td>
                      <td className="py-2 px-3">{item.date}</td>
                      <td className="py-2 px-3">{item.channel}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{getSortedConversationData().length} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={conversationDropdownRef}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-left bg-background border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none  text-foreground transition-colors"
                  onClick={() => setConversationDropdownOpen(!conversationDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">
                    {rowsPerPageConversation}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </button>
                {conversationDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-background rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] animate-in fade-in-80">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className={`flex items-center px-3 py-2 text-xs cursor-pointer select-none transition-colors rounded-md hover:bg-accent`}
                          onClick={() => {
                            setRowsPerPageConversation(option);
                            setConversationDropdownOpen(false);
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-muted-foreground">Page 1 of 1</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronRight size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

