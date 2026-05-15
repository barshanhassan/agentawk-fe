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
import { Globe, Edit2, Trash2, Plus, Loader2, ChevronLeft, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function IframeSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [menuText, setMenuText] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
  const [menuTitleInput, setMenuTitleInput] = useState("");
  const [iframeToDelete, setIframeToDelete] = useState<any>(null);

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

  const textareaCls = cn(
    "w-full rounded-xl text-[12px] font-mono transition-all px-4 py-3 border outline-none resize-none",
    "focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  );

  const outlineBtn = cn(
    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
    dark ? "border-slate-800 text-slate-300 hover:border-primary/40 hover:text-primary" : "border-slate-200 text-slate-700 hover:border-primary/40 hover:text-primary"
  );

  const primaryOutlineBtn = cn(
    "h-10 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    "border-primary text-primary hover:bg-primary hover:text-white"
  );

  const primaryBtn =
    "h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2";

  const labelCls = cn("block text-[10px] font-black uppercase tracking-widest", sub);

  const { data, isLoading } = useQuery<{ iframes: any[]; menu_title: string }>({
    queryKey: ["/api/iframes"],
  });

  const iframes = data?.iframes || [];
  const menuTitle = data?.menu_title || "Iframes";

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiRequest("POST", "/api/iframes", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iframes"] });
      toast({ title: "Success", description: "Iframe saved successfully" });
      setIsCreateOpen(false);
      setName("");
      setMenuText("");
      setHtmlCode("");
      setEditingId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/iframes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iframes"] });
      toast({ title: "Success", description: "Iframe deleted successfully" });
      setIframeToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const titleMutation = useMutation({
    mutationFn: async (title: string) => {
      await apiRequest("POST", "/api/iframes/menu-title", { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/iframes"] });
      toast({ title: "Success", description: "Menu title updated successfully" });
      setIsEditTitleModalOpen(false);
    },
  });

  const handleSave = () => {
    if (name.trim() && menuText.trim() && htmlCode.trim()) {
      saveMutation.mutate({ id: editingId, name, menu_text: menuText, html_code: htmlCode });
    }
  };

  const handleEditIframe = (iframe: any) => {
    setName(iframe.name);
    setMenuText(iframe.menu_text);
    setHtmlCode(iframe.html_code);
    setEditingId(iframe.id);
    setIsCreateOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setMenuText("");
    setHtmlCode("");
    setIsCreateOpen(true);
  };

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header — dynamic per view */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>
                  {isCreateOpen ? (editingId ? "Edit Iframe" : "Create Iframe") : menuTitle}
                </h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>
                  Embed another webpage or resource inside your current page.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isCreateOpen ? (
                <>
                  <button onClick={() => setIsEditTitleModalOpen(true)} className={outlineBtn}>
                    <Edit2 size={12} /> Edit Menu Title
                  </button>
                  <button onClick={openCreate} disabled={iframes.length >= 3} className={primaryOutlineBtn}>
                    <Plus size={12} /> Add New
                  </button>
                </>
              ) : (
                <button onClick={() => setIsCreateOpen(false)} className={outlineBtn}>
                  <ChevronLeft size={12} /> Back
                </button>
              )}
            </div>
          </div>

          {/* ── LIST VIEW ── */}
          {!isCreateOpen && (
            <div className="p-8">
              <div className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
                <div className={cn("px-6 py-3 border-b text-[10px] font-black uppercase tracking-widest", softBorder, sub, dark ? "bg-slate-900/40" : "bg-white/60")}>
                  You can create a maximum of 3 items
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={cn("border-b", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                        <th className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", sub)}>Name</th>
                        <th className={cn("px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest", sub)}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={2} className="px-6 py-12 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                          </td>
                        </tr>
                      ) : iframes.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <Globe className="w-7 h-7 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <h3 className={cn("text-[13px] font-black", text)}>No iframes yet</h3>
                                <p className={cn("text-[11px] font-medium opacity-60", sub)}>
                                  Click "Add New" to embed your first iframe.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        iframes.map((iframe: any) => (
                          <tr
                            key={iframe.id}
                            className={cn("border-b transition-colors", softBorder, dark ? "hover:bg-slate-900/40" : "hover:bg-white/80")}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                  <Globe size={14} className="text-primary" />
                                </div>
                                <span className={cn("text-[13px] font-black", text)}>{iframe.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditIframe(iframe)}
                                  className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary text-slate-400" : "border-slate-200 hover:border-primary/40 hover:text-primary text-slate-500")}
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => setIframeToDelete(iframe)}
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
                  Showing {iframes.length} of {iframes.length} iframes
                </div>
              </div>
            </div>
          )}

          {/* ── CREATE / EDIT FORM ── */}
          {isCreateOpen && (
            <div className="p-8">
              <div className={cn("rounded-[1.5rem] border p-8 space-y-6", softBg, softBorder)}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className={labelCls}>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Enter iframe name" />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Sidebar Menu Text</label>
                    <input value={menuText} onChange={(e) => setMenuText(e.target.value)} className={inputCls} placeholder="Text shown in the sidebar" />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>HTML Code</label>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      rows={10}
                      className={textareaCls}
                      placeholder="Paste your embed / iframe HTML here..."
                    />
                  </div>
                </div>

                <div className={cn("flex justify-end gap-2 pt-6 border-t", softBorder)}>
                  <button onClick={() => setIsCreateOpen(false)} className={outlineBtn}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!name || !menuText || !htmlCode || saveMutation.isPending}
                    className={primaryBtn}
                  >
                    {saveMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Edit Menu Title Modal ── */}
      <Dialog open={isEditTitleModalOpen} onOpenChange={setIsEditTitleModalOpen}>
        <DialogContent className={cn("border p-0 overflow-hidden rounded-[2rem] max-w-md", card, border)}>
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Edit2 size={18} />
                </div>
                <div className="text-left">
                  <DialogTitle className={cn("text-[13px] font-black uppercase tracking-widest", text)}>
                    Edit Menu Title
                  </DialogTitle>
                  <DialogDescription className={cn("text-[11px] font-medium opacity-60 mt-0.5", sub)}>
                    Change the label shown in the sidebar.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-2">
              <label className={labelCls}>Menu Title</label>
              <input
                value={menuTitleInput || menuTitle}
                onChange={(e) => setMenuTitleInput(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className={cn("flex justify-end gap-2 pt-4 border-t", softBorder)}>
              <button onClick={() => setIsEditTitleModalOpen(false)} className={outlineBtn}>
                Cancel
              </button>
              <button
                onClick={() => titleMutation.mutate(menuTitleInput || menuTitle)}
                disabled={titleMutation.isPending}
                className={primaryBtn}
              >
                {titleMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={!!iframeToDelete} onOpenChange={(open) => !open && setIframeToDelete(null)}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Iframe?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  <span className="text-rose-500 font-black">{iframeToDelete?.name || "This iframe"}</span> will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(iframeToDelete.id)}
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
