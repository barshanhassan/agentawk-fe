import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Gavel, 
  Plus, 
  MoreVertical,
  History,
  FileCheck,
  Eye,
  Info
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AgencyLegal = () => {
  const { mode } = useTheme();
  
  const documents = [
    { checkbox: "Checkbox #1", name: "Terms", activeDate: "2024-03-18 12:29 am" },
    { checkbox: "Checkbox #2", name: "Termos de Uso", activeDate: "2024-03-17 11:53 pm" },
  ];

  const historyDocs = [
    { checkbox: "Checkbox #1", name: "Termos e Condicoes", activeDate: "2024-03-17 11:52 pm", inactiveDate: "2024-03-17 07:29 pm" },
    { checkbox: "Checkbox #2", name: "T&C 2", activeDate: "2024-03-17 11:40 pm", inactiveDate: "2024-03-17 06:53 pm" },
    { checkbox: "Checkbox #1", name: "Nome", activeDate: "2024-03-17 11:39 pm", inactiveDate: "2024-03-17 07:29 pm" },
  ];

  const acceptedDocs = [
    { name: "Terms", acceptedAt: "2025-12-04 04:46 am" },
    { name: "Termos de Uso", acceptedAt: "2025-12-04 04:46 am" },
  ];

  const acceptedDocs2 = [
    { name: "New Privacy Policy", acceptedAt: "2023-12-29 11:25 am" },
    { name: "New Terms and Conditions", acceptedAt: "2023-12-29 11:25 am" },
  ];

  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", 
      mode === "dark" ? "text-white" : "text-slate-900")}>
      {/* Header Section */}
      <div className={cn("flex items-center justify-between mb-8 p-4 rounded-md border shadow-sm transition-colors", 
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded", mode === "dark" ? "bg-[#334155]" : "bg-slate-100")}>
            <Gavel className={cn("w-6 h-6", mode === "dark" ? "text-white" : "text-primary")} />
          </div>
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-tight">Legal Documents</h1>
            <p className="text-gray-400 text-sm font-medium">Create legal documents to obtain consent from your Agency Team.</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className={cn("bg-transparent border-b w-full justify-start rounded-none h-12 p-0 gap-8 transition-colors",
          mode === "dark" ? "border-slate-700" : "border-slate-100")}>
          <TabsTrigger 
            value="active" 
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-bold transition-colors",
              mode === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-500 data-[state=active]:text-slate-900"
            )}
          >
            Active
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-bold transition-colors",
              mode === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-500 data-[state=active]:text-slate-900"
            )}
          >
            History
          </TabsTrigger>
          <TabsTrigger 
            value="accepted" 
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-bold transition-colors",
              mode === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-500 data-[state=active]:text-slate-900"
            )}
          >
            Accepted Terms
          </TabsTrigger>
          <TabsTrigger 
            value="accepted2" 
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full font-bold transition-colors",
              mode === "dark" ? "text-gray-400 data-[state=active]:text-white" : "text-gray-500 data-[state=active]:text-slate-900"
            )}
          >
            Your Accepted Terms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-8">
          <div className={cn("rounded-lg border overflow-hidden transition-colors", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-100")}>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Checkbox</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
                {documents.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-4 text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                      {doc.checkbox}
                    </td>
                    <td className={cn("px-6 py-4 text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {doc.activeDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={cn("p-1 rounded transition-colors", mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-400 hover:text-primary hover:bg-slate-100")}>
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <div className={cn("rounded-lg border overflow-hidden transition-colors", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-100")}>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Checkbox</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inactive Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
                {historyDocs.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-4 text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                      {doc.checkbox}
                    </td>
                    <td className={cn("px-6 py-4 text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {doc.activeDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {doc.inactiveDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={cn("p-1 rounded transition-colors", mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-400 hover:text-primary hover:bg-slate-100")}>
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="accepted" className="mt-8 space-y-4">
          <div className={cn("p-3 rounded-md flex items-center gap-3 transition-colors border", 
            mode === "dark" ? "bg-sky-500/10 border-sky-500/30" : "bg-sky-50 border-sky-200")}>
             <Info className="w-4 h-4 text-sky-500" />
             <p className={cn("text-[13px] font-bold", mode === "dark" ? "text-sky-100/90" : "text-sky-800")}>These are the terms and conditions that you have accepted as a user.</p>
          </div>

          <div className={cn("rounded-lg border overflow-hidden transition-colors", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-100")}>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accepted At</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
                {acceptedDocs.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-4 text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {doc.acceptedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={cn("p-1 rounded transition-colors", mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-400 hover:text-primary hover:bg-slate-100")}>
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="accepted2" className="mt-8 space-y-4">
          <div className={cn("p-3 rounded-md flex items-center gap-3 transition-colors border", 
            mode === "dark" ? "bg-sky-500/10 border-sky-500/30" : "bg-sky-50 border-sky-200")}>
             <Info className="w-4 h-4 text-sky-500" />
             <p className={cn("text-[13px] font-bold", mode === "dark" ? "text-sky-100/90" : "text-sky-800")}>Following is the list of your accepted Terms and Conditions</p>
          </div>

          <div className={cn("rounded-lg border overflow-hidden transition-colors", 
            mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200")}>
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "bg-[#1e293b] border-slate-700" : "bg-slate-50 border-slate-100")}>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accepted At</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y transition-colors", mode === "dark" ? "divide-slate-700" : "divide-slate-100")}>
                {acceptedDocs2.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-4 text-sm font-bold", mode === "dark" ? "text-gray-300" : "text-slate-700")}>
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                      {doc.acceptedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={cn("p-1 rounded transition-colors", mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-400 hover:text-primary hover:bg-slate-100")}>
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgencyLegal;
