import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BellRing, Plus, Trash2, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * One-Time Notification (OTN) / Recurring Notification "topic" requests, per
 * Messenger page — genuinely new, no Instagram precedent. Mirrors replyagent
 * MessengerController::createNotificationRequest/getNotificationRequests/
 * deleteOtnRequest/getNotificationSubscribers (routes `fb/page/otn/*`).
 *
 * A request here is just a reusable template (title/description/topic) that
 * an automation's `otn` step later offers the user to subscribe to — no Meta
 * call happens at create time, same as replyagent. `otn_type` mirrors Meta's
 * three recurring-notification topics (there's no page-level "type" concept
 * for classic single-use OTN, which only has one implicit topic).
 * Backend: GET/POST `/api/messenger/pages/:id/otn`,
 * DELETE `/api/messenger/pages/:id/otn/:requestId`,
 * GET `/api/messenger/pages/:id/otn/:requestId/subscribers`.
 */
interface Props {
  open: boolean;
  page: any | null;
  onClose: () => void;
}

const OTN_TYPES = [
  { value: "CONFIRMED_EVENT_UPDATE", labelKey: "messenger_otn_dialog.type_confirmed_event_update" },
  { value: "POST_PURCHASE_UPDATE", labelKey: "messenger_otn_dialog.type_post_purchase_update" },
  { value: "NON_PROMOTIONAL_SUBSCRIPTION", labelKey: "messenger_otn_dialog.type_non_promotional_subscription" },
];

