import { useState } from "react";
import { Plus, RefreshCw, Edit2, Eye, Copy, Trash2, Download, Calendar } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function TemplateManager() {
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [dateRangePreset, setDateRangePreset] = useState("last-7-days");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  const whatsappTemplates = [
    {
      id: 1,
      name: "Welcome Message",
      type: "Marketing",
      language: "EN",
      status: "Active - High quality",
      statusType: "success" as const,
      delivered: 15420,
      readRate: 87.5,
      cost: 124.5,
      updated: "2024-01-20",
    },
    {
      id: 2,
      name: "Order Confirmation",
      type: "Utility",
      language: "EN",
      status: "Active",
      statusType: "success" as const,
      delivered: 8923,
      readRate: 92.3,
      cost: 89.2,
      updated: "2024-01-18",
    },
    {
      id: 3,
      name: "Promotional Offer",
      type: "Marketing",
      language: "EN",
      status: "Pending",
      statusType: "warning" as const,
      delivered: 0,
      readRate: 0,
      cost: 0,
      updated: "2024-01-22",
    },
    {
      id: 4,
      name: "Cart Abandonment",
      type: "Marketing",
      language: "EN",
      status: "Rejected",
      statusType: "danger" as const,
      delivered: 0,
      readRate: 0,
      cost: 0,
      updated: "2024-01-15",
    },
  ];

  const toggleTemplate = (id: number) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTemplates.length === whatsappTemplates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(whatsappTemplates.map((t) => t.id));
    }
  };

  const getStatusBadgeClasses = (statusType: string) => {
    switch (statusType) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "danger":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="template-manager">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Template Manager</h1>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center space-x-1 bg-slate-200/75 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "whatsapp"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="tab-whatsapp"
          >
            WhatsApp Templates
          </button>
          <button
            onClick={() => setActiveTab("freeform")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "freeform"
                ? "bg-background text-foreground shadow-[0_-3px_6px_rgba(0,0,0,0.00),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.02)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid="tab-freeform"
          >
            Free Form
          </button>
        </div>

        {/* WhatsApp Templates Tab */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                {/* Date Range Preset */}
                <Select value={dateRangePreset} onValueChange={setDateRangePreset}>
                  <SelectTrigger className="w-[180px] hover-elevate" style={{ height: "38px" }}>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)]">
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom Date Range */}
                {dateRangePreset === "custom" && (
                  <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2 font-normal h-10 hover-elevate [border-color:hsl(var(--input))]">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {customDateRange
                            ? customDateRange.to
                              ? `${customDateRange.from?.toLocaleDateString() || ""} - ${customDateRange.to?.toLocaleDateString() || ""}`
                              : customDateRange.from?.toLocaleDateString() || ""
                            : "Select Date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={customDateRange?.from}
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Right side: Create and Refresh */}
              <div className="flex items-center gap-3">
                <Button className="gap-2 font-normal" data-testid="button-create-template">
                  <Plus size={16} />
                  Create Template
                </Button>
                <Button variant="outline" className="gap-2 font-normal" data-testid="button-refresh">
                  <RefreshCw size={16} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Table */}
            <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
              <CardContent className="pt-2">
                {/* Bulk Actions Toolbar */}
                {selectedTemplates.length > 0 && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <span className="text-sm text-foreground">{selectedTemplates.length} selected</span>
                    <div className="flex gap-2 ml-auto">
                      <button className="p-1 hover:bg-blue-100 rounded" title="Delete">
                        <Trash2 size={14} className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                )}

                <div className={`overflow-x-auto ${selectedTemplates.length > 0 ? 'mt-3' : 'mt-6'}`}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                          <Checkbox
                            checked={selectedTemplates.length === whatsappTemplates.length}
                            onCheckedChange={toggleAll}
                            data-testid="checkbox-select-all"
                          />
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Template Name</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Language</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Delivered</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Read Rate</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Cost ($)</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Updated</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whatsappTemplates.map((template) => (
                        <tr key={template.id} className="border-b hover:bg-muted/50" data-testid={`template-row-${template.id}`}>
                          <td className="py-2 px-3">
                            <Checkbox
                              checked={selectedTemplates.includes(template.id)}
                              onCheckedChange={() => toggleTemplate(template.id)}
                              data-testid={`checkbox-template-${template.id}`}
                            />
                          </td>
                          <td className="py-2 px-3 font-medium">{template.name}</td>
                          <td className="py-2 px-3">{template.type}</td>
                          <td className="py-2 px-3">{template.language}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClasses(template.statusType)}`}>
                              {template.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">{template.delivered.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right">{template.readRate}%</td>
                          <td className="py-2 px-3 text-right">${template.cost.toFixed(2)}</td>
                          <td className="py-2 px-3 text-muted-foreground">{template.updated}</td>
                          <td className="py-2 px-3 flex justify-start">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded">
                                  <MoreVertical size={14} className="text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem data-testid={`button-edit-${template.id}`}>
                                  <Edit2 size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPreviewOpen(true)} data-testid={`button-preview-${template.id}`}>
                                  <Eye size={14} className="mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`button-clone-${template.id}`}>
                                  <Copy size={14} className="mr-2" />
                                  Clone
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" data-testid={`button-delete-${template.id}`}>
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Free Form Tab */}
        {activeTab === "freeform" && (
          <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>No free form templates yet</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md" data-testid="dialog-preview">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="w-full max-w-[375px] h-[600px] border-4 border-foreground/20 rounded-3xl bg-background p-4 shadow-xl">
              <div className="h-full bg-muted/30 rounded-2xl p-4 flex flex-col">
                <div className="flex-1 flex items-end">
                  <div className="bg-primary/10 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm font-semibold mb-2">Welcome Message</p>
                    <p className="text-sm">Hi there! Welcome to our platform. We're excited to have you here!</p>
                    <p className="text-xs text-muted-foreground mt-2">10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
