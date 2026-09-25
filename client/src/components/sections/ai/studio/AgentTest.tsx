import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bot, Image as ImageIcon, Loader2, MessageSquareText, Pencil, Search, Send, Trash2, X, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GalleryPickerDialog } from "@/components/contact-profile/sub-dialogs";
import { cn } from "@/lib/utils";
import { studioApi } from "./api";
import { getProvider, modelName } from "./providers";

/**
 * AI Studio → assistant → Test — replyagent `AIStudio/PortkeyAgentTest.vue`.
 *
 * A contact must be picked first (the assistant's functions act on it). One
 * deliberate difference: replyagent sends the message it is asking about both
 * as `message` and again as the last entry of `history`, so the model saw every
 * question twice; here `history` holds only the earlier turns.
 */

const MAX_MESSAGE_LENGTH = 10000;
const VISION_WARNING_KEY = "ai_studio_vision_warning_dismissed";
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
const QUICK_PROMPTS = [
  "ai_studio.test_agent.quick_prompts.how_can_you_help_me",
  "ai_studio.test_agent.quick_prompts.What_are_your_capabilities",
  "ai_studio.test_agent.quick_prompts.tell_me_about_your_features",
  "ai_studio.test_agent.quick_prompts.can_you_explain_this_in_simple_terms",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachment?: { url: string; name: string } | null;
}

/** replyagent `sanitizeMessage()`. */
const sanitize = (m: string) =>
  (m ?? "").trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, MAX_MESSAGE_LENGTH);

const formatJson = (data: any) => {
  if (!data) return "-";
  try {
    return JSON.stringify(typeof data === "string" ? JSON.parse(data) : data, null, 2);
  } catch {
    return String(data);
  }
};

