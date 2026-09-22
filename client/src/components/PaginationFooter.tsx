import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

// App-wide default pagination footer — every page used to hand-roll its own
// "Rows per page" dropdown + page nav, and they'd all drifted into different
// sizes/hover colors. This is the one design (compact trigger, single
// primary-tint hover on the open list) everything should use instead.
interface PaginationFooterProps {
  totalLabel: string; // pre-translated, e.g. "8 results"
  rowsLabel: string; // pre-translated, e.g. "Rows:"
  rowsPerPage: number;
  rowsOptions?: number[];
  onRowsPerPageChange: (n: number) => void;
  page: number;
  totalPages: number;
  pagePrefixLabel: string; // pre-translated, e.g. "Page"
  pageOfLabel: string; // pre-translated, e.g. "of"
  onPageChange: (page: number) => void;
  className?: string;
}

export default function PaginationFooter({
  totalLabel,
  rowsLabel,
  rowsPerPage,
  rowsOptions = [10, 25, 50, 100],
  onRowsPerPageChange,
  page,
  totalPages,
  pagePrefixLabel,
  pageOfLabel,
  onPageChange,
  className = "",
}: PaginationFooterProps) {
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowsDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRowsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [rowsDropdownOpen]);

  return (
    <div className={cn("py-3 px-5 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/30 dark:bg-transparent", className)}>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{totalLabel}</span>

        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{rowsLabel}</span>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 h-7 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 transition-all text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-sm"
              onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
            >
              <span>{rowsPerPage}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            {rowsDropdownOpen && (
              <div className="absolute bottom-full mb-1.5 z-10 min-w-[60px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <ul className="py-1">
                  {rowsOptions.map((option) => (
                    <li
                      key={option}
                      className={cn(
                        "px-3 py-2 text-[11px] font-bold tabular-nums cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-center",
                        rowsPerPage === option ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-300",
                      )}
                      onClick={() => {
                        onRowsPerPageChange(option);
                        setRowsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
          {pagePrefixLabel} <span className="text-slate-900 dark:text-slate-200">{page}</span> {pageOfLabel} {totalPages}
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
          <button
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft size={13} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft size={13} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            <ChevronRight size={13} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-90"
            disabled={page >= totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight size={13} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