export default function MessengerOtnDialog({ open, page, onClose }: Props) {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const text = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-500" : "text-slate-400";
  const inputCls = "w-full h-10 rounded-xl border px-3";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [otnType, setOtnType] = useState(OTN_TYPES[0].value);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["/api/messenger/pages", String(page?.id), "otn"],
    queryFn: async () => (await apiRequest("GET", `/api/messenger/pages/${page?.id}/otn`)).json(),
    enabled: open && !!page?.id,
  });
  const requests: any[] = Array.isArray(requestsData) ? requestsData : [];

  const { data: subscribersData, isLoading: subscribersLoading } = useQuery({
    queryKey: ["/api/messenger/pages", String(page?.id), "otn", expandedId, "subscribers"],
    queryFn: async () => (await apiRequest("GET", `/api/messenger/pages/${page?.id}/otn/${expandedId}/subscribers`)).json(),
    enabled: open && !!page?.id && !!expandedId,
  });
  const subscribers: any[] = Array.isArray(subscribersData) ? subscribersData : [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/messenger/pages", String(page?.id), "otn"] });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/messenger/pages/${page?.id}/otn`, { title, description, otn_type: otnType });
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      invalidate();
      toast({ title: t("messenger_otn_dialog.created"), description: t("messenger_otn_dialog.created_description") });
    },
    onError: () => toast({ title: t("messenger_otn_dialog.error"), description: t("messenger_otn_dialog.failed_to_create"), variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await apiRequest("DELETE", `/api/messenger/pages/${page?.id}/otn/${requestId}`);
    },
    onSuccess: () => {
      invalidate();
      toast({ title: t("messenger_otn_dialog.deleted"), description: t("messenger_otn_dialog.deleted_description") });
    },
    onError: () => toast({ title: t("messenger_otn_dialog.error"), description: t("messenger_otn_dialog.failed_to_delete"), variant: "destructive" }),
  });

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className={cn("rounded-[2rem] border p-0 max-w-3xl overflow-hidden", dark ? "bg-[#0f1829] border-slate-800" : "bg-white border-slate-200")}>
        <div className="p-7 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
              <BellRing size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn("text-[14px] font-semibold", text)}>{t("messenger_otn_dialog.title")}</div>
              <p className={cn("text-[11px] font-medium opacity-60 mt-1 leading-relaxed", sub)}>
                {t("messenger_otn_dialog.description_prefix")}{" "}
                <span className="font-mono">{page.name}</span>. {t("messenger_otn_dialog.description_suffix")}
              </p>
            </div>
          </div>

          {/* Create new request */}
          <div className={cn("rounded-xl border p-4 space-y-3", dark ? "bg-slate-900/60 border-slate-700" : "bg-white border-slate-200")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={cn("text-[11px] font-semibold opacity-50 mb-1 block", sub)}>{t("messenger_otn_dialog.request_title_label")}</label>
                <input value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} placeholder={t("messenger_otn_dialog.request_title_placeholder")} className={inputCls} />
              </div>
              <div>
                <label className={cn("text-[11px] font-semibold opacity-50 mb-1 block", sub)}>{t("messenger_otn_dialog.request_topic_label")}</label>
                <select value={otnType} onChange={(e) => setOtnType(e.target.value)} className={cn(inputCls)}>
                  {OTN_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={cn("text-[11px] font-semibold opacity-50 mb-1 block", sub)}>{t("messenger_otn_dialog.request_description_label")}</label>
              <input value={description} maxLength={100} onChange={(e) => setDescription(e.target.value)} placeholder={t("messenger_otn_dialog.request_description_placeholder")} className={inputCls} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !title || !description}
                className="h-10 px-5 rounded-xl text-[11px] font-semibold transition-all bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={12} /> {createMutation.isPending ? t("messenger_otn_dialog.creating") : t("messenger_otn_dialog.create_request")}
              </button>
            </div>
          </div>

          {/* Existing requests */}
          {isLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner size={26} /></div>
          ) : requests.length === 0 ? (
            <div className={cn("rounded-xl border py-10 flex flex-col items-center justify-center text-center gap-3", dark ? "border-slate-800" : "border-slate-100")}>
              <BellRing size={24} className="opacity-30" />
              <p className={cn("text-[11px] opacity-50 font-medium", sub)}>{t("messenger_otn_dialog.no_requests_yet")}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {requests.map((r: any) => {
                const isExpanded = expandedId === String(r.id);
                return (
                  <div key={r.id} className={cn("rounded-xl border", dark ? "bg-slate-900/60 border-slate-700" : "bg-white border-slate-200")}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[12px] font-black truncate", text)}>{r.title}</p>
                        <p className={cn("text-[10px] opacity-60 truncate", sub)}>{r.description}</p>
                      </div>
                      <span className={cn("text-[9px] font-semibold px-2 py-1 rounded-md border", dark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500")}>
                        {r.otn_type}
                      </span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : String(r.id))}
                        className={cn("h-8 px-3 rounded-lg border text-[10px] font-semibold flex items-center gap-1 transition-all", dark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-200 text-slate-700 hover:border-slate-400")}
                      >
                        <Users size={11} /> {r.subscribers_count ?? 0} {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(String(r.id))}
                        disabled={deleteMutation.isPending}
                        className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-all text-rose-500 shrink-0", dark ? "border-slate-700 hover:bg-rose-500/10" : "border-slate-200 hover:bg-rose-500/10")}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className={cn("border-t px-3 py-2 space-y-1", dark ? "border-slate-800" : "border-slate-100")}>
                        {subscribersLoading ? (
                          <div className="flex justify-center py-3"><LoadingSpinner size={18} /></div>
                        ) : subscribers.length === 0 ? (
                          <p className={cn("text-[10px] opacity-50 font-medium py-2", sub)}>{t("messenger_otn_dialog.no_subscribers_yet")}</p>
                        ) : (
                          subscribers.map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between text-[11px] py-1">
                              <span className={text}>{s.contact?.full_name || s.contact?.first_name || t("messenger_otn_dialog.unnamed_contact")}</span>
                              <span className={cn("opacity-50", sub)}>{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : "—"}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className={cn("h-10 px-5 rounded-xl border text-[11px] font-semibold transition-all", dark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-200 text-slate-700 hover:border-slate-400")}
            >
              {t("messenger_otn_dialog.close")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
