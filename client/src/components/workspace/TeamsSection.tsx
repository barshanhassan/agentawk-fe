import React, { useState } from "react";
import {
  Users2,
  Users,
  Pencil,
  Trash2,
  Plus,
  Check,
  ChevronLeft,
  Shuffle,
  GitBranch,
  UserMinus,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROW_ACCENTS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500',  'bg-rose-500', 'bg-cyan-500',
  'bg-indigo-500', 'bg-teal-500',
];

const AVATAR_COLORS = [
  { bg: 'bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400' },
  { bg: 'bg-blue-500/15',   text: 'text-blue-600 dark:text-blue-400'   },
  { bg: 'bg-emerald-500/15',text: 'text-emerald-600 dark:text-emerald-400' },
  { bg: 'bg-amber-500/15',  text: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-rose-500/15',   text: 'text-rose-600 dark:text-rose-400'   },
  { bg: 'bg-cyan-500/15',   text: 'text-cyan-600 dark:text-cyan-400'   },
];

function nameHash(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return Math.abs(h) % AVATAR_COLORS.length;
}

function MemberAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const idx = nameHash(name);
  const { bg, text } = AVATAR_COLORS[idx];
  const dim = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-[12px]';
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold flex-shrink-0', dim, bg, text)}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function TeamsSection() {
  const { mode } = useTheme();
  const dark = mode === 'dark';
  const { toast } = useToast();

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [distribution, setDistribution] = useState<'EQUAL' | 'PRIORITY'>('EQUAL');
  const [autoAssign, setAutoAssign] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const card   = dark ? 'bg-[#0f1829]'  : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';
  const muted  = dark ? 'text-slate-400' : 'text-slate-500';

  const { data: teamsData, isLoading } = useQuery<any>({
    queryKey: ['/api/teams/get-all'],
  });

  const { data: membersData } = useQuery<any>({
    queryKey: ['/api/workspaces/members'],
  });

  const agents = membersData || [];
  const teams  = Array.isArray(teamsData) ? teamsData : [];

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/teams/create', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams/get-all'] });
      toast({ title: 'Team saved' });
      resetForm();
      setView('list');
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest('DELETE', `/api/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams/get-all'] });
      toast({ title: 'Team deleted' });
      setDeleteTarget(null);
      setDeleteConfirm('');
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const resetForm = () => {
    setTeamName('');
    setDistribution('EQUAL');
    setAutoAssign(false);
    setEditingId(null);
    setSelectedAgents([]);
  };

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setTeamName(team.name);
    setDistribution(team.distribution);
    setAutoAssign(team.auto_assign === 1);
    setSelectedAgents(team.team_members?.map((m: any) => ({ ...m.users, priority: m.priority })) || []);
    setView('edit');
  };

  const handleSave = () => {
    if (!teamName.trim()) return;
    saveMutation.mutate({
      id: editingId,
      name: teamName,
      distribution,
      auto_assign: autoAssign,
      members: selectedAgents.map(a => ({ id: a.id, priority: a.priority || 0 })),
    });
  };

  /* ── Form view ─────────────────────────────────────────────────── */
  if (view === 'add' || view === 'edit') {
    const teamInitial = teamName.trim().charAt(0).toUpperCase() || '?';
    const accentIdx   = teamName ? nameHash(teamName) % ROW_ACCENTS.length : 0;
    const accentCls   = ROW_ACCENTS[accentIdx];

    return (
      <div className={cn('flex flex-col rounded-xl border overflow-hidden', card, border)}>

        {/* Header */}
        <div className={cn('px-6 py-4 border-b flex items-center gap-3', border)}>
          <button
            onClick={() => { resetForm(); setView('list'); }}
            className={cn('p-1.5 rounded-lg transition-colors', dark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700')}
          >
            <ChevronLeft size={16} />
          </button>
          <div className={cn('p-2 rounded-xl', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <Users2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className={cn('text-[14px] font-bold', text)}>{view === 'add' ? 'New Team' : 'Edit Team'}</h2>
            <p className={cn('text-[11px]', sub)}>Configure team settings and members</p>
          </div>
        </div>

        {/* Body: 8/4 grid */}
        <div className="grid grid-cols-12 flex-1 overflow-hidden">

          {/* Left — form */}
          <div className={cn('col-span-8 overflow-y-auto border-r p-6 space-y-6', border)}>

            {/* Team name */}
            <div className="space-y-1.5">
              <label className={cn('text-[12px] font-bold', muted)}>Team Name</label>
              <Input
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. Sales Team"
                className={cn(
                  'h-10 text-[13px] font-medium rounded-lg border focus-visible:ring-1 focus-visible:ring-primary',
                  dark ? 'bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'
                )}
              />
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              <label className={cn('text-[12px] font-bold', muted)}>Distribution Method</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  {
                    key: 'EQUAL',
                    label: 'Equal Distribution',
                    desc: 'Contacts are assigned evenly across all team members.',
                    icon: <Shuffle size={15} className="text-primary" />,
                  },
                  {
                    key: 'PRIORITY',
                    label: 'Priority Distribution',
                    desc: 'Higher-priority members receive more assignments.',
                    icon: <GitBranch size={15} className="text-primary" />,
                  },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setDistribution(opt.key)}
                    className={cn(
                      'relative flex flex-col text-left p-4 rounded-xl border-2 transition-all',
                      distribution === opt.key
                        ? 'border-primary bg-primary/5'
                        : dark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {opt.icon}
                      <span className={cn('text-[12px] font-bold', text)}>{opt.label}</span>
                    </div>
                    <p className={cn('text-[11px] leading-relaxed', sub)}>{opt.desc}</p>
                    {distribution === opt.key && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check size={9} className="text-primary-foreground" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-assign toggle */}
            <div className={cn('flex items-center justify-between px-4 py-3 rounded-xl border', dark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/60')}>
              <div className="pr-4">
                <p className={cn('text-[12px] font-bold', text)}>Auto-assign to available agents</p>
                <p className={cn('text-[11px] mt-0.5', sub)}>Only assign to agents with "Available" status</p>
              </div>
              <Switch
                checked={autoAssign}
                onCheckedChange={setAutoAssign}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Members */}
            <div className="space-y-2.5">
              <label className={cn('text-[12px] font-bold', muted)}>Team Members</label>
              <Select onValueChange={val => {
                const agent = agents.find((a: any) => a.id.toString() === val);
                if (agent && !selectedAgents.find((sa: any) => sa.id === agent.id)) {
                  setSelectedAgents(prev => [...prev, { ...agent, priority: 0 }]);
                }
              }}>
                <SelectTrigger className={cn(
                  'h-10 text-[13px] rounded-lg border focus:ring-1 focus:ring-primary',
                  dark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                )}>
                  <SelectValue placeholder="Add a member..." />
                </SelectTrigger>
                <SelectContent className={cn('border', card, border)}>
                  {agents
                    .filter((a: any) => !selectedAgents.find((sa: any) => sa.id === a.id))
                    .map((agent: any) => (
                      <SelectItem key={agent.id} value={agent.id.toString()} className="text-[13px]">
                        {agent.full_name || agent.first_name} ({agent.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {selectedAgents.length > 0 && (
                <div className="space-y-2 mt-1">
                  {selectedAgents.map((agent: any, idx: number) => {
                    const displayName = agent.full_name || agent.first_name || '?';
                    return (
                      <div
                        key={agent.id}
                        className={cn(
                          'flex items-center justify-between px-3.5 py-3 rounded-xl border transition-colors',
                          dark ? 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <MemberAvatar name={displayName} size="md" />
                          <div>
                            <p className={cn('text-[12px] font-bold', text)}>{displayName}</p>
                            <p className={cn('text-[11px]', sub)}>{agent.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {distribution === 'PRIORITY' && (
                            <div className="flex items-center gap-1.5">
                              <span className={cn('text-[10px] font-bold uppercase', sub)}>Priority</span>
                              <Input
                                type="number"
                                value={agent.priority || 0}
                                onChange={e => {
                                  const updated = [...selectedAgents];
                                  updated[idx] = { ...updated[idx], priority: parseInt(e.target.value) || 0 };
                                  setSelectedAgents(updated);
                                }}
                                className={cn(
                                  'h-7 w-14 text-center text-[12px] font-bold rounded-md border focus-visible:ring-1 focus-visible:ring-primary',
                                  dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                                )}
                              />
                            </div>
                          )}
                          <button
                            onClick={() => setSelectedAgents(prev => prev.filter((sa: any) => sa.id !== agent.id))}
                            className={cn('p-1.5 rounded-lg transition-colors', dark ? 'hover:bg-slate-700 text-slate-500 hover:text-rose-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500')}
                          >
                            <UserMinus size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className={cn('flex items-center justify-end gap-2 pt-2 border-t', border)}>
              <button
                onClick={() => { resetForm(); setView('list'); }}
                className={cn(
                  'px-5 py-2 rounded-lg text-[12px] font-semibold border transition-colors',
                  dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!teamName.trim() || saveMutation.isPending}
                className="px-5 py-2 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-colors disabled:opacity-50 shadow-sm"
              >
                {saveMutation.isPending ? 'Saving…' : view === 'add' ? 'Create Team' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Right — preview */}
          <div className={cn('col-span-4 flex flex-col overflow-y-auto p-6', dark ? 'bg-slate-900/40' : 'bg-slate-50/50')}>
            <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-5', sub)}>Preview</p>

            {/* Team avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-3', accentCls, 'text-white')}>
                {teamInitial}
              </div>
              <p className={cn('text-[14px] font-bold', text)}>{teamName || 'Team name'}</p>
              <span className={cn(
                'mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full',
                distribution === 'EQUAL'
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'bg-violet-500/10 text-violet-500'
              )}>
                {distribution === 'EQUAL' ? <Shuffle size={9} /> : <GitBranch size={9} />}
                {distribution === 'EQUAL' ? 'Equal' : 'Priority'}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-5">
              {[
                { label: 'Members', value: `${selectedAgents.length} agent${selectedAgents.length !== 1 ? 's' : ''}` },
                { label: 'Auto-assign', value: autoAssign ? 'Enabled' : 'Disabled' },
              ].map(row => (
                <div key={row.label} className={cn('flex items-center justify-between px-3 py-2 rounded-lg', dark ? 'bg-slate-800/50' : 'bg-white border border-slate-100')}>
                  <span className={cn('text-[11px] font-semibold', sub)}>{row.label}</span>
                  <span className={cn('text-[11px] font-bold', text)}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Member stack */}
            {selectedAgents.length > 0 && (
              <div>
                <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-2', sub)}>Members</p>
                <div className="space-y-1.5">
                  {selectedAgents.slice(0, 6).map((agent: any) => {
                    const n = agent.full_name || agent.first_name || '?';
                    return (
                      <div key={agent.id} className="flex items-center gap-2">
                        <MemberAvatar name={n} size="sm" />
                        <span className={cn('text-[11px] font-semibold truncate', text)}>{n}</span>
                      </div>
                    );
                  })}
                  {selectedAgents.length > 6 && (
                    <p className={cn('text-[11px] pl-1', sub)}>+{selectedAgents.length - 6} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── List view ─────────────────────────────────────────────────── */
  return (
    <div className={cn('flex flex-col rounded-xl border overflow-hidden', card, border)}>

      {/* Header */}
      <div className={cn('px-6 py-4 border-b flex items-center justify-between', border)}>
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl', dark ? 'bg-primary/15' : 'bg-primary/10')}>
            <Users2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className={cn('text-[14px] font-bold', text)}>Teams</h2>
            <p className={cn('text-[11px] mt-0.5', sub)}>
              {teams.length} team{teams.length !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setView('add'); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-colors shadow-sm"
        >
          <Plus size={13} /> Add Team
        </button>
      </div>

      {/* Table area */}
      <div>
        {/* Column headers */}
        {!isLoading && teams.length > 0 && (
          <div
            className={cn(
              'grid items-center px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border-b',
              dark ? 'text-slate-600 border-slate-800 bg-slate-900/30' : 'text-slate-400 border-slate-100 bg-slate-50/60'
            )}
            style={{ gridTemplateColumns: '2.5rem 1fr 11rem 8rem 5rem' }}
          >
            <span />
            <span>Team</span>
            <span>Distribution</span>
            <span>Members</span>
            <span className="text-right">Actions</span>
          </div>
        )}

        {/* Rows */}
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn('flex items-center gap-4 px-5 py-4 border-b last:border-0 animate-pulse', border)}>
              <div className={cn('w-1.5 h-8 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-200')} />
              <div className="flex-1 space-y-2">
                <div className={cn('h-3 w-36 rounded', dark ? 'bg-slate-800' : 'bg-slate-200')} />
                <div className={cn('h-2 w-52 rounded', dark ? 'bg-slate-800/60' : 'bg-slate-100')} />
              </div>
              <div className={cn('h-6 w-28 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-100')} />
              <div className={cn('h-6 w-16 rounded-full', dark ? 'bg-slate-800' : 'bg-slate-100')} />
            </div>
          ))
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', dark ? 'bg-slate-800' : 'bg-slate-100')}>
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <p className={cn('text-[13px] font-bold mb-1', text)}>No teams yet</p>
            <p className={cn('text-[12px] mb-5', sub)}>Create a team to automate assignment of conversations and tasks.</p>
            <button
              onClick={() => { resetForm(); setView('add'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground"
            >
              <Plus size={13} /> Add Team
            </button>
          </div>
        ) : (
          teams.map((team: any, i: number) => {
            const accent     = ROW_ACCENTS[i % ROW_ACCENTS.length];
            const memberCount = team.team_members?.length || 0;
            const members    = (team.team_members || []).slice(0, 3);

            return (
              <div
                key={team.id}
                className={cn(
                  'group grid items-center px-5 py-3.5 border-b last:border-0 transition-colors',
                  dark ? 'border-slate-800 hover:bg-slate-800/25' : 'border-slate-100 hover:bg-slate-50/70'
                )}
                style={{ gridTemplateColumns: '2.5rem 1fr 11rem 8rem 5rem' }}
              >
                {/* Accent */}
                <div className="flex items-center">
                  <span className={cn('w-2 h-2 rounded-full', accent)} />
                </div>

                {/* Name */}
                <div className="min-w-0 pr-4">
                  <p className={cn('text-[13px] font-bold truncate', text)}>{team.name}</p>
                  {team.auto_assign === 1 && (
                    <p className={cn('text-[11px] mt-0.5', sub)}>Auto-assign enabled</p>
                  )}
                </div>

                {/* Distribution */}
                <div>
                  <span className={cn(
                    'inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md border',
                    team.distribution === 'EQUAL'
                      ? dark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200/60 text-blue-600'
                      : dark ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-violet-50 border-violet-200/60 text-violet-600'
                  )}>
                    {team.distribution === 'EQUAL' ? <Shuffle size={9} /> : <GitBranch size={9} />}
                    {team.distribution === 'EQUAL' ? 'Equal' : 'Priority'}
                  </span>
                </div>

                {/* Members */}
                <div className="flex items-center gap-2">
                  {memberCount > 0 ? (
                    <>
                      <div className="flex -space-x-1.5">
                        {members.map((m: any, mi: number) => {
                          const n = m.users?.full_name || m.users?.first_name || '?';
                          const idx2 = nameHash(n);
                          const { bg: abg, text: at } = AVATAR_COLORS[idx2];
                          return (
                            <div key={mi} className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ring-2', abg, at, dark ? 'ring-[#0f1829]' : 'ring-white')}>
                              {n.charAt(0).toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                      <span className={cn('text-[11px] font-semibold tabular-nums', sub)}>
                        {memberCount > 3 ? `+${memberCount - 3}` : memberCount === 1 ? '1 member' : `${memberCount}`}
                      </span>
                    </>
                  ) : (
                    <span className={cn('text-[11px]', sub)}>No members</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(team)}
                    title="Edit"
                    className={cn('p-1.5 rounded-lg transition-colors', dark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700')}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => { setDeleteTarget(team); setDeleteConfirm(''); }}
                    title="Delete"
                    className={cn('p-1.5 rounded-lg transition-colors', dark ? 'hover:bg-slate-700 text-slate-500 hover:text-rose-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={cn('w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border', card, border)}>
            <div className="h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-400" />
            <div className="p-7 space-y-5">
              {/* Icon + name */}
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0', ROW_ACCENTS[teams.findIndex((t: any) => t.id === deleteTarget.id) % ROW_ACCENTS.length], 'text-white')}>
                  {deleteTarget.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={cn('text-[14px] font-black', text)}>Delete "{deleteTarget.name}"?</p>
                  <p className={cn('text-[12px] mt-0.5', sub)}>
                    {deleteTarget.team_members?.length || 0} member{(deleteTarget.team_members?.length || 0) !== 1 ? 's' : ''} will be removed from this team
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border', dark ? 'bg-red-500/5 border-red-500/15' : 'bg-red-50 border-red-100')}>
                <TriangleAlert size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-[12px] text-red-500 font-semibold leading-relaxed">
                  This action is permanent and cannot be undone. All associated assignments will be unlinked.
                </p>
              </div>

              {/* Type-to-confirm */}
              <div className="space-y-1.5">
                <label className={cn('text-[12px] font-semibold', muted)}>
                  Type <span className={cn('font-bold', text)}>{deleteTarget.name}</span> to confirm
                </label>
                <Input
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder={deleteTarget.name}
                  className={cn(
                    'h-10 text-[13px] rounded-lg border focus-visible:ring-1 focus-visible:ring-red-400',
                    dark ? 'bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'
                  )}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => { setDeleteTarget(null); setDeleteConfirm(''); }}
                  className={cn(
                    'px-5 py-2 rounded-lg text-[12px] font-semibold border transition-colors',
                    dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirm !== deleteTarget.name || deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(deleteTarget.id)}
                  className="px-5 py-2 rounded-lg text-[12px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete Team'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
