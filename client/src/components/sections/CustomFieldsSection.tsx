import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal, Copy, Database, Globe, DollarSign, Calendar, Clock, Type, Lock, Hash, Phone, Mail, Link, Code, ChevronDown, Plus, X } from "lucide-react";

interface CustomField {
  id: string;
  name: string;
  contentType: string;
  dataFormat: string;
}

export default function CustomFieldsSection() {
  const [fields] = useState<CustomField[]>([
    { id: "valor_oportunidade", name: "valor_oportunidade", contentType: "00 NUMBER", dataFormat: "text" },
    { id: "min_max_length", name: "min max length", contentType: "00 NUMBER", dataFormat: "text" },
    { id: "resposta_cal", name: "resposta_cal", contentType: "TEXT", dataFormat: "textarea" },
    { id: "audio", name: "audio", contentType: "URL", dataFormat: "text" },
    { id: "whisperer", name: "whisperer", contentType: "TEXT", dataFormat: "text" },
    { id: "whisperer_resposta", name: "whisperer_resposta", contentType: "TEXT", dataFormat: "textarea" },
    { id: "event_id", name: "event_id", contentType: "TEXT", dataFormat: "text" },
    { id: "customfieldjson", name: "CustomFieldJSON", contentType: "JSON", dataFormat: "textarea" },
    { id: "teste_edilson_apagar", name: "teste_edilson_apagar", contentType: "TEXT", dataFormat: "textarea" },
    { id: "lower_case_test", name: "lower case test", contentType: "FIXED", dataFormat: "text" },
  ]);

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    systemName: "",
    description: "",
    dataType: "",
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(fields.map((f) => f.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleCreateField = () => {
    if (formData.displayName.trim() && formData.systemName.trim() && formData.dataType) {
      // TODO: API call to create field
      console.log("Creating field:", formData);
      setFormData({ displayName: "", systemName: "", description: "", dataType: "" });
      setIsCreateFieldOpen(false);
    }
  };

  const isAllSelected = selectedRows.size === fields.length && fields.length > 0;

  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <Database className="w-8 h-8 text-black dark:text-white" />
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center justify-between">
            Custom fields
            <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white" onClick={() => setIsCreateFieldOpen(true)}>+ Create New</Button>
          </CardTitle>
          <CardDescription>Efficiently manage custom fields and associate them with Contacts, Companies, or Opportunities</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      <Card className="flex-1 overflow-hidden flex flex-col border-0 shadow-none">
        <div className="border-b p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Root</span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <button 
              onClick={() => setIsCreateFieldOpen(true)}
              className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded cursor-pointer transition-colors"
              title="Add new folder"
            >
              <Plus size={16} className="text-slate-600" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">51 out of 50</span>
            
            {/* Content Type Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-xs px-2 py-1 border rounded bg-white dark:bg-slate-900 hover:bg-gray-50">
                <span>Content Type</span>
                <ChevronDown size={14} />
              </button>
              
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 border rounded-lg shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs">All</div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Globe size={14} className="text-slate-600" /> Country
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <DollarSign size={14} className="text-slate-600" /> Currency
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Calendar size={14} className="text-slate-600" /> Date
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Clock size={14} className="text-slate-600" /> Datetime
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Type size={14} className="text-slate-600" /> Text
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Lock size={14} className="text-slate-600" /> Fixed value
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Hash size={14} className="text-slate-600" /> Numbers
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Phone size={14} className="text-slate-600" /> Phone
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Mail size={14} className="text-slate-600" /> E-mail
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Link size={14} className="text-slate-600" /> URL
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs flex items-center gap-2">
                    <Code size={14} className="text-slate-600" /> JSON
                  </div>
                </div>
              </div>
            </div>

            <select className="text-xs px-2 py-1 border rounded bg-white dark:bg-slate-900">
              <option>From oldest</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Content Type</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Data Format</th>
                <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr
                  key={field.id}
                  className={`border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${
                    index % 2 === 0 ? "bg-white dark:bg-slate-900/20" : "bg-gray-50/50 dark:bg-slate-800/10"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(field.id)} 
                      onChange={(e) => handleSelectRow(field.id, e.target.checked)}
                      className="rounded" 
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{field.name}</td>
                  <td className="px-4 py-3 text-muted-foreground flex items-center gap-1">
                    {field.id}
                    <Copy size={14} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground">{field.contentType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground">{field.dataFormat}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <Edit size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <Trash2 size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 bg-gray-50 dark:bg-slate-800/50 text-xs text-muted-foreground">
          Showing {fields.length} of {fields.length} custom fields
        </div>
      </Card>

      {/* Create Custom Field Modal */}
      {isCreateFieldOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-6 text-foreground">Create custom field</h2>

            <div className="space-y-5">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Display name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-green-500 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter display name"
                />
              </div>

              {/* System Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground flex items-center gap-1">
                  System name
                  <span className="text-primary cursor-help" title="System name is used for API references">ⓘ</span>
                </label>
                <input
                  type="text"
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter system name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground flex items-center gap-1">
                  Give a description (optional)
                  <span className="text-primary cursor-help" title="Add helpful description for users">ⓘ</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Enter description"
                  rows={4}
                />
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  What type of data you want to collect?
                </label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select data type</option>
                  <option value="text">Text</option>
                  <option value="number">Numbers</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Phone</option>
                  <option value="date">Date</option>
                  <option value="datetime">Datetime</option>
                  <option value="url">URL</option>
                  <option value="country">Country</option>
                  <option value="currency">Currency</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-7">
              <button
                onClick={() => {
                  setIsCreateFieldOpen(false);
                  setFormData({ displayName: "", systemName: "", description: "", dataType: "" });
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateField}
                disabled={!formData.displayName.trim() || !formData.systemName.trim() || !formData.dataType}
                className="px-4 py-2 bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-md text-sm font-medium transition-colors"
              >
                + Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
