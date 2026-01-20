import React, { useState } from "react";
import { 
  Film, 
  Folder, 
  Plus, 
  MoreVertical, 
  Search, 
  Grid, 
  List, 
  FileText, 
  Image as ImageIcon, 
  Mic, 
  Video,
  ChevronDown,
  UploadCloud,
  FilePlus2,
  Check,
  X,
  Play,
  Copy,
  Pencil,
  Trash2,
  Upload,
  AlertCircle
} from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const INITIAL_MEDIA = [
  { id: "1", name: "1768665176_241130", size: "22 KB", type: "audio", url: "/media/audio1.mp3" },
  { id: "2", name: "1768665157_241128", size: "23 KB", type: "audio", url: "/media/audio2.mp3" },
  { id: "3", name: "1768665092_241123", size: "23 KB", type: "audio", url: "/media/audio3.mp3" },
  { id: "4", name: "1768664961_241119", size: "22 KB", type: "audio", url: "/media/audio4.mp3" },
  { id: "5", name: "file-example_PDF_50...", size: "459 KB", type: "pdf", url: "/media/example.pdf" },
  { id: "6", name: "Barshan Hassan", size: "Image", type: "image", isUser: true, url: "/media/barshan.jpg" },
  { id: "7", name: "TestTiagoStage", size: "Image", type: "image", url: "/media/tiago.jpg" },
];

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge as UI_Badge } from "@/components/ui/badge";

