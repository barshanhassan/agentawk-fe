import React, { useState } from "react";
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
  Image as ImageIcon
} from "lucide-react";

interface Theme {
  id: string;
  name: string;
  subtitle: string;
  type: string;
}

interface Product {
  id: string;
  name: string;
  trigger_text?: string;
  payload?: string;
  trigger_url?: string;
  properties?: Record<string, any>;
}

const DefaultProductIcon = ({ className = "h-12 w-12" }: { className?: string }) => {
  return (
    <div className={`${className} flex flex-col gap-1 p-0.5`}>
      {/* Top Row - Light Blue */}
      <div className="flex gap-1 flex-1 h-[30%]">
        <div className="w-[30%] bg-[#06b6d4] rounded-[2px]" />
        <div className="flex-1 bg-[#06b6d4] rounded-[2px]" />
      </div>
      {/* Middle Row - Medium Blue */}
      <div className="flex-1 h-[30%] bg-[#3b82f6] rounded-[2px]" />
      {/* Bottom Row - Dark Blue */}
      <div className="flex gap-1 flex-1 h-[30%]">
        <div className="flex-1 bg-[#4f46e5] rounded-[2px]" />
        <div className="w-[25%] bg-[#4f46e5] rounded-[2px]" />
      </div>
    </div>
  );
};

const ThemeIcon = ({ type, className = "h-12 w-12" }: { type: string | undefined, className?: string }) => {
  const [error, setError] = useState(false);

  if (!type || error) {
    return <DefaultProductIcon className={className} />;
  }

  return (
    <img
      src={`/images/integrations/${type}.png`}
      className={`${className} object-contain`}
      alt={type}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default function AIProductsSection() {
  const [viewMode, setViewMode] = useState<"list" | "manage_theme" | "edit_product">("list");
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([
    {
      id: "1",
      name: "Baserow Theme",
      subtitle: "This is a baserow theme for testing",
      type: "baserow",
    },
    {
      id: "2",
      name: "Imoveis Inventory",
      subtitle: "Stock of available properties",
      type: "google_sheets",
    },
    {
      id: "3",
      name: "Vehicle Rental",
      subtitle: "Rental car registration system",
      type: "airtable",
    },
  ]);

  // Mock products state
  const [products, setProducts] = useState<Product[]>([
    { id: "101", name: "Product A", trigger_text: "Show A", trigger_url: "https://example.com/a" },
    { id: "102", name: "Product B", trigger_text: "Show B", trigger_url: "https://example.com/b" },
  ]);

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleManageTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setViewMode("manage_theme");
    // In a real app, you'd fetch products for this theme here
  };

  const handleCreateProduct = () => {
    setCurrentProduct({ id: "", name: "", trigger_text: "", payload: "", properties: {} });
    setViewMode("edit_product");
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct({ ...product });
    setViewMode("edit_product");
  };

  const handleSaveProduct = () => {
    if (!currentProduct) return;
    
    if (currentProduct.id) {
      setProducts(prev => prev.map(p => p.id === currentProduct.id ? currentProduct : p));
    } else {
      setProducts(prev => [...prev, { ...currentProduct, id: Date.now().toString(), trigger_url: "https://example.com/new" }]);
    }
    setViewMode("manage_theme");
  };

  const handleDeleteProduct = (productId: string) => {
     setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleDeleteTheme = () => {
    if (selectedTheme) {
      setThemes(prev => prev.filter(t => t.id !== selectedTheme.id));
      setViewMode("list");
      setSelectedTheme(null);
    }
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
                <AlertDialogAction onClick={handleDeleteTheme} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={handleCreateProduct} className="btn-outline-primary">Create</Button>
        </div>
      </div>

      <div className="border rounded-md">
        {products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
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
                            <Button variant="ghost" size="icon" onClick={() => { /* Copy link logic */ }}>
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
                        <AlertDialogContent key={product.id}> {/* Unique key to force re-render if needed */}
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600">Delete</AlertDialogAction>
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
             <div className="flex justify-center mb-4">
               <img src="/images/integrations/baserow.png" className="h-12 w-12 opacity-50" onError={(e) => e.currentTarget.style.display='none'} alt="" />
             </div>
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
              onChange={(e) => setCurrentProduct(prev => prev ? ({...prev, name: e.target.value}) : null)}
              placeholder="Product Name" 
            />
         </div>

         <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              Trigger Text
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent>Text that triggers this product</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Input 
              value={currentProduct?.trigger_text || ""} 
              onChange={(e) => setCurrentProduct(prev => prev ? ({...prev, trigger_text: e.target.value}) : null)}
            />
         </div>

         <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium leading-none flex items-center gap-2">
              Payload
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                  <TooltipContent>JSON payload for the product</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Input 
               value={currentProduct?.payload || ""} 
               onChange={(e) => setCurrentProduct(prev => prev ? ({...prev, payload: e.target.value}) : null)}
            />
         </div>

         {/* Mock Dynamic Fields */}
         <Separator />
         <div className="space-y-4">
            <h4 className="font-medium">Properties</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Enter description..." />
               </div>
               <div className="space-y-2">
                   <label className="text-sm font-medium">Image Upload</label>
                   <div className="border border-dashed rounded-md p-4 flex items-center justify-center h-[100px] bg-slate-50 dark:bg-slate-900 cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center">
                         <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                         <span className="text-xs text-muted-foreground">Select Image</span>
                      </div>
                   </div>
               </div>
            </div>
         </div>

         <div className="flex justify-end gap-3 pt-6">
            <Button variant="secondary" onClick={() => setViewMode("manage_theme")}>Cancel</Button>
            <Button onClick={handleSaveProduct} disabled={!currentProduct?.name} variant="outline" className="btn-outline-primary h-9 px-6 font-medium">
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
          </div>
          
          <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

          {themes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
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
               <Button variant="outline" className="btn-outline-primary">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Product
               </Button>
            </div>
          )}
        </>
      )}

      {viewMode === "manage_theme" && renderProductList()}
      {viewMode === "edit_product" && renderProductEditor()}
    </div>
  );
}
