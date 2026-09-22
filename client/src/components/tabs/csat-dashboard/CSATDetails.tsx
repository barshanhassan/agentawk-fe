import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/ThemeContext";
import { useDateRange } from "@/contexts/DateRangeContext";
import { cn } from "@/lib/utils";
import PaginationFooter from "@/components/PaginationFooter";

type SortDirection = "asc" | "desc" | "default";
interface SortState { column: string | null; direction: SortDirection; }

interface CSATDetailsProps {
  teamIds?: string[];
  agentIds?: string[];
}

export default function CSATDetails({ teamIds = [], agentIds = [] }: CSATDetailsProps) {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === "dark";

  const card      = dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200";
  const text      = dark ? "text-white"     : "text-slate-900";
  const sub       = dark ? "text-slate-400" : "text-slate-500";
  const divider   = dark ? "border-slate-800" : "border-slate-100";
  const rowHover  = dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50";
  const thCls     = dark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-100";
  const inputCls  = dark
    ? "bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300";

  const [searchAgent, setSearchAgent] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  const [rowsPerPageAgent, setRowsPerPageAgent] = useState(10);
  const [rowsPerPageFeedback, setRowsPerPageFeedback] = useState(10);
  const [pageAgent, setPageAgent] = useState(1);
  const [pageFeedback, setPageFeedback] = useState(1);
  const [agentSort, setAgentSort] = useState<SortState>({ column: null, direction: "default" });
  const [feedbackSort, setFeedbackSort] = useState<SortState>({ column: null, direction: "default" });

  const { from, to } = useDateRange().rangeFor("csat");
  const filterParams = new URLSearchParams();
  if (teamIds.length) filterParams.set("teamIds", teamIds.join(","));
  if (agentIds.length) filterParams.set("agentIds", agentIds.join(","));
  filterParams.set("from", from);
  filterParams.set("to", to);
  const filterQs = filterParams.toString();

  const { data: csatDet } = useQuery<any>({
    queryKey: ["/api/statistics/csat-details", filterQs],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/statistics/csat-details${filterQs ? `?${filterQs}` : ""}`);
      return res.json();
    },
    refetchInterval: 300_000,
  });
  const agentCSATData: Array<{ agentName: string; agentId: string; team: string; great: number; average: number; poor: number; total: number }> = csatDet?.agentCSAT ?? [];
  const feedbackData: Array<{ conversationId: string; customer: string; agent: string; rating: string; date: string }> = csatDet?.feedback ?? [];

  // Reset to page 1 whenever the underlying data changes (e.g. team/agent/date
  // filters from the parent), so a shorter result set never leaves the user
  // stranded on a now-empty page.
  useEffect(() => setPageAgent(1), [agentCSATData.length]);
  useEffect(() => setPageFeedback(1), [feedbackData.length]);

  const handleAgentSort = (column: string) => {
    setPageAgent(1);
    setAgentSort((prev) => {
      if (prev.column === column) {
        if (prev.direction === "default") return { column, direction: "asc" };
        if (prev.direction === "asc") return { column, direction: "desc" };
        return { column: null, direction: "default" };
      }
      return { column, direction: "asc" };
    });
  };

  const handleFeedbackSort = (column: string) => {
    setPageFeedback(1);
    setFeedbackSort((prev) => {
      if (prev.column === column) {
        if (prev.direction === "default") return { column, direction: "asc" };
        if (prev.direction === "asc") return { column, direction: "desc" };
        return { column: null, direction: "default" };
      }
      return { column, direction: "asc" };
    });
  };

  const renderSortIcon = (column: string, currentSort: SortState) => {
    const isActive = currentSort.column === column;
    const color = isActive ? "text-primary" : "opacity-30";
    if (currentSort.column !== column) return <ChevronsUpDown size={12} className={color} />;
    if (currentSort.direction === "asc") return <ChevronUp size={12} className={color} />;
    if (currentSort.direction === "desc") return <ChevronDown size={12} className={color} />;
    return <ChevronsUpDown size={12} className={color} />;
  };

  const getSortedAgentData = () => {
    let sorted = [...agentCSATData];
    if (agentSort.column && agentSort.direction !== "default") {
      sorted.sort((a, b) => {
        const aVal = a[agentSort.column as keyof typeof a];
        const bVal = b[agentSort.column as keyof typeof b];
        if (typeof aVal === "string" && typeof bVal === "string") return agentSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        if (typeof aVal === "number" && typeof bVal === "number") return agentSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        return 0;
      });
    }
    return sorted.filter(item => searchAgent === "" || item.agentName.toLowerCase().includes(searchAgent.toLowerCase()) || item.agentId.toLowerCase().includes(searchAgent.toLowerCase()));
  };

  const getSortedFeedbackData = () => {
    let sorted = [...feedbackData];
    if (feedbackSort.column && feedbackSort.direction !== "default") {
      sorted.sort((a, b) => {
        const aVal = a[feedbackSort.column as keyof typeof a];
        const bVal = b[feedbackSort.column as keyof typeof b];
        if (feedbackSort.column === "rating" && typeof aVal === "string" && typeof bVal === "string") {
          const order = { "Great": 3, "Average": 2, "Poor": 1 };
          return feedbackSort.direction === "asc" ? (order[aVal as keyof typeof order] || 0) - (order[bVal as keyof typeof order] || 0) : (order[bVal as keyof typeof order] || 0) - (order[aVal as keyof typeof order] || 0);
        }
        if (typeof aVal === "string" && typeof bVal === "string") return feedbackSort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        return 0;
      });
    }
    return sorted.filter(item => searchFeedback === "" || item.customer.toLowerCase().includes(searchFeedback.toLowerCase()) || item.conversationId.toLowerCase().includes(searchFeedback.toLowerCase()));
  };

  const filteredAgentData = getSortedAgentData();
  const agentTotalPages = Math.max(1, Math.ceil(filteredAgentData.length / rowsPerPageAgent));
  const paginatedAgentData = filteredAgentData.slice((pageAgent - 1) * rowsPerPageAgent, pageAgent * rowsPerPageAgent);

  const filteredFeedbackData = getSortedFeedbackData();
  const feedbackTotalPages = Math.max(1, Math.ceil(filteredFeedbackData.length / rowsPerPageFeedback));
  const paginatedFeedbackData = filteredFeedbackData.slice((pageFeedback - 1) * rowsPerPageFeedback, pageFeedback * rowsPerPageFeedback);

  return (
    <div className="space-y-5">
      {/* Agent CSAT Performance */}
      <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={cn("text-[13px] font-bold", text)}>{t("csat_dashboard.agent_performance_title")}</h3>
          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5", sub)} />
            <input placeholder={t("csat_dashboard.search_agent_placeholder")} value={searchAgent} onChange={(e) => { setSearchAgent(e.target.value); setPageAgent(1); }} className={cn("pl-9 pr-3 h-8 w-64 text-[11px] rounded-lg border outline-none transition-colors", inputCls)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn("border-b text-left", divider)}>
                {[
                  { l: t("csat_dashboard.th_agent"),      k: "agentName" },
                  { l: t("csat_dashboard.th_team"),       k: "team" },
                  { l: t("csat_dashboard.rating_great"),   k: "great" },
                  { l: t("csat_dashboard.rating_average"), k: "average" },
                  { l: t("csat_dashboard.rating_poor"),    k: "poor" },
                  { l: t("csat_dashboard.th_total"),      k: "total" },
                ].map((h) => (
                  <th key={h.k} onClick={() => handleAgentSort(h.k)} className={cn("pb-2 px-3 text-[10px] font-bold cursor-pointer", thCls)}>
                    <div className="flex items-center gap-1.5">{h.l} {renderSortIcon(h.k, agentSort)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedAgentData.length > 0 ? paginatedAgentData.map((item, i) => (
                <tr key={i} className={cn("border-b transition-colors", divider, rowHover)}>
                  <td className={cn("py-3 px-3 text-[12px] font-semibold", text)}>{item.agentName} <span className="opacity-40 font-normal text-[10px]">({item.agentId})</span></td>
                  <td className={cn("py-3 px-3 text-[11px]", sub)}>{item.team}</td>
                  <td className="py-3 px-3 text-[12px] font-black text-emerald-500">{item.great}</td>
                  <td className="py-3 px-3 text-[12px] font-black text-orange-500">{item.average}</td>
                  <td className="py-3 px-3 text-[12px] font-black text-rose-500">{item.poor}</td>
                  <td className={cn("py-3 px-3 text-[12px] font-black", text)}>{item.total}</td>
                </tr>
              )) : <tr><td colSpan={6} className={cn("py-8 text-center text-[11px]", sub)}>{t("csat_dashboard.no_results")}</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationFooter
          totalLabel={t("csat_dashboard.results_count", { count: filteredAgentData.length })}
          rowsLabel={t("csat_dashboard.rows_per_page")}
          rowsOptions={[10, 25, 50]}
          rowsPerPage={rowsPerPageAgent}
          onRowsPerPageChange={(n) => { setRowsPerPageAgent(n); setPageAgent(1); }}
          page={pageAgent}
          totalPages={agentTotalPages}
          pagePrefixLabel={t("csat_dashboard.page_prefix")}
          pageOfLabel={t("csat_dashboard.of_label")}
          onPageChange={setPageAgent}
          className="mt-5 px-0 border-t-0"
        />
      </div>

      {/* Feedback Table */}
      <div className={cn("rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl", card)}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={cn("text-[13px] font-bold", text)}>{t("csat_dashboard.feedback_table_title")}</h3>
          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5", sub)} />
            <input placeholder={t("csat_dashboard.search_feedback_placeholder")} value={searchFeedback} onChange={(e) => { setSearchFeedback(e.target.value); setPageFeedback(1); }} className={cn("pl-9 pr-3 h-8 w-64 text-[11px] rounded-lg border outline-none transition-colors", inputCls)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn("border-b text-left", divider)}>
                {[
                  { l: t("csat_dashboard.th_conversation"), k: "conversationId" },
                  { l: t("csat_dashboard.th_customer"),     k: "customer" },
                  { l: t("csat_dashboard.th_agent"),        k: "agent" },
                  { l: t("csat_dashboard.th_feedback"),     k: "rating" },
                  { l: t("csat_dashboard.th_date"),         k: "date" },
                ].map((h) => (
                  <th key={h.k} onClick={() => handleFeedbackSort(h.k)} className={cn("pb-2 px-3 text-[10px] font-bold cursor-pointer", thCls)}>
                    <div className="flex items-center gap-1.5">{h.l} {renderSortIcon(h.k, feedbackSort)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedFeedbackData.length > 0 ? paginatedFeedbackData.map((item, i) => (
                <tr key={i} className={cn("border-b transition-colors", divider, rowHover)}>
                  <td className={cn("py-3 px-3 text-[12px] font-semibold tabular-nums", text)}>{item.conversationId}</td>
                  <td className={cn("py-3 px-3 text-[11px] font-bold", text)}>{item.customer}</td>
                  <td className={cn("py-3 px-3 text-[11px]", sub)}>{item.agent}</td>
                  <td className="py-3 px-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                      item.rating === "Great"   ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      item.rating === "Average" ? "bg-orange-500/10 text-orange-500 border-orange-500/20"   :
                                                  "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}>
                      {item.rating === "Great" ? "😊" : item.rating === "Average" ? "😐" : "😞"}{" "}
                      {item.rating === "Great" ? t("csat_dashboard.rating_great") : item.rating === "Average" ? t("csat_dashboard.rating_average") : t("csat_dashboard.rating_poor")}
                    </span>
                  </td>
                  <td className={cn("py-3 px-3 text-[11px] tabular-nums", sub)}>{item.date}</td>
                </tr>
              )) : <tr><td colSpan={5} className={cn("py-8 text-center text-[11px]", sub)}>{t("csat_dashboard.no_results")}</td></tr>}
            </tbody>
          </table>
        </div>
        <PaginationFooter
          totalLabel={t("csat_dashboard.results_count", { count: filteredFeedbackData.length })}
          rowsLabel={t("csat_dashboard.rows_per_page")}
          rowsOptions={[10, 25, 50]}
          rowsPerPage={rowsPerPageFeedback}
          onRowsPerPageChange={(n) => { setRowsPerPageFeedback(n); setPageFeedback(1); }}
          page={pageFeedback}
          totalPages={feedbackTotalPages}
          pagePrefixLabel={t("csat_dashboard.page_prefix")}
          pageOfLabel={t("csat_dashboard.of_label")}
          onPageChange={setPageFeedback}
          className="mt-5 px-0 border-t-0"
        />
      </div>
    </div>
  );
}
