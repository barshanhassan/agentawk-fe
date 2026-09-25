import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GalleryPickerDialog } from "@/components/contact-profile/sub-dialogs";
import { SYSTEM_FIELDS } from "./voiceApi";

/** Small shared pieces for the Voice Assistants screens. */

async function getJson(url: string) {
  return (await apiRequest("GET", url)).json();
}

/** replyagent `workspace.automations_list` filtered to active flows. */
export function useActiveFlows(): { id: any; name: string }[] {
  const { data } = useQuery({ queryKey: ["/api/automations"], queryFn: () => getJson("/api/automations").catch(() => ({})) });
  return useMemo(() => {
    const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.automations) ? data.automations : Array.isArray(data?.data) ? data.data : [];
    return list.filter((a) => a?.status === "active").map((a) => ({ id: a.id, name: a.name }));
  }, [data]);
}

/**
 * replyagent `FieldPickerNew` (types system + custom, select / multiselect
 * custom fields hidden). The stored value is the field object
 * `{ value, label, type, id? }` like there; custom fields carry their id so
 * the backend can resolve them.
 */
export function FieldSelect({
  value,
  onChange,
  withSystem,
  placeholder,
}: {
  value: any;
  onChange: (v: any) => void;
  withSystem?: boolean;
  placeholder: string;
}) {
  const { data } = useQuery({ queryKey: ["/api/custom-fields"], queryFn: () => getJson("/api/custom-fields").catch(() => ({})) });
  const custom = useMemo(() => {
    const list: any[] = Array.isArray(data?.fields) ? data.fields : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return list
      .filter((f) => !["select", "multiselect"].includes(String(f.input_type ?? "").toLowerCase()))
      .map((f) => ({ value: f.slug ?? String(f.id), label: f.label ?? f.name ?? f.slug, type: "custom", id: f.id }));
  }, [data]);
  const system = withSystem ? SYSTEM_FIELDS.map((f) => ({ ...f, type: "system" })) : [];
  const key = (f: any) => `${f.type}:${f.value}`;
  const all = [...system, ...custom];

  return (
    <Select
      value={value ? key({ type: value.type ?? "custom", value: value.value }) : ""}
      onValueChange={(k) => {
        const f = all.find((x) => key(x) === k);
        if (f) onChange(f);
      }}
    >
      <SelectTrigger className="h-9 rounded-lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {system.length > 0 && (
          <SelectGroup>
            <SelectLabel>System fields</SelectLabel>
            {system.map((f) => (
              <SelectItem key={key(f)} value={key(f)}>
                {f.label}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        <SelectGroup>
          {system.length > 0 && <SelectLabel>Custom fields</SelectLabel>}
          {custom.map((f) => (
            <SelectItem key={key(f)} value={key(f)}>
              {f.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** replyagent `getFileTypeAfterValidation()` — by extension, since the gallery gives a URL only. */
export function mediaKind(url: string): "image" | "video" | null {
  const ext = String(url ?? "").split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg"].includes(ext)) return "video";
  return null;
}

/** Colour swatch + hex text, like the chat widget settings. */
export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="color"
        value={/^#[0-9a-f]{6}$/i.test(value ?? "") ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer border dark:border-slate-700"
      />
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 flex-1 min-w-0 rounded-lg border px-3 text-[12px] bg-white dark:bg-slate-950/50 dark:border-slate-800"
      />
    </div>
  );
}

/** replyagent dashed "Select from gallery" box used for logo, favicon and custom background. */
export function GalleryBox({
  url,
  kind,
  onPick,
  label,
  className,
  accept = "image",
}: {
  url: string | null | undefined;
  kind?: "image" | "video";
  onPick: (url: string) => void;
  label: string;
  className?: string;
  accept?: "image" | "any";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={label}
        className={`flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-slate-50 dark:bg-slate-900/40 dark:border-slate-700 hover:border-primary/50 ${className ?? "h-16 w-40"}`}
      >
        {url ? (
          kind === "video" ? (
            <video src={url} muted className="h-full w-full object-cover" />
          ) : (
            <img src={url} alt="" className="h-full w-full object-contain" />
          )
        ) : (
          <ImageIcon size={18} className="text-slate-400" />
        )}
      </button>
      <GalleryPickerDialog
        open={open}
        onOpenChange={setOpen}
        mediaType={accept === "image" ? "image" : undefined}
        onPick={(media) => {
          setOpen(false);
          onPick(media.url);
        }}
      />
    </>
  );
}
