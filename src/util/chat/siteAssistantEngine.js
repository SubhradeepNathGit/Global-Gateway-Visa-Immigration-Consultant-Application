import {
  INTENTS,
  LOCAL_CONFIDENCE_MIN_SCORE,
  SORRY_NO_ANSWER,
} from './siteIntents';

function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreIntent(intent, normalizedUserText) {
  let score = 0;
  for (const kw of intent.keywords) {
    const k = normalize(kw);
    if (!k) continue;
    if (normalizedUserText.includes(k)) {
      score += k.length > 8 ? 4 : k.length > 5 ? 3 : 2;
    }
  }
  return score;
}

function lastUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      return messages[i].content;
    }
  }
  return '';
}

/**
 * @param {{ role: 'user' | 'assistant', content: string }[]} messages
 * @returns {{ confident: boolean, score: number, reply: string | null }}
 */
export function evaluateSiteAssistant(messages) {
  const userText = lastUserText(messages);
  const normalized = normalize(userText);

  if (!normalized) {
    return {
      confident: true,
      score: 99,
      reply: 'Please type a question about visas, courses, payments, or using Global Gateway.',
    };
  }

  let best = { id: null, score: 0, reply: null };
  for (const intent of INTENTS) {
    const score = scoreIntent(intent, normalized);
    if (score > best.score) {
      best = { id: intent.id, score, reply: intent.reply };
    }
  }

  if (best.score >= LOCAL_CONFIDENCE_MIN_SCORE && best.reply) {
    return { confident: true, score: best.score, reply: best.reply };
  }

  return { confident: false, score: best.score, reply: null };
}

/**
 * @param {{ role: 'user' | 'assistant', content: string }[]} messages
 */
export function replyFromSiteAssistant(messages) {
  const result = evaluateSiteAssistant(messages);
  if (result.confident && result.reply) {
    return result.reply;
  }
  return null;
}

export { SORRY_NO_ANSWER };

/** Fallback when API fails — best intent match + generic visa answers (never null). */
export function getBestEffortLocalReply(messages) {
  const userText = lastUserText(messages);
  const normalized = normalize(userText);
  if (!normalized) {
    return 'Please type a question about visas, courses, or using Global Gateway.';
  }

  let best = { score: 0, reply: null };
  for (const intent of INTENTS) {
    const score = scoreIntent(intent, normalized);
    if (score > best.score) {
      best = { score, reply: intent.reply };
    }
  }
  if (best.score >= 1 && best.reply) return best.reply;

  const lower = normalized;

  if (
    (lower.includes('south africa') || lower.includes('africa')) &&
    (lower.includes('student') || lower.includes('study'))
  ) {
    return (
      'For South Africa student visa: open /country, find South Africa, and check Visa Process for student visa options, fees, and documents. ' +
      'If the country is not listed, contact /contact — we will confirm availability.'
    );
  }

  if (
    lower.includes('available') ||
    lower.includes('offer') ||
    lower.includes('do you have') ||
    lower.includes('is there')
  ) {
    return (
      'Check availability on /country — select the destination → Visa Process. ' +
      'Listed visa types can be applied for online. Not listed? Use /contact with the country and visa type.'
    );
  }

  const visaHints = [
    'visa',
    'passport',
    'country',
    'apply',
    'student',
    'tourist',
    'work',
    'course',
    'ielts',
    'payment',
    'fee',
    'dashboard',
    'login',
    'embassy',
    'document',
    'refund',
  ];
  if (visaHints.some((h) => lower.includes(h))) {
    return (
      'On Global Gateway: browse /country for destinations and visa types, sign in at /authentication to apply, ' +
      'and track status in /dashboard. For fees, see Visa Process before payment. Need more help? /contact.'
    );
  }

  return (
    'I can help with visas (/country), applying, fees, IELTS courses (/course), payments, and your dashboard. ' +
    'Try asking about a specific country or visa type, or use /contact for personal support.'
  );
}

export function replyWithDelay(messages, minMs = 350, maxMs = 750) {
  const result = evaluateSiteAssistant(messages);
  const delay = minMs + Math.floor(Math.random() * (maxMs - minMs));
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        confident: result.confident,
        reply: result.reply,
        score: result.score,
      });
    }, delay);
  });
}
