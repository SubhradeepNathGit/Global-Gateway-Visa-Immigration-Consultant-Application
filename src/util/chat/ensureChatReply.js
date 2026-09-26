import { formatChatReply } from './chatReplyFormat';

const FALLBACK =
  'I could not load a full answer right now. Please try once more, or use the Contact us page with your question — we will help you personally.';

/** Never show an empty bubble in the UI. */
export function ensureChatReply(text) {
  const formatted = formatChatReply(String(text ?? '').trim());
  return formatted.length > 0 ? formatted : FALLBACK;
}
