import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import Hls from "hls.js";
import {
  AppWindow,
  ChevronLeft,
  ChevronRight,
  CloudDownload,
  Eye,
  Loader2,
  NotebookText,
  Pause,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Wand2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatSeconds, voiceApi } from "./voiceApi";

/**
 * Voice assistant call logs + function logs — replyagent `AIVoice/Logs.vue`
 * and `AIVoice/FunctionLogs.vue`.
 */

const dt = (v: any) => (v ? new Date(v).toLocaleString() : "");

function Header({ title, subtitle, onRefresh, loading, onBack }: { title: string; subtitle: string; onRefresh?: () => void; loading?: boolean; onBack: () => void }) {
  const { t } = useTranslation();
  const ra = (k: string) => t(`ai_studio.ra.${k}`) as string;
  return (
    <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img src="/images/integrations/chat_gpt.svg" alt="" className="h-10 w-10" />
        <div>
          <h1 className="text-[16px] font-bold">{title}</h1>
          <p className="text-[12px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <button type="button" onClick={onRefresh} className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2">
            {loading && <Loader2 size={13} className="animate-spin" />}
            {ra("refresh")}
          </button>
        )}
        <button type="button" onClick={onBack} className="h-10 px-5 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
          {ra("back")}
        </button>
      </div>
    </div>
  );
}

function Pager({ meta, page, onPage }: { meta: any; page: number; onPage: (p: number) => void }) {
  if (!meta || meta.last_page <= 1) return null;
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1).filter((p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 2);
  return (
    <nav className="mt-4 flex items-center justify-center gap-1 text-[12px]">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="h-8 w-8 rounded-lg border flex items-center justify-center disabled:opacity-40 dark:border-slate-800">
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-slate-400">…</span>}
          <button
            type="button"
            onClick={() => onPage(p)}
            className={cn("h-8 min-w-8 px-2 rounded-lg border font-semibold dark:border-slate-800", p === page && "bg-primary text-white border-primary")}
          >
            {p}
          </button>
        </span>
      ))}
      <button type="button" disabled={page >= meta.last_page} onClick={() => onPage(page + 1)} className="h-8 w-8 rounded-lg border flex items-center justify-center disabled:opacity-40 dark:border-slate-800">
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}

const statusTag = (s: string) =>
  s === "failed" ? "bg-red-100 text-red-700" : s === "success" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600";

// ─── Call logs ──────────────────────────────────────────────────────────

