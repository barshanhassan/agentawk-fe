import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Edit2,
} from "react-feather";
import {
  ChevronsUpDown,
  ChevronDown,
  ChevronUp,
  Plus,
  MoreVertical,
  Loader2,
  Tag as TagIcon,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

type TagStatus = "Active" | "Inactive";

interface Tag {
  id: string;
  name: string;
  status: TagStatus;
  lastEdited: string;
}

export default function TagsSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<TagStatus | "">("");

  // ── Design tokens ─────────────────────────────────────────
  const card       = dark ? "bg-[#0f1829]"    : "bg-white";
  const border     = dark ? "border-slate-800" : "border-slate-200";
  const text       = dark ? "text-white"      : "text-slate-900";
  const sub        = dark ? "text-slate-500"  : "text-slate-400";
  const softBg     = dark ? "bg-slate-950/40" : "bg-slate-50/50";
  const softBorder = dark ? "border-slate-800" : "border-slate-100";

  const inputCls = cn(
    "w-full h-11 rounded-xl text-[13px] font-bold transition-all px-4 border outline-none",
    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  );

  const selectCls = cn(
    inputCls,
    "appearance-none cursor-pointer pr-10 bg-no-repeat",
    dark
      ? "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')]"
      : "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')]",
    "[background-position:right_1rem_center]"
  );

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary"
  );

  const primaryOutlineBtn = cn(
    "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    "border-primary text-primary hover:bg-primary hover:text-white"
  );

  const primaryBtn =
    "h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2";

  const labelCls = cn("block text-[10px] font-black uppercase tracking-widest", sub);

  // Queries
  const { data: tagsData, isLoading } = useQuery<any>({
    queryKey: ["/api/tags/list"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tags/list");
      return res.json();
    },
  });

  const allTags: Tag[] = (tagsData?.tags || []).map((t: any) => ({
    id: t.id.toString(),
    name: t.name,
    status: t.status || "Active",
    lastEdited: t.updated_at
      ? new Date(t.updated_at).toISOString().split("T")[0]
      : t.created_at
        ? new Date(t.created_at).toISOString().split("T")[0]
        : "-",
  }));

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/tags", { name, status: "Active" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags/list"] });
      toast({ title: "Success", description: "Tag created successfully!" });
      setShowCreateModal(false);
      setNewName("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/tags/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags/list"] });
      toast({ title: "Success", description: "Tag updated successfully!" });
      setShowEditModal(false);
      setEditingItem(null);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags/list"] });
      toast({ title: "Success", description: "Tag deleted successfully!" });
      setShowDeleteModal(false);
      setItemToDelete(null);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Tag | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<TagStatus>("Active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Tag | null>(null);

  const handleColumnSort = (column: string) => {
    if (sort?.column === column) {
      if (sort.direction === "asc") setSort({ column, direction: "desc" });
      else setSort(null);
    } else {
      setSort({ column, direction: "asc" });
    }
  };

  const renderSortIcon = (column: string) => {
    const isActive = sort?.column === column;
    if (!isActive) return <ChevronsUpDown size={12} className="opacity-40" />;
    if (sort?.direction === "asc") return <ChevronUp size={12} className="text-primary" />;
    return <ChevronDown size={12} className="text-primary" />;
  };

  const getFilteredAndSortedData = () => {
    let data = [...allTags];
    if (search) data = data.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus) data = data.filter((i) => i.status === filterStatus);
    if (sort) {
      data.sort((a, b) => {
        const aVal = a[sort.column as keyof Tag];
        const bVal = b[sort.column as keyof Tag];
        let cmp = 0;
        if (typeof aVal === "string" && typeof bVal === "string") cmp = aVal.localeCompare(bVal);
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return data;
  };

  const filteredAndSorted = getFilteredAndSortedData();
  const totalFilteredItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredItems / rowsPerPage));
  const paginatedData = filteredAndSorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleEdit = (item: Tag) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditStatus(item.status);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      toast({ title: "Missing Fields", description: "Please enter a tag name.", variant: "destructive" });
      return;
    }
    createMutation.mutate(newName);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast({ title: "Missing Fields", description: "Please enter a tag name.", variant: "destructive" });
      return;
    }
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: { name: editName, status: editStatus } });
  };

  const thCls = cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest cursor-pointer select-none", sub);

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
                <TagIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Tags</h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  Create tags to categorize your conversations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowCreateModal(true)} className={primaryOutlineBtn}>
                <Plus size={12} /> Add Tag
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-5">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", sub)} />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(inputCls, "pl-11")}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TagStatus | "")}
                className={cn(selectCls, "max-w-[160px]")}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Table */}
            <div className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn("border-b", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                      <th className={thCls} onClick={() => handleColumnSort("name")}>
                        <div className="flex items-center gap-2">Name {renderSortIcon("name")}</div>
                      </th>
                      <th className={thCls} onClick={() => handleColumnSort("status")}>
                        <div className="flex items-center gap-2">Status {renderSortIcon("status")}</div>
                      </th>
                      <th className={thCls} onClick={() => handleColumnSort("lastEdited")}>
                        <div className="flex items-center gap-2">Last Edited {renderSortIcon("lastEdited")}</div>
                      </th>
                      <th className={cn("px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest", sub)}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                        </td>
                      </tr>
                    ) : paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                              <TagIcon className="w-7 h-7 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className={cn("text-[13px] font-black", text)}>No tags found</h3>
                              <p className={cn("text-[11px] font-medium opacity-60", sub)}>
                                Create your first tag to categorize conversations.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr
                          key={item.id}
                          className={cn("border-b transition-colors", softBorder, dark ? "hover:bg-slate-900/40" : "hover:bg-white/80")}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <TagIcon size={14} className="text-primary" />
                              </div>
                              <span className={cn("text-[13px] font-black break-all", text)}>{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex h-5 px-2 items-center rounded-md text-[9px] font-black uppercase tracking-widest border",
                                item.status === "Active"
                                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                  : "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400"
                              )}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className={cn("px-6 py-4 text-[12px] font-bold", sub)}>{item.lastEdited}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary text-slate-400" : "border-slate-200 hover:border-primary/40 hover:text-primary text-slate-500")}>
                                    <MoreVertical size={14} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={cn("rounded-xl border p-1.5 w-40", card, border)}>
                                  <DropdownMenuItem onClick={() => handleEdit(item)} className="rounded-lg text-[12px] font-bold py-2 px-3 flex gap-2 cursor-pointer">
                                    <Edit2 size={13} /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => { setItemToDelete(item); setShowDeleteModal(true); }}
                                    className="rounded-lg text-[12px] font-bold py-2 px-3 flex gap-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoading && (
                <div className={cn("px-6 py-3 border-t flex items-center justify-between flex-wrap gap-3", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", sub)}>
                    {totalFilteredItems} results
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", sub)}>Rows</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                      className={cn(selectCls, "h-8 w-20 text-[11px] px-3")}
                    >
                      {[10, 25, 50].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", sub)}>
                      Page {page} of {totalPages}
                    </span>
                    <div className="flex gap-1">
                      {[
                        { Icon: ChevronsLeft, onClick: () => setPage(1), disabled: page === 1 },
                        { Icon: ChevronLeft, onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
                        { Icon: ChevronRight, onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages || totalFilteredItems === 0 },
                        { Icon: ChevronsRight, onClick: () => setPage(totalPages), disabled: page === totalPages || totalFilteredItems === 0 },
                      ].map(({ Icon, onClick, disabled }, i) => (
                        <button
                          key={i}
                          onClick={onClick}
                          disabled={disabled}
                          className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-all disabled:opacity-40", softBorder, dark ? "hover:border-primary/40 hover:text-primary text-slate-400" : "hover:border-primary/40 hover:text-primary text-slate-500")}
                        >
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Create Modal ── */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className={cn("border p-0 overflow-hidden rounded-[2rem] max-w-md", card, border)}>
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <TagIcon size={18} />
                </div>
                <div className="text-left">
                  <DialogTitle className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Create Tag</DialogTitle>
                  <DialogDescription className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                    Add a new tag to categorize conversations.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-2">
              <label className={labelCls}>Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  placeholder="Enter tag name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.slice(0, 100))}
                  className={cn(inputCls, "pr-16")}
                />
                <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold", sub)}>
                  {newName.length}/100
                </span>
              </div>
            </div>

            <div className={cn("flex justify-end gap-2 pt-4 border-t", softBorder)}>
              <button onClick={() => setShowCreateModal(false)} className={outlineBtn}>Cancel</button>
              <button onClick={handleCreate} disabled={createMutation.isPending} className={primaryBtn}>
                {createMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                <Plus size={12} /> Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Modal ── */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className={cn("border p-0 overflow-hidden rounded-[2rem] max-w-md", card, border)}>
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Edit2 size={18} />
                </div>
                <div className="text-left">
                  <DialogTitle className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Edit Tag</DialogTitle>
                  <DialogDescription className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                    Update tag name and status.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className={labelCls}>Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    placeholder="Enter tag name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value.slice(0, 100))}
                    className={cn(inputCls, "pr-16")}
                  />
                  <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold", sub)}>
                    {editName.length}/100
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Status <span className="text-rose-500">*</span></label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TagStatus)}
                  className={selectCls}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className={cn("flex justify-end gap-2 pt-4 border-t", softBorder)}>
              <button onClick={() => setShowEditModal(false)} className={outlineBtn}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={updateMutation.isPending} className={primaryBtn}>
                {updateMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Tag?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  <span className="text-rose-500 font-black break-all">{itemToDelete?.name || "This tag"}</span> will be permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => itemToDelete && deleteMutation.mutate(itemToDelete.id)}
                disabled={deleteMutation.isPending}
                className="h-11 px-7 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                {deleteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
