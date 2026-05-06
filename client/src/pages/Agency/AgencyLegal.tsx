import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Gavel, 
  Plus, 
  MoreVertical,
  History,
  FileCheck,
  Eye,
  Info,
  Edit,
  FilePlus,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

const AgencyLegal = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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
      
      {/* Single Unified Card Wrapper */}
      <div className={cn("w-full border rounded-xl transition-colors flex flex-col overflow-hidden bg-white",
        mode === "dark" ? "bg-[#1e293b] border-slate-700" : "border-slate-300")}>
        
        {/* Header Section */}
        <div className={cn("flex items-center gap-4 p-6 border-b transition-colors",
          mode === "dark" ? "border-slate-800" : "border-slate-300")}>
          <Gavel className={cn("w-7 h-7", mode === "dark" ? "text-slate-300" : "text-slate-800")} strokeWidth={1.5} />
          <div>
            <h1 className="text-[19px] font-bold tracking-tight text-slate-900 leading-tight">{t("agency.legal.title")}</h1>
            <p className="text-slate-500 text-[13px] font-medium leading-tight mt-0.5">{t("agency.legal.desc")}</p>
          </div>
        </div>

        {/* Tabs Section Integrated */}
        <Tabs defaultValue="active" className="w-full flex flex-col">
          <div className="w-full px-8 pt-4">
            <TabsList className={cn("h-auto p-0 bg-transparent flex justify-start gap-6 w-full rounded-none border-b",
              mode === "dark" ? "border-slate-800" : "border-slate-300")}>
              {[
                { id: "active", label: t("agency.legal.tabs.active") },
                { id: "history", label: t("agency.legal.tabs.history") },
                { id: "accepted", label: t("agency.legal.tabs.accepted") },
                { id: "accepted2", label: t("agency.legal.tabs.accepted") },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className={cn(
                    "px-1 py-3.5 rounded-none text-[15px] font-medium transition-all shadow-none mb-[-1px]",
                    "bg-transparent data-[state=active]:bg-transparent hover:bg-transparent",
                    "data-[state=active]:text-[#00e55e] data-[state=active]:border-b-[2px] data-[state=active]:border-[#00e55e] data-[state=active]:shadow-none",
                    "text-slate-800 border-b-[2px] border-transparent hover:text-[#00e55e] hover:border-[#00e55e]"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="active" className="m-0 focus-visible:outline-none">
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "border-slate-700" : "border-slate-300")}>
                <tr>
                  <th className="w-[25%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.checkbox")}</th>
                  <th className="w-[40%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.name")}</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.active_date")}</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest text-right">{t("agency.legal.table.action")}</th>
                </tr>
              </thead>
              <tbody className="transition-colors">
                {documents.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.checkbox}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.name}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.activeDate}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={cn("p-1 rounded transition-colors outline-none", mode === "dark" ? "text-gray-400 hover:text-white hover:bg-[#475569]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")}>
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 shadow-md">
                          <DropdownMenuItem className={cn("cursor-pointer", mode === "dark" ? "text-gray-300 focus:text-white focus:bg-[#334155]" : "text-slate-600 focus:text-slate-900 focus:bg-slate-50")}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>{t("agency.legal.actions.view")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={cn("cursor-pointer", mode === "dark" ? "text-blue-400 focus:text-blue-300 focus:bg-[#334155]" : "text-[#2563eb] focus:text-[#1d4ed8] focus:bg-slate-50")}
                            onClick={() => setIsEditModalOpen(true)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>{t("agency.legal.actions.edit")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={cn("cursor-pointer", mode === "dark" ? "text-red-400 focus:text-red-300 focus:bg-[#334155]" : "text-[#ef4444] focus:text-[#dc2626] focus:bg-slate-50")}
                            onClick={() => setIsAddModalOpen(true)}
                          >
                            <FilePlus className="mr-2 h-4 w-4" />
                            <span>{t("agency.legal.actions.add")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={cn("cursor-pointer", mode === "dark" ? "text-red-400 focus:text-red-300 focus:bg-[#334155]" : "text-[#ef4444] focus:text-[#dc2626] focus:bg-slate-50")}
                            onClick={() => setIsArchiveModalOpen(true)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t("agency.legal.actions.archive")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="history" className="m-0 focus-visible:outline-none">
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "border-slate-700" : "border-slate-300")}>
                <tr>
                  <th className="w-[15%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.checkbox")}</th>
                  <th className="w-[30%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.name")}</th>
                  <th className="w-[25%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.active_date")}</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.inactive_date")}</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest text-right">{t("agency.legal.table.action")}</th>
                </tr>
              </thead>
              <tbody className="transition-colors">
                {historyDocs.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.checkbox}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.name}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.activeDate}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.inactiveDate}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className={cn("p-1.5 rounded transition-colors", mode === "dark" ? "text-blue-400 hover:bg-blue-900/30" : "text-[#2563eb] hover:bg-blue-50")}>
                        <Eye size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="accepted" className="m-0 focus-visible:outline-none">
            <div className="px-6 py-5 pb-1">
              <div className={cn("px-4 py-2.5 rounded-md flex items-center gap-3 transition-colors border", 
                mode === "dark" ? "bg-sky-500/10 border-sky-500/30" : "bg-[#f0f9ff] border-[#bae6fd]")}>
                 <Info className="w-4 h-4 fill-[#0284c7] text-white shrink-0" />
                 <p className={cn("text-[13px]", mode === "dark" ? "text-sky-100/90" : "text-[#0369a1]")}>
                   {t("agency.legal.info.accepted_desc")}
                 </p>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "border-slate-700" : "border-slate-300")}>
                <tr>
                  <th className="w-[65%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.accepted_at")}</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="transition-colors">
                {acceptedDocs.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.name}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.acceptedAt}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className={cn("p-1.5 rounded transition-colors", mode === "dark" ? "text-blue-400 hover:bg-blue-900/30" : "text-[#2563eb] hover:bg-blue-50")}>
                        <Eye size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="accepted2" className="m-0 focus-visible:outline-none">
            <div className="px-6 py-5 pb-1">
              <div className={cn("px-4 py-2.5 rounded-md flex items-center gap-3 transition-colors border", 
                mode === "dark" ? "bg-sky-500/10 border-sky-500/30" : "bg-[#f0f9ff] border-[#bae6fd]")}>
                 <Info className="w-4 h-4 fill-[#0284c7] text-white shrink-0" />
                 <p className={cn("text-[13px]", mode === "dark" ? "text-sky-100/90" : "text-[#0369a1]")}>
                   {t("agency.legal.info.accepted_list")}
                 </p>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className={cn("border-b transition-colors", mode === "dark" ? "border-slate-700" : "border-slate-300")}>
                <tr>
                  <th className="w-[65%] px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t("agency.legal.table.accepted_at")}</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-900 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="transition-colors">
                {acceptedDocs2.map((doc, i) => (
                  <tr key={i} className={cn("transition-colors group", mode === "dark" ? "hover:bg-[#334155]/20" : "hover:bg-slate-50")}>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.name}
                    </td>
                    <td className={cn("px-6 py-3 text-[13px] font-medium", mode === "dark" ? "text-gray-300" : "text-slate-800")}>
                      {doc.acceptedAt}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className={cn("p-1.5 rounded transition-colors", mode === "dark" ? "text-blue-400 hover:bg-blue-900/30" : "text-[#2563eb] hover:bg-blue-50")}>
                        <Eye size={18} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

        </Tabs>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className={cn("w-full max-w-2xl rounded-xl shadow-2xl p-7 relative", 
            mode === "dark" ? "bg-[#1e293b]" : "bg-white")}>
            
            {/* Header */}
            <div>
              <h2 className={cn("text-xl font-semibold tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
                {t("agency.legal.modals.edit.title")}
              </h2>
              <p className={cn("text-[13px] mt-1", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                {t("agency.legal.modals.edit.desc")}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mt-6">
              {/* Document Name */}
              <div>
                <label className={cn("block text-[13px] font-semibold mb-1.5", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
                  {t("agency.legal.modals.edit.doc_name")}
                </label>
                <input 
                  type="text" 
                  defaultValue="Terms" 
                  className={cn("w-full px-3 py-2.5 border rounded-md text-[13px] outline-none transition-colors focus:ring-1 focus:ring-[#00e55e] focus:border-[#00e55e]",
                    mode === "dark" ? "bg-[#0f172a] border-[#00e55e] text-white" : "bg-white border-[#00e55e] text-slate-900")} 
                />
              </div>

              {/* Link Text */}
              <div>
                <label className={cn("block text-[13px] font-semibold mb-1.5", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
                  {t("agency.legal.modals.edit.link_text")}
                </label>
                <input 
                  type="text" 
                  defaultValue="Terms" 
                  className={cn("w-full px-3 py-2.5 border rounded-md text-[13px] outline-none transition-colors focus:ring-1 focus:ring-[#00e55e] focus:border-[#00e55e]",
                    mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                />
              </div>

              {/* Checkbox Text */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={cn("block text-[13px] font-semibold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
                    {t("agency.legal.modals.edit.checkbox_text_label")}
                  </label>
                  <button className={cn("text-[11px] px-2.5 py-0.5 rounded transition-colors border",
                    mode === "dark" ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200")}>
                    {t("agency.legal.modals.edit.doc_link_btn")}
                  </button>
                </div>
                <textarea 
                  defaultValue="I Accept the [LINK] and Conditions" 
                  className={cn("w-full px-3 py-2.5 border rounded-md text-[13px] outline-none transition-colors focus:ring-1 focus:ring-[#00e55e] focus:border-[#00e55e] min-h-[80px] resize-y",
                    mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                />
                <p className={cn("text-[12px] mt-1.5", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                  {t("agency.legal.modals.edit.preview")}: I Accept the <span className={cn(mode === "dark" ? "text-blue-400" : "text-[#0284c7]")}>Terms</span> and Conditions
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-2">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className={cn("px-4 py-2 text-[13px] font-medium border rounded-md transition-colors",
                  mode === "dark" ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50")}
              >
                Cancel
              </button>
              <button 
                className={cn("px-4 py-2 text-[13px] font-medium border rounded-md transition-colors",
                  mode === "dark" ? "border-[#00e55e] text-[#00e55e] hover:bg-[#00e55e]/10" : "bg-white border-[#00e55e] text-slate-900 hover:bg-[#00e55e]/5")}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className={cn("w-full max-w-2xl rounded-xl shadow-2xl p-7 relative", 
            mode === "dark" ? "bg-[#1e293b]" : "bg-white")}>
            
            {/* Header */}
            <div>
              <h2 className={cn("text-xl font-semibold tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
                {t("agency.legal.modals.edit.title")}
              </h2>
              <p className={cn("text-[13px] mt-1", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                {t("agency.legal.modals.edit.desc")}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mt-6">
              {/* Document Name */}
              <div>
                <label className={cn("block text-[13px] font-semibold mb-1.5", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
                  {t("agency.legal.modals.edit.doc_name")}
                </label>
                <input 
                  type="text" 
                  className={cn("w-full px-3 py-2.5 border rounded-md text-[13px] outline-none transition-colors focus:ring-1 focus:ring-[#00e55e] focus:border-[#00e55e]",
                    mode === "dark" ? "bg-[#0f172a] border-[#00e55e] text-white" : "bg-white border-[#00e55e] text-slate-900")} 
                />
              </div>

              {/* Link Text */}
              <div>
                <label className={cn("block text-[13px] font-semibold mb-1.5", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
                  {t("agency.legal.modals.edit.link_text")}
                </label>
                <input 
                  type="text" 
                  className={cn("w-full px-3 py-2.5 border rounded-md text-[13px] outline-none transition-colors focus:ring-1 focus:ring-[#00e55e] focus:border-[#00e55e]",
                    mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                />
              </div>

              {/* Checkbox Text */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={cn("block text-[13px] font-semibold", mode === "dark" ? "text-slate-200" : "text-slate-800")}>
                    {t("agency.legal.modals.edit.checkbox_text_label")}
                  </label>
                  <button className={cn("text-[11px] px-2.5 py-0.5 rounded transition-colors border",
                    mode === "dark" ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200")}>
                    {t("agency.legal.modals.edit.doc_link_btn")}
                  </button>
                </div>
                <textarea 
                  className={cn("w-full px-3 py-2.5 border rounded-md text-[13px] outline-none transition-colors focus:ring-1 focus:ring-[#00e55e] focus:border-[#00e55e] min-h-[80px] resize-y",
                    mode === "dark" ? "bg-[#0f172a] border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900")} 
                />
                <p className={cn("text-[12px] mt-1.5", mode === "dark" ? "text-slate-400" : "text-slate-500")}>
                  {t("agency.legal.modals.edit.preview")}:
                </p>
              </div>

              {/* File Upload Dropzone */}
              <div 
                className={cn("mt-4 border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors",
                  mode === "dark" ? "border-slate-700 hover:bg-slate-800/50" : "border-[#e2e8f0] hover:bg-slate-50")}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <FilePlus className="w-8 h-8 text-[#00e55e] mb-2" strokeWidth={1.5} />
                {selectedFile ? (
                  <span className={cn("text-[13px] font-medium text-center truncate w-full px-4", mode === "dark" ? "text-slate-300" : "text-slate-700")}>
                    {selectedFile.name}
                  </span>
                ) : (
                  <>
                    <span className="text-[#00e55e] text-[13px] font-medium mb-1">{t("agency.legal.modals.edit.file_upload_btn")}</span>
                    <span className="text-red-500 text-[11px]">{t("agency.legal.modals.edit.file_upload_warning")}</span>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-2">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className={cn("px-4 py-2 text-[13px] font-medium border rounded-md transition-colors",
                  mode === "dark" ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50")}
              >
                Cancel
              </button>
              <button 
                className={cn("px-4 py-2 text-[13px] font-medium border rounded-md transition-colors",
                  mode === "dark" ? "border-[#00e55e] text-[#00e55e] hover:bg-[#00e55e]/10" : "bg-white border-[#00e55e] text-slate-900 hover:bg-[#00e55e]/5")}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className={cn("w-full max-w-md rounded-xl shadow-2xl p-8 relative flex flex-col items-center text-center", 
            mode === "dark" ? "bg-[#1e293b]" : "bg-white")}>
            
            <AlertTriangle className="w-16 h-16 text-[#f97316] mb-3" strokeWidth={1.5} />
            
            <h2 className={cn("text-2xl font-bold tracking-tight", mode === "dark" ? "text-white" : "text-slate-900")}>
              {t("agency.legal.modals.archive.title")}
            </h2>
            <p className={cn("text-[13px] mt-2", mode === "dark" ? "text-slate-400" : "text-slate-700")}>
              {t("agency.legal.modals.archive.desc")}
            </p>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button 
                onClick={() => setIsArchiveModalOpen(false)}
                className={cn("px-6 py-2.5 text-[13.5px] font-medium border rounded transition-colors",
                  mode === "dark" ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50")}
              >
                {t("common.no")}
              </button>
              <button 
                onClick={() => setIsArchiveModalOpen(false)}
                className={cn("px-6 py-2.5 text-[13.5px] font-medium border rounded transition-colors",
                  mode === "dark" ? "border-[#00e55e] text-[#00e55e] hover:bg-[#00e55e]/10" : "bg-white border-[#00e55e] text-[#00e55e] hover:bg-[#00e55e]/5")}
              >
                {t("common.yes")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyLegal;
