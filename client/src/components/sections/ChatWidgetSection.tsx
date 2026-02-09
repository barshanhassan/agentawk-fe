import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MessageCircle, Mail, Phone, Send, Facebook, ArrowLeft, Copy, Eye } from "lucide-react";

interface ChatWidget {
  id: string;
  name: string;
  title: string;
  channels: string[];
  headerColor?: string;
  bodyColor?: string;
  position?: string;
  footerText?: string;
  fontFamily?: string;
}

export default function ChatWidgetSection() {
  const [widgets, setWidgets] = useState<ChatWidget[]>([
    {
      id: "1",
      name: "Test",
      title: "Hi there, Choose your preferred channel to contact us.",
      channels: ["WhatsApp"],
      headerColor: "#1e40af",
      bodyColor: "#ffffff",
      position: "right",
      footerText: "Powered by Ezconn",
      fontFamily: "Verdana",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "Hi there, Choose your preferred channel to contact us.",
    channels: [] as string[],
    headerColor: "#3D46CD",
    bodyColor: "#EDF7FF",
    position: "right",
    footerText: "Powered by Ezconn",
    fontFamily: "Verdana",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const channelOptions = ["Email", "Phone", "Custom number", "WhatsApp", "Telegram", "Facebook"];

  const getChannelIcon = (channel: string) => {
    const iconProps = { size: 14, className: "text-white" };
    switch (channel) {
      case "WhatsApp":
        return <Send {...iconProps} />;
      case "Email":
        return <Mail {...iconProps} />;
      case "Phone":
        return <Phone {...iconProps} />;
      case "Telegram":
        return <Send {...iconProps} />;
      case "Facebook":
        return <Facebook {...iconProps} />;
      case "Custom number":
        return <Phone {...iconProps} />;
      default:
        return <MessageCircle {...iconProps} />;
    }
  };

  const handleCreateWidget = () => {
    if (formData.name.trim() && formData.title.trim() && formData.channels.length > 0) {
      if (editingId) {
        setWidgets(widgets.map(w => w.id === editingId ? {
          ...w,
          id: editingId,
          name: formData.name,
          title: formData.title,
          channels: formData.channels,
          headerColor: formData.headerColor,
          bodyColor: formData.bodyColor,
          position: formData.position,
          footerText: formData.footerText,
          fontFamily: formData.fontFamily,
        } : w));
        setEditingId(null);
      } else {
        const newWidget: ChatWidget = {
          id: String(widgets.length + 1),
          name: formData.name,
          title: formData.title,
          channels: formData.channels,
          headerColor: formData.headerColor,
          bodyColor: formData.bodyColor,
          position: formData.position,
          footerText: formData.footerText,
          fontFamily: formData.fontFamily,
        };
        setWidgets([...widgets, newWidget]);
      }
      setFormData({
        name: "",
        title: "",
        channels: [],
        headerColor: "#1e40af",
        bodyColor: "#ffffff",
        position: "right",
        footerText: "Powered by Ezconn",
        fontFamily: "Verdana",
      });
      setIsCreateModalOpen(false);
    }
  };

  const handleEditWidget = (widget: ChatWidget) => {
    setFormData({
      name: widget.name,
      title: widget.title,
      channels: widget.channels,
      headerColor: widget.headerColor || "#1e40af",
      bodyColor: widget.bodyColor || "#ffffff",
      position: widget.position || "right",
      footerText: widget.footerText || "Powered by Ezconn",
      fontFamily: widget.fontFamily || "Verdana",
    });
    setEditingId(widget.id);
    setIsCreateModalOpen(true);
  };

  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const toggleChannel = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const widgetCode = `<!-- EZCONN Chat Widget -->
<script src="https://widget.ezconn.io/embed.js"></script>
<script>
  EZConnWidget.init({
    id: "widget_${widgets.length + 1}",
    headerColor: "${formData.headerColor}",
    position: "${formData.position}"
  });
</script>`;

  return (
    <div className="p-6 h-full flex flex-col">
      {!isCreateModalOpen && (
        <>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <MessageCircle className="w-8 h-8 text-black dark:text-white" />
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center justify-between">
            Chat Widget
            <Button 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary hover:text-white"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  title: "",
                  channels: [],
                  headerColor: "#1e40af",
                  bodyColor: "#ffffff",
                  position: "right",
                  footerText: "Powered by Ezconn",
                  fontFamily: "Verdana",
                });
                setIsCreateModalOpen(true);
              }}
            >
              Create new
            </Button>
          </CardTitle>
          <CardDescription>Embed a chat widget to your website</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <Card className="flex-1 overflow-hidden flex flex-col border-0 shadow-none">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Channels</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {widgets.map((widget, index) => (
                <tr
                  key={widget.id}
                  className={`border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${
                    index % 2 === 0 ? "bg-white dark:bg-slate-900/20" : "bg-gray-50/50 dark:bg-slate-800/10"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{widget.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{widget.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {widget.channels.map((channel) => (
                        <span 
                          key={channel}
                          className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white"
                          title={channel}
                        >
                          {getChannelIcon(channel)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                        onClick={() => handleEditWidget(widget)}
                      >
                        <Edit size={16} className="text-muted-foreground" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                        onClick={() => handleDeleteWidget(widget.id)}
                      >
                        <Trash2 size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 bg-gray-50 dark:bg-slate-800/50 text-xs text-muted-foreground">
          Showing {widgets.length} of {widgets.length} chat widgets
        </div>
      </Card>
        </>
      )}

      {/* Create Chat Widget Form */}
      {isCreateModalOpen && (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto w-full">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MessageCircle size={20} />
                  {editingId ? "Edit Widget" : "Create New Widget"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Embed a chat widget to your website</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                Go back
              </button>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="col-span-2 space-y-6">
                {/* Widget Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Widget name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Name this widget"
                  />
                </div>

                {/* Widget Message Preview */}
                {/* Widget Message - Title */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Welcome message</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Hi there, Choose your preferred channel to contact us."
                  />
                </div>

                {/* Widget Header Color and Font */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Widget header color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={formData.headerColor}
                        onChange={(e) => setFormData({ ...formData, headerColor: e.target.value })}
                        className="w-10 h-10 rounded-md cursor-pointer border border-slate-200 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        value={formData.headerColor}
                        onChange={(e) => setFormData({ ...formData, headerColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Widget title font family</label>
                    <select 
                      value={formData.fontFamily}
                      onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Verdana">Verdana</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Helvetica">Helvetica</option>
                    </select>
                  </div>
                </div>

                {/* Widget Body Color and Position */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Widget body color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={formData.bodyColor}
                        onChange={(e) => setFormData({ ...formData, bodyColor: e.target.value })}
                        className="w-10 h-10 rounded-md cursor-pointer border border-slate-200 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        value={formData.bodyColor}
                        onChange={(e) => setFormData({ ...formData, bodyColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Widget position on your website</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="right">Right bottom</option>
                      <option value="left">Left bottom</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                    </select>
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Select the channels to add to the widget</label>
                  <div className="space-y-3">
                    {channelOptions.map((channel) => (
                      <div key={channel} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={channel}
                          checked={formData.channels.includes(channel)}
                          onChange={() => toggleChannel(channel)}
                          className="rounded"
                        />
                        <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {getChannelIcon(channel)}
                        </span>
                        {channel === "Email" && (
                          <input
                            type="email"
                            placeholder="Enter email address"
                            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                        {channel === "Phone" && (
                          <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                        {channel === "Custom number" && (
                          <>
                            <select className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                              <option>Custom number</option>
                            </select>
                            <input
                              type="tel"
                              placeholder="Enter phone number"
                              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </>
                        )}
                        {(channel === "WhatsApp" || channel === "Telegram" || channel === "Facebook") && (
                          <input
                            type="text"
                            placeholder={`Enter ${channel} ID`}
                            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                        )}
                        <button className="p-1 text-muted-foreground hover:text-foreground">
                          <Eye size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Footer Text */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Footer text</label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Powered by Ezconn"
                  />
                </div>
              </div>

              {/* Right Column - Preview */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Widget preview</label>
                <div 
                  className="rounded-lg overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700"
                  style={{ backgroundColor: formData.bodyColor }}
                >
                  <div 
                    style={{ backgroundColor: formData.headerColor }}
                    className="p-4 text-white min-h-24 flex items-center justify-center"
                  >
                    <p className="text-sm font-semibold text-center" style={{ fontFamily: formData.fontFamily }}>{formData.title || "Hi there, Choose your preferred channel to contact us."}</p>
                  </div>
                  <div className="p-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                      <MessageCircle size={32} className="text-white" />
                    </div>
                  </div>
                  {formData.footerText && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-3 text-center text-xs text-muted-foreground">
                      {formData.footerText}
                    </div>
                  )}
                </div>
              
              {/* Code Snippet (Moved to Right Column) */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-foreground">Code snippet to be installed on your website</label>
                <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 p-3 rounded-md font-mono text-xs overflow-auto h-48">
                  <code>{widgetCode}</code>
                  <button className="absolute top-2 right-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-500">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({
                    name: "",
                    title: "",
                    channels: [],
                    headerColor: "#1e40af",
                    bodyColor: "#ffffff",
                    position: "right",
                    footerText: "Powered by Ezconn",
                    fontFamily: "Verdana",
                  });
                  setEditingId(null);
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWidget}
                disabled={!formData.name.trim() || !formData.title.trim() || formData.channels.length === 0}
                className="px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-md text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
