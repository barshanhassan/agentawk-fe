/**
 * Declarative schemas for every automation action's property editor.
 *
 * The Smart Flow builder's right-sidebar inspector renders fields off these
 * definitions instead of carrying a separate component per action. Each
 * field's `type` maps to a primitive picker in `pickers.tsx` (TagPicker,
 * CustomFieldPicker, AiAgentPicker, UserPicker, etc.).
 *
 * Keeping the schemas declarative means:
 *   - Adding a new action == adding one entry here + (optionally) a new
 *     primitive picker if its field type isn't already represented.
 *   - The save path is uniform: ActionEditor sets `node.data.value.<key>`
 *     and the builder's sync-graph payload carries the same shape the
 *     backend processor's `handleAction()` dispatcher reads.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'json'
  | 'tag'
  | 'custom-field'
  | 'system-field'
  | 'ai-agent'
  | 'ai-voice-agent'
  | 'dify-bot'
  | 'user'
  | 'automation'
  | 'channel-account'
  | 'pipeline'
  | 'pipeline-stage'
  | 'list-of-keywords';

export interface ActionFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  placeholder?: string;
  // For channel-account: which channel (whatsapp/telegram/messenger/…)
  channel?: string;
  helpText?: string;
}

export interface ActionSchema {
  slug: string;
  label: string;
  group: string;
  fields: ActionFieldSchema[];
}

const SAVE_TO_FIELD: ActionFieldSchema = {
  key: 'save_to.field_id',
  label: 'Save answer to (custom field)',
  type: 'custom-field',
};

export const ACTION_SCHEMAS: Record<string, ActionSchema> = {
  // ─── Tags & Fields ────────────────────────────────────────────────
  add_tag: {
    slug: 'add_tag',
    label: 'Add tag',
    group: 'Tags & Fields',
    fields: [{ key: 'tag.id', label: 'Tag', type: 'tag', required: true }],
  },
  remove_tag: {
    slug: 'remove_tag',
    label: 'Remove tag',
    group: 'Tags & Fields',
    fields: [{ key: 'tag.id', label: 'Tag', type: 'tag', required: true }],
  },
  add_custom_field: {
    slug: 'add_custom_field',
    label: 'Set custom field',
    group: 'Tags & Fields',
    fields: [
      { key: 'field.id', label: 'Custom field', type: 'custom-field', required: true },
      { key: 'value', label: 'Value', type: 'text' },
    ],
  },
  remove_custom_field: {
    slug: 'remove_custom_field',
    label: 'Remove custom field',
    group: 'Tags & Fields',
    fields: [{ key: 'field.id', label: 'Custom field', type: 'custom-field', required: true }],
  },
  json_to_custom_fields: {
    slug: 'json_to_custom_fields',
    label: 'JSON → custom fields',
    group: 'Tags & Fields',
    fields: [
      { key: 'source', label: 'Source JSON (variable / contact field)', type: 'text' },
      { key: 'mappings', label: 'Mappings — [{ json_path, field_id }]', type: 'json' },
    ],
  },
  set_system_field: {
    slug: 'set_system_field',
    label: 'Set system field',
    group: 'Tags & Fields',
    fields: [
      { key: 'field', label: 'Field', type: 'system-field', required: true },
      { key: 'value', label: 'Value', type: 'text' },
    ],
  },
  unset_system_field: {
    slug: 'unset_system_field',
    label: 'Unset system field',
    group: 'Tags & Fields',
    fields: [{ key: 'field', label: 'Field', type: 'system-field', required: true }],
  },
  set_language: {
    slug: 'set_language',
    label: 'Set language',
    group: 'Tags & Fields',
    fields: [{ key: 'value', label: 'Language code (e.g. en)', type: 'text', required: true }],
  },
  set_locale: {
    slug: 'set_locale',
    label: 'Set locale',
    group: 'Tags & Fields',
    fields: [{ key: 'value', label: 'Locale (e.g. en-US)', type: 'text', required: true }],
  },
  set_timezone: {
    slug: 'set_timezone',
    label: 'Set timezone',
    group: 'Tags & Fields',
    fields: [{ key: 'value', label: 'IANA Timezone (e.g. America/New_York)', type: 'text', required: true }],
  },

  // ─── External ────────────────────────────────────────────────────
  external_request: {
    slug: 'external_request',
    label: 'HTTP request',
    group: 'External',
    fields: [
      { key: 'url', label: 'URL', type: 'text', required: true },
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => ({ value: m, label: m })),
      },
      { key: 'headers', label: 'Headers (JSON)', type: 'json' },
      { key: 'body', label: 'Body (JSON)', type: 'json' },
      SAVE_TO_FIELD,
    ],
  },
  make_hook: {
    slug: 'make_hook',
    label: 'Make.com webhook',
    group: 'External',
    fields: [
      { key: 'url', label: 'Make webhook URL', type: 'text', required: true },
      { key: 'payload', label: 'Payload (JSON)', type: 'json' },
    ],
  },

  // ─── AI ───────────────────────────────────────────────────────────
  chatgpt_question: {
    slug: 'chatgpt_question',
    label: 'ChatGPT: ask question',
    group: 'AI',
    fields: [
      { key: 'agent.id', label: 'AI Agent', type: 'ai-agent', required: true },
      { key: 'question', label: 'Question / Prompt', type: 'textarea', required: true },
      SAVE_TO_FIELD,
    ],
  },
  chatgpt_completion: {
    slug: 'chatgpt_completion',
    label: 'ChatGPT: completion',
    group: 'AI',
    fields: [
      { key: 'agent.id', label: 'AI Agent', type: 'ai-agent', required: true },
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      SAVE_TO_FIELD,
    ],
  },
  chatgpt_image_recognition: {
    slug: 'chatgpt_image_recognition',
    label: 'ChatGPT: image recognition',
    group: 'AI',
    fields: [
      { key: 'agent.id', label: 'AI Agent', type: 'ai-agent', required: true },
      { key: 'image_url', label: 'Image URL', type: 'text', required: true },
      { key: 'prompt', label: 'Question about the image', type: 'textarea' },
      SAVE_TO_FIELD,
    ],
  },
  chatgpt_text_to_speech: {
    slug: 'chatgpt_text_to_speech',
    label: 'ChatGPT: text to speech',
    group: 'AI',
    fields: [
      { key: 'agent.id', label: 'AI Agent', type: 'ai-agent', required: true },
      { key: 'text', label: 'Text to speak', type: 'textarea', required: true },
      { key: 'voice', label: 'Voice (alloy / echo / fable / onyx / nova / shimmer)', type: 'text' },
    ],
  },
  dify_question: {
    slug: 'dify_question',
    label: 'Dify: ask question',
    group: 'AI',
    fields: [
      { key: 'bot.id', label: 'Dify Bot', type: 'dify-bot', required: true },
      { key: 'question', label: 'Question', type: 'textarea', required: true },
      { key: 'inputs', label: 'Input vars (JSON)', type: 'json' },
      SAVE_TO_FIELD,
    ],
  },
  ai_studio_vision: {
    slug: 'ai_studio_vision',
    label: 'AI Studio: vision',
    group: 'AI',
    fields: [
      { key: 'agent.id', label: 'AI Agent', type: 'ai-agent', required: true },
      { key: 'image_url', label: 'Image URL', type: 'text', required: true },
      { key: 'prompt', label: 'Prompt', type: 'textarea' },
      SAVE_TO_FIELD,
    ],
  },
  ai_studio_text_to_speech: {
    slug: 'ai_studio_text_to_speech',
    label: 'AI Studio: text to speech',
    group: 'AI',
    fields: [
      { key: 'agent.id', label: 'AI Agent', type: 'ai-agent', required: true },
      { key: 'text', label: 'Text to speak', type: 'textarea', required: true },
      { key: 'voice', label: 'Voice', type: 'text' },
    ],
  },
  elevenlabs_text_to_speech: {
    slug: 'elevenlabs_text_to_speech',
    label: 'ElevenLabs: text to speech',
    group: 'AI',
    fields: [
      { key: 'voice_id', label: 'Voice ID', type: 'text', required: true },
      { key: 'text', label: 'Text', type: 'textarea', required: true },
      { key: 'stability', label: 'Stability (0-1)', type: 'number' },
      { key: 'similarity_boost', label: 'Similarity boost (0-1)', type: 'number' },
    ],
  },
  ms_text_to_speech: {
    slug: 'ms_text_to_speech',
    label: 'Microsoft: text to speech',
    group: 'AI',
    fields: [
      { key: 'text', label: 'Text', type: 'textarea', required: true },
      { key: 'voice', label: 'Voice (e.g. en-US-AriaNeural)', type: 'text' },
    ],
  },

  // ─── CRM ──────────────────────────────────────────────────────────
  active_campaign: {
    slug: 'active_campaign',
    label: 'ActiveCampaign',
    group: 'CRM / Conversions',
    fields: [
      { key: 'tag_id', label: 'Tag ID (optional)', type: 'text' },
      { key: 'list_id', label: 'List ID (optional)', type: 'text' },
    ],
  },
  capi: {
    slug: 'capi',
    label: 'Meta Conversions API',
    group: 'CRM / Conversions',
    fields: [
      { key: 'pixel_id', label: 'Pixel ID', type: 'text', required: true },
      { key: 'event_name', label: 'Event name (e.g. Lead, Purchase)', type: 'text', required: true },
      { key: 'custom_data', label: 'Custom data (JSON)', type: 'json' },
    ],
  },
  meta_conversions: {
    slug: 'meta_conversions',
    label: 'Meta Conversions',
    group: 'CRM / Conversions',
    fields: [
      { key: 'pixel_id', label: 'Pixel ID', type: 'text', required: true },
      { key: 'event_name', label: 'Event name', type: 'text', required: true },
      { key: 'custom_data', label: 'Custom data (JSON)', type: 'json' },
    ],
  },

  // ─── Baserow ──────────────────────────────────────────────────────
  baserow_add_row: {
    slug: 'baserow_add_row',
    label: 'Baserow: add row',
    group: 'Baserow',
    fields: [
      { key: 'table_id', label: 'Table ID', type: 'text', required: true },
      { key: 'fields', label: 'Fields (JSON)', type: 'json' },
      SAVE_TO_FIELD,
    ],
  },
  baserow_get_row: {
    slug: 'baserow_get_row',
    label: 'Baserow: get row',
    group: 'Baserow',
    fields: [
      { key: 'table_id', label: 'Table ID', type: 'text', required: true },
      { key: 'row_id', label: 'Row ID', type: 'text', required: true },
      SAVE_TO_FIELD,
    ],
  },
  baserow_update_row: {
    slug: 'baserow_update_row',
    label: 'Baserow: update row',
    group: 'Baserow',
    fields: [
      { key: 'table_id', label: 'Table ID', type: 'text', required: true },
      { key: 'row_id', label: 'Row ID', type: 'text', required: true },
      { key: 'fields', label: 'Fields (JSON)', type: 'json' },
    ],
  },
  baserow_delete_row: {
    slug: 'baserow_delete_row',
    label: 'Baserow: delete row',
    group: 'Baserow',
    fields: [
      { key: 'table_id', label: 'Table ID', type: 'text', required: true },
      { key: 'row_id', label: 'Row ID', type: 'text', required: true },
    ],
  },
  baserow_to_json: {
    slug: 'baserow_to_json',
    label: 'Baserow → JSON',
    group: 'Baserow',
    fields: [
      { key: 'table_id', label: 'Table ID', type: 'text', required: true },
      SAVE_TO_FIELD,
    ],
  },

  // ─── Channel opting ──────────────────────────────────────────────
  whatsapp_opting: { slug: 'whatsapp_opting', label: 'WhatsApp opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  telegram_opting: { slug: 'telegram_opting', label: 'Telegram opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  messenger_opting: { slug: 'messenger_opting', label: 'Messenger opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  instagram_opting: { slug: 'instagram_opting', label: 'Instagram opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  webchat_opting: { slug: 'webchat_opting', label: 'Webchat opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  email_opting: { slug: 'email_opting', label: 'Email opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  sms_opting: { slug: 'sms_opting', label: 'SMS opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  call_opting: { slug: 'call_opting', label: 'Call opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  zapi_opting: { slug: 'zapi_opting', label: 'Z-API opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },
  evolution_opting: { slug: 'evolution_opting', label: 'Evolution opt-in/out', group: 'Channel opting', fields: [{ key: 'opt_in', label: 'Subscribe?', type: 'checkbox' }, { key: 'reason', label: 'Reason', type: 'text' }] },

  // ─── Flow control ─────────────────────────────────────────────────
  start_automation: {
    slug: 'start_automation',
    label: 'Start another automation',
    group: 'Flow control',
    fields: [{ key: 'automation.id', label: 'Automation', type: 'automation', required: true }],
  },
  remove_from_flow: {
    slug: 'remove_from_flow',
    label: 'Remove from automation',
    group: 'Flow control',
    fields: [
      { key: 'automation.id', label: 'Automation (blank = current contact, all flows)', type: 'automation' },
    ],
  },

  // ─── Conversation ─────────────────────────────────────────────────
  assign_conversation: {
    slug: 'assign_conversation',
    label: 'Assign conversation',
    group: 'Conversation',
    fields: [
      { key: 'user.id', label: 'Assign to', type: 'user', required: true },
      { key: 'snooze_until', label: 'Snooze until (ISO datetime)', type: 'text', helpText: 'Optional — agent gets the chat at this time' },
      {
        key: 'snooze_duration',
        label: 'Snooze duration',
        type: 'select',
        options: [
          { value: '', label: 'No snooze' },
          { value: '15m', label: '15 minutes' },
          { value: '1h', label: '1 hour' },
          { value: '4h', label: '4 hours' },
          { value: '1d', label: '1 day' },
          { value: '3d', label: '3 days' },
          { value: '7d', label: '7 days' },
        ],
      },
    ],
  },
  manage_conversations: {
    slug: 'manage_conversations',
    label: 'Manage conversations',
    group: 'Conversation',
    fields: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['ACTIVE', 'COMPLETED', 'UNASSIGNED', 'SPAM'].map((v) => ({ value: v, label: v })),
      },
    ],
  },
  notify_agent: {
    slug: 'notify_agent',
    label: 'Notify agent',
    group: 'Conversation',
    fields: [
      { key: 'user.id', label: 'Agent', type: 'user', required: true },
      { key: 'message', label: 'Notification message', type: 'textarea' },
    ],
  },
  close_conversation: {
    slug: 'close_conversation',
    label: 'Close conversation',
    group: 'Conversation',
    fields: [
      {
        key: 'note',
        label: 'Closing note (optional)',
        type: 'textarea',
        helpText: 'Stored on the inbox row; not sent to the contact',
      },
    ],
  },

  // ─── Pipeline ─────────────────────────────────────────────────────
  create_opportunity: {
    slug: 'create_opportunity',
    label: 'Create opportunity',
    group: 'Pipeline',
    fields: [
      { key: 'pipeline.id', label: 'Pipeline', type: 'pipeline', required: true },
      { key: 'stage.id', label: 'Stage', type: 'pipeline-stage', required: true },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'text' },
      { key: 'probability', label: 'Probability (1-10)', type: 'number' },
      { key: 'note', label: 'Note', type: 'textarea' },
    ],
  },
  update_opportunity: {
    slug: 'update_opportunity',
    label: 'Update opportunity',
    group: 'Pipeline',
    fields: [
      { key: 'stage_id', label: 'Move to stage', type: 'pipeline-stage' },
      { key: 'value', label: 'Value', type: 'number' },
      { key: 'probability', label: 'Probability (1-10)', type: 'number' },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['ACTIVE', 'WON', 'LOST'].map((v) => ({ value: v, label: v })),
      },
    ],
  },

  // ─── Contact ──────────────────────────────────────────────────────
  delete_contact: { slug: 'delete_contact', label: 'Delete contact', group: 'Contact', fields: [] },

  // ─── Misc integrations ───────────────────────────────────────────
  cal_calendar: {
    slug: 'cal_calendar',
    label: 'Cal.com booking',
    group: 'Other integrations',
    fields: [
      { key: 'event_type_id', label: 'Event type ID', type: 'text', required: true },
      { key: 'start', label: 'Start (ISO datetime)', type: 'text', required: true },
      { key: 'end', label: 'End (ISO datetime)', type: 'text' },
      { key: 'timezone', label: 'Timezone', type: 'text' },
      SAVE_TO_FIELD,
    ],
  },
  cloudinary_image: {
    slug: 'cloudinary_image',
    label: 'Cloudinary image transform',
    group: 'Other integrations',
    fields: [
      { key: 'source_url', label: 'Source URL', type: 'text', required: true },
      { key: 'transformation', label: 'Transformation (e.g. q_auto,f_auto)', type: 'text' },
      SAVE_TO_FIELD,
    ],
  },
  get_report: { slug: 'get_report', label: 'Get report', group: 'Other integrations', fields: [{ key: 'report.id', label: 'Report ID', type: 'text', required: true }, SAVE_TO_FIELD] },
  trigger_report: { slug: 'trigger_report', label: 'Trigger report', group: 'Other integrations', fields: [{ key: 'report.id', label: 'Report ID', type: 'text', required: true }] },
  share_clonekit: { slug: 'share_clonekit', label: 'Share clone kit', group: 'Other integrations', fields: [{ key: 'bundle_id', label: 'Bundle ID', type: 'text', required: true }, { key: 'recipient_workspace_id', label: 'Recipient workspace ID', type: 'text' }] },
  unstract: { slug: 'unstract', label: 'Unstract document', group: 'Other integrations', fields: [{ key: 'document_url', label: 'Document URL', type: 'text', required: true }, { key: 'workflow', label: 'Workflow name', type: 'text' }, SAVE_TO_FIELD] },
  woovi: { slug: 'woovi', label: 'Woovi payment', group: 'Other integrations', fields: [{ key: 'amount', label: 'Amount', type: 'number', required: true }, { key: 'comment', label: 'Comment', type: 'text' }, SAVE_TO_FIELD] },
};

export const CONDITION_TYPES = [
  { key: 'text', label: 'Text', operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'] },
  { key: 'number', label: 'Number', operators: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between'] },
  { key: 'date', label: 'Date', operators: ['before', 'after', 'on', 'between', 'within_last', 'in_next'] },
  { key: 'boolean', label: 'Boolean', operators: ['is_true', 'is_false'] },
  { key: 'tag', label: 'Tag', operators: ['has', 'has_not'] },
  { key: 'source', label: 'Source', operators: ['equals', 'not_equals'] },
  { key: 'current_time', label: 'Current time', operators: ['before', 'after', 'between'] },
  { key: 'message_window', label: '24h message window', operators: ['is_true', 'is_false'] },
  { key: 'language', label: 'Language', operators: ['equals', 'not_equals'] },
  { key: 'locale', label: 'Locale', operators: ['equals', 'not_equals'] },
  { key: 'timezone', label: 'Timezone', operators: ['equals', 'not_equals'] },
  { key: 'gender', label: 'Gender', operators: ['equals', 'not_equals'] },
  { key: 'country_code', label: 'Country code', operators: ['equals', 'not_equals'] },
  { key: 'contact_id', label: 'Contact ID', operators: ['eq', 'neq'] },
  { key: 'subscribed', label: 'Subscribed', operators: ['is_true', 'is_false'] },
  { key: 'opting', label: 'Channel opted-in', operators: ['is_true', 'is_false'] },
  { key: 'last_message', label: 'Last message (any channel)', operators: ['within_last', 'before'] },
  { key: 'whatsapp_last_message', label: 'WhatsApp last message', operators: ['contains', 'not_contains', 'equals', 'starts_with', 'ends_with'] },
  { key: 'telegram_last_message', label: 'Telegram last message', operators: ['contains', 'not_contains', 'equals', 'starts_with', 'ends_with'] },
  { key: 'messenger_last_message', label: 'Messenger last message', operators: ['contains', 'not_contains', 'equals', 'starts_with', 'ends_with'] },
  { key: 'instagram_last_message', label: 'Instagram last message', operators: ['contains', 'not_contains', 'equals', 'starts_with', 'ends_with'] },
  { key: 'zapi_last_message', label: 'Z-API last message', operators: ['contains', 'not_contains', 'equals', 'starts_with', 'ends_with'] },
  { key: 'twilio_last_message', label: 'Twilio last message', operators: ['contains', 'not_contains', 'equals', 'starts_with', 'ends_with'] },
  { key: 'messenger_otn', label: 'Messenger OTN', operators: ['is_true', 'is_false'] },
];
