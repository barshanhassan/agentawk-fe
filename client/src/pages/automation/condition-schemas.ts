/**
 * Condition schemas — replyagent parity for the 24 condition types exposed
 * in `gateway-frontend/src/components/automation/conditions/*.vue`. Each
 * schema describes the form fields and operator options the condition row
 * renders inside the ConditionEditor's "+ Add condition" builder.
 *
 * Match modes (set on the Condition step itself, not per condition):
 *   - all  — every condition must match
 *   - any  — at least one condition must match
 *   - none — zero conditions must match
 */

import type { FieldType } from './action-schemas';

export interface ConditionFieldSchema {
  key: string;
  label: string;
  type: FieldType | 'operator' | 'condition-value';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  dependsOn?: { field: string; equals?: string };
}

export interface ConditionSchema {
  key: string;
  label: string;
  category: string;
  operators: Array<{ value: string; label: string }>;
  // The "value" field appears for some operators and not others.
  valueless?: string[]; // operator values that DON'T need a value
  fields: ConditionFieldSchema[];
}

const TEXT_OPS = [
  { value: 'exist', label: 'Exists' },
  { value: 'does_not_exist', label: 'Does not exist' },
  { value: 'is', label: 'Is exactly' },
  { value: 'is_not', label: 'Is not' },
  { value: 'contain', label: 'Contains' },
  { value: 'does_not_contain', label: 'Does not contain' },
  { value: 'begin_with', label: 'Begins with' },
];

const NUMBER_OPS = [
  { value: 'exist', label: 'Exists' },
  { value: 'does_not_exist', label: 'Does not exist' },
  { value: 'is', label: 'Equals' },
  { value: 'is_not', label: 'Does not equal' },
  { value: 'less_than', label: 'Less than' },
  { value: 'greater_than', label: 'Greater than' },
];

const DATE_OPS = [
  { value: 'exist', label: 'Exists' },
  { value: 'does_not_exist', label: 'Does not exist' },
  { value: 'on', label: 'On the date' },
  { value: 'after', label: 'After the date' },
  { value: 'before', label: 'Before the date' },
  { value: 'between_dates', label: 'Between dates' },
  { value: 'less_than', label: 'Less than (interval)' },
  { value: 'greater_than', label: 'Greater than (interval)' },
];

const BOOLEAN_OPS = [
  { value: 'is', label: 'Is' },
  { value: 'is_not', label: 'Is not' },
];

const SELECT_OPS = [
  { value: 'is', label: 'Is' },
  { value: 'is_not', label: 'Is not' },
];

const SOURCE_VALUES = [
  { value: 'manual', label: 'Manual' },
  { value: 'import', label: 'Import' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'sms', label: 'SMS' },
  { value: 'api', label: 'API' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'webchat', label: 'Webchat' },
];

const GENDER_VALUES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'not_specified', label: 'Not specified' },
];

