import React from 'react';
import type { IntegrationsContext } from './ActionEditor';

/**
 * Variable / token picker — a small "+" button that opens a popover listing
 * available variables the user can insert into any text field. Tokens follow
 * replyagent's syntax:
 *
 *   {{contact.first_name}}        — contact system field
 *   {{contact.field.<slug>}}      — contact custom field
 *   {{flow.<step_label>.text}}    — previous step's output (e.g. ChatGPT answer)
 *   {{now}} / {{now.iso}}         — current timestamp helpers
 *
 * Backend's action handlers replace these at execution time via
 * `injectContactId()` and the templating helper. Adding new variable kinds
 * means extending the list here and the matching backend helper.
 */

interface VariablePickerProps {
  onInsert: (token: string) => void;
  integrations: IntegrationsContext;
}

const SYSTEM_FIELDS = [
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'full_name', label: 'Full name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile_number', label: 'Mobile' },
  { key: 'language', label: 'Language' },
  { key: 'locale', label: 'Locale' },
  { key: 'timezone', label: 'Timezone' },
];

export const VariablePicker: React.FC<VariablePickerProps> = ({ onInsert, integrations }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const insert = (token: string) => {
    onInsert(token);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[10px] uppercase font-bold text-indigo-600 hover:text-indigo-800 px-1.5 py-0.5 border border-indigo-200 rounded bg-white"
        title="Insert variable"
      >
        + var
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-[260px] max-h-[360px] overflow-auto bg-white border border-gray-200 rounded shadow-xl">
          <Section label="Contact (system)">
            {SYSTEM_FIELDS.map((f) => (
              <Token key={f.key} label={f.label} token={`{{contact.${f.key}}}`} onInsert={insert} />
            ))}
          </Section>
          {(integrations.custom_fields ?? []).length > 0 && (
            <Section label="Contact (custom)">
              {(integrations.custom_fields ?? []).map((f: any) => (
                <Token
                  key={f.id}
                  label={f.label ?? f.slug}
                  token={`{{contact.field.${f.slug}}}`}
                  onInsert={insert}
                />
              ))}
            </Section>
          )}
          <Section label="Time helpers">
            <Token label="Now (ISO)" token="{{now.iso}}" onInsert={insert} />
            <Token label="Now (epoch seconds)" token="{{now.epoch}}" onInsert={insert} />
            <Token label="Today (date)" token="{{now.date}}" onInsert={insert} />
          </Section>
          <Section label="Workspace">
            <Token label="Workspace ID" token="{{workspace.id}}" onInsert={insert} />
          </Section>
        </div>
      )}
    </div>
  );
};

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-500 bg-gray-50 sticky top-0">
      {label}
    </div>
    {children}
  </div>
);

const Token: React.FC<{ label: string; token: string; onInsert: (t: string) => void }> = ({ label, token, onInsert }) => (
  <button
    type="button"
    onClick={() => onInsert(token)}
    className="block w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50"
  >
    <span className="text-gray-700">{label}</span>
    <span className="text-gray-400 text-[10px] ml-2 font-mono">{token}</span>
  </button>
);
