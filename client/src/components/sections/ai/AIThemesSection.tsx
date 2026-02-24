import React, { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, HelpCircle, Edit, Trash2, FileText } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: "baserow" | "question";
  badges?: Array<{ text: string; variant: "beta" | "new" }>;
  available: boolean;
}

interface ThemeItem {
  id: string;
  name: string;
}

export default function AIThemesSection() {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    smartFlow: "",
    channel: "",
    payload: "",
    spreadsheet: "",
  });

  const [themeItems, setThemeItems] = useState<ThemeItem[]>([
    { id: "1", name: "Baserow theme" },
    { id: "2", name: "imoveis" },
    { id: "3", name: "imoveis_test_jaderson" },
    { id: "4", name: "imveis_tutorial" },
    { id: "5", name: "Cadastro de Veiculos Rent" },
  ]);

  const themes: Theme[] = [
    {
      id: "1",
      name: "Baserow.io",
      description: "Use Baserow.io to store and manage products linked to each theme efficiently",
      icon: "baserow",
      badges: [
        { text: "Beta", variant: "beta" },
        { text: "New", variant: "new" },
      ],
      available: true,
    },
    {
      id: "2",
      name: "Databases",
      description: "More integrations coming soon...",
      icon: "question",
      badges: [],
      available: false,
    },
  ];

  const handleDeleteItem = (id: string) => {
    setThemeItems(themeItems.filter(item => item.id !== id));
  };

  const handlePublish = () => {
    if (formData.name.trim()) {
      const newItem: ThemeItem = {
        id: String(themeItems.length + 1),
        name: formData.name,
      };
      setThemeItems([...themeItems, newItem]);
      setFormData({
        name: "",
        subtitle: "",
        smartFlow: "",
        channel: "",
        payload: "",
        spreadsheet: "",
      });
      setIsCreateFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      subtitle: "",
      smartFlow: "",
      channel: "",
      payload: "",
      spreadsheet: "",
    });
    setIsCreateFormOpen(false);
  };

  const renderIcon = (iconType: string) => {
    if (iconType === "baserow") {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center">
          <div className="space-y-1">
            <div className="flex gap-1">
              <div className="w-5 h-1.5 bg-cyan-400 rounded-sm"></div>
              <div className="w-5 h-1.5 bg-cyan-400 rounded-sm"></div>
            </div>
            <div className="w-11 h-1.5 bg-blue-600 rounded-sm"></div>
            <div className="flex gap-1">
              <div className="w-5 h-1.5 bg-blue-700 rounded-sm"></div>
              <div className="w-2 h-1.5 bg-blue-700 rounded-sm"></div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-slate-700">
        <HelpCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    );
  };

  // If a theme is selected, show the detailed view or create form
  if (selectedTheme) {
    // Show create form
    if (isCreateFormOpen) {
      return (
        <div className="p-6 h-full flex flex-col">
          <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {renderIcon(selectedTheme.icon)}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">AI Theme</h2>
                    <p className="text-sm text-muted-foreground">Create an AI theme to attach products to it</p>
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
                      placeholder="Enter theme name"
                    />
                  </div>

                  {/* Subtitle Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  {/* TRIGGER SECTION */}
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold text-primary mb-4">TRIGGER SECTION</h3>

                    {/* Smart Flow */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-foreground">Smart Flow</label>
                      <select
                        value={formData.smartFlow}
                        onChange={(e) => setFormData({ ...formData, smartFlow: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Smart Flow</option>
                        <option value="flow1">Flow 1</option>
                        <option value="flow2">Flow 2</option>
                      </select>
                    </div>

                    {/* Channel */}
                    <div className="mb-4">
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
                  </div>

                  {/* BASEROW.IO SECTION */}
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold text-primary mb-4">BASEROW.IO SECTION</h3>

                    {/* Select a Spreadsheet */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Select a Spreadsheet</label>
                      <select
                        value={formData.spreadsheet}
                        onChange={(e) => setFormData({ ...formData, spreadsheet: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Spreadsheet</option>
                        <option value="sheet1">Spreadsheet 1</option>
                        <option value="sheet2">Spreadsheet 2</option>
                      </select>
                    </div>
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
                <Button
                  variant="outline"
                  onClick={handlePublish}
                  disabled={!formData.name.trim()}
                  className="btn-outline-primary h-9 px-6 font-medium"
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show table view
    return (
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {renderIcon(selectedTheme.icon)}
            <div>
              <h3 className="font-semibold text-lg">{selectedTheme.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedTheme.description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="btn-outline-primary h-9 px-4"
              onClick={() => setIsCreateFormOpen(true)}
            >
              Add
            </Button>
            <button
              onClick={() => setSelectedTheme(null)}
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              Back
            </button>
          </div>
        </div>

        {/* Table */}
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
                {themeItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-slate-900/20" : "bg-gray-50/50 dark:bg-slate-800/10"
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
            Showing {themeItems.length} of {themeItems.length} items
          </div>
        </div>
      </div>
    );
  }

  // Default view - show theme cards
  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg font-semibold">AI Themes</CardTitle>
          <CardDescription>Organize and manage your AI Themes</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-900 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Icon */}
            <div className="mb-4">{renderIcon(theme.icon)}</div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {theme.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              {theme.description}
            </p>

            {/* Badges and Button */}
            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="flex gap-2">
                {theme.badges?.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={
                      badge.variant === "beta"
                        ? "text-red-600 border-red-600 text-xs px-2 py-0.5"
                        : "text-green-600 border-green-600 text-xs px-2 py-0.5"
                    }
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
              {theme.available ? (
                <Button
                  variant="outline"
                  onClick={() => setSelectedTheme(theme)}
                  className="btn-outline-primary h-8 px-4 text-xs font-semibold"
                >
                  Select
                </Button>
              ) : (
                <button
                  disabled
                  className="px-4 py-1.5 border border-gray-300 dark:border-slate-700 text-gray-400 dark:text-gray-500 rounded-md text-sm cursor-not-allowed"
                >
                  Soon...
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
