import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink } from "lucide-react";

/**
 * The OpenAI checks replyagent runs before an AI assistant can be created,
 * edited or given knowledge — `validateAssistantPermission()` in both
 * `Settings/AI.vue` and `Settings/AIVoice/Index.vue` (identical there), plus
 * the Voice page's `voice_calls` gate in `editAssistant()`:
 *
 *   1. no ChatGPT integration          → "Unable to create" + how to get a key
 *   2. integration not ACTIVE          → "integration is disabled"
 *   3. free plan, Custom AI switch off → premium feature
 *   4. free plan, Custom AI switch on  → at most one agent
 *   5. (Voice only) AI Voice Calls off → "AI Voice Calls are disabled"
 *
 * One deliberate difference: replyagent applies the one-agent limit to every
 * save, so a free workspace could not even edit the single agent it was
 * allowed. Here the limit only applies when creating.
 */

type GateDialog = {
  title: string;
  message: string;
  showKeyLink?: boolean;
  showIntegrationsLink?: boolean;
};

const API_KEYS_URL = "https://platform.openai.com/api-keys";

export function useOpenAiGate() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [dialog, setDialog] = useState<GateDialog | null>(null);

  // Same cache entries the Integrations page and Contacts page already use.
  const { data: integrationsData } = useQuery({
    queryKey: ["/api/integrations"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/integrations");
      return res.json();
    },
  });
  const { data: planFeatures } = useQuery({
    queryKey: ["/api/workspaces/plan-features"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/workspaces/plan-features");
      return res.json();
    },
  });

  const integration = integrationsData?.integrations?.find((i: any) => i.type === "CHATGPT") ?? null;
  const freePlan = !!planFeatures?.free;
  const voiceCallsEnabled = !!integration?.modelable?.voice_calls;

  /** replyagent `validateAssistantPermission()`. */
  const checkAssistant = (opts: { agentCount: number; isCreate: boolean }): boolean => {
    if (!integration) {
      setDialog({
        title: t("openai_integration.gate_missing_title"),
        message: t("openai_integration.gate_missing_description"),
        showKeyLink: true,
        showIntegrationsLink: true,
      });
      return false;
    }
    if (integration.status !== "ACTIVE") {
      setDialog({
        title: t("openai_integration.gate_disabled_title"),
        message: t("openai_integration.gate_disabled_description"),
        showIntegrationsLink: true,
      });
      return false;
    }
    if (freePlan && !integration.modelable?.chatgpt) {
      setDialog({
        title: t("openai_integration.gate_premium_title"),
        message: t("openai_integration.gate_premium_description"),
      });
      return false;
    }
    if (freePlan && opts.isCreate && opts.agentCount >= 1) {
      setDialog({
        title: t("openai_integration.gate_premium_title"),
        message: t("openai_integration.gate_free_limit"),
      });
      return false;
    }
    return true;
  };

  /** replyagent AIVoice `editAssistant()` — runs before the editor opens. */
  const checkVoiceCalls = (): boolean => {
    if (!voiceCallsEnabled) {
      setDialog({
        title: t("openai_integration.voice_calls_disabled_title"),
        message: t("openai_integration.voice_calls_disabled_description"),
        showIntegrationsLink: true,
      });
      return false;
    }
    return true;
  };

  const gateDialog = (
    <AlertDialog open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog?.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialog?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        {dialog?.showKeyLink && (
          <a
            href={API_KEYS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary underline underline-offset-2"
          >
            {t("openai_integration.gate_create_key_link")}
            <ExternalLink size={12} />
          </a>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("openai_integration.gate_close")}</AlertDialogCancel>
          {dialog?.showIntegrationsLink && (
            <AlertDialogAction
              onClick={() => {
                setDialog(null);
                navigate("/settings?tab=Integrations&view=openai");
              }}
            >
              {t("openai_integration.gate_go_integrations")}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { checkAssistant, checkVoiceCalls, gateDialog, voiceCallsEnabled };
}
