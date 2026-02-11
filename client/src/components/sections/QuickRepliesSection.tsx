import { useState } from "react";
import { Bot, Plus, Trash2, Edit2, MoreVertical, ArrowLeft, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Collection {
  id: string;
  name: string;
  visibility: "private" | "public" | "specific";
  messages: Message[];
}

interface Message {
  id: string;
  title: string;
  type: "text" | "media";
  content: string;
}

const initialCollections: Collection[] = [
  { id: "1", name: "CaioTest", visibility: "public", messages: [{ id: "m1", title: "Caio", type: "text", content: "" }] },
  { id: "2", name: "Collection 2 by usman", visibility: "public", messages: [] },
  { id: "3", name: "Another collection for public.", visibility: "public", messages: [] },
  { id: "4", name: "public collection by john doe", visibility: "public", messages: [] },
  { id: "5", name: "Teste Tiago", visibility: "public", messages: [] },
  { id: "6", name: "Makar", visibility: "public", messages: [] },
];

export default function QuickRepliesSection() {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [view, setView] = useState<"list" | "create_collection" | "collection_detail" | "create_message">("list");
  
  // Create Form State
  const [collectionName, setCollectionName] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public" | "specific">("private");
  const [showError, setShowError] = useState(false);

  // Edit/Delete State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

  // Create Message State
  const [messageTitle, setMessageTitle] = useState("");
  const [messageType, setMessageType] = useState<"text" | "media">("text");
  const [messageContent, setMessageContent] = useState("");

  const handleCreateCollectionClick = () => {
    setView("create_collection");
    setCollectionName("");
    setVisibility("private");
    setShowError(false);
  };

  const handleCancelCreateCollection = () => {
    setView("list");
    setCollectionName("");
    setVisibility("private");
    setShowError(false);
  };

  const handleCreateCollection = () => {
    if (!collectionName.trim()) {
      setShowError(true);
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: collectionName,
      visibility,
      messages: [],
    };
    setCollections([...collections, newCollection]);
    setView("list");
    toast({
      title: "Success",
      description: "Collection created successfully",
    });
  };

  // Edit Logic
  const handleUpdateCollection = () => {
    if (currentCollection && collectionName.trim()) {
      setCollections(collections.map(c => 
        c.id === currentCollection.id ? { ...c, name: collectionName } : c
      ));
      setCollectionName("");
      setCurrentCollection(null);
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Collection updated successfully",
      });
    }
  };

  const handleDeleteCollection = () => {
    if (currentCollection) {
      setCollections(collections.filter(c => c.id !== currentCollection.id));
      setCurrentCollection(null);
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
    }
  };

  const openEditModal = (collection: Collection) => {
    setCurrentCollection(collection);
    setCollectionName(collection.name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (collection: Collection) => {
    setCurrentCollection(collection);
    setIsDeleteModalOpen(true);
  };

  const openCollectionDetail = (collection: Collection) => {
    setCurrentCollection(collection);
    setView("collection_detail");
  };

  const handleCreateMessageClick = () => {
    setView("create_message");
    setMessageTitle("");
    setMessageType("text");
    setMessageContent("");
  };

  const handleCancelCreateMessage = () => {
    setView("collection_detail");
    setMessageTitle("");
    setMessageType("text");
    setMessageContent("");
  };

  const handleCreateMessage = () => {
    if (currentCollection && messageTitle.trim() && messageContent.trim()) {
       const newMessage: Message = {
        id: Date.now().toString(),
        title: messageTitle,
        type: messageType,
        content: messageContent,
      };

      const updatedCollections = collections.map(c => {
        if (c.id === currentCollection.id) {
          return { ...c, messages: [...c.messages, newMessage] };
        }
        return c;
      });

      setCollections(updatedCollections);
      // Update current collection reference as well to reflect changes immediately
      const updatedCurrent = updatedCollections.find(c => c.id === currentCollection.id) || null;
      setCurrentCollection(updatedCurrent);

      setView("collection_detail");
       toast({
        title: "Success",
        description: "Message created successfully",
      });
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b pb-6">
        <div className="flex gap-4">
          <div className="mt-1">
            <Bot className="h-8 w-8 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Quick Replies</h2>
            <p className="text-sm text-muted-foreground mt-1 text-slate-500">
              Efficiently create and organize quick replies for live chats with leads or contacts.
            </p>
          </div>
        </div>
        
        {view === "list" && (
          <Button 
            onClick={handleCreateCollectionClick}
            variant="outline"
            className="btn-outline-primary gap-2"
          >
            <Plus size={16} />
            Create Collection
          </Button>
        )}
         {(view === "collection_detail" || view === "create_message") && (
           <Button 
            onClick={handleCreateCollectionClick}
            variant="outline"
            className="btn-outline-primary gap-2"
          >
            <Plus size={16} />
            Create Collection
          </Button>
        )}
      </div>

      {view === "list" && (
        <div className="mt-6">
          <div className="w-full">
            <div className="grid grid-cols-[1fr,100px] border-b pb-3 mb-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-4">Collection Name</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Action</div>
            </div>
            
            <div className="space-y-1">
              {collections.map((collection) => (
                <div 
                  key={collection.id} 
                  className="grid grid-cols-[1fr,100px] items-center py-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 px-4 -mx-4 transition-colors cursor-pointer group"
                  onClick={() => openCollectionDetail(collection)}
                >
                  <div className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
                    {collection.name}
                  </div>
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(collection)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit name
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => openCollectionDetail(collection)}>
                          <Bot className="mr-2 h-4 w-4" />
                          Open collection
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteModal(collection)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {collections.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No collections found. Create a new one to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "create_collection" && (
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name" className="text-sm font-medium text-foreground">
                Collection name
              </Label>
              <Input
                id="collection-name"
                value={collectionName}
                onChange={(e) => {
                  setCollectionName(e.target.value);
                  if (e.target.value.trim()) setShowError(false);
                }}
                placeholder="Collection name"
                className={`w-full ${showError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {showError && (
                <p className="text-xs text-red-500">Enter collection name.</p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm font-medium text-foreground">
                Share this collection with.
              </Label>
              <RadioGroup value={visibility} onValueChange={(v: any) => setVisibility(v)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" className="text-blue-600 border-gray-400" />
                  <Label htmlFor="private" className="font-normal cursor-pointer">Private - Only you can see.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" className="text-blue-600 border-gray-400" />
                  <Label htmlFor="public" className="font-normal cursor-pointer">Public - All agents can see.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" className="text-blue-600 border-gray-400" />
                  <Label htmlFor="specific" className="font-normal cursor-pointer">Specific - Share with specific agents.</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-8">
            <Button 
              variant="outline" 
              onClick={handleCancelCreateCollection}
              className="text-foreground"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCollection}
              className="btn-outline-primary min-w-[80px]"
              variant="outline"
            >
              <span className="sr-only">Create</span>
              + Create
            </Button>
          </div>
        </div>
      )}

      {/* Collection Detail View */}
      {view === "collection_detail" && currentCollection && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{currentCollection.name}</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setView("list")}
                className="gap-2 text-muted-foreground"
              >
                <ArrowLeft size={16} />
                Collections
              </Button>
              <Button 
                variant="outline"
                className="btn-outline-primary gap-2"
                onClick={handleCreateMessageClick}
              >
                <Plus size={16} />
                Create Message
              </Button>
            </div>
           </div>

           <div className="space-y-2">
             {currentCollection.messages.map(message => (
               <div key={message.id} className="p-4 rounded-lg border border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
                 <div className="font-medium">{message.title}</div>
               </div>
             ))}
             {currentCollection.messages.length === 0 && (
               <div className="text-center py-8 text-muted-foreground text-sm">
                 No canned messages in this collection yet.
               </div>
             )}
           </div>
        </div>
      )}

      {/* Create Message View */}
      {view === "create_message" && currentCollection && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{currentCollection.name}</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setView("list")}
                className="gap-2 text-muted-foreground"
              >
                <ArrowLeft size={16} />
                Collections
              </Button>
              <Button 
                variant="outline"
                className="btn-outline-primary gap-2"
              >
                <Plus size={16} />
                Create Message
              </Button>
            </div>
           </div>

           <div className="space-y-4">
             <div className="space-y-2">
               <Label className="text-sm font-medium">Message title</Label>
               <Input 
                 placeholder="Message title" 
                 value={messageTitle}
                 onChange={(e) => setMessageTitle(e.target.value)}
                />
             </div>

             <div className="space-y-3">
               <Label className="text-sm font-medium">Message type</Label>
               <RadioGroup value={messageType} onValueChange={(v: any) => setMessageType(v)} className="flex items-center gap-6">
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="text" id="text" className="text-blue-600 border-gray-400" />
                   <Label htmlFor="text" className="font-normal cursor-pointer">Text message</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="media" id="media" className="text-blue-600 border-gray-400" />
                   <Label htmlFor="media" className="font-normal cursor-pointer">Media message</Label>
                 </div>
               </RadioGroup>
             </div>

             <div className="space-y-2 relative">
               <Label className="text-sm font-medium">Response text</Label>
               <div className="relative">
                 <Textarea 
                   placeholder="Type message..." 
                   className="min-h-[140px] resize-none pr-8"
                   value={messageContent}
                   onChange={(e) => setMessageContent(e.target.value)}
                 />
                 <button className="absolute bottom-3 right-3 text-muted-foreground hover:text-foreground">
                   <Smile size={20} />
                 </button>
               </div>
             </div>

             <div className="flex justify-between items-center">
               <div className="w-[200px]">
                 <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <span className="text-xs text-blue-500">Characters remaining: {2000 - messageContent.length}</span>
             </div>
           </div>

           <div className="flex justify-end gap-3 pt-6">
              <Button variant="outline" onClick={handleCancelCreateMessage}>
                Close
              </Button>
              <Button 
                onClick={handleCreateMessage}
                disabled={!messageTitle.trim() || !messageContent.trim()}
                className="btn-outline-primary min-w-[80px]"
                variant="outline"
              >
                + Create
              </Button>
           </div>
        </div>
      )}

      {/* Edit Modal (Collection Name) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Collection Name</Label>
              <Input
                id="edit-name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Enter collection name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCollection} disabled={!collectionName.trim()} variant="outline" className="btn-outline-primary">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
             <p className="text-sm text-slate-500">
              Are you sure you want to delete <span className="font-semibold text-foreground">{currentCollection?.name}</span>? 
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
