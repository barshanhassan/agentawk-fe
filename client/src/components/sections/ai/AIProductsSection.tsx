import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import {
  Cpu,
  Plus,
  Trash2,
  QrCode,
  Link as LinkIcon,
  Edit2,
  ChevronLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AIProduct {
  id?: string | number;
  name: string;
  trigger_text?: string;
  payload?: string;
  trigger_url?: string;
  properties?: string | Record<string, any>;
  ai_theme_id?: string | number;
}

interface AITheme {
  id: string | number;
  name: string;
  subtitle?: string;
  type?: string;
}

import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function AIProductsSection() {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<"list" | "manage_theme" | "edit_product">("list");
  const [selectedTheme, setSelectedTheme] = useState<AITheme | null>(null);
  const [currentProduct, setCurrentProduct] = useState<AIProduct | null>(null);
  const [deleteTheme, setDeleteTheme] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

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
  const { data: themes, isLoading: themesLoading } = useQuery({
    queryKey: ["/api/ai/themes"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/ai/themes");
      return res.json();
    },
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/ai/themes", selectedTheme?.id, "products"],
    queryFn: async () => {
      const themeId = selectedTheme?.id;
      if (!themeId) return [];
      const res = await apiRequest("GET", `/api/ai/themes/${themeId}/products`);
      return res.json();
    },
    enabled: !!selectedTheme && viewMode !== "list",
  });

  // Mutations
  const createThemeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/ai/themes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/themes"] });
      toast({ title: "Created", description: "AI Theme created successfully." });
    },
  });

  const deleteThemeMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/ai/themes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/themes"] });
      toast({ title: "Deleted", description: "Theme and associated products removed." });
      setViewMode("list");
      setSelectedTheme(null);
      setDeleteTheme(false);
    },
  });

  const saveProductMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!selectedTheme) throw new Error("No theme selected");
      const res = await apiRequest("POST", "/api/ai/products", { ...data, ai_theme_id: selectedTheme.id });
      return res.json();
    },
    onSuccess: () => {
      if (selectedTheme) {
        queryClient.invalidateQueries({ queryKey: ["/api/ai/themes", selectedTheme.id, "products"] });
      }
      toast({ title: "Success", description: "Product saved successfully." });
      setViewMode("manage_theme");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/ai/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/themes", selectedTheme?.id, "products"] });
      toast({ title: "Deleted", description: "Product removed." });
      setProductToDelete(null);
    },
  });

  const handleManageTheme = (theme: any) => {
    setSelectedTheme(theme);
    setViewMode("manage_theme");
  };

  const handleCreateProduct = () => {
    setCurrentProduct({ name: "", trigger_text: "", payload: "", properties: {} });
    setViewMode("edit_product");
  };

  const handleEditProduct = (product: any) => {
    setCurrentProduct({ ...product });
    setViewMode("edit_product");
  };

  const handleSaveProduct = () => {
    if (!currentProduct) return;
    saveProductMutation.mutate(currentProduct);
  };

  const ThemeIcon = ({ type, className = "w-7 h-7" }: { type?: string; className?: string }) => {
    const [error, setError] = useState(false);
    if (!type || error) return <Cpu className={cn(className, "text-primary")} />;
    return (
      <img
        src={`/images/integrations/${type}.png`}
        className={cn(className, "object-contain")}
        alt={type}
        onError={() => setError(true)}
      />
    );
  };

  // Header content per view
  const headerTitle =
    viewMode === "edit_product"
      ? currentProduct?.id
        ? "Edit Product"
        : "New Product"
      : viewMode === "manage_theme"
        ? selectedTheme?.name || "Manage Theme"
        : "AI Products";
  const headerSub =
    viewMode === "edit_product"
      ? selectedTheme?.name || "Configure your product"
      : viewMode === "manage_theme"
        ? selectedTheme?.subtitle || "Manage products in this theme"
        : "Organize and manage your AI Products";

  return (
    <>
      <Card className={cn("rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300", card, border)}>
        <CardContent className="p-0">
          {/* Header — dynamic per view */}
          <div className={cn("px-8 py-5 border-b flex items-center justify-between", border)}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl shadow-sm", "bg-primary/10")}>
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className={cn("text-[15px] font-black tracking-widest uppercase", text)}>{headerTitle}</h1>
                <p className={cn("text-[11px] font-bold mt-0.5 opacity-60 max-w-2xl", sub)}>{headerSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {viewMode === "list" && (
                <button
                  onClick={() => createThemeMutation.mutate({ name: "New Inventory", subtitle: "Managed items", type: "baserow" })}
                  className={primaryOutlineBtn}
                >
                  <Plus size={12} /> Add Theme
                </button>
              )}
              {viewMode === "manage_theme" && (
                <>
                  <button onClick={handleCreateProduct} className={primaryOutlineBtn}>
                    <Plus size={12} /> Add Product
                  </button>
                  <button onClick={() => setDeleteTheme(true)} className={cn(outlineBtn, "hover:!border-rose-500/40 hover:!text-rose-500")}>
                    <Trash2 size={12} /> Delete
                  </button>
                  <button onClick={() => { setViewMode("list"); setSelectedTheme(null); }} className={outlineBtn}>
                    <ChevronLeft size={12} /> Back
                  </button>
                </>
              )}
              {viewMode === "edit_product" && (
                <button onClick={() => setViewMode("manage_theme")} className={outlineBtn}>
                  <ChevronLeft size={12} /> Back
                </button>
              )}
            </div>
          </div>

          {/* ── LIST VIEW (Themes grid) ── */}
          {viewMode === "list" && (
            <div className="p-8">
              {themesLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : themes && themes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {themes.map((theme: any) => (
                    <div
                      key={theme.id}
                      className={cn(
                        "p-6 rounded-[1.5rem] border transition-all hover:shadow-md hover:border-primary/40 flex flex-col",
                        softBg,
                        softBorder
                      )}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <ThemeIcon type={theme.type} />
                      </div>
                      <h3 className={cn("text-[14px] font-black tracking-tight mb-1", text)}>{theme.name}</h3>
                      <p className={cn("text-[11px] font-medium opacity-70 leading-relaxed mb-5 flex-1 line-clamp-2", sub)}>
                        {theme.subtitle}
                      </p>
                      <button onClick={() => handleManageTheme(theme)} className={cn(primaryOutlineBtn, "self-end")}>
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn("rounded-[1.5rem] border py-16 px-8 flex flex-col items-center justify-center text-center space-y-5", softBg, softBorder)}>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className={cn("text-[14px] font-black tracking-tight", text)}>No AI Products found</h3>
                    <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
                      You haven't created any AI products yet. Create one to get started with automation.
                    </p>
                  </div>
                  <button
                    onClick={() => createThemeMutation.mutate({ name: "New Inventory", subtitle: "Managed items", type: "baserow" })}
                    className={primaryOutlineBtn}
                  >
                    <Plus size={12} /> Add Theme
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── MANAGE THEME (Products table) ── */}
          {viewMode === "manage_theme" && (
            <div className="p-8">
              {productsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : products && products.length > 0 ? (
                <div className={cn("rounded-[1.5rem] border overflow-hidden", softBorder, softBg)}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={cn("border-b", softBorder, dark ? "bg-slate-900/40" : "bg-white/60")}>
                          <th className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", sub)}>Name</th>
                          <th className={cn("px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest", sub)}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product: any) => (
                          <tr
                            key={product.id}
                            className={cn("border-b transition-colors", softBorder, dark ? "hover:bg-slate-900/40" : "hover:bg-white/80")}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                  <Cpu size={14} className="text-primary" />
                                </div>
                                <span className={cn("text-[13px] font-black", text)}>{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => toast({ title: "QR Code", description: "QR code for this product." })}
                                  className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary text-slate-400" : "border-slate-200 hover:border-primary/40 hover:text-primary text-slate-500")}
                                  title="QR Code"
                                >
                                  <QrCode size={13} />
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(product.trigger_url || "");
                                    toast({ title: "Copied", description: "Trigger URL copied to clipboard." });
                                  }}
                                  className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-cyan-500/40 hover:text-cyan-500 text-slate-400" : "border-slate-200 hover:border-cyan-500/40 hover:text-cyan-500 text-slate-500")}
                                  title="Copy Link"
                                >
                                  <LinkIcon size={13} />
                                </button>
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-primary/40 hover:text-primary text-slate-400" : "border-slate-200 hover:border-primary/40 hover:text-primary text-slate-500")}
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(product)}
                                  className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", dark ? "border-slate-800 hover:border-rose-500/40 hover:text-rose-500 text-slate-400" : "border-slate-200 hover:border-rose-500/40 hover:text-rose-500 text-slate-500")}
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={cn("px-6 py-3 border-t text-[10px] font-black uppercase tracking-widest", softBorder, sub, dark ? "bg-slate-900/40" : "bg-white/60")}>
                    Showing {products.length} of {products.length} products
                  </div>
                </div>
              ) : (
                <div className={cn("rounded-[1.5rem] border py-16 px-8 flex flex-col items-center justify-center text-center space-y-5", softBg, softBorder)}>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className={cn("text-[14px] font-black tracking-tight", text)}>No products found</h3>
                    <p className={cn("text-[11px] font-medium opacity-60 leading-relaxed", sub)}>
                      Create a product to get started.
                    </p>
                  </div>
                  <button onClick={handleCreateProduct} className={primaryOutlineBtn}>
                    <Plus size={12} /> Create Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── EDIT PRODUCT ── */}
          {viewMode === "edit_product" && (
            <div className="p-8">
              <div className={cn("rounded-[1.5rem] border p-8 space-y-6", softBg, softBorder)}>
                <div className="max-w-2xl space-y-6">
                  <div className="space-y-2">
                    <label className={labelCls}>
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={currentProduct?.name || ""}
                      onChange={(e) => setCurrentProduct((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                      placeholder="Product name"
                      className={inputCls}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Trigger URL</label>
                    <input
                      readOnly
                      value={currentProduct?.trigger_url || "Generated after save"}
                      className={cn(inputCls, "font-mono text-[12px] opacity-60")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelCls}>Payload</label>
                    <input
                      value={currentProduct?.payload || ""}
                      onChange={(e) => setCurrentProduct((prev) => (prev ? { ...prev, payload: e.target.value } : null))}
                      placeholder="Optional JSON payload"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className={cn("flex justify-end gap-2 pt-6 border-t", softBorder)}>
                  <button onClick={() => setViewMode("manage_theme")} className={outlineBtn}>
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={!currentProduct?.name || saveProductMutation.isPending}
                    className={primaryBtn}
                  >
                    {saveProductMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                    {currentProduct?.id ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Delete Theme Dialog ── */}
      <AlertDialog open={deleteTheme} onOpenChange={setDeleteTheme}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Theme?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  <span className="text-rose-500 font-black">{selectedTheme?.name || "This theme"}</span> and all associated products will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedTheme && deleteThemeMutation.mutate(selectedTheme.id)}
                className="h-11 px-7 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Product Dialog ── */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent className={cn("rounded-[2rem] border p-0 max-w-md overflow-hidden", card, border)}>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 className={cn("text-[13px] font-black uppercase tracking-widest", text)}>Delete Product?</h2>
                <p className={cn("text-[11px] font-medium opacity-60 mt-0.5 leading-relaxed", sub)}>
                  <span className="text-rose-500 font-black">{productToDelete?.name || "This product"}</span> will be permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel className={cn(outlineBtn, "m-0")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteProductMutation.mutate(productToDelete.id)}
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
