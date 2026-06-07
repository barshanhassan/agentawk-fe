/**
 * Trigger schemas — replyagent parity for the 36 trigger types exposed in
 * `gateway-frontend/src/components/automation/Trigger.vue`. Each schema
 * describes the form fields the right-sidebar editor renders when the user
 * picks that trigger event for an activity.
 *
 * The schemas are PURE DATA — they're consumed by `editors.tsx`'s
 * `TriggerEditor` component which knows how to render each `FieldType`.
 * Adding a new trigger == adding an entry here.
 */

import type { FieldType } from './action-schemas';

export interface TriggerFieldSchema {
  key: string;
  label: string;
  type: FieldType | 'start-url' | 'ref-text' | 'keywords' | 'match-type' | 'payload-toggle';
  options?: Array<{ value: string; label: string }>;
  channel?: string;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  maxLength?: number;
  // When true, render in a collapsed "Payload" section toggled by a switch.
  inPayloadSection?: boolean;
}

export interface TriggerSchema {
  event: string;
  label: string;
  category: string; // For TriggersModal grouping
  icon?: string;
  // URL-based triggers expose a copyable start URL constructed server-side.
  // We tell the editor which URL to fetch by setting urlField.
  urlField?: 'default' | 'telegram' | 'whatsapp' | 'webchat' | 'evolution' | 'zapi' | 'fb_ref' | 'ig_ref';
  fields: TriggerFieldSchema[];
}

const MATCH_TYPE_OPTIONS = [
  { value: 'is', label: 'Is exact' },
  { value: 'contains', label: 'Contains' },
  { value: 'begins_with', label: 'Begins with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'word', label: 'Exact word' },
  { value: 'doesnot_contains', label: 'Does not contain' },
];

const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'import', label: 'Import' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'sms', label: 'SMS' },
  { value: 'webchat', label: 'Web chat' },
  { value: 'api', label: 'API' },
  { value: 'webhook', label: 'Webhook' },
];

