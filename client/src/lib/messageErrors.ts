import type { TFunction } from "i18next";

// Maps a Meta/internal error `code` to a translated, human-readable reason.
// Codes not listed here fall back to whatever readable text the raw payload
// carries (English only, since we don't control Meta's own error text), and
// finally to a generic "failed to send" message.
const KNOWN_CODE_KEYS: Record<string, string> = {
  "131042": "meta_billing_not_configured",
  "190": "meta_auth_expired",
  unspecified: "wa_failed_no_detail",
  publish_failed: "wa_failed_internal",
};

/**
 * Turns a wa_messages.error_data value (a JSON string, an older nested
 * `{error:{...}}` shape, a plain string, or null) into a reason a user can
 * read — translated when the underlying code is one we recognize.
 */
export function getMessageFailureReason(rawErrorData: string | null | undefined, t: TFunction): string {
  if (!rawErrorData) return t("message_errors.generic_failed");

  let parsed: any;
  try {
    parsed = JSON.parse(rawErrorData);
  } catch {
    // Not JSON (older rows stored a plain string) — show it as-is.
    return rawErrorData;
  }

  const code = String(parsed?.code ?? parsed?.error?.code ?? "").trim();
  const key = code && KNOWN_CODE_KEYS[code];
  if (key) return t(`message_errors.${key}`);

  const fallbackText =
    parsed?.error_user_msg ||
    parsed?.error_data?.details ||
    parsed?.message ||
    parsed?.title ||
    parsed?.error?.message;

  return fallbackText || t("message_errors.generic_failed");
}
