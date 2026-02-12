import React, { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Play, History, Download, Trash2, Sparkles } from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: string;
  lastRun?: string;
}

export default function AIReportBuilderSection() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    reportType: "Text type",
    llmModel: "gpt-4o-mini",
    prompt: "",
  });

  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "report creating for haider test",
      type: "Graph type",
      lastRun: undefined,
    },
    {
      id: "2",
      name: "Test builder",
      type: "Text type",
      lastRun: "2025-12-24 04:56 am",
    },
    {
      id: "3",
      name: "Test-Tiago-Delet",
      type: "Graph type",
      lastRun: "2025-11-18 01:52 pm",
    },
    {
      id: "4",
      name: "Custom field test",
      type: "Text type",
      lastRun: undefined,
    },
    {
      id: "5",
      name: "Ads",
      type: "Text type",
      lastRun: undefined,
    },
    {
      id: "6",
      name: "Teste Live",
      type: "Text type",
      lastRun: "2025-10-08 08:32 pm",
    },
    {
      id: "7",
      name: "Roger III",
      type: "Graph type",
      lastRun: "2025-10-08 08:32 pm",
    },
  ]);

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const handlePublish = () => {
    if (formData.name.trim() && formData.prompt.trim()) {
      const newReport: Report = {
        id: String(reports.length + 1),
        name: formData.name,
        type: formData.reportType,
        lastRun: undefined,
      };
      setReports([...reports, newReport]);
      setFormData({
        name: "",
        reportType: "Text type",
        llmModel: "gpt-4o-mini",
        prompt: "",
      });
      setIsCreateFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      reportType: "Text type",
      llmModel: "gpt-4o-mini",
      prompt: "",
    });
    setIsCreateFormOpen(false);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {!isCreateFormOpen && (
        <>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
            <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg flex items-center justify-between">
                Report Builder
                <Button 
                  variant="outline" 
                  className="btn-outline-primary h-9 px-4"
                  onClick={() => setIsCreateFormOpen(true)}
                >
                  + Add New
                </Button>
              </CardTitle>
              <CardDescription>Generate reports with Artificial Intelligence</CardDescription>
            </div>
          </CardHeader>
          <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

          <div className="flex-1 overflow-hidden flex flex-col border rounded-lg bg-white dark:bg-slate-900">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText size={14} />
                        Name
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Last Run</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={report.id}
                      className={`border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${
                        index % 2 === 0 ? "bg-white dark:bg-slate-900/20" : "bg-gray-50/50 dark:bg-slate-800/10"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-amber-700 dark:text-amber-500 font-medium">{report.type}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {report.lastRun || "-"}
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
                            className="p-1.5 bg-green-500/10 hover:bg-green-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                            title="Run"
                          >
                            <Play size={16} className="text-green-600 dark:text-green-400" />
                          </button>
                          {report.lastRun && (
                            <>
                              <button 
                                className="p-1.5 bg-gray-500/10 hover:bg-gray-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                                title="History"
                              >
                                <History size={16} className="text-gray-600 dark:text-gray-400" />
                              </button>
                              <button 
                                className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                                title="Download"
                              >
                                <Download size={16} className="text-purple-600 dark:text-purple-400" />
                              </button>
                            </>
                          )}
                          <button 
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm rounded transition-all hover:scale-110"
                            title="Delete"
                            onClick={() => handleDeleteReport(report.id)}
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
              Showing {reports.length} of {reports.length} reports
            </div>
          </div>
        </>
      )}

      {/* Create/Edit Form */}
      {isCreateFormOpen && (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Report Builder</h2>
                  <p className="text-sm text-muted-foreground">Generate reports with Artificial Intelligence</p>
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
                    placeholder="Enter report name"
                  />
                </div>

                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Select report type</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Text type">Text type</option>
                    <option value="Graph type">Graph type</option>
                  </select>
                </div>

                {/* LLM Model */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Select LLM model</label>
                  <select
                    value={formData.llmModel}
                    onChange={(e) => setFormData({ ...formData, llmModel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-4-turbo">gpt-4-turbo</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  </select>
                </div>

                {/* Prompt */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground flex items-center justify-between">
                    Prompt
                    <button className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-sm rounded transition-all">
                      <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                    </button>
                  </label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={12}
                    placeholder="Enter your prompt here..."
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Generate result as a PDF file link</span>
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
                disabled={!formData.name.trim() || !formData.prompt.trim()}
                className="btn-outline-primary h-9 px-6 font-medium"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
