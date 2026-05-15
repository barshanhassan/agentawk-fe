import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import {
  Edit2,
  Trash2,
  Copy,
  Database,
  ChevronDown,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function CustomFieldsSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<any>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    systemName: "",
    description: "",
    dataType: "",
  });

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

  const textareaCls = cn(
    "w-full rounded-xl text-[13px] font-medium transition-all px-4 py-3 border outline-none resize-none",
    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
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

  const { data, isLoading } = useQuery<{ fields: any[]; folders: any[] }>({
    queryKey: ["/api/custom-fields"],
  });

  const fields = data?.fields || [];

  const createMutation = useMutation({
    mutationFn: async (newField: any) => {
      const res = await apiRequest("POST", "/api/custom-fields/field", newField);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-fields"] });
      toast({ title: "Success", description: "Custom field created successfully" });
      setIsCreateFieldOpen(false);
      setFormData({ displayName: "", systemName: "", description: "", dataType: "" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      await apiRequest("DELETE", `/api/custom-fields/field/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-fields"] });
      toast({ title: "Success", description: "Custom field deleted successfully" });
      setFieldToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(new Set(fields.map((f) => f.id)));
    else setSelectedRows(new Set());
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedRows);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedRows(next);
  };

  const handleCreateField = () => {
    if (formData.displayName.trim() && formData.systemName.trim() && formData.dataType) {
      createMutation.mutate({
        label: formData.displayName,
        system_name: formData.systemName,
        description: formData.description,
        content_type: formData.dataType.toUpperCase(),
        input_type: formData.dataType === "number" ? "number" : "text",
        creating_for: "CONTACT",
      });
    }
  };

  const isAllSelected = selectedRows.size === fields.length && fields.length > 0;

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>Custom Fields</h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  Manage custom fields and link them to Contacts, Companies, or Opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setIsCreateFieldOpen(true)} className={primaryOutlineBtn}>
                <Plus size={12} /> Add New
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
              {/* Toolbar */}
              <div className={cn("px-6 py-4 border-b flex items-center justify-between gap-4", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", sub)}>Root</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <button
                    onClick={() => setIsCreateFieldOpen(true)}
                    className={cn("ml-1 w-7 h-7 rounded-md flex items-center justify-center transition-colors", dark ? "hover:bg-slate-800 text-slate-400 hover:text-primary" : "hover:bg-slate-100 text-slate-500 hover:text-primary")}
                    title="Add new folder"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", sub)}>
                    {fields.length} of 50
                  </span>
                  <button className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-colors", softBorder, dark ? "hover:border-primary/40 text-slate-400 hover:text-primary" : "hover:border-primary/40 text-slate-500 hover:text-primary")}>
                    Content Type <ChevronDown size={12} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn("border-b", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                      <th className="px-6 py-4 text-left w-10">
                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="rounded accent-[hsl(var(--primary))]" />
                      </th>
                      <th className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", sub)}>Name</th>
                      <th className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", sub)}>ID</th>
                      <th className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", sub)}>Content Type</th>
                      <th className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", sub)}>Data Format</th>
                      <th className={cn("px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest", sub)}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                        </td>
                      </tr>
                    ) : fields.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                              <Database className="w-7 h-7 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className={cn("text-[13px] font-black", text)}>No custom fields yet</h3>
                              <p className={cn("text-[11px] font-medium opacity-60", sub)}>
                                Create your first custom field to get started.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      fields.map((field: any) => (
                        <tr
                          key={field.id}
                          className={cn("border-b transition-colors", softBorder, dark ? "hover:bg-slate-900/40" : "hover:bg-white/80")}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedRows.has(field.id.toString())}
                              onChange={(e) => handleSelectRow(field.id.toString(), e.target.checked)}
                              className="rounded accent-[hsl(var(--primary))]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-black text-primary">{field.label}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <code className={cn("text-[11px] font-bold", sub)}>{field.slug}</code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(field.slug);
                                  toast({ title: "Copied", description: "Field ID copied." });
                                }}
                                className={cn("w-6 h-6 rounded-md flex items-center justify-center transition-colors", dark ? "hover:bg-slate-800 text-slate-500 hover:text-primary" : "hover:bg-slate-100 text-slate-400 hover:text-primary")}
                                title="Copy ID"
                              >
                                <Copy size={11} />
                              </button>
                            </div>
                          </td>
                          <td className={cn("px-6 py-4 text-[12px] font-bold", sub)}>{field.content_type}</td>
                          <td className={cn("px-6 py-4 text-[12px] font-bold", sub)}>{field.input_type}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toast({ title: "Edit", description: "Edit custom field." })}
                                className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary text-slate-400" : "border-slate-200 hover:border-primary/40 hover:text-primary text-slate-500")}
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => setFieldToDelete(field)}
                                className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-rose-500/40 hover:text-rose-500 text-slate-400" : "border-slate-200 hover:border-rose-500/40 hover:text-rose-500 text-slate-500")}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className={cn("px-6 py-3 border-t text-[10px] font-black uppercase tracking-widest", softBorder, sub, dark ? "bg-slate-900/40" : "bg-white/60")}>
                Showing {fields.length} of {fields.length} custom fields
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Create Field Modal ── */}
      <Dialog open={isCreateFieldOpen} onOpenChange={setIsCreateFieldOpen}>
        <DialogContent className={cn("border p-0 overflow-hidden rounded-[2rem] max-w-md", card, border)}>
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Database size={18} />
                </div>
                <div className="text-left">
                  <DialogTitle className={cn("text-[13px] font-black uppercase tracking-widest", text)}>
                    Create Custom Field
                  </DialogTitle>
                  <DialogDescription className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                    Define a new field to collect data.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className={labelCls}>Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className={inputCls}
                  placeholder="Enter display name"
                />
              </div>

              <div className="space-y-2">
                <label className={labelCls}>System Name</label>
                <input
                  type="text"
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className={inputCls}
                  placeholder="Enter system name"
                />
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={textareaCls}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Data Type</label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                  className={selectCls}
                >
                  <option value="">Select data type</option>
                  <option value="text">Text</option>
                  <option value="number">Numbers</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Phone</option>
                  <option value="date">Date</option>
                  <option value="datetime">Datetime</option>
                  <option value="url">URL</option>
                  <option value="country">Country</option>
                  <option value="currency">Currency</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            <div className={cn("flex justify-end gap-2 pt-4 border-t", softBorder)}>
              <button
                onClick={() => {
                  setIsCreateFieldOpen(false);
                  setFormData({ displayName: "", systemName: "", description: "", dataType: "" });
                }}
                className={outlineBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateField}
                disabled={!formData.displayName.trim() || !formData.systemName.trim() || !formData.dataType || createMutation.isPending}
                className={primaryBtn}
              >
                {createMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={!!fieldToDelete} onOpenChange={(open) => !open && setFieldToDelete(null)}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Field?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  <span className="text-rose-500 font-black">{fieldToDelete?.label || "This field"}</span> will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(fieldToDelete.slug)}
                className="h-11 px-7 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
