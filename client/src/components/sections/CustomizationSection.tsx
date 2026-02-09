import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const items = [
  "Custom fields",
  "Tags",
  "Chat Widget",
  "Iframe",
];

export default function CustomizationSection({ openPanel }: { openPanel?: string }) {
  const [open, setOpen] = useState<string | null>(openPanel ?? null);
  const [fields, setFields] = useState<string[]>(["Customer ID"]);
  const [newField, setNewField] = useState("");
  const [tags, setTags] = useState<string[]>(["VIP", "Trial"]);
  const [newTag, setNewTag] = useState("");
  const [widgetId, setWidgetId] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

  const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

  React.useEffect(() => {
    if (openPanel) setOpen(openPanel);
  }, [openPanel]);

  const addField = () => {
    const v = newField.trim();
    if (!v) return;
    setFields((s) => [...s, v]);
    setNewField("");
  };

  const addTag = () => {
    const v = newTag.trim();
    if (!v) return;
    setTags((s) => [...s, v]);
    setNewTag("");
  };

  return (
    <div className="p-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customization</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
            {items.map((it) => {
              const isOpen = open === it;
              return (
                <div key={it} className="bg-white dark:bg-slate-900">
                  <button
                    onClick={() => toggle(it)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-accent/50 hover:text-foreground transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`panel-${it.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <span className="font-medium">{it}</span>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div
                    id={`panel-${it.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`px-4 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 py-3" : "max-h-0 py-0"}`}
                  >
                    {it === "Custom fields" && (
                      <div>
                        <div className="flex flex-col gap-2 mb-3">
                          {fields.map((f) => (
                            <div key={f} className="text-sm px-2 py-1 bg-gray-50 dark:bg-slate-800 rounded">{f}</div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input value={newField} onChange={(e: any) => setNewField(e.target.value)} placeholder="Add custom field" />
                          <Button onClick={addField}>Add</Button>
                        </div>
                      </div>
                    )}

                    {it === "Tags" && (
                      <div>
                        <div className="flex gap-2 flex-wrap mb-3">
                          {tags.map((t) => (
                            <div key={t} className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded">{t}</div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input value={newTag} onChange={(e: any) => setNewTag(e.target.value)} placeholder="Add tag" />
                          <Button onClick={addTag}>Add</Button>
                        </div>
                      </div>
                    )}

                    {it === "Chat Widget" && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Configure your embeddable chat widget.</p>
                        <div className="flex gap-2">
                          <Input value={widgetId} onChange={(e: any) => setWidgetId(e.target.value)} placeholder="Widget ID or snippet" />
                          <Button onClick={() => navigator.clipboard?.writeText(widgetId || "")}>
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}

                    {it === "Iframe" && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Paste an iframe or URL to preview.</p>
                        <div className="flex gap-2 mb-3">
                          <Input value={iframeUrl} onChange={(e: any) => setIframeUrl(e.target.value)} placeholder="https://example.com/embed" />
                          <Button onClick={() => {}}>Save</Button>
                        </div>
                        {iframeUrl && (
                          <div className="border rounded overflow-hidden">
                            <iframe src={iframeUrl} title="iframe-preview" className="w-full h-48" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
