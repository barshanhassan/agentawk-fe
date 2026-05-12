import React, { useState, useRef, useEffect } from 'react';
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
  AlertTriangle,
  X,
  Upload
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

  // Force hide browser scrollbar for this page
  useEffect(() => {
    const targets: { el: HTMLElement; orig: string }[] = [];

    const hide = (el: HTMLElement | null) => {
      if (!el) return;
      targets.push({ el, orig: el.style.overflowY });
      el.style.overflowY = 'hidden';
    };

    hide(document.documentElement as HTMLElement);
    hide(document.body);

    let node = document.querySelector('main') as HTMLElement | null;
    while (node) {
      hide(node);
      node = node.parentElement as HTMLElement | null;
    }

    return () => {
      targets.forEach(({ el, orig }) => { el.style.overflowY = orig; });
    };
  }, []);
  
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

  const dark = mode === 'dark';
  const bg     = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={cn("h-screen overflow-hidden transition-colors flex flex-col font-sans", bg)}>
      
      {/* ── Header Card ── */}
      <div className={cn('px-8 py-5 border-b flex items-center justify-between', card, border)}>
        <div className="flex items-center gap-4">
          <div className={cn('p-2.5 rounded-xl shadow-sm', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <Gavel className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className={cn('text-[15px] font-bold', text)}>{t("agency.legal.title")}</h1>
            <p className={cn('text-[11px] mt-0.5', sub)}>
              {t("agency.legal.desc")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-8">
        {/* Unified Main Card */}
        <div className={cn("flex flex-col rounded-2xl border overflow-hidden shadow-sm h-fit max-h-[calc(100vh-220px)]", card, border)}>
          
          <Tabs defaultValue="active" className="flex-1 flex flex-col overflow-hidden">
            <div className={cn("px-8 pt-4 border-b", border)}>
              <TabsList className="h-auto p-0 bg-transparent flex justify-start gap-8 w-full rounded-none">
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
                      "px-0 py-4 rounded-none text-[13px] font-bold transition-all shadow-none data-[state=active]:shadow-none mb-[-1px] border-b-2 border-transparent",
                      "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary",
                      dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-700"
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Content Areas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              
              <TabsContent value="active" className="m-0 focus-visible:outline-none">
                <table className="w-full text-left border-collapse">
                  <thead className={cn("sticky top-0 z-10 border-b", dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/80 border-slate-100")}>
                    <tr>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.checkbox")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.name")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.active_date")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest text-right", sub)}>{t("agency.legal.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", dark ? "divide-slate-800/50" : "divide-slate-50")}>
                    {documents.map((doc, i) => (
                      <tr key={i} className={cn("transition-colors group", dark ? "hover:bg-slate-800/25" : "hover:bg-slate-50/70")}>
                        <td className={cn("px-8 py-4 text-[13px] font-bold", text)}>{doc.checkbox}</td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-60" />
                            <span className={cn("text-[13px] font-bold", text)}>{doc.name}</span>
                          </div>
                        </td>
                        <td className={cn("px-8 py-4 text-[13px] font-medium", sub)}>{doc.activeDate}</td>
                        <td className="px-8 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className={cn("p-1.5 rounded-lg transition-all", 
                                dark ? "text-slate-500 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100")}>
                                <MoreVertical size={16} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={cn("w-44 p-1.5 shadow-xl border", dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                              <DropdownMenuItem className="cursor-pointer rounded-md gap-2 text-[12px] font-bold">
                                <Eye size={14} className="text-primary" /> {t("agency.legal.actions.view")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="cursor-pointer rounded-md gap-2 text-[12px] font-bold">
                                <Edit size={14} className="text-primary" /> {t("agency.legal.actions.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setIsAddModalOpen(true)} className="cursor-pointer rounded-md gap-2 text-[12px] font-bold">
                                <Plus size={14} className="text-primary" /> {t("agency.legal.actions.add")}
                              </DropdownMenuItem>
                              <div className={cn("h-px my-1", dark ? "bg-slate-800" : "bg-slate-100")} />
                              <DropdownMenuItem onClick={() => setIsArchiveModalOpen(true)} className="cursor-pointer rounded-md gap-2 text-[12px] font-bold text-rose-500">
                                <Trash2 size={14} /> {t("agency.legal.actions.archive")}
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
                <table className="w-full text-left border-collapse">
                  <thead className={cn("sticky top-0 z-10 border-b", dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/80 border-slate-100")}>
                    <tr>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.checkbox")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.name")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.active_date")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.inactive_date")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest text-right", sub)}>{t("agency.legal.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", dark ? "divide-slate-800/50" : "divide-slate-50")}>
                    {historyDocs.map((doc, i) => (
                      <tr key={i} className={cn("transition-colors group", dark ? "hover:bg-slate-800/25" : "hover:bg-slate-50/70")}>
                        <td className={cn("px-8 py-4 text-[13px] font-bold", text)}>{doc.checkbox}</td>
                        <td className={cn("px-8 py-4 text-[13px] font-bold", text)}>{doc.name}</td>
                        <td className={cn("px-8 py-4 text-[13px] font-medium", sub)}>{doc.activeDate}</td>
                        <td className={cn("px-8 py-4 text-[13px] font-medium", sub)}>{doc.inactiveDate}</td>
                        <td className="px-8 py-4 text-right">
                          <button className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>

              <TabsContent value="accepted" className="m-0 focus-visible:outline-none">
                <div className="px-8 py-6">
                  <div className={cn("p-4 rounded-xl flex items-center gap-4 transition-colors border shadow-sm", 
                    dark ? "bg-primary/5 border-primary/20" : "bg-primary/5 border-primary/10")}>
                    <Info className="w-5 h-5 text-primary shrink-0" />
                    <p className={cn("text-[13px] font-bold", dark ? "text-slate-300" : "text-slate-700")}>
                      {t("agency.legal.info.accepted_desc")}
                    </p>
                  </div>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className={cn("sticky top-0 z-10 border-b", dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/80 border-slate-100")}>
                    <tr>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>Name</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.accepted_at")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest text-right", sub)}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", dark ? "divide-slate-800/50" : "divide-slate-50")}>
                    {acceptedDocs.map((doc, i) => (
                      <tr key={i} className={cn("transition-colors group", dark ? "hover:bg-slate-800/25" : "hover:bg-slate-50/70")}>
                        <td className={cn("px-8 py-4 text-[13px] font-bold", text)}>{doc.name}</td>
                        <td className={cn("px-8 py-4 text-[13px] font-medium", sub)}>{doc.acceptedAt}</td>
                        <td className="px-8 py-4 text-right">
                          <button className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>

              <TabsContent value="accepted2" className="m-0 focus-visible:outline-none">
                <div className="px-8 py-6">
                  <div className={cn("p-4 rounded-xl flex items-center gap-4 transition-colors border shadow-sm", 
                    dark ? "bg-primary/5 border-primary/20" : "bg-primary/5 border-primary/10")}>
                    <Info className="w-5 h-5 text-primary shrink-0" />
                    <p className={cn("text-[13px] font-bold", dark ? "text-slate-300" : "text-slate-700")}>
                      {t("agency.legal.info.accepted_list")}
                    </p>
                  </div>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className={cn("sticky top-0 z-10 border-b", dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/80 border-slate-100")}>
                    <tr>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>Name</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.table.accepted_at")}</th>
                      <th className={cn("px-8 py-3 text-[10px] font-black uppercase tracking-widest text-right", sub)}>Action</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", dark ? "divide-slate-800/50" : "divide-slate-50")}>
                    {acceptedDocs2.map((doc, i) => (
                      <tr key={i} className={cn("transition-colors group", dark ? "hover:bg-slate-800/25" : "hover:bg-slate-50/70")}>
                        <td className={cn("px-8 py-4 text-[13px] font-bold", text)}>{doc.name}</td>
                        <td className={cn("px-8 py-4 text-[13px] font-medium", sub)}>{doc.acceptedAt}</td>
                        <td className="px-8 py-4 text-right">
                          <button className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className={cn("w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300", card, border)}>
            <div className={cn("px-8 py-6 border-b flex items-center justify-between", border)}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", dark ? "bg-primary/15" : "bg-primary/10")}>
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className={cn("text-[15px] font-black uppercase tracking-wide", text)}>{t("agency.legal.modals.edit.title")}</h2>
                  <p className={cn("text-[11px] font-bold", sub)}>{t("agency.legal.modals.edit.desc")}</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className={cn("p-2 rounded-lg transition-colors hover:bg-slate-100", dark ? "hover:bg-slate-800" : "")}>
                <X size={18} />
              </button>
            </div>

            <div className="px-8 py-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={cn("block text-[12px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.modals.edit.doc_name")}</label>
                  <input 
                    type="text" 
                    defaultValue="Terms" 
                    className={cn("w-full px-4 py-2.5 rounded-xl border text-[13px] font-bold outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                      dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={cn("block text-[12px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.modals.edit.link_text")}</label>
                  <input 
                    type="text" 
                    defaultValue="Terms" 
                    className={cn("w-full px-4 py-2.5 rounded-xl border text-[13px] font-bold outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                      dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className={cn("text-[12px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.modals.edit.checkbox_text_label")}</label>
                  <button className="text-[11px] font-bold px-3 py-1 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-all">
                    {t("agency.legal.modals.edit.doc_link_btn")}
                  </button>
                </div>
                <textarea 
                  defaultValue="I Accept the [LINK] and Conditions" 
                  className={cn("w-full px-4 py-3 rounded-xl border text-[13px] font-bold outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 min-h-[100px] resize-none",
                    dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900")} 
                />
                <div className={cn("p-3 rounded-lg border border-dashed text-[12px] font-bold flex gap-2", border)}>
                  <Info size={14} className="text-primary shrink-0 mt-0.5" />
                  <p className={sub}>
                    {t("agency.legal.modals.edit.preview")}: I Accept the <span className="text-primary underline">Terms</span> and Conditions
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("px-8 py-5 border-t flex justify-end gap-3", border, dark ? "bg-slate-900/30" : "bg-slate-50/50")}>
              <button onClick={() => setIsEditModalOpen(false)} className={cn("px-6 py-2.5 text-[13px] font-bold rounded-xl transition-all border", 
                dark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-white")}>
                Cancel
              </button>
              <button className="px-10 py-2.5 text-[13px] font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className={cn("w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden", card, border)}>
            <div className={cn("px-8 py-6 border-b flex items-center justify-between", border)}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", dark ? "bg-primary/15" : "bg-primary/10")}>
                  <FilePlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className={cn("text-[15px] font-black uppercase tracking-wide", text)}>{t("agency.legal.modals.edit.title")}</h2>
                  <p className={cn("text-[11px] font-bold", sub)}>{t("agency.legal.modals.edit.desc")}</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className={cn("p-2 rounded-lg transition-colors hover:bg-slate-100", dark ? "hover:bg-slate-800" : "")}>
                <X size={18} />
              </button>
            </div>

            <div className="px-8 py-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={cn("block text-[12px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.modals.edit.doc_name")}</label>
                  <input type="text" className={cn("w-full px-4 py-2.5 rounded-xl border text-[13px] font-bold outline-none transition-all", dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-slate-50 border-slate-200")} />
                </div>
                <div className="space-y-2">
                  <label className={cn("block text-[12px] font-black uppercase tracking-widest", sub)}>{t("agency.legal.modals.edit.link_text")}</label>
                  <input type="text" className={cn("w-full px-4 py-2.5 rounded-xl border text-[13px] font-bold outline-none transition-all", dark ? "bg-slate-950/50 border-slate-800 text-white" : "bg-slate-50 border-slate-200")} />
                </div>
              </div>

              <div 
                className={cn("border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group",
                  dark ? "border-slate-800 hover:bg-primary/5 hover:border-primary/50" : "border-slate-200 hover:bg-primary/5 hover:border-primary/30")}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm", dark ? "bg-slate-900" : "bg-slate-50")}>
                  <Upload className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                {selectedFile ? (
                  <span className={cn("text-[13px] font-black truncate max-w-sm px-4", text)}>{selectedFile.name}</span>
                ) : (
                  <div className="text-center space-y-1">
                    <span className="text-primary text-[13px] font-black uppercase tracking-widest block">{t("agency.legal.modals.edit.file_upload_btn")}</span>
                    <span className="text-rose-500 text-[11px] font-bold uppercase">{t("agency.legal.modals.edit.file_upload_warning")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={cn("px-8 py-5 border-t flex justify-end gap-3", border, dark ? "bg-slate-900/30" : "bg-slate-50/50")}>
              <button onClick={() => setIsAddModalOpen(false)} className={cn("px-6 py-2.5 text-[13px] font-bold rounded-xl border", dark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-white")}>Cancel</button>
              <button className="px-10 py-2.5 text-[13px] font-bold rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Upload Document</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Archive Modal ── */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className={cn("w-full max-w-md rounded-[32px] shadow-2xl border p-10 relative flex flex-col items-center text-center transition-all animate-in fade-in zoom-in duration-300", card, border)}>
            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner", dark ? "bg-rose-950/20" : "bg-rose-50")}>
              <AlertTriangle className="w-10 h-10 text-rose-500" strokeWidth={1.5} />
            </div>
            <h2 className={cn("text-2xl font-black tracking-tight", text)}>{t("agency.legal.modals.archive.title")}</h2>
            <p className={cn("text-[13px] mt-3 font-medium px-4 leading-relaxed", sub)}>{t("agency.legal.modals.archive.desc")}</p>

            <div className="flex items-center justify-center gap-4 mt-10 w-full">
              <button onClick={() => setIsArchiveModalOpen(false)} className={cn("flex-1 py-3 text-[13px] font-black uppercase tracking-widest border rounded-xl transition-all", dark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                {t("common.no")}
              </button>
              <button onClick={() => setIsArchiveModalOpen(false)} className="flex-1 py-3 text-[13px] font-black uppercase tracking-widest bg-rose-500 text-white rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
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