export function VoiceCallLogs({ agent, onBack }: { agent: any; onBack: () => void }) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["/api/ai/voice-agent/logs", agent.id, page],
    queryFn: () => voiceApi.logs(agent.id, page).catch(() => ({ logs: { data: [] } })),
  });
  const logs = data?.logs ?? { data: [] };
  const card = "rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm";

  if (selected) return <Transcript log={selected} onBack={() => setSelected(null)} card={card} />;

  const directionIcon = (d: string) => (d === "outbound" ? PhoneOutgoing : d === "inbound" ? PhoneIncoming : AppWindow);
  const directionLabel = (d: string) =>
    d === "inbound" ? ra("ai.voice_assistant.direction_inbound") : d === "outbound" ? ra("ai.voice_assistant.direction_outbound") : ra("ai.voice_assistant.type_widget");

  return (
    <div className={card}>
      <Header title={ra("ai.logs")} subtitle={ra("ai.logs_available_limit")} onRefresh={() => refetch()} loading={isFetching} onBack={onBack} />
      <div className="p-8">
        {logs.data?.length ? (
          <>
            <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500 border-b dark:border-slate-800">
                  <tr>
                    <th className="text-left px-5 py-3">{ra("date_and_time")}</th>
                    <th className="text-left px-5 py-3">{ra("ai.voice_direction")}</th>
                    <th className="text-left px-5 py-3">Duration</th>
                    <th className="text-left px-5 py-3">{ra("status")}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((log: any) => {
                    const Icon = directionIcon(log.direction);
                    return (
                      <tr key={log.id} className="border-t dark:border-slate-800">
                        <td className="px-5 py-3">{dt(log.started_at)}</td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-2">
                            <Icon size={16} className="text-primary" /> {directionLabel(log.direction)}
                          </span>
                        </td>
                        <td className="px-5 py-3">{formatSeconds(log.duration)}</td>
                        <td className="px-5 py-3">
                          <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", statusTag(log.status))}>{ra(log.status) || log.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button type="button" onClick={() => setSelected(log)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pager meta={logs} page={page} onPage={setPage} />
          </>
        ) : (
          <div className="py-12 flex flex-col items-center text-slate-400">
            {isFetching ? <Loader2 size={24} className="animate-spin" /> : <NotebookText size={34} />}
            {!isFetching && <p className="mt-3 text-[13px]">{ra("ai.thread_message_no_history")}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Transcript({ log, onBack, card }: { log: any; onBack: () => void; card: string }) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const transcript: any[] = Array.isArray(log.transcript) ? log.transcript : [];

  useEffect(() => () => hlsRef.current?.destroy(), []);

  /** replyagent: attach hls.js on first play, native HLS on Safari. */
  const toggle = () => {
    const el = videoRef.current;
    if (!el || !log.recording_url) return;
    if (!el.src && !hlsRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(log.recording_url);
        hls.attachMedia(el);
        hlsRef.current = hls;
      } else if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = log.recording_url;
      }
    }
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      el.pause();
      setPlaying(false);
    }
  };

  const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const download = (blob: Blob, name: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadRecording = async () => {
    try {
      const res = await fetch(log.recording_url);
      if (!res.ok) throw new Error(String(res.status));
      download(await res.blob(), "recording.m3u8");
    } catch {
      toast({ title: "Error", description: "Failed to download recording", variant: "destructive" });
    }
  };

  const downloadTranscript = () => {
    const text = transcript.map((m) => `[${m.time}] ${String(m.role ?? "").toUpperCase()}: ${m.transcription}`).join("\n");
    download(new Blob([text], { type: "text/plain" }), "call_transcription.txt");
  };

  return (
    <div className={card}>
      <Header title={ra("ai.logs")} subtitle={ra("ai.logs_available_limit")} onBack={onBack} />
      <div className="p-8 space-y-8">
        {log.recording_url && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[13px] font-bold">
              {ra("ai.call_recording")}
              <button type="button" title={ra("download")} onClick={downloadRecording} className="text-slate-500 hover:text-primary">
                <CloudDownload size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3 max-w-xl">
              <button type="button" onClick={toggle} className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = v;
                  setTime(v);
                }}
                className="flex-1 accent-[hsl(var(--primary))]"
              />
              <span className="text-[12px] text-slate-500 tabular-nums">
                {mmss(time)} / {mmss(duration)}
              </span>
            </div>
            <video
              ref={videoRef}
              preload="metadata"
              className="hidden"
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
              onEnded={() => {
                setPlaying(false);
                setTime(0);
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[13px] font-bold">
            {ra("ai.call_transcription")}
            <button type="button" title={ra("download")} onClick={downloadTranscript} className="text-slate-500 hover:text-primary">
              <CloudDownload size={16} />
            </button>
          </div>
          {transcript.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-[13px] font-bold uppercase shrink-0">
                  {String(m.role ?? "").charAt(0)}
                </div>
                <div>
                  <p className="text-[13px]">{m.transcription}</p>
                  <p className="text-[11px] text-slate-400">{dt(m.time)}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start justify-end gap-3 text-right">
                <div>
                  <p className="text-[13px]">{m.transcription}</p>
                  <p className="text-[11px] text-slate-400">{dt(m.time)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[13px] font-bold uppercase shrink-0">
                  {String(m.role ?? "").charAt(0)}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Function logs ──────────────────────────────────────────────────────

export function VoiceFunctionLogs({ agent, onBack }: { agent: any; onBack: () => void }) {
  const { t } = useTranslation();
  const ra = (k: string, o?: any) => t(`ai_studio.ra.${k}`, o) as string;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["/api/ai/voice-agent/function-logs", agent.id, page],
    queryFn: () => voiceApi.functionLogs(agent.id, page).catch(() => ({ logs: { data: [] } })),
  });
  const logs = data?.logs ?? { data: [] };

  // replyagent closes the popup on any click outside it.
  useEffect(() => {
    if (!selected) return;
    const onDoc = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setSelected(null);
    };
    const id = setTimeout(() => document.addEventListener("click", onDoc), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", onDoc);
    };
  }, [selected]);

  const formatJson = (raw: any) => {
    if (raw == null || raw === "") return "N/A";
    if (typeof raw === "object") return JSON.stringify(raw, null, 2);
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return String(raw);
    }
  };

  return (
    <div className="relative rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm">
      <Header title={ra("ai.function_logs")} subtitle={agent.name} onRefresh={() => refetch()} loading={isFetching} onBack={onBack} />
      <div className="p-8">
        {logs.data?.length ? (
          <>
            <div className="rounded-2xl border dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500 border-b dark:border-slate-800">
                  <tr>
                    <th className="text-left px-5 py-3">{ra("date_and_time")}</th>
                    <th className="text-left px-5 py-3">{ra("ai.customer_phone")}</th>
                    <th className="text-left px-5 py-3">{ra("status")}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((log: any) => (
                    <tr key={log.id} className="border-t dark:border-slate-800">
                      <td className="px-5 py-3">{dt(log.created_at)}</td>
                      <td className="px-5 py-3">{log.customer_phone}</td>
                      <td className="px-5 py-3">
                        <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", statusTag(log.status))}>{ra(log.status) || log.status}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          title={ra("ai.function_calls")}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(selected?.id === log.id ? null : log);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager meta={logs} page={page} onPage={setPage} />
          </>
        ) : (
          <div className="py-12 flex flex-col items-center text-slate-400">
            {isFetching ? <Loader2 size={24} className="animate-spin" /> : <NotebookText size={34} />}
            {!isFetching && <p className="mt-3 text-[13px]">{ra("ai.no_function_logs")}</p>}
          </div>
        )}
      </div>

      {selected && (
        <div ref={popupRef} className="absolute top-2 left-[15%] right-[15%] z-20 max-h-[80vh] overflow-auto rounded-2xl border border-purple-200 bg-purple-50 dark:bg-purple-950/40 dark:border-purple-900 shadow-lg">
          <div className="flex items-center justify-between px-5 py-3 border-b border-purple-200 dark:border-purple-900">
            <span className="flex items-center gap-2 text-[13px] font-bold text-purple-700 dark:text-purple-300">
              <Wand2 size={15} /> {ra("ai.function_calls")}
            </span>
            <button type="button" onClick={() => setSelected(null)} className="p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900">
              <X size={14} />
            </button>
          </div>
          <pre className="p-5 text-[11px] whitespace-pre-wrap">{formatJson(selected.json)}</pre>
        </div>
      )}
    </div>
  );
}
