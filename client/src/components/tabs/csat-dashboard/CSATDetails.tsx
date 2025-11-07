import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";

type SortDirection = "asc" | "desc" | "default";

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export default function CSATDetails() {
  const [searchAgent, setSearchAgent] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  const [agentPage, setAgentPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [rowsPerPageAgent, setRowsPerPageAgent] = useState(10);
  const [rowsPerPageFeedback, setRowsPerPageFeedback] = useState(10);
  const [agentSort, setAgentSort] = useState<SortState>({ column: null, direction: "default" });
  const [feedbackSort, setFeedbackSort] = useState<SortState>({ column: null, direction: "default" });
  const agentDropdownRef = useRef<HTMLDivElement>(null);
  const feedbackDropdownRef = useRef<HTMLDivElement>(null);
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [feedbackDropdownOpen, setFeedbackDropdownOpen] = useState(false);

  // Mock data for Agent CSAT Performance
  const agentCSATData = [
    { agentName: "John Smith", agentId: "A001", team: "Sales", great: 45, average: 12, poor: 3, total: 60 },
    { agentName: "Sarah Johnson", agentId: "A002", team: "Support", great: 52, average: 8, poor: 2, total: 62 },
    { agentName: "Mike Davis", agentId: "A003", team: "Sales", great: 38, average: 15, poor: 5, total: 58 },
    { agentName: "Emily Brown", agentId: "A004", team: "Support", great: 61, average: 5, poor: 1, total: 67 },
    { agentName: "David Wilson", agentId: "A005", team: "Sales", great: 42, average: 10, poor: 4, total: 56 },
  ];

  // Mock data for Feedback Table
  const feedbackData = [
    { conversationId: "C001", customer: "Alice Johnson", agent: "John Smith", rating: "Great", date: "2024-10-30" },
    { conversationId: "C002", customer: "Bob Smith", agent: "Sarah Johnson", rating: "Great", date: "2024-10-30" },
    { conversationId: "C003", customer: "Carol White", agent: "Mike Davis", rating: "Average", date: "2024-10-30" },
    { conversationId: "C004", customer: "David Brown", agent: "Emily Brown", rating: "Great", date: "2024-10-30" },
    { conversationId: "C005", customer: "Eve Davis", agent: "David Wilson", rating: "Poor", date: "2024-10-30" },
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

  // Handle sort for feedback table
  const handleFeedbackSort = (column: string) => {
    setFeedbackSort((prev) => {
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
    let sorted = [...agentCSATData];

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

  // Sort and filter feedback data
  const getSortedFeedbackData = () => {
    let sorted = [...feedbackData];

    if (feedbackSort.column && feedbackSort.direction !== "default") {
      sorted.sort((a, b) => {
        const aVal = a[feedbackSort.column as keyof typeof a];
        const bVal = b[feedbackSort.column as keyof typeof b];

        // Semantic sorting for rating column
        if (feedbackSort.column === "rating" && typeof aVal === "string" && typeof bVal === "string") {
          const ratingOrder = { "Great": 3, "Average": 2, "Poor": 1 };
          const aRating = ratingOrder[aVal as keyof typeof ratingOrder] || 0;
          const bRating = ratingOrder[bVal as keyof typeof ratingOrder] || 0;
          return feedbackSort.direction === "asc" ? aRating - bRating : bRating - aRating;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return feedbackSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return sorted.filter(item =>
      searchFeedback === "" ||
      item.customer.toLowerCase().includes(searchFeedback.toLowerCase()) ||
      item.conversationId.toLowerCase().includes(searchFeedback.toLowerCase())
    );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target as Node)) {
        setAgentDropdownOpen(false);
      }
      if (feedbackDropdownRef.current && !feedbackDropdownRef.current.contains(event.target as Node)) {
        setFeedbackDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Agent CSAT Performance Table */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Agent CSAT Performance</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or number..."
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
                      Agent
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
                    onClick={() => handleAgentSort("great")}
                  >
                    <div className="flex items-center gap-2">
                      Great
                      {renderSortIcon("great", agentSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleAgentSort("average")}
                  >
                    <div className="flex items-center gap-2">
                      Average
                      {renderSortIcon("average", agentSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleAgentSort("poor")}
                  >
                    <div className="flex items-center gap-2">
                      Poor
                      {renderSortIcon("poor", agentSort)}
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
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getSortedAgentData().map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{item.agentName}</td>
                      <td className="py-2 px-3">{item.team}</td>
                      <td className="py-2 px-3">{item.great}</td>
                      <td className="py-2 px-3">{item.average}</td>
                      <td className="py-2 px-3">{item.poor}</td>
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
                  className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none  text-foreground transition-colors"
                  onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">
                    {rowsPerPageAgent}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    <ChevronDown className="h-3 w-3"/>
                  </span>
                </button>
                {agentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] animate-in fade-in-80">
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

      {/* Feedback Table */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Feedback Table</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or number..."
                value={searchFeedback}
                onChange={(e) => setSearchFeedback(e.target.value)}
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
                    onClick={() => handleFeedbackSort("conversationId")}
                  >
                    <div className="flex items-center gap-2">
                      Conversation
                      {renderSortIcon("conversationId", feedbackSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleFeedbackSort("customer")}
                  >
                    <div className="flex items-center gap-2">
                      Customer
                      {renderSortIcon("customer", feedbackSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleFeedbackSort("agent")}
                  >
                    <div className="flex items-center gap-2">
                      Agent
                      {renderSortIcon("agent", feedbackSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleFeedbackSort("rating")}
                  >
                    <div className="flex items-center gap-2">
                      Feedback
                      {renderSortIcon("rating", feedbackSort)}
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                    onClick={() => handleFeedbackSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {renderSortIcon("date", feedbackSort)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedFeedbackData().length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getSortedFeedbackData().map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{item.conversationId}</td>
                      <td className="py-2 px-3">{item.customer}</td>
                      <td className="py-2 px-3">{item.agent}</td>
                      <td className="py-2 px-3">{item.rating}</td>
                      <td className="py-2 px-3">{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{getSortedFeedbackData().length} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={feedbackDropdownRef}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none  text-foreground transition-colors"
                  onClick={() => setFeedbackDropdownOpen(!feedbackDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">
                    {rowsPerPageFeedback}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    <ChevronDown className="h-3 w-3"/>
                  </span>
                </button>
                {feedbackDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] animate-in fade-in-80">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className={`flex items-center px-3 py-2 text-xs cursor-pointer select-none transition-colors rounded-md hover:bg-accent`}
                          onClick={() => {
                            setRowsPerPageFeedback(option);
                            setFeedbackDropdownOpen(false);
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

