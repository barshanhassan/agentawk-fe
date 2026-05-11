import React, { useState } from 'react';
import { getUserInfo } from "@/lib/auth";
import { Shield, Plus, Archive, RotateCcw, Pencil, ShieldCheck, ShieldOff, Sparkles, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import AddRoleForm from "./AddRoleForm";
import { useTranslation } from 'react-i18next';

const ROW_ACCENTS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500',  'bg-rose-500', 'bg-cyan-500',
  'bg-indigo-500', 'bg-teal-500',
];

const AgencyRoles = () => {
  const { mode } = useTheme();
  const { t } = useTranslation();
  const dark = mode === 'dark';
  const [viewMode, setViewMode] = useState<'LIST' | 'ADD' | 'EDIT'>('LIST');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id;

  const { data: rolesResponse, isLoading } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/roles`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/agencies/${agencyId}/roles`);
      return res.json();
    },
  });

  const toggleArchiveMutation = useMutation({
    mutationFn: async (role: any) => {
      const res = await apiRequest("PATCH", `/api/agencies/${agencyId}/roles/${role.id}`, {
        status: role.status === 'ACTIVE' ? 'ARCHIVE' : 'ACTIVE',
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/roles`] });
      toast({ title: t('common.success') });
    },
  });

  const allRoles = rolesResponse?.roles || [];
  const activeRoles  = allRoles.filter((r: any) => r.status === 'ACTIVE');
  const archivedRoles = allRoles.filter((r: any) => r.status === 'ARCHIVE');
  const displayRoles = activeTab === 'active' ? activeRoles : archivedRoles;

  if (viewMode === 'ADD' || viewMode === 'EDIT') {
    return (
      <AddRoleForm
        onCancel={() => { setViewMode('LIST'); setSelectedRole(null); }}
        initialData={selectedRole}
      />
    );
  }

  const bg   = dark ? 'bg-[#0b1120]'  : 'bg-slate-50/80';
  const card = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text = dark ? 'text-white'    : 'text-slate-900';
  const sub  = dark ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={cn('min-h-screen transition-colors', bg)}>

      {/* ── Header ── */}
      <div className={cn('px-8 py-5 border-b flex items-center justify-between', card, border)}>
        <div className="flex items-center gap-4">
          <div className={cn('p-2.5 rounded-xl', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className={cn('text-[15px] font-bold', text)}>{t('nav.roles')}</h1>
            <p className={cn('text-[11px] mt-0.5', sub)}>
              {activeRoles.length} active · {archivedRoles.length} archived
            </p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedRole(null); setViewMode('ADD'); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-colors shadow-sm"
        >
          <Plus size={14} /> {t('agency.roles.add')}
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div className={cn('px-8 border-b flex items-center gap-0', card, border)}>
        {([
          { key: 'active',   label: t('common.active'),   icon: <ShieldCheck size={13} />, count: activeRoles.length },
          { key: 'archived', label: t('common.archived'), icon: <ShieldOff size={13} />,   count: archivedRoles.length },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-3.5 text-[12px] font-semibold border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : cn('border-transparent', sub, 'hover:text-slate-300')
            )}
          >
            {tab.icon}
            {tab.label}
            <span className={cn(
              'ml-0.5 min-w-[18px] text-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
              activeTab === tab.key
                ? 'bg-primary/10 text-primary'
                : dark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table area ── */}
      <div className="px-8 py-6">
        <div className={cn('rounded-xl border overflow-hidden', card, border)}>

          {/* Column headers */}
          {!isLoading && displayRoles.length > 0 && (
            <div className={cn(
              'grid items-center px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border-b',
              dark ? 'text-slate-600 border-slate-800 bg-slate-900/30' : 'text-slate-400 border-slate-100 bg-slate-50/60'
            )}
              style={{ gridTemplateColumns: '2.5rem 1fr 10rem 7rem 7rem 6rem' }}
            >
              <span />
              <span>Role</span>
              <span>Permissions</span>
              <span>Type</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
          )}

          {/* Rows */}
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cn('flex items-center gap-4 px-5 py-4 border-b last:border-0 animate-pulse', border)}>
                <div className={cn('w-1.5 h-8 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-200')} />
                <div className="flex-1 space-y-2">
                  <div className={cn('h-3 w-40 rounded', dark ? 'bg-slate-800' : 'bg-slate-200')} />
                  <div className={cn('h-2 w-64 rounded', dark ? 'bg-slate-800/60' : 'bg-slate-100')} />
                </div>
                <div className={cn('h-6 w-24 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-100')} />
                <div className={cn('h-6 w-16 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-100')} />
                <div className={cn('h-6 w-16 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-100')} />
              </div>
            ))
          ) : displayRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', dark ? 'bg-slate-800' : 'bg-slate-100')}>
                <Shield className="w-6 h-6 text-slate-400" />
              </div>
              <p className={cn('text-[13px] font-bold mb-1', text)}>
                {activeTab === 'active' ? t('agency.roles.empty') : t('agency.roles.empty')}
              </p>
              <p className={cn('text-[12px] mb-5', sub)}>
                {activeTab === 'active' ? t('agency.roles.emptyActive') : t('agency.roles.emptyArchived')}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={() => setViewMode('ADD')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground"
                >
                  <Plus size={13} /> {t('agency.roles.add')}
                </button>
              )}
            </div>
          ) : (
            displayRoles.map((role: any, i: number) => {
              const accent = ROW_ACCENTS[i % ROW_ACCENTS.length];
              const permCount = role.permissions?.length || 0;
              const maxPerms = 10;
              const pct = Math.min((permCount / maxPerms) * 100, 100);

              return (
                <div
                  key={role.id}
                  className={cn(
                    'group grid items-center px-5 py-3.5 border-b last:border-0 transition-colors',
                    dark ? 'border-slate-800 hover:bg-slate-800/25' : 'border-slate-100 hover:bg-slate-50/70'
                  )}
                  style={{ gridTemplateColumns: '2.5rem 1fr 10rem 7rem 7rem 6rem' }}
                >
                  {/* Accent dot */}
                  <div className="flex items-center">
                    <span className={cn('w-2 h-2 rounded-full', accent)} />
                  </div>

                  {/* Name + description */}
                  <div className="min-w-0 pr-4">
                    <p className={cn('text-[13px] font-bold truncate', text)}>{role.name}</p>
                    {role.description && (
                      <p className={cn('text-[11px] truncate mt-0.5', sub)}>{role.description}</p>
                    )}
                  </div>

                  {/* Permission bar */}
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', dark ? 'bg-slate-800' : 'bg-slate-100')}>
                        <div
                          className={cn('h-full rounded-full transition-all', accent)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={cn('text-[10px] font-bold tabular-nums w-6 text-right', sub)}>
                        {permCount}
                      </span>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    {role.isSystem ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
                        <Lock size={9} /> System
                      </span>
                    ) : (
                      <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border',
                        dark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')}>
                        <Sparkles size={9} /> Custom
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md',
                      role.status === 'ACTIVE'
                        ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
                        : dark ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-100'
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', role.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400')} />
                      {role.status === 'ACTIVE' ? t('common.active') : t('common.archived')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!role.isSystem && activeTab === 'active' && (
                      <button
                        onClick={() => { setSelectedRole(role); setViewMode('EDIT'); }}
                        title="Edit"
                        className={cn('p-1.5 rounded-lg transition-colors', dark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700')}
                      >
                        <Pencil size={13} />
                      </button>
                    )}
                    {!role.isSystem && (
                      <button
                        onClick={() => toggleArchiveMutation.mutate(role)}
                        title={activeTab === 'active' ? t('common.archive') : t('common.activate')}
                        className={cn('p-1.5 rounded-lg transition-colors',
                          activeTab === 'active'
                            ? dark ? 'hover:bg-slate-700 text-slate-500 hover:text-slate-300' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                            : 'hover:bg-emerald-50 text-emerald-500 dark:hover:bg-emerald-500/10'
                        )}
                      >
                        {activeTab === 'active' ? <Archive size={13} /> : <RotateCcw size={13} />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyRoles;
