import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Cpu, 
  Plus, 
  Trash2, 
  QrCode, 
  Link as LinkIcon, 
  Pencil, 
  ArrowLeft,
  Info,
  X,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

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

export default function AIProductsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "manage_theme" | "edit_product">("list");
  const [selectedTheme, setSelectedTheme] = useState<AITheme | null>(null);
  const [currentProduct, setCurrentProduct] = useState<AIProduct | null>(null);

  // Queries
  const { data: themes, isLoading: themesLoading } = useQuery({
    queryKey: ["/api/ai/themes"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/ai/themes");
      return res.json();
    }
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/ai/themes", selectedTheme?.id, "products"],
    queryFn: async () => {
      const themeId = selectedTheme?.id;
      if (!themeId) return [];
      const res = await apiRequest("GET", `/api/ai/themes/${themeId}/products`);
      return res.json();
    },
    enabled: !!selectedTheme && viewMode !== "list"
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
    }
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
    }
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
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/ai/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/themes", selectedTheme?.id, "products"] });
      toast({ title: "Deleted", description: "Product removed." });
    }
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

  const ThemeIcon = ({ type, className = "h-12 w-12" }: { type: string | undefined, className?: string }) => {
    const [error, setError] = useState(false);
    if (!type || error) return <Cpu className={`${className} text-blue-500`} />;
    return (
      <img
        src={`/images/integrations/${type}.png`}
        className={`${className} object-contain`}
        alt={type}
        onError={() => setError(true)}
      />
    );
  };

  const renderProductList = () => (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center justify-between pb-6">
        <div className="flex items-center gap-4">
           <div className="p-2 border rounded-lg bg-white dark:bg-slate-800">
             <ThemeIcon type={selectedTheme?.type} className="h-8 w-8" />
           </div>
           <div>
             <h3 className="text-lg font-medium">{selectedTheme?.name}</h3>
             <p className="text-sm text-muted-foreground">{selectedTheme?.subtitle}</p>
           </div>
        </div>
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will delete the theme and all associated products.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => selectedTheme && deleteThemeMutation.mutate(selectedTheme.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={handleCreateProduct} className="btn-outline-primary">Create</Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {productsLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : products && products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                     <span className="text-muted-foreground"><Cpu className="w-4 h-4" /></span>
                     {product.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => { /* Show QR logic */ }}>
                              <QrCode className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>QR Code</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                       <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => { 
                                navigator.clipboard.writeText(product.trigger_url || "");
                                toast({ title: "Copied", description: "Trigger URL copied to clipboard." });
                             }}>
                              <LinkIcon className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy Link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                             <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProductMutation.mutate(product.id)} className="bg-red-600">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
             <h3 className="text-lg font-medium text-foreground">No Products Found</h3>
             <p>Create a product to get started.</p>
             <Button variant="outline" onClick={handleCreateProduct} className="mt-4 btn-outline-primary">Create</Button>
          </div>
        )}
      </div>
       <div className="mt-4">
          <Button variant="outline" onClick={() => setViewMode("list")}>Back to Themes</Button>
       </div>
    </div>
  );

  const renderProductEditor = () => (
    <div className="flex flex-col h-full max-w-3xl">
       <div className="flex flex-row items-center justify-between pb-6">
        <div className="flex items-center gap-4">
           <div className="p-2 border rounded-lg bg-white dark:bg-slate-800">
             <ThemeIcon type={selectedTheme?.type} className="h-8 w-8" />
           </div>
           <div>
             <h3 className="text-lg font-medium">{currentProduct?.id ? "Edit Product" : "New Product"}</h3>
             <p className="text-sm text-muted-foreground">{selectedTheme?.name}</p>
           </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode("manage_theme")}>Back</Button>
        </div>
      </div>

      <div className="space-y-6">
         <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium leading-none">Name <span className="text-red-500">*</span></label>
            <Input 
              value={currentProduct?.name || ""} 
              onChange={(e) => setCurrentProduct((prev: AIProduct | null) => prev ? ({...prev, name: e.target.value}) : null)}
              placeholder="Product Name" 
            />
         </div>

         <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              Trigger URL
            </label>
            <Input 
              readOnly
              value={currentProduct?.trigger_url || "Generated after save"} 
              className="bg-muted font-mono text-sm"
            />
         </div>

         <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              Payload
            </label>
            <Input 
               value={currentProduct?.payload || ""} 
               onChange={(e) => setCurrentProduct((prev: AIProduct | null) => prev ? ({...prev, payload: e.target.value}) : null)}
               placeholder="optional JSON payload"
            />
         </div>

         <div className="flex justify-end gap-3 pt-6">
            <Button variant="secondary" onClick={() => setViewMode("manage_theme")}>Cancel</Button>
            <Button 
                onClick={handleSaveProduct} 
                disabled={!currentProduct?.name || saveProductMutation.isPending} 
                variant="outline" 
                className="btn-outline-primary h-9 px-6 font-medium"
            >
               {saveProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {currentProduct?.id ? "Update" : "Create"}
            </Button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col">
      {viewMode === "list" && (
        <>
          <div className="flex flex-row items-center justify-between pb-6">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                 <Cpu className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-lg font-medium">AI Products</h3>
                 <p className="text-sm text-muted-foreground">Organize and manage your AI Products</p>
               </div>
            </div>
            <Button variant="outline" className="btn-outline-primary" onClick={() => {
                // In a real app, open a "Create Theme" dialog
                createThemeMutation.mutate({ name: "New Inventory", subtitle: "Managed items", type: "baserow" });
            }}>
                <Plus className="w-4 h-4 mr-2" /> Theme
            </Button>
          </div>
          
          <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

          {themesLoading ? (
            <div className="flex-1 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
          ) : themes && themes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme: any) => (
                <div
                  key={theme.id}
                  className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 flex flex-col hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center mb-4">
                      <div className="border rounded-lg p-2 bg-slate-50 dark:bg-slate-800">
                        <ThemeIcon type={theme.type} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-foreground">
                        {theme.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {theme.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t flex justify-end">
                    <Button variant="outline" onClick={() => handleManageTheme(theme)} className="btn-outline-primary">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
               <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <Cpu className="h-10 w-10 text-slate-400" />
               </div>
               <h3 className="text-lg font-semibold mb-2">No AI Products Found</h3>
               <p className="text-muted-foreground max-w-sm mb-6">
                 You haven't created any AI products yet. Create one to get started with automation.
               </p>
            </div>
          )}
        </>
      )}

      {viewMode === "manage_theme" && renderProductList()}
      {viewMode === "edit_product" && renderProductEditor()}
    </div>
  );
}
