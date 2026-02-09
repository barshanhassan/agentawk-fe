import React, { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles, Edit, Trash2, FileText, Grid3x3, Link as LinkIcon } from "lucide-react";

interface AIItem {
  id: string;
  name: string;
}

export default function AIItemsSection() {
  const [items, setItems] = useState<AIItem[]>([
    { id: "1", name: "Apartamento no Brooklin #001" },
    { id: "2", name: "Apartamento aconchegante no Itaim Bibi #002" },
    { id: "3", name: "Apartamento de Luxo no Jardim Europa #003" },
    { id: "4", name: "Springfield" },
    { id: "5", name: "Elm Street" },
    { id: "6", name: "asf" },
    { id: "7", name: "ai item one" },
    { id: "8", name: "bot item two" },
  ]);

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"item-data" | "internal-notes">("item-data");
  const [formData, setFormData] = useState({
    name: "",
    aiAssistant: "",
    smartFlow: "",
    channel: "",
    linkText: "",
    payload: "",
    savePayloadField: "",
    dataToFeedAI: "",
    images: [] as string[],
  });

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handlePublish = () => {
    if (formData.name.trim()) {
      const newItem: AIItem = {
        id: String(items.length + 1),
        name: formData.name,
      };
      setItems([...items, newItem]);
      setFormData({
        name: "",
        aiAssistant: "",
        smartFlow: "",
        channel: "",
        linkText: "",
        payload: "",
        savePayloadField: "",
        dataToFeedAI: "",
        images: [],
      });
      setIsCreateFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      aiAssistant: "",
      smartFlow: "",
      channel: "",
      linkText: "",
      payload: "",
      savePayloadField: "",
      dataToFeedAI: "",
      images: [],
    });
    setIsCreateFormOpen(false);
  };

  // Show create form
  if (isCreateFormOpen) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Create AI Item</h2>
                  <p className="text-sm text-muted-foreground">Add structured data to the Knowledge base</p>
                </div>
              </div>
              <button 
                onClick={handleCancel}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                Back
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AI Chat Assistant */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      AI Chat <span className="text-primary">Assistant</span>
                    </label>
                    <select
                      value={formData.aiAssistant}
                      onChange={(e) => setFormData({ ...formData, aiAssistant: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Assistant</option>
                      <option value="assistant1">Assistant 1</option>
                      <option value="assistant2">Assistant 2</option>
                    </select>
                  </div>

                  {/* Smart Flow */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Smart Flow</label>
                    <select
                      value={formData.smartFlow}
                      onChange={(e) => setFormData({ ...formData, smartFlow: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a Smart Flow</option>
                      <option value="flow1">Flow 1</option>
                      <option value="flow2">Flow 2</option>
                    </select>
                  </div>
                </div>

                {/* Two Column Layout - Channel and Link text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Channel */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Channel</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Channel</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>

                  {/* Link text */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground flex items-center gap-1">
                      Link text
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-xs">
                        i
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter link text"
                    />
                  </div>
                </div>

                {/* Two Column Layout - Payload and Save payload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payload */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Payload</label>
                    <input
                      type="text"
                      value={formData.payload}
                      onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter payload"
                    />
                  </div>

                  {/* Save payload to a custom field */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Save payload to a custom field
                    </label>
                    <select
                      value={formData.savePayloadField}
                      onChange={(e) => setFormData({ ...formData, savePayloadField: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select</option>
                      <option value="field1">Field 1</option>
                      <option value="field2">Field 2</option>
                    </select>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab("item-data")}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "item-data"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Item data
                    </button>
                    <button
                      onClick={() => setActiveTab("internal-notes")}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "internal-notes"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Internal notes
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "item-data" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">
                      Data to feed the AI
                    </label>
                    <textarea
                      value={formData.dataToFeedAI}
                      onChange={(e) => setFormData({ ...formData, dataToFeedAI: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Enter data to feed the AI"
                    />
                  </div>
                )}

                {activeTab === "internal-notes" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Internal Notes
                    </label>
                    <textarea
                      rows={8}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Enter internal notes"
                    />
                  </div>
                )}

                {/* Add images */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Add images</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Add link"
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-md text-sm font-medium transition-colors">
                      Select from gallery
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    Only PNG and JPG images are allowed, with a limit of up to 5 images, each no larger than 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={!formData.name.trim()}
                className="px-6 py-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show items table
  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center justify-between">
            Ai Items
            <Button 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary hover:text-white"
              onClick={() => setIsCreateFormOpen(true)}
            >
              Create an Ai Item
            </Button>
          </CardTitle>
          <CardDescription>Add structured data to the Knowledge base</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <div className="flex-1 overflow-hidden flex flex-col border rounded-lg bg-white dark:bg-slate-900">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${
                    index % 2 === 0 ? "bg-white dark:bg-slate-900/20" : "bg-gray-50/50 dark:bg-slate-800/10"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                        title="Grid View"
                      >
                        <Grid3x3 size={16} className="text-purple-600 dark:text-purple-400" />
                      </button>
                      <button 
                        className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                        title="Link"
                      >
                        <LinkIcon size={16} className="text-cyan-600 dark:text-cyan-400" />
                      </button>
                      <button 
                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                        title="Edit"
                      >
                        <Edit size={16} className="text-blue-600 dark:text-blue-400" />
                      </button>
                      <button 
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                        title="Delete"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 bg-gray-50 dark:bg-slate-800/50 text-xs text-muted-foreground">
          Showing {items.length} of {items.length} items
        </div>
      </div>
    </div>
  );
}
