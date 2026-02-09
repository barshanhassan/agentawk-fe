import React, { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles, Edit, Trash2, FileText } from "lucide-react";

interface Topic {
  id: string;
  name: string;
}

export default function AITopicsSection() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const handlePublish = () => {
    if (formData.name.trim()) {
      const newTopic: Topic = {
        id: String(topics.length + 1),
        name: formData.name,
      };
      setTopics([...topics, newTopic]);
      setFormData({ name: "" });
      setIsCreateFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "" });
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
                <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add Topic</h2>
                  <p className="text-sm text-muted-foreground">Create a new AI topic</p>
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
                  <label className="block text-sm font-medium mb-2 text-foreground">Topic Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter topic name"
                  />
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
                Add Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show topics list or empty state
  return (
    <div className="p-6 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center justify-between">
            Ai Topics
            <Button 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary hover:text-white"
              onClick={() => setIsCreateFormOpen(true)}
            >
              Add a topic
            </Button>
          </CardTitle>
          <CardDescription>Manage your AI topics</CardDescription>
        </div>
      </CardHeader>
      <Separator className="bg-gray-200 dark:bg-slate-800 mb-6" />

      {topics.length === 0 ? (
        // Empty State
        <div className="flex-1 flex flex-col items-center justify-center border rounded-lg bg-white dark:bg-slate-900 py-24">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-full mb-4">
            <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">No topic found</h3>
          <p className="text-sm text-muted-foreground mb-6">Click the button below to add a new topic</p>
          <Button 
            variant="outline" 
            className="text-primary border-primary hover:bg-primary hover:text-white"
            onClick={() => setIsCreateFormOpen(true)}
          >
            Add a topic
          </Button>
        </div>
      ) : (
        // Topics Table
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
                {topics.map((topic, index) => (
                  <tr
                    key={topic.id}
                    className={`border-b hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${
                      index % 2 === 0 ? "bg-white dark:bg-slate-900/20" : "bg-gray-50/50 dark:bg-slate-800/10"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-muted-foreground" />
                        <span className="font-medium">{topic.name}</span>
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
                          onClick={() => handleDeleteTopic(topic.id)}
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
            Showing {topics.length} of {topics.length} topics
          </div>
        </div>
      )}
    </div>
  );
}
