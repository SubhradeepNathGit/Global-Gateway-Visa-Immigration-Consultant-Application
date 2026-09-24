import { replyFromSiteAssistant, SORRY_NO_ANSWER } from './siteAssistantEngine';

export function getLocalChatFallback(message) {
  const reply = replyFromSiteAssistant([{ role: 'user', content: String(message ?? '') }]);
  return reply ?? SORRY_NO_ANSWER;
}

export { SORRY_NO_ANSWER };