export const TRIGGER_SCHEMAS: Record<string, TriggerSchema> = {
  // ─── URL TRIGGERS (8) ──────────────────────────────────────────────
  default_url: {
    event: 'default_url',
    label: 'Default',
    category: 'Events',
    icon: 'fa-link',
    urlField: 'default',
    fields: [
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
      { key: 'payload_enabled', label: 'Enable payload', type: 'payload-toggle' },
      { key: 'payload', label: 'Payload', type: 'textarea', maxLength: 500, inPayloadSection: true, helpText: 'Inject extra context as {{trigger.payload.<key>}}' },
    ],
  },
  telegram_url: {
    event: 'telegram_url',
    label: 'Telegram start URL',
    category: 'Telegram',
    icon: 'fa-telegram',
    urlField: 'telegram',
    fields: [
      { key: 'channel_account_id', label: 'Telegram bot', type: 'channel-account', channel: 'telegram', required: true },
      { key: 'ref', label: 'Ref text', type: 'text', maxLength: 64 },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
      { key: 'payload_enabled', label: 'Enable payload', type: 'payload-toggle' },
      { key: 'payload', label: 'Payload', type: 'textarea', maxLength: 500, inPayloadSection: true },
    ],
  },
  whatsapp_url: {
    event: 'whatsapp_url',
    label: 'WhatsApp start URL',
    category: 'WhatsApp',
    icon: 'fa-whatsapp',
    urlField: 'whatsapp',
    fields: [
      { key: 'channel_account_id', label: 'WhatsApp number', type: 'channel-account', channel: 'whatsapp', required: true },
      { key: 'ref', label: 'Ref text', type: 'text', maxLength: 64 },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
      { key: 'payload_enabled', label: 'Enable payload', type: 'payload-toggle' },
      { key: 'payload', label: 'Payload', type: 'textarea', maxLength: 500, inPayloadSection: true },
    ],
  },
  webchat_url: {
    event: 'webchat_url',
    label: 'Webchat start URL',
    category: 'Webchat',
    icon: 'fa-comment',
    urlField: 'webchat',
    fields: [
      { key: 'channel_account_id', label: 'Webchat instance', type: 'channel-account', channel: 'webchat', required: true },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
      { key: 'payload_enabled', label: 'Enable payload', type: 'payload-toggle' },
      { key: 'payload', label: 'Payload', type: 'textarea', maxLength: 500, inPayloadSection: true },
    ],
  },
  evolution_url: {
    event: 'evolution_url',
    label: 'Evolution start URL',
    category: 'Evolution',
    icon: 'fa-whatsapp',
    urlField: 'evolution',
    fields: [
      { key: 'channel_account_id', label: 'Evolution instance', type: 'channel-account', channel: 'evolution', required: true },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
      { key: 'payload_enabled', label: 'Enable payload', type: 'payload-toggle' },
      { key: 'payload', label: 'Payload', type: 'textarea', maxLength: 500, inPayloadSection: true },
    ],
  },
  zapi_url: {
    event: 'zapi_url',
    label: 'Z-API start URL',
    category: 'Z-API',
    icon: 'fa-whatsapp',
    urlField: 'zapi',
    fields: [
      { key: 'channel_account_id', label: 'Z-API instance', type: 'channel-account', channel: 'zapi', required: true },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
      { key: 'payload_enabled', label: 'Enable payload', type: 'payload-toggle' },
      { key: 'payload', label: 'Payload', type: 'textarea', maxLength: 500, inPayloadSection: true },
    ],
  },
  fb_messenger_ref_start: {
    event: 'fb_messenger_ref_start',
    label: 'Messenger ref URL',
    category: 'Facebook Messenger',
    icon: 'fa-facebook-messenger',
    urlField: 'fb_ref',
    fields: [
      { key: 'channel_account_id', label: 'Facebook page', type: 'channel-account', channel: 'messenger', required: true },
      { key: 'ref', label: 'Ref text', type: 'text', required: true, maxLength: 64 },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
    ],
  },
  ig_ref_start: {
    event: 'ig_ref_start',
    label: 'Instagram ref URL',
    category: 'Instagram',
    icon: 'fa-instagram',
    urlField: 'ig_ref',
    fields: [
      { key: 'channel_account_id', label: 'Instagram account', type: 'channel-account', channel: 'instagram', required: true },
      { key: 'ref', label: 'Ref text', type: 'text', required: true, maxLength: 64 },
      { key: 'url', label: 'Trigger URL', type: 'start-url' },
    ],
  },

  // ─── CONTACT LIFECYCLE (5) ─────────────────────────────────────────
  contact_added: {
    event: 'contact_added',
    label: 'Contact Added',
    category: 'Events',
    icon: 'fa-user-plus',
    fields: [
      { key: 'source', label: 'Source (any if blank)', type: 'select', options: SOURCE_OPTIONS },
      { key: 'channel', label: 'Channel filter (any if blank)', type: 'select', options: SOURCE_OPTIONS },
    ],
  },
  contact_deleted: {
    event: 'contact_deleted',
    label: 'Contact Deleted',
    category: 'Events',
    icon: 'fa-user-minus',
    fields: [],
  },
  tag_applied: {
    event: 'tag_applied',
    label: 'Tag applied:',
    category: 'Events',
    icon: 'fa-tag',
    fields: [{ key: 'tag_id', label: 'Tag', type: 'tag', required: true }],
  },
  tag_removed: {
    event: 'tag_removed',
    label: 'Tag removed:',
    category: 'Events',
    icon: 'fa-tag',
    fields: [{ key: 'tag_id', label: 'Tag', type: 'tag', required: true }],
  },
  custom_field_changed: {
    event: 'custom_field_changed',
    label: 'Custom field updated:',
    category: 'Events',
    icon: 'fa-database',
    fields: [
      { key: 'field_id', label: 'Custom field', type: 'custom-field', required: true },
      { key: 'value', label: 'New value equals (optional)', type: 'text' },
    ],
  },
  date_field_changed: {
    event: 'date_field_changed',
    label: 'Date & Time changed',
    category: 'Events',
    icon: 'fa-calendar-day',
    fields: [
      { key: 'field_id', label: 'Date field', type: 'custom-field', required: true },
      {
        key: 'condition',
        label: 'When',
        type: 'select',
        options: [
          { value: 'on', label: 'On the date' },
          { value: 'before', label: 'Before the date' },
          { value: 'after', label: 'After the date' },
        ],
      },
      { key: 'offset_amount', label: 'Offset amount', type: 'number' },
      {
        key: 'offset_unit',
        label: 'Offset unit',
        type: 'select',
        options: [
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' },
        ],
      },
    ],
  },
  system_field_changed: {
    event: 'system_field_changed',
    label: 'System field updated:',
    category: 'Events',
    icon: 'fa-cog',
    fields: [
      { key: 'field', label: 'System field', type: 'system-field', required: true },
      { key: 'value', label: 'New value equals (optional)', type: 'text' },
    ],
  },

  // ─── KEYWORD TRIGGERS (7) ──────────────────────────────────────────
  wa_keyword: {
    event: 'wa_keyword',
    label: 'WhatsApp keyword',
    category: 'WhatsApp',
    icon: 'fa-whatsapp',
    fields: [
      { key: 'channel_account_id', label: 'WhatsApp number', type: 'channel-account', channel: 'whatsapp' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  tg_keyword: {
    event: 'tg_keyword',
    label: 'Telegram keyword',
    category: 'Telegram',
    icon: 'fa-telegram',
    fields: [
      { key: 'channel_account_id', label: 'Telegram bot', type: 'channel-account', channel: 'telegram' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  ig_keyword: {
    event: 'ig_keyword',
    label: 'Instagram keyword',
    category: 'Instagram',
    icon: 'fa-instagram',
    fields: [
      { key: 'channel_account_id', label: 'Instagram page', type: 'channel-account', channel: 'instagram' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  fb_keyword: {
    event: 'fb_keyword',
    label: 'Messenger keyword',
    category: 'Facebook Messenger',
    icon: 'fa-facebook-messenger',
    fields: [
      { key: 'channel_account_id', label: 'Facebook page', type: 'channel-account', channel: 'messenger' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  wc_keyword: {
    event: 'wc_keyword',
    label: 'Webchat keyword',
    category: 'Webchat',
    icon: 'fa-comment',
    fields: [
      { key: 'channel_account_id', label: 'Webchat instance', type: 'channel-account', channel: 'webchat' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  twilio_keyword: {
    event: 'twilio_keyword',
    label: 'SMS keyword',
    category: 'Twilio',
    icon: 'fa-phone',
    fields: [
      { key: 'channel_account_id', label: 'Twilio number', type: 'channel-account', channel: 'twilio' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  evolution_keyword: {
    event: 'evolution_keyword',
    label: 'Evolution keyword',
    category: 'Evolution',
    icon: 'fa-whatsapp',
    fields: [
      { key: 'channel_account_id', label: 'Evolution instance', type: 'channel-account', channel: 'evolution' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },
  zapi_keyword: {
    event: 'zapi_keyword',
    label: 'Z-API keyword',
    category: 'Z-API',
    icon: 'fa-whatsapp',
    fields: [
      { key: 'channel_account_id', label: 'Z-API instance', type: 'channel-account', channel: 'zapi' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'keywords' },
    ],
  },

  // ─── CONVERSATION (3) ──────────────────────────────────────────────
  conversation_marked_as_done: {
    event: 'conversation_marked_as_done',
    label: 'Conversation Marked as Done',
    category: 'Events',
    icon: 'fa-check-double',
    fields: [
      {
        key: 'channel',
        label: 'Channel filter',
        type: 'select',
        options: [
          { value: '', label: 'Any channel' },
          ...SOURCE_OPTIONS,
        ],
      },
    ],
  },
  conversation_assigned: {
    event: 'conversation_assigned',
    label: 'Conversation assigned',
    category: 'Conversation',
    icon: 'fa-user-tag',
    fields: [{ key: 'user_id', label: 'Agent (any if blank)', type: 'user' }],
  },
  subscribed_to_flow: {
    event: 'subscribed_to_flow',
    label: 'Subscribed to flow',
    category: 'Flow',
    icon: 'fa-bell',
    fields: [],
  },
  unsubscribed_from_flow: {
    event: 'unsubscribed_from_flow',
    label: 'Unsubscribed from flow',
    category: 'Flow',
    icon: 'fa-bell-slash',
    fields: [],
  },
  broadcast: {
    event: 'broadcast',
    label: 'Broadcast',
    category: 'Broadcast',
    icon: 'fa-broadcast-tower',
    fields: [],
  },

  // ─── FB / IG / WA EXTRAS (6) ───────────────────────────────────────
  fb_topic_subscribed: {
    event: 'fb_topic_subscribed',
    label: 'Messenger topic subscribed',
    category: 'Facebook Messenger',
    icon: 'fa-facebook-messenger',
    fields: [
      { key: 'channel_account_id', label: 'Facebook page', type: 'channel-account', channel: 'messenger', required: true },
      { key: 'topic_id', label: 'Topic', type: 'text', required: true },
    ],
  },
  fb_comment: {
    event: 'fb_comment',
    label: 'Facebook comment reply',
    category: 'Facebook Messenger',
    icon: 'fa-comment',
    fields: [
      { key: 'channel_account_id', label: 'Facebook page', type: 'channel-account', channel: 'messenger', required: true },
      { key: 'post_id', label: 'Post ID (any if blank)', type: 'text' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (any if blank)', type: 'keywords' },
    ],
  },
  ig_story_mention: {
    event: 'ig_story_mention',
    label: 'Instagram story mention',
    category: 'Instagram',
    icon: 'fa-instagram',
    fields: [
      { key: 'channel_account_id', label: 'Instagram account', type: 'channel-account', channel: 'instagram', required: true },
    ],
  },
  ig_comment_reply: {
    event: 'ig_comment_reply',
    label: 'Instagram comment reply',
    category: 'Instagram',
    icon: 'fa-instagram',
    fields: [
      { key: 'channel_account_id', label: 'Instagram account', type: 'channel-account', channel: 'instagram', required: true },
      { key: 'post_id', label: 'Post ID (any if blank)', type: 'text' },
      { key: 'match_type', label: 'Match type', type: 'select', options: MATCH_TYPE_OPTIONS },
      { key: 'keywords', label: 'Keywords (any if blank)', type: 'keywords' },
    ],
  },
  wa_ref_start: {
    event: 'wa_ref_start',
    label: 'WhatsApp ref start',
    category: 'WhatsApp',
    icon: 'fa-whatsapp',
    fields: [
      { key: 'channel_account_id', label: 'WhatsApp number', type: 'channel-account', channel: 'whatsapp', required: true },
      { key: 'ref_code', label: 'Ref code', type: 'text', required: true },
    ],
  },
  wa_ad_clicked: {
    event: 'wa_ad_clicked',
    label: 'WhatsApp ad clicked',
    category: 'WhatsApp',
    icon: 'fa-whatsapp',
    fields: [
      { key: 'channel_account_id', label: 'WhatsApp number', type: 'channel-account', channel: 'whatsapp', required: true },
      { key: 'ad_id', label: 'Ad ID (any if blank)', type: 'text' },
    ],
  },

  // ─── PIPELINE / API (2) ────────────────────────────────────────────
  opportunity_stage_moved: {
    event: 'opportunity_stage_moved',
    label: 'Opportunity stage moved',
    category: 'Pipeline',
    icon: 'fa-project-diagram',
    fields: [
      { key: 'pipeline_id', label: 'Pipeline', type: 'pipeline', required: true },
      { key: 'stage_id', label: 'Stage (any if blank)', type: 'pipeline-stage' },
    ],
  },
  api_trigger: {
    event: 'api_trigger',
    label: 'API trigger',
    category: 'API',
    icon: 'fa-bolt',
    fields: [
      { key: 'api_trigger_id', label: 'API trigger', type: 'text', required: true, helpText: 'ID of the saved API trigger' },
    ],
  },

  // ─── FB/IG TIMEZONE/LOCALE/LANG (4 — Messenger-side filters) ────────
  fb_topic_sent: {
    event: 'fb_topic_sent',
    label: 'Messenger topic sent',
    category: 'Facebook Messenger',
    icon: 'fa-facebook-messenger',
    fields: [
      { key: 'channel_account_id', label: 'Facebook page', type: 'channel-account', channel: 'messenger', required: true },
    ],
  },
  fb_topic_limit_reach: {
    event: 'fb_topic_limit_reach',
    label: 'Messenger topic limit reached',
    category: 'Facebook Messenger',
    icon: 'fa-facebook-messenger',
    fields: [
      { key: 'channel_account_id', label: 'Facebook page', type: 'channel-account', channel: 'messenger', required: true },
    ],
  },
};

export const TRIGGER_CATEGORIES = Array.from(
  new Set(Object.values(TRIGGER_SCHEMAS).map((t) => t.category)),
).sort();

export function getTriggerSchema(event: string): TriggerSchema | null {
  return TRIGGER_SCHEMAS[event] ?? null;
}

export function getTriggersByCategory(category?: string): TriggerSchema[] {
  const all = Object.values(TRIGGER_SCHEMAS);
  if (!category || category === 'All') return all;
  return all.filter((t) => t.category === category);
}
