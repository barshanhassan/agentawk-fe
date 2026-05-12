import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Book,
  Trash2,
  Globe,
  FileText,
  File,
  Loader2,
  Search,
  Plus
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// Mock Data
const mockKnowledgeBases = [
  { id: 1, name: "Company Policies", status: "PUBLISHED", source_type: "pdf", items: 5 },
  { id: 2, name: "Product Manual", status: "PENDING", source_type: "website", items: 12 },
];

const mockFetchedPages = [
  { page: "https://example.com/about", title: "About Us" },
  { page: "https://example.com/pricing", title: "Pricing" },
  { page: "https://example.com/contact", title: "Contact" },
  { page: "https://example.com/blog/post-1", title: "Blog Post 1" },
  { page: "https://example.com/features", title: "Features" },
];

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AIKnowledgeBaseSection() {
  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: knowledgeBases, isLoading } = useQuery({
    queryKey: ["/api/ai/knowledge-bases"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/ai/knowledge-bases");
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      await apiRequest("DELETE", `/api/ai/knowledge-bases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/knowledge-bases"] });
      toast({ title: "Deleted", description: "Knowledge base removed successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete knowledge base.", variant: "destructive" });
    }
  });

  const [formData, setFormData] = useState<any>({
    id: null,
    name: "",
    source_type: "website",
    website: "",
    web_pages: [],
    selected_pages: [],
    files: [],
    website_content: ""
  });
  
  // Website fetching state
  const [fetching, setFetching] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");
  
  // Validation state
  const [errors, setErrors] = useState<any>({});

  const handleEdit = (kb: any = null) => {
    if (kb) {
      setFormData({
        ...kb,
        website: kb.source_type === 'website' ? (kb.url || '') : '',
        web_pages: [],
        selected_pages: [],
        files: [],
        website_content: kb.source_type === 'text' ? (kb.content || '') : ''
      });
    } else {
      setFormData({
        id: null,
        name: "",
        source_type: "website",
        website: "",
        web_pages: [],
        selected_pages: [],
        files: [],
        website_content: ""
      });
    }
    setErrors({});
    setViewMode("edit");
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData?.name?.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    toast({ title: "Info", description: "Saving knowledge base not fully implemented yet." });
    setViewMode("list");
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleFetchPages = () => {
    if (!formData.website) return;
    setFetching(true);
    // Simulate API call
    setTimeout(() => {
      setFetching(false);
      setFormData((prev: any) => ({
        ...prev,
        web_pages: mockFetchedPages,
        selected_pages: [] // Reset selection on new fetch
      }));
      toast({ title: "Pages Fetched", description: `Found ${mockFetchedPages.length} pages from ${formData.website}.` });
    }, 1500);
  };

  const togglePageSelection = (pageUrl: string) => {
    setFormData((prev: any) => {
      const selected = prev.selected_pages.includes(pageUrl)
        ? prev.selected_pages.filter((p: string) => p !== pageUrl)
        : [...prev.selected_pages, pageUrl];
      return { ...prev, selected_pages: selected };
    });
  };

  const toggleAllPages = (checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      selected_pages: checked ? prev.web_pages.map((p: any) => p.page) : []
    }));
  };

  const handleAddFileMock = () => {
    // Simulate adding a PDF
    const newFile = { id: Date.now(), object_name: `document_${formData.files.length + 1}.pdf` };
    setFormData((prev: any) => ({
      ...prev,
      files: [...prev.files, newFile]
    }));
    toast({ title: "File Added", description: `${newFile.object_name} attached to knowledge base.` });
  };

  const removeFile = (id: number) => {
    setFormData((prev: any) => ({
      ...prev,
      files: prev.files.filter((f: any) => f.id !== id)
    }));
    toast({ title: "File Removed", description: "Document removed from attachments." });
  };

  const filteredPages = formData.web_pages?.filter((p: any) => 
    p.page.toLowerCase().includes(searchUrl.toLowerCase())
  ) || [];

  return (
    <>
      <div className="flex flex-row items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
           <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <img src="/images/integrations/chat_gpt.svg" className="h-8 w-8" alt="AI" />
           </div>
           <div>
             <h3 className="text-lg font-medium">Knowledge Base</h3>
             <p className="text-sm text-muted-foreground">Manage knowledge bases for your AI agents.</p>
           </div>
        </div>
        <div>
          {viewMode === "list" ? (
             <Button onClick={() => handleEdit(null)} className="btn-outline-primary flex items-center gap-2">
               <Plus className="w-4 h-4" />
               Add Knowledge Base
             </Button>
          ) : (
             <Button variant="outline" onClick={() => setViewMode("list")}>
               Back
             </Button>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <CardContent className="p-6 pt-0">
        {viewMode === "list" && (
          <>
            {knowledgeBases && knowledgeBases.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {knowledgeBases?.map((kb: any) => (
                      <TableRow key={kb.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => handleEdit(kb)}>
                        <TableCell className="font-medium">{kb.name}</TableCell>
                        <TableCell>
                          <Badge variant={kb.status === 'PUBLISHED' ? 'default' : 'secondary'} className={kb.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-none'}>
                            {kb.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize text-muted-foreground">{kb.source_type}</TableCell>
                        <TableCell className="text-right">
                           <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 btn-soft-destructive transition-all hover:scale-110 active:scale-90">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the knowledge base.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(kb.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                             </AlertDialog>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 border-2 border-dashed rounded-lg">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                   <Book className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="font-semibold text-lg">No knowledge bases yet</h3>
                <p className="text-muted-foreground max-sm">
                  Create a knowledge base to train your AI agents on your specific business data.
                </p>
                <Button onClick={() => handleEdit(null)} className="mt-4 btn-outline-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Knowledge Base
                </Button>
              </div>
            )}
          </>
        )}

        {viewMode === "edit" && (
          <div className="space-y-6">
             {/* Name Input */}
             <div className="space-y-2 max-w-md">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Support Knowledge Base"
                  className={errors.name ? "border-red-500" : ""}
                  maxLength={250}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                <p className="text-xs text-right text-muted-foreground">{formData.name.length}/250</p>
             </div>

             {/* Source Tabs */}
             <Tabs value={formData.source_type} onValueChange={(val) => setFormData({...formData, source_type: val})} className="w-full">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
                   <TabsTrigger value="website" className="w-[150px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                   </TabsTrigger>
                   <TabsTrigger value="pdf" className="w-[150px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <File className="h-4 w-4 mr-2" />
                      PDF
                   </TabsTrigger>
                   <TabsTrigger value="text" className="w-[150px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Text
                   </TabsTrigger>
                </TabsList>

                {/* Website Content */}
                <TabsContent value="website" className="space-y-6 mt-6">
                   <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-slate-900">
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Website URL</label>
                         <div className="flex gap-2">
                            <div className="flex items-center px-3 border rounded-l-md bg-slate-50 dark:bg-slate-900 border-r-0 text-sm text-muted-foreground">
                               https://
                            </div>
                            <Input 
                              value={formData.website} 
                              onChange={(e) => setFormData({...formData, website: e.target.value})} 
                              placeholder="yoursite.com"
                              className="rounded-l-none"
                            />
                            <Button onClick={handleFetchPages} disabled={fetching || !formData.website} variant="outline" className="btn-outline-primary h-10 px-6">
                               {fetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                               {fetching ? "Fetching..." : "Fetch Pages"}
                            </Button>
                         </div>
                      </div>

                      {(formData.web_pages?.length > 0) && (
                         <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="select-all"
                                      checked={formData.selected_pages.length === formData.web_pages.length && formData.web_pages.length > 0}
                                      onCheckedChange={(c) => toggleAllPages(c as boolean)}
                                    />
                                    <label
                                      htmlFor="select-all"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Select All
                                    </label>
                                  </div>
                                  <div className="relative">
                                     <Input 
                                       placeholder="Search URLs..." 
                                       className="h-8 w-[250px] pl-2 text-xs" 
                                       value={searchUrl}
                                       onChange={(e) => setSearchUrl(e.target.value)}
                                     />
                                  </div>
                               </div>
                               <div className="text-xs text-muted-foreground space-x-3 bg-slate-100 px-3 py-1 rounded-full">
                                  <span>Total: <strong>{formData.web_pages.length}</strong></span>
                                  <span>Selected: <strong>{formData.selected_pages.length}</strong></span>
                               </div>
                            </div>
                            
                            <div className="max-h-[400px] overflow-y-auto border rounded-md divide-y">
                               {filteredPages.map((page: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                     <Checkbox 
                                       checked={formData.selected_pages.includes(page.page)}
                                       onCheckedChange={() => togglePageSelection(page.page)}
                                     />
                                     <a href={page.page} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate flex-1">
                                        {page.page}
                                     </a>
                                  </div>
                               ))}
                               {filteredPages.length === 0 && (
                                  <div className="p-8 text-center text-sm text-muted-foreground">No pages found matching your search.</div>
                               )}
                            </div>
                         </div>
                      )}
                   </div>
                </TabsContent>

                {/* PDF Content */}
                <TabsContent value="pdf" className="space-y-6 mt-6">
                   <div className="space-y-4 border p-4 rounded-md bg-white dark:bg-slate-900">
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Assistant Files (PDF only)</label>
                            <span className="text-xs text-muted-foreground">Max 10 files</span>
                         </div>
                         
                         <Button 
                            variant="outline" 
                            onClick={handleAddFileMock} 
                            className="w-full h-32 border-2 border-dashed flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                         >
                            <div className="p-3 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors">
                               <File className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
                            </div>
                            <div className="text-center">
                               <p className="text-sm font-medium text-blue-600">Click to add PDF files</p>
                               <p className="text-xs text-muted-foreground">Upload documents from your gallery</p>
                            </div>
                         </Button>
                      </div>

                      {formData.files.length > 0 && (
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Attached Files</label>
                            <div className="space-y-2">
                                {formData.files.map((file: any) => (
                                   <div key={file.id} className="flex items-center justify-between p-3 border rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors">
                                      <div className="flex items-center gap-3">
                                         <FileText className="h-5 w-5 text-red-500" />
                                         <span className="text-sm font-medium">{file.object_name}</span>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 btn-soft-destructive transition-all hover:scale-110 active:scale-90" onClick={() => removeFile(file.id)}>
                                         <Trash2 className="h-4 w-4" />
                                      </Button>
                                   </div>
                                ))}
                            </div>
                         </div>
                      )}
                   </div>
                </TabsContent>

                {/* Text Content */}
                <TabsContent value="text" className="space-y-6 mt-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Text Content</label>
                      <Textarea 
                        value={formData.website_content} 
                        onChange={(e) => setFormData({...formData, website_content: e.target.value})}
                        rows={12}
                        placeholder="Paste your text content here to train the AI..." 
                        className="font-mono text-sm leading-relaxed"
                      />
                      <p className="text-xs text-muted-foreground">Enter raw text content that you want the AI knowledge base to learn from.</p>
                   </div>
                </TabsContent>
             </Tabs>
             
             <div className="flex items-center justify-end gap-3 pt-6 border-t mt-8">
                <Button variant="outline" onClick={() => setViewMode("list")}>Cancel</Button>
                <Button variant="outline" onClick={handleSave} className="btn-outline-primary min-w-[100px]">Publish</Button>
             </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