/** replyagent `linkifyMessage()` — as React nodes instead of v-html. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="underline break-all">
            {p.length > 60 ? `${p.slice(0, 60)}...` : p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function AgentTest({ agent, onBack, onEdit }: { agent: any; onBack: () => void; onEdit: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [threadId, setThreadId] = useState<any>(null);
  const [contact, setContact] = useState<any | null>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; name: string } | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [visionWarning, setVisionWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [lastCalls, setLastCalls] = useState<any>(null);
  const [hint, setHint] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const provider = getProvider(agent.provider);

  const { data: contactResults } = useQuery<any>({
    queryKey: ["/api/contacts/search/simple", contactSearch],
    queryFn: async () => (await apiRequest("POST", "/api/contacts/search/simple", { search: contactSearch, type: "full_name" })).json(),
    enabled: contactSearch.trim().length >= 2 && !contact,
  });

  // replyagent `loadLastLog()` is defined but never called there; the panel
  // starts empty and fills from the first answer, as it does in practice.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, sending]);

  const flash = (msg: string) => {
    setHint(msg);
    setTimeout(() => setHint(null), 2000);
  };

  const send = async (raw: string) => {
    if (sending) return;
    if (!contact) return flash(t("ai_studio.test_agent.select_contact_first"));
    const message = sanitize(raw);
    if (!message) return flash(t("ai_studio.test_agent.type_message_required"));

    const history = messages.slice(-Math.max(1, Number(agent.history_limit) || 10) * 2).map((m) => ({ role: m.role, content: sanitize(m.content) }));
    const imageUrl = attachment?.url ?? null;
    setMessages((prev) => [...prev, { role: "user", content: message, timestamp: new Date().toISOString(), attachment }]);
    setText("");
    setAttachment(null);
    setSending(true);
    try {
      const res = await studioApi.test(agent.id, { message, thread_id: threadId, history, contact_id: contact.id, image_url: imageUrl });
      if (!threadId && res.thread_id) setThreadId(res.thread_id);
      setMessages((prev) => [...prev, { role: "assistant", content: res.response ?? "", timestamp: new Date().toISOString() }]);
      setLastResponse(res.raw_response ?? null);
      setLastCalls(res.function_calls ?? null);
    } catch (err: any) {
      toast({ title: err?.message || t("ai_studio.test_agent.failed_to_send_message"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const openGallery = () => {
    let dismissed = false;
    try {
      dismissed = !!localStorage.getItem(VISION_WARNING_KEY);
    } catch {
      /* storage unavailable */
    }
    if (!dismissed) setVisionWarning(true);
    else setGalleryOpen(true);
  };

  const clearChat = async () => {
    if (threadId) await studioApi.clearTestThreads(agent.id).catch(() => undefined);
    setMessages([]);
    setThreadId(null);
    setLastResponse(null);
    setLastCalls(null);
    setAttachment(null);
    setQuickOpen(false);
  };

  const time = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const contactLabel = (c: any) => c?.full_name || [c?.first_name, c?.last_name].filter(Boolean).join(" ") || c?.mobile_number || `#${c?.id}`;

  return (
    <div className="rounded-[2rem] border bg-white dark:bg-[#0f1829] dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[16px] font-bold">{t("ai_studio.test_agent.title")}</h1>
          <p className="text-[12px] text-slate-500">
            {t("ai_studio.test_agent.sub_title")}: <strong>{agent.name}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onEdit} className="h-10 px-4 rounded-xl bg-primary text-white text-[12px] font-semibold flex items-center gap-2">
            <Pencil size={12} /> {t("ai_studio.test_agent.edit_assistant")}
          </button>
          <button type="button" onClick={onBack} className="h-10 px-4 rounded-xl border text-[12px] font-semibold flex items-center gap-2 dark:border-slate-800">
            <ArrowLeft size={12} /> {t("ai_studio.test_agent.back_to_list")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Chat */}
        <div className="lg:col-span-2 border-r dark:border-slate-800 flex flex-col h-[640px]">
          <div className="px-5 py-3 border-b dark:border-slate-800 flex flex-wrap items-center gap-4 text-[12px]">
            {provider && <img src={provider.logo} alt="" className="h-5 w-5" />}
            <span>
              <span className="text-slate-500">{t("ai_studio.test_agent.model")}:</span> {modelName(agent.model, agent.provider)}
            </span>
            <span>
              <span className="text-slate-500">{t("ai_studio.test_agent.temperature")}:</span> {Number(agent.creativity ?? agent.temperature ?? 0)}
            </span>
            <div className="relative flex-1 min-w-[200px]" title={t("ai_studio.test_agent.select_contact_hint")}>
              {contact ? (
                <div className="h-9 rounded-xl border px-3 flex items-center justify-between dark:border-slate-800">
                  <span className="truncate font-medium">{contactLabel(contact)}</span>
                  <button type="button" onClick={() => setContact(null)} className="text-slate-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder={t("ai_studio.test_agent.select_contact_first")}
                    className="w-full h-9 rounded-xl border pl-8 pr-3 bg-white dark:bg-slate-950 dark:border-slate-800 outline-none"
                  />
                  {(contactResults?.contacts?.length ?? 0) > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg">
                      {contactResults.contacts.map((c: any) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setContact(c);
                            setContactSearch("");
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <div className="font-medium">{contactLabel(c)}</div>
                          {c.mobile_number && <div className="text-[11px] text-slate-500">{c.mobile_number}</div>}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <button type="button" onClick={clearChat} className="h-9 px-3 rounded-xl border font-semibold flex items-center gap-1.5 dark:border-slate-800">
              <Trash2 size={12} /> {t("ai_studio.test_agent.clear_chat")}
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <MessageSquareText size={32} />
                <p className="mt-2 text-[13px]">{t("ai_studio.test_agent.start_conversation_title")}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5", m.role === "user" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800")}>
                  {m.attachment && <img src={m.attachment.url} alt={m.attachment.name} className="mb-2 max-h-48 rounded-lg" />}
                  {m.content && (
                    <div className="text-[13px] whitespace-pre-wrap break-words">
                      <Linkified text={m.content} />
                    </div>
                  )}
                  <div className={cn("mt-1 text-[10px]", m.role === "user" ? "text-white/70" : "text-slate-400")}>{time(m.timestamp)}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2.5 bg-slate-100 dark:bg-slate-800">
                  <Loader2 size={14} className="animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t dark:border-slate-800">
            {attachment && (
              <div className="px-4 pt-3 flex items-center gap-2">
                <img src={attachment.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="text-[12px] truncate">{attachment.name}</span>
                <button type="button" title={t("ai_studio.test_agent.remove_attachment")} onClick={() => setAttachment(null)} className="text-slate-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            )}
            {hint && <div className="px-4 pt-2 text-[11px] text-amber-600">{hint}</div>}
            <div className="p-3 flex items-end gap-2">
              <button type="button" title={t("ai_studio.test_agent.upload_image")} onClick={openGallery} className="h-10 w-10 rounded-xl border flex items-center justify-center text-slate-500 dark:border-slate-800">
                <ImageIcon size={16} />
              </button>
              <div className="relative">
                <button type="button" onClick={() => setQuickOpen((o) => !o)} className="h-10 w-10 rounded-xl border flex items-center justify-center text-slate-500 dark:border-slate-800">
                  <Zap size={16} />
                </button>
                {quickOpen && (
                  <div className="absolute bottom-12 left-0 z-20 w-72 rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg py-2">
                    <h6 className="px-3 pb-2 text-[12px] font-semibold">{t("ai_studio.test_agent.quick_test_prompts")}</h6>
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setQuickOpen(false);
                          send(t(p));
                        }}
                        className="w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {t(p)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                rows={1}
                value={text}
                maxLength={MAX_MESSAGE_LENGTH}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(text);
                  }
                }}
                placeholder={attachment ? t("ai_studio.test_agent.type_message_for_image") : "Type your message..."}
                className="flex-1 min-h-10 max-h-32 rounded-xl border px-3 py-2.5 text-[13px] resize-none bg-white dark:bg-slate-950 dark:border-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => send(text)}
                disabled={sending}
                className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white", contact ? "bg-primary" : "bg-slate-300 cursor-not-allowed")}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Realtime log */}
        <div className="p-5 h-[640px] overflow-y-auto">
          <h5 className="font-semibold text-[14px] mb-3">{t("ai_studio.test_agent.realtime_log")}</h5>
          {!lastResponse ? (
            <div className="py-10 text-center text-slate-400">
              <Bot size={28} className="mx-auto" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
                <h6 className="text-[12px] font-semibold mb-2">{t("ai_studio.test_agent.ai_assistant_label")}</h6>
                <pre className="text-[11px] whitespace-pre-wrap overflow-x-auto">{formatJson(lastResponse)}</pre>
              </div>
              {lastCalls && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
                  <h6 className="text-[12px] font-semibold mb-2">{t("ai_studio.test_agent.function_calls")}</h6>
                  <pre className="text-[11px] whitespace-pre-wrap overflow-x-auto">{formatJson(lastCalls)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <GalleryPickerDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        mediaType="image"
        onPick={(media) => {
          const ext = String(media.object_name ?? media.url ?? "").split("?")[0].split(".").pop()?.toLowerCase() ?? "";
          if (!IMAGE_EXTENSIONS.includes(ext)) {
            toast({ title: t("ai_studio.test_agent.only_images_allowed"), variant: "destructive" });
            return;
          }
          setAttachment({ url: media.url, name: media.object_name });
          setGalleryOpen(false);
        }}
      />

      <Dialog open={visionWarning} onOpenChange={setVisionWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("ai_studio.test_agent.vision_warning_title")}</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">{t("ai_studio.test_agent.vision_warning_message")}</p>
          <label className="flex items-center gap-2 text-[13px] mt-2">
            <input type="checkbox" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} />
            {t("ai_studio.test_agent.dont_show_again")}
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setVisionWarning(false)} className="h-9 px-4 rounded-xl border text-[12px] font-semibold dark:border-slate-800">
              {t("ai_studio.ra.cancel")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (dontShowAgain) {
                  try {
                    localStorage.setItem(VISION_WARNING_KEY, "1");
                  } catch {
                    /* storage unavailable */
                  }
                }
                setVisionWarning(false);
                setGalleryOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-primary text-white text-[12px] font-semibold"
            >
              {t("ai_studio.test_agent.continue_upload")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
