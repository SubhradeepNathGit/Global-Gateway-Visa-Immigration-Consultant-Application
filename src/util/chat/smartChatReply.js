import { INTENTS } from './siteIntents';

function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function lastUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === 'user') {
      return String(messages[i].content ?? '');
    }
  }
  return '';
}

function scoreIntents(normalized) {
  let best = { score: 0, reply: null };
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      const k = normalize(kw);
      if (k && normalized.includes(k)) {
        score += k.length > 8 ? 4 : k.length > 5 ? 3 : 2;
      }
    }
    if (score > best.score) {
      best = { score, reply: intent.reply };
    }
  }
  return best;
}

/** Short greetings / ack — answer locally without waiting on API */
export function isInstantLocalMessage(userText) {
  const n = normalize(userText);
  if (!n) return true;
  if (n.length <= 3 && !/\d/.test(n)) return true;
  const instant = new Set([
    'hi',
    'hey',
    'hello',
    'hola',
    'namaste',
    'yo',
    'sup',
    'ok',
    'okay',
    'k',
    'thanks',
    'thank you',
    'thx',
    'bye',
    'goodbye',
    'good morning',
    'good evening',
    'good afternoon',
  ]);
  if (instant.has(n)) return true;
  if (/^(hi|hey|hello)\b/.test(n) && n.length < 20) return true;
  return false;
}

function composeContextualReply(userText, normalized) {
  const isIndian =
    /\b(indian|india|from india|indian citizen|indian national)\b/.test(normalized);
  const isSA =
    /\bsouth africa\b/.test(normalized) ||
    (normalized.includes('africa') && normalized.includes('south'));
  const isStudent =
    /\b(student|study|studying|university|college|education)\b/.test(normalized);
  const isTourist = /\b(tourist|tourism|visit|holiday|travel)\b/.test(normalized);
  const isWork = /\b(work|working|employment|job)\b/.test(normalized);

  if (isStudent && isSA) {
    let reply =
      'South Africa student visa on Global Gateway:\n\n' +
      '1. Open /country and select South Africa.\n' +
      '2. Go to Visa Process — confirm **Student visa** is listed and read requirements, fees, and documents.\n' +
      '3. Sign in at /authentication and complete the application form.\n' +
      '4. Upload documents (passport, admission/LOA, funds, etc. — exact list on the form).\n' +
      '5. Pay at checkout and track status in /dashboard.\n\n';
    if (isIndian) {
      reply +=
        'As an **Indian passport holder**, use the nationality and document fields in the form as shown for your profile. ' +
        'If anything is unclear, contact /contact with your course and university name.\n\n';
    }
    reply +=
      'If South Africa or student visa does not appear on /country yet, use /contact — we will confirm availability for your case.';
    return reply;
  }

  if (isIndian && isStudent && !isSA) {
    return (
      'For an **Indian student visa** application:\n\n' +
      '1. Go to /country and choose your **destination country** (e.g. South Africa, UK, Canada).\n' +
      '2. Open Visa Process for that country and select the student visa type if listed.\n' +
      '3. Apply at /authentication with your Indian passport details and required documents.\n\n' +
      'Tell me the destination country and I can outline the exact steps.'
    );
  }

  if (isSA && (isTourist || isWork)) {
    const type = isWork ? 'work' : 'tourist';
    return (
      `For a South Africa **${type} visa**, visit /country → South Africa → Visa Process. ` +
      `If ${type} visa is listed, you can apply online after signing in at /authentication. ` +
      `Otherwise contact /contact with your travel or job details.`
    );
  }

  if (
    /\b(available|availability|offer|do you have|can i get|is there)\b/.test(normalized) &&
    (isStudent || isTourist || isWork || isSA || normalized.includes('visa'))
  ) {
    return (
      'To see what we offer:\n\n' +
      '• Go to /country and pick the destination.\n' +
      '• Open **Visa Process** — listed visa types are available to apply for online.\n' +
      '• Fees and documents are shown before payment.\n\n' +
      'Not listed? Email /contact with nationality, destination, and visa type (e.g. Indian student for South Africa).'
    );
  }

  return null;
}

function greetingReply() {
  const g = INTENTS.find((i) => i.id === 'greeting');
  return (
    g?.reply ??
    "Hi! I'm here to help with visas, countries on /country, applications, fees, courses, and your dashboard. What would you like to know?"
  );
}

function thanksReply() {
  const t = INTENTS.find((i) => i.id === 'thanks');
  return t?.reply ?? "You're welcome! Ask anytime about visas or the site.";
}

function unclearShortInput(normalized) {
  if (normalized.length <= 2 || /^[a-z]{1,2}$/.test(normalized)) {
    return (
      "I didn't quite catch that. Try asking something like:\n" +
      '• "Student visa for South Africa as an Indian"\n' +
      '• "How do I apply?"\n' +
      '• "What visas do you offer?"'
    );
  }
  return null;
}

/**
 * Best local answer — greetings, compound visa questions, intents, then helpful default.
 * @param {{ role: 'user' | 'assistant', content: string }[]} messages
 */
export function getSmartLocalReply(messages) {
  const userText = lastUserText(messages);
  const normalized = normalize(userText);

  if (!normalized) {
    return greetingReply();
  }

  if (isInstantLocalMessage(userText)) {
    if (/thank|thx/.test(normalized)) return thanksReply();
    if (/bye|goodbye|later/.test(normalized)) {
      return "Goodbye! Safe travels — message anytime if you need visa or site help.";
    }
    if (/^ok(ay)?$/.test(normalized)) {
      return 'Sure! What would you like help with — a country, visa type, fees, or how to apply on /country?';
    }
    const unclear = unclearShortInput(normalized);
    if (unclear) return unclear;
    return greetingReply();
  }

  const contextual = composeContextualReply(userText, normalized);
  if (contextual) return contextual;

  const best = scoreIntents(normalized);
  if (best.score >= 1 && best.reply) return best.reply;

  if (
    /\b(visa|passport|country|apply|student|tourist|work|course|ielts|payment|fee|dashboard|embassy|document)\b/.test(
      normalized,
    )
  ) {
    return (
      'On Global Gateway: use /country to pick a destination → Visa Process for requirements and fees → ' +
      '/authentication to apply → /dashboard to track. For personal help: /contact or needhelp@company.com.'
    );
  }

  return (
    'I can help with visa types, applying on /country, fees, IELTS courses (/course), payments, and your dashboard. ' +
    'Example: "Indian student visa for South Africa — is it available?"'
  );
}
