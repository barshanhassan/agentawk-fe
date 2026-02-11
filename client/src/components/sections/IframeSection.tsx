import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Edit, Trash2, Eye } from "lucide-react";

interface IframeItem {
  id: string;
  name: string;
  menuText: string;
  htmlCode: string;
}

export default function IframeSection() {
  const [iframes, setIframes] = useState<IframeItem[]>([
    { id: "1", name: "Site", menuText: "Site", htmlCode: '<iframe src="https://example.com"></iframe>' }
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [menuText, setMenuText] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (name.trim() && menuText.trim() && htmlCode.trim()) {
      if (editingId) {
        setIframes(iframes.map(item => item.id === editingId ? {
          ...item,
          id: editingId,
          name: name,
          menuText: menuText,
          htmlCode: htmlCode,
        } : item));
        setEditingId(null);
      } else {
        const newItem: IframeItem = {
          id: Date.now().toString(),
          name: name,
          menuText: menuText,
          htmlCode: htmlCode,
        };
        setIframes([...iframes, newItem]);
      }
      setName("");
      setMenuText("");
      setHtmlCode("");
      setIsCreateOpen(false);
    }
  };

  const handleEditIframe = (iframe: IframeItem) => {
     setName(iframe.name);
     setMenuText(iframe.menuText);
     setHtmlCode(iframe.htmlCode);
     setEditingId(iframe.id);
     setIsCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    setIframes(iframes.filter(item => item.id !== id));
  };

  const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
  const [menuTitle, setMenuTitle] = useState("Iframes");

  return (
    <div className="p-6 h-full flex flex-col">
      {!isCreateOpen && (
        <>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
            <Globe className="w-8 h-8 text-black dark:text-white" />
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg flex items-center justify-between">
                {menuTitle}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="text-foreground border-slate-200 dark:border-slate-700"
                    onClick={() => setIsEditTitleModalOpen(true)}
                  >
                    Edit Menu Title
                  </Button>
                  <Button 
                    variant="outline" 
                    className="btn-outline-primary"
                    onClick={() => {
                        setEditingId(null);
                        setName("");
                        setMenuText("");
                        setHtmlCode("");
                        setIsCreateOpen(true);
                    }}
                    disabled={iframes.length >= 3}
                  >
                    + Create New
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Embed another webpage or resource inside your current page.</CardDescription>
            </div>
          </CardHeader>
          <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

          <Card className="flex-1 overflow-hidden flex flex-col border-0 shadow-none">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 text-sm text-muted-foreground border-b border-gray-200 dark:border-slate-700">
              You can create a maximum of 3 items
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-white dark:bg-slate-900">
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-foreground tracking-wider">Name</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase text-foreground tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {iframes.map((iframe) => (
                    <tr
                      key={iframe.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium text-foreground">{iframe.name}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors" title="View">
                            <Eye size={16} className="text-slate-600 dark:text-slate-400" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors" 
                            title="Edit"
                            onClick={() => handleEditIframe(iframe)}
                          >
                            <Edit size={16} className="text-slate-600 dark:text-slate-400" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors" 
                            title="Delete"
                            onClick={() => handleDelete(iframe.id)}
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {iframes.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                        No iframes created yet. Click "+ Create New" to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {isCreateOpen && (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
             <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Globe size={20} />
                  {editingId ? "Edit Iframe" : "Create New Iframe"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Embed another webpage or resource inside your current page.</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="text-foreground border-slate-200 dark:border-slate-700"
              >
                Back
              </Button>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div>
              <label className="text-sm font-medium block mb-2">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Sidebar menu text</label>
              <Input
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">HTML Code</label>
              <Textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex justify-end gap-3">
             <Button 
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="btn-outline-primary"
                variant="outline"
                disabled={!name || !menuText || !htmlCode}
              >
                Publish
              </Button>
          </div>
        </div>
      )}

      {/* Edit Menu Title Modal */}
      {isEditTitleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Edit Menu Title</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Menu Title</label>
              <Input 
                value={menuTitle}
                onChange={(e) => setMenuTitle(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditTitleModalOpen(false)}
                className="text-foreground border-slate-200 dark:border-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsEditTitleModalOpen(false)}
                className="btn-outline-primary"
                variant="outline"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