const YES_NO_VALUES = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const CONDITION_SCHEMAS: Record<string, ConditionSchema> = {
  // ─── PRIMITIVES ────────────────────────────────────────────────────
  text: {
    key: 'text',
    label: 'Text condition',
    category: 'Custom',
    operators: TEXT_OPS,
    valueless: ['exist', 'does_not_exist'],
    fields: [
      { key: 'field', label: 'Field', type: 'custom-field', required: true },
      { key: 'value', label: 'Value', type: 'text' },
    ],
  },
  number: {
    key: 'number',
    label: 'Number condition',
    category: 'Custom',
    operators: NUMBER_OPS,
    valueless: ['exist', 'does_not_exist'],
    fields: [
      { key: 'field', label: 'Field', type: 'custom-field', required: true },
      { key: 'value', label: 'Value', type: 'number' },
    ],
  },
  date: {
    key: 'date',
    label: 'Date condition',
    category: 'Custom',
    operators: DATE_OPS,
    valueless: ['exist', 'does_not_exist'],
    fields: [
      { key: 'field', label: 'Field', type: 'custom-field', required: true },
      {
        key: 'value_source',
        label: 'Compare to',
        type: 'select',
        options: [
          { value: 'specific_date', label: 'Specific date' },
          { value: 'custom_field', label: 'Another date field' },
          { value: 'interval', label: 'Interval from now' },
        ],
      },
      { key: 'specific_date', label: 'Date', type: 'text', placeholder: 'YYYY-MM-DD', dependsOn: { field: 'value_source', equals: 'specific_date' } },
      { key: 'compare_field', label: 'Other date field', type: 'custom-field', dependsOn: { field: 'value_source', equals: 'custom_field' } },
      { key: 'interval_amount', label: 'Interval amount', type: 'number', dependsOn: { field: 'value_source', equals: 'interval' } },
      {
        key: 'interval_unit',
        label: 'Interval unit',
        type: 'select',
        options: [
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' },
        ],
        dependsOn: { field: 'value_source', equals: 'interval' },
      },
    ],
  },
  boolean: {
    key: 'boolean',
    label: 'Yes/No condition',
    category: 'Custom',
    operators: BOOLEAN_OPS,
    fields: [
      { key: 'field', label: 'Field', type: 'custom-field', required: true },
      { key: 'value', label: 'Value', type: 'select', options: YES_NO_VALUES },
    ],
  },
  yes_no: {
    key: 'yes_no',
    label: 'Yes / No',
    category: 'Custom',
    operators: BOOLEAN_OPS,
    fields: [
      { key: 'value', label: 'Value', type: 'select', options: YES_NO_VALUES },
    ],
  },
  select: {
    key: 'select',
    label: 'Select option',
    category: 'Custom',
    operators: SELECT_OPS,
    fields: [
      { key: 'field', label: 'Field', type: 'custom-field', required: true },
      { key: 'value', label: 'Value', type: 'text' },
    ],
  },

  // ─── CONTACT ATTRIBUTES ────────────────────────────────────────────
  contact_id: {
    key: 'contact_id',
    label: 'Contact ID',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Contact ID', type: 'text', required: true }],
  },
  gender: {
    key: 'gender',
    label: 'Gender',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Gender', type: 'select', options: GENDER_VALUES }],
  },
  language: {
    key: 'language',
    label: 'Language',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Language', type: 'text', placeholder: 'e.g. en, es, pt' }],
  },
  locale: {
    key: 'locale',
    label: 'Locale',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Locale', type: 'text', placeholder: 'e.g. en_US' }],
  },
  timezone: {
    key: 'timezone',
    label: 'Timezone',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Timezone', type: 'text', placeholder: 'e.g. America/New_York' }],
  },
  source: {
    key: 'source',
    label: 'Contact source',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Source', type: 'select', options: SOURCE_VALUES }],
  },
  country_code: {
    key: 'country_code',
    label: 'Country code',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Country code', type: 'text', placeholder: 'e.g. US, GB, BR' }],
  },
  subscribed: {
    key: 'subscribed',
    label: 'Subscribed',
    category: 'Contact',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Status', type: 'select', options: YES_NO_VALUES }],
  },
  tag: {
    key: 'tag',
    label: 'Has tag',
    category: 'Contact',
    operators: [
      { value: 'has', label: 'Has tag' },
      { value: 'does_not_have', label: 'Does not have tag' },
    ],
    fields: [{ key: 'tag_id', label: 'Tag', type: 'tag', required: true }],
  },

  // ─── TIME ──────────────────────────────────────────────────────────
  current_time: {
    key: 'current_time',
    label: 'Current time',
    category: 'Time',
    operators: [
      { value: 'between', label: 'Between hours' },
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
    ],
    fields: [
      { key: 'from', label: 'From (HH:MM)', type: 'text', placeholder: '09:00' },
      { key: 'to', label: 'To (HH:MM)', type: 'text', placeholder: '17:00' },
      {
        key: 'days',
        label: 'Days (Mon-Sun, comma separated)',
        type: 'text',
        placeholder: 'mon,tue,wed,thu,fri',
      },
    ],
  },
  message_window: {
    key: 'message_window',
    label: 'Message window',
    category: 'Time',
    operators: [
      { value: 'open', label: 'Is open (within 24h)' },
      { value: 'closed', label: 'Is closed' },
    ],
    fields: [
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        options: [
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'messenger', label: 'Messenger' },
          { value: 'instagram', label: 'Instagram' },
        ],
      },
    ],
  },
  last_message: {
    key: 'last_message',
    label: 'Last message',
    category: 'Time',
    operators: [
      { value: 'less_than', label: 'Less than' },
      { value: 'greater_than', label: 'Greater than' },
    ],
    fields: [
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        options: [
          { value: 'any', label: 'Any channel' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'telegram', label: 'Telegram' },
          { value: 'messenger', label: 'Messenger' },
          { value: 'instagram', label: 'Instagram' },
        ],
      },
      { key: 'amount', label: 'Amount', type: 'number' },
      {
        key: 'unit',
        label: 'Unit',
        type: 'select',
        options: [
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' },
        ],
      },
    ],
  },

  // ─── OPTING (channel subscription status) ──────────────────────────
  opting: {
    key: 'opting',
    label: 'Channel opt-in',
    category: 'Opting',
    operators: [
      { value: 'opted_in', label: 'Is opted in' },
      { value: 'opted_out', label: 'Is opted out' },
    ],
    fields: [
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        options: [
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'telegram', label: 'Telegram' },
          { value: 'messenger', label: 'Messenger' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'webchat', label: 'Webchat' },
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'call', label: 'Call' },
          { value: 'evolution', label: 'Evolution' },
          { value: 'zapi', label: 'Z-API' },
        ],
      },
    ],
  },

  // ─── MESSENGER-SPECIFIC (4) ────────────────────────────────────────
  messenger_language: {
    key: 'messenger_language',
    label: 'Messenger language',
    category: 'Messenger',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Language', type: 'text' }],
  },
  messenger_locale: {
    key: 'messenger_locale',
    label: 'Messenger locale',
    category: 'Messenger',
    operators: SELECT_OPS,
    fields: [{ key: 'value', label: 'Locale', type: 'text' }],
  },
  messenger_timezone: {
    key: 'messenger_timezone',
    label: 'Messenger timezone',
    category: 'Messenger',
    operators: NUMBER_OPS,
    fields: [{ key: 'value', label: 'UTC offset (hours)', type: 'number' }],
  },
  messenger_otn: {
    key: 'messenger_otn',
    label: 'Messenger OTN',
    category: 'Messenger',
    operators: [
      { value: 'opted_in', label: 'Has OTN' },
      { value: 'opted_out', label: 'No OTN' },
    ],
    fields: [{ key: 'topic_id', label: 'Topic ID', type: 'text', required: true }],
  },

  // ─── PIPELINE ──────────────────────────────────────────────────────
  pipeline: {
    key: 'pipeline',
    label: 'Pipeline opportunity',
    category: 'Pipeline',
    operators: [
      { value: 'is', label: 'Is' },
      { value: 'is_not', label: 'Is not' },
      { value: 'less_than', label: 'Less than' },
      { value: 'greater_than', label: 'Greater than' },
    ],
    fields: [
      { key: 'pipeline_id', label: 'Pipeline', type: 'pipeline', required: true },
      { key: 'stage_id', label: 'Stage', type: 'pipeline-stage' },
      {
        key: 'attribute',
        label: 'Attribute',
        type: 'select',
        options: [
          { value: 'value', label: 'Value' },
          { value: 'closing_date', label: 'Closing date' },
          { value: 'confidence', label: 'Confidence %' },
          { value: 'assign_to', label: 'Assigned agent' },
        ],
      },
      { key: 'compare_value', label: 'Compare to', type: 'text' },
    ],
  },
};

export const CONDITION_CATEGORIES = Array.from(
  new Set(Object.values(CONDITION_SCHEMAS).map((c) => c.category)),
).sort();

export function getConditionSchema(key: string): ConditionSchema | null {
  return CONDITION_SCHEMAS[key] ?? null;
}
