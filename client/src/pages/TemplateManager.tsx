import { useState } from "react";
import { Plus, RefreshCw, Edit2, Eye, Copy, Trash2 } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import DateRangePicker from "@/components/DateRangePicker";
import Breadcrumb from "@/components/Breadcrumb";

export default function TemplateManager() {
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  return (
    <div className="p-6 space-y-6" data-testid="template-manager">
      <div>
        <h1 className="text-3xl font-bold">Template Manager</h1>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Templates</CardTitle>
          <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button className="gap-2" data-testid="button-create-template">
              <Plus size={16} />
              Create Template
            </Button>
            <Button variant="outline" size="icon" className="hover-elevate" data-testid="button-refresh">
              <RefreshCw size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="whatsapp" className="space-y-4">
            <TabsList>
              <TabsTrigger value="whatsapp" data-testid="tab-whatsapp">WhatsApp Templates</TabsTrigger>
              <TabsTrigger value="freeform" data-testid="tab-freeform">Free Form</TabsTrigger>
            </TabsList>

            <TabsContent value="whatsapp" className="space-y-4">
              {selectedTemplates.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="destructive" size="sm" data-testid="button-bulk-delete">
                    <Trash2 size={16} className="mr-2" />
                    Delete ({selectedTemplates.length})
                  </Button>
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedTemplates.length === whatsappTemplates.length}
                          onCheckedChange={toggleAll}
                          data-testid="checkbox-select-all"
                        />
                      </TableHead>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead className="text-right">Read Rate</TableHead>
                      <TableHead className="text-right">Cost ($)</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whatsappTemplates.map((template) => (
                      <TableRow key={template.id} data-testid={`template-row-${template.id}`}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTemplates.includes(template.id)}
                            onCheckedChange={() => toggleTemplate(template.id)}
                            data-testid={`checkbox-template-${template.id}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.type}</TableCell>
                        <TableCell>{template.language}</TableCell>
                        <TableCell>
                          <StatusBadge status={template.status} type={template.statusType} />
                        </TableCell>
                        <TableCell className="text-right">{template.delivered.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{template.readRate}%</TableCell>
                        <TableCell className="text-right">${template.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{template.updated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover-elevate" data-testid={`button-edit-${template.id}`}>
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover-elevate"
                              onClick={() => setPreviewOpen(true)}
                              data-testid={`button-preview-${template.id}`}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover-elevate" data-testid={`button-clone-${template.id}`}>
                              <Copy size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover-elevate" data-testid={`button-delete-${template.id}`}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="freeform">
              <div className="text-center py-12 text-muted-foreground">
                <i className="fas fa-file-text text-5xl mx-auto mb-4 opacity-50"></i>
                <p>No free form templates yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