export default function MediaGallerySection() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("All files");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  // Load from localStorage or use initial data
  const [mediaItems, setMediaItems] = useState<typeof INITIAL_MEDIA>(() => {
    const saved = localStorage.getItem('mediaGallery_items');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });
  
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  
  const [folderContents, setFolderContents] = useState<Record<string, typeof INITIAL_MEDIA>>(() => {
    const saved = localStorage.getItem('mediaGallery_folderContents');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever mediaItems or folderContents change
  React.useEffect(() => {
    localStorage.setItem('mediaGallery_items', JSON.stringify(mediaItems));
  }, [mediaItems]);

  React.useEffect(() => {
    localStorage.setItem('mediaGallery_folderContents', JSON.stringify(folderContents));
  }, [folderContents]);

  const handlePlay = (item: typeof INITIAL_MEDIA[0]) => {
    toast({
      title: "Playing media",
      description: `Now playing: ${item.name}`,
    });
    // In a real app, this would open a media player
    console.log("Playing:", item.url);
  };

  const handleCopyURL = (item: typeof INITIAL_MEDIA[0]) => {
    const fullUrl = `${window.location.origin}${item.url}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL copied",
      description: "Media URL has been copied to clipboard",
    });
  };

  const handleRename = (item: typeof INITIAL_MEDIA[0]) => {
    setRenamingId(item.id);
    setRenameValue(item.name);
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      setMediaItems(prev => prev.map(item => 
        item.id === renamingId ? { ...item, name: renameValue.trim() } : item
      ));
      toast({
        title: "Renamed successfully",
        description: `File renamed to: ${renameValue.trim()}`,
      });
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const item = mediaItems.find(m => m.id === deleteId);
      setMediaItems(prev => prev.filter(m => m.id !== deleteId));
      toast({
        title: "Deleted successfully",
        description: `${item?.name} has been removed`,
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    // Process files here
    Array.from(files).forEach(file => {
      console.log('Uploading file:', file.name, file.size);
      const newFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'pdf',
        url: URL.createObjectURL(file),
      };
      
      if (currentFolder) {
        setFolderContents(prev => ({
          ...prev,
          [currentFolder]: [...(prev[currentFolder] || []), newFile]
        }));
      } else {
        setMediaItems(prev => [...prev, newFile]);
      }
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    });
    
    setUploadDialogOpen(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    if (!folderContents[folderId]) {
      setFolderContents(prev => ({ ...prev, [folderId]: [] }));
    }
  };

  const handleBackToRoot = () => {
    setCurrentFolder(null);
  };

  const getCurrentItems = () => {
    if (currentFolder) {
      return folderContents[currentFolder] || [];
    }
    return mediaItems;
  };

  const filteredMedia = getCurrentItems().filter(item => {
    const matchesFilter = 
      filter === "All files" || 
      (filter === "Audios" && item.type === "audio") ||
      (filter === "Images" && item.type === "image") ||
      (filter === "Files" && item.type === "pdf") ||
      (filter === "Videos" && item.type === "video") ||
      (filter === "Folders" && item.type === "folder");
    
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "audio": return <Mic className="w-12 h-12 text-slate-400" />;
      case "pdf": return <FileText className="w-12 h-12 text-slate-400" />;
      case "image": return <ImageIcon className="w-12 h-12 text-slate-400" />;
      case "video": return <Video className="w-12 h-12 text-slate-400" />;
      case "folder": return <Folder className="w-12 h-12 text-blue-600" />;
      default: return <FileText className="w-12 h-12 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-left overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6 border-b border-gray-50 dark:border-slate-800/50">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          <Film className="w-7 h-7 text-[#1e293b] dark:text-white" />
        </div>
        <div className="text-left max-w-2xl">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Media gallery</CardTitle>
          <CardDescription className="text-[13px] font-medium text-slate-500 mt-1 leading-relaxed">
            Efficiently manage and organize the Workspace media right here
          </CardDescription>
        </div>
      </CardHeader>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          {currentFolder ? (
            <>
              <Button 
                variant="ghost" 
                onClick={handleBackToRoot}
                className="h-9 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Folder size={16} />
                <span className="text-sm font-medium">Main folder</span>
              </Button>
              <span className="text-slate-400">/</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-800">
                    <Folder size={16} />
                    <span className="text-sm font-medium">{mediaItems.find(m => m.id === currentFolder)?.name}</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {mediaItems.filter(item => item.type === 'folder').map((folder) => (
                    <DropdownMenuItem 
                      key={folder.id} 
                      onClick={() => handleFolderClick(folder.id, folder.name)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Folder size={14} className="text-blue-600" />
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-800">
                  <Folder size={16} />
                  <span className="text-sm font-medium">Main folder</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {mediaItems.filter(item => item.type === 'folder').map((folder) => (
                  <DropdownMenuItem 
                    key={folder.id} 
                    onClick={() => handleFolderClick(folder.id, folder.name)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Folder size={14} className="text-blue-600" />
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-800"
              onClick={() => setIsCreatingFolder(true)}
            >
              <Plus size={18} />
            </Button>
            
            {isCreatingFolder && (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 shadow-sm animate-in fade-in slide-in-from-left-2 duration-200">
                <input 
                  type="text" 
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 w-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      const newFolder = {
                        id: Date.now().toString(),
                        name: newFolderName.trim(),
                        size: "Folder",
                        type: "folder",
                        url: `/media/folders/${newFolderName.trim()}`,
                      };
                      setMediaItems(prev => [newFolder, ...prev]);
                      toast({
                        title: "Folder created",
                        description: `${newFolderName.trim()} has been created successfully`,
                      });
                      setNewFolderName("");
                      setIsCreatingFolder(false);
                    }
                    if (e.key === 'Escape') {
                      setNewFolderName("");
                      setIsCreatingFolder(false);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (newFolderName.trim()) {
                      const newFolder = {
                        id: Date.now().toString(),
                        name: newFolderName.trim(),
                        size: "Folder",
                        type: "folder",
                        url: `/media/folders/${newFolderName.trim()}`,
                      };
                      setMediaItems(prev => [newFolder, ...prev]);
                      toast({
                        title: "Folder created",
                        description: `${newFolderName.trim()} has been created successfully`,
                      });
                      setNewFolderName("");
                    }
                    setIsCreatingFolder(false);
                  }}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => {
                    setNewFolderName("");
                    setIsCreatingFolder(false);
                  }}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search media..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 pl-9 bg-slate-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-600/50"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-300 border-green-600/50 hover:bg-green-50/50 dark:hover:bg-green-900/10">
                <span className="text-sm font-medium">{filter}</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              {["All files", "Files", "Folders", "Images", "Videos", "Audios"].map((item) => (
                <DropdownMenuItem key={item} onClick={() => setFilter(item)} className="cursor-pointer">
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-7 w-7 rounded-md", viewMode === "list" && "bg-white dark:bg-slate-700 shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-7 w-7 rounded-md", viewMode === "grid" && "bg-white dark:bg-slate-700 shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-8">
        {filteredMedia.length === 0 && currentFolder ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-6 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-6">
              <Folder className="w-20 h-20 text-blue-600" />
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-6">
              There aren't any files here. Want to upload some?
            </p>
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              variant="outline" 
              className="h-10 px-6 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold"
            >
              Add files
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Add Files Card */}
            <div 
              onClick={() => setUploadDialogOpen(true)}
              className="group relative flex flex-col items-center justify-center aspect-video border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl hover:border-blue-600 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <Button variant="outline" className="h-8 px-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold rounded-md">
                  Add files
                </Button>
              </div>
            </div>

            {/* Media Items */}
            {filteredMedia.map((item) => (
              <div 
                key={item.id} 
                onClick={() => item.type === 'folder' && handleFolderClick(item.id, item.name)}
                className={cn(
                  "group relative flex flex-col bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow",
                  item.type === 'folder' && "cursor-pointer"
                )}
              >
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/30 dark:bg-slate-900/30">
                  {getIcon(item.type)}
                </div>
                <div className="p-4 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {item.isUser && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500">{item.size}</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <DropdownMenuItem onClick={() => handlePlay(item)} className="flex items-center gap-3 px-3 py-2 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Play size={14} className="text-blue-600" />
                        <span className="text-sm font-medium">Play</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyURL(item)} className="flex items-center gap-3 px-3 py-2 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Copy size={14} className="text-slate-400" />
                        <span className="text-sm font-medium">Copy URL</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRename(item)} className="flex items-center gap-3 px-3 py-2 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Pencil size={14} className="text-slate-400" />
                        <span className="text-sm font-medium">Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)} className="flex items-center gap-3 px-3 py-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <Trash2 size={14} />
                        <span className="text-sm font-medium">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
                <TableRow>
                  <TableHead className="pl-6 uppercase text-[11px] font-bold tracking-wider">Name</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold tracking-wider">Type</TableHead>
                  <TableHead className="uppercase text-[11px] font-bold tracking-wider">Size</TableHead>
                  <TableHead className="text-right pr-6 uppercase text-[11px] font-bold tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Add Files Row */}
                <TableRow 
                  onClick={() => setUploadDialogOpen(true)}
                  className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border-b-2 border-blue-100 dark:border-blue-900/30"
                >
                  <TableCell colSpan={4} className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-blue-600">Add files</span>
                    </div>
                  </TableCell>
                </TableRow>

                {filteredMedia.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        {React.cloneElement(getIcon(item.type) as React.ReactElement, { className: "w-5 h-5" })}
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <UI_Badge variant="secondary" className="capitalize text-[10px] font-bold">
                        {item.type}
                      </UI_Badge>
                    </TableCell>
                    <TableCell className="text-[12px] text-slate-500">{item.size}</TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                          <DropdownMenuItem onClick={() => handlePlay(item)} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                            <Play size={14} className="text-blue-600" />
                            <span className="text-sm font-medium">Play</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyURL(item)} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                            <Copy size={14} className="text-slate-400" />
                            <span className="text-sm font-medium">Copy URL</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRename(item)} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                            <Pencil size={14} className="text-slate-400" />
                            <span className="text-sm font-medium">Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)} className="flex items-center gap-3 px-3 py-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                            <Trash2 size={14} />
                            <span className="text-sm font-medium">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Rename Dialog */}
      <AlertDialog open={renamingId !== null} onOpenChange={(open) => !open && setRenamingId(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Rename File</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this file
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input 
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
            className="mt-2"
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRename}>Rename</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Dialog */}
      <AlertDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <AlertDialogContent className="max-w-2xl bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Upload Files</AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 transition-all",
                isDragging 
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20" 
                  : "border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600"
              )}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <Upload className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Drag and drop a file here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">or</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    className="h-10 px-6 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                    }}
                  >
                    Select from computer
                  </Button>
                </label>
              </div>
            </div>

            {/* File Format Information */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">Accepted formats and file size limits:</p>
              </div>
              
              <div className="pl-6 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📷</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">jpg, jpeg, gif, bmp, png, webp.</span> Max file size <span className="font-bold">5 MB</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎥</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">m4v, avi, mpg, mp4, mkv, webm, flv, wmv and mov.</span> Max file size <span className="font-bold">15 MB</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎵</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">mp3, avi, wav, aac, ogg, oga, mp4, ogg, cga.</span> Max file size <span className="font-bold">10 MB</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📄</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">doc, docx, pdf, xls, ppt, pptx, csv, txt, odt, html.</span> Max file size <span className="font-bold">10 MB</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">🚫</span>
                  <p className="text-red-500 dark:text-red-400 font-medium">
                    Compressed files (.zip, .rar, .7z, .tar, .gz, etc.) are not allowed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
