import { validatePhoneNumberLength } from "libphonenumber-js";

/**
 * Validate a national phone number against its country — mirrors replyagent's
 * libphonenumber-js `validatePhoneNumberLength` (returns TOO_SHORT / TOO_LONG).
 * Empty value returns "" (phone/whatsapp are optional). Use the returned message
 * to show a field-level error, and keep inputs digits-only via `onlyDigits`.
 */
export function phoneError(value: string, iso2: string): string {
  if (!value) return "";
  try {
    const code = validatePhoneNumberLength(value, iso2 as any);
    if (code === "TOO_SHORT") return "Phone number is too short";
    if (code === "TOO_LONG") return "Phone number is too long";
  } catch {
    /* invalid country / not a number — no blocking error */
  }
  return "";
}

/** Strip everything except digits (use on phone-input onChange so letters never enter). */
export function onlyDigits(value: string): string {
  return String(value ?? "").replace(/\D/g, "");
}
