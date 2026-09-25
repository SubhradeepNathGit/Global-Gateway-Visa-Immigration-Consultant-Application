import { INTENTS } from './siteIntents';
import { formatChatReply } from './chatReplyFormat';

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

/** Pre-baked high-quality instant responses for quick questions */
export function getPreparedQuickReply(userText) {
  const n = normalize(userText);
  if (!n) return null;

  if (n.includes('what visa services do you offer') || n.includes('visa services offer')) {
    return formatChatReply(
      "Global Gateway offers expert visa & immigration services for 6 primary categories:\n\n" +
      "1. Student Visa — Admissions & higher education permits abroad\n" +
      "2. Tourist Visa — Leisure, vacation, and travel permits\n" +
      "3. Work Visa — Employment and official work permits\n" +
      "4. Business Visa — Trade meetings, corporate travel & conferences\n" +
      "5. Family Visa — Spouse, dependent, & family reunification\n" +
      "6. Resident Visa — Permanent residency & settlement guidance\n\n" +
      "Next step: Go to the **Countries page** → pick your destination → open **Visa Process**!"
    );
  }

  if (n.includes('how much does it cost') || n.includes('cost') || (n.includes('fee') && !n.includes('refund'))) {
    return formatChatReply(
      "Visa fees and costs depend on your chosen destination country and visa type:\n\n" +
      "• Consultancy & Platform Fee: Displayed transparently at checkout before you pay.\n" +
      "• Embassy / Government Fees: Official non-refundable fees set by the destination embassy.\n" +
      "• Coaching Courses: Individual course prices are shown on the **Courses page**.\n\n" +
      "Next step: Open the **Countries page**, select your target country, and check the **Visa Process** tab for exact fee breakdowns!"
    );
  }

  if (n.includes('tell me about ielts prep') || n.includes('ielts') || n.includes('coaching prep')) {
    return formatChatReply(
      "Our IELTS & Language Coaching programs are tailored for Band 7+ success:\n\n" +
      "• IELTS Academic & General Training prep courses\n" +
      "• 1-on-1 speaking practice & mock interview sessions\n" +
      "• Unlimited practice tests & essay evaluation\n\n" +
      "How to enroll: Browse the **Courses page** → select a course → Add to Cart → Checkout. Access instantly from your **Dashboard**!"
    );
  }

  if (n.includes('refund policy') || n.includes('refund') || n.includes('cancellation')) {
    return formatChatReply(
      "Global Gateway Refund Policy:\n\n" +
      "1. Consultancy & Platform Fees: 100% refundable if requested before your documents are submitted to the embassy.\n" +
      "2. Government & Embassy Fees: Non-refundable once paid to official government portals.\n" +
      "3. Course Purchases: Refundable within 48 hours if course modules have not been accessed.\n\n" +
      "To request a refund: Reach our support team via the **Contact us page** with your application reference number!"
    );
  }

  return null;
}

function keywordMatches(normalized, keyword) {
  const k = normalize(keyword);
  if (!k) return false;
  // Short keywords use word-boundary matching to avoid false positives
  if (k.length <= 4) {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(normalized);
  }
  return normalized.includes(k);
}

/**
 * Improved scoring: multi-keyword phrases get a bonus,
 * and we track how many distinct keywords matched.
 */
function scoreIntents(normalized) {
  const results = [];

  for (const intent of INTENTS) {
    let score = 0;
    let matchCount = 0;

    for (const kw of intent.keywords) {
      if (!keywordMatches(normalized, kw)) continue;
      matchCount++;
      const k = normalize(kw);
      // Multi-word phrases are stronger signals
      const wordCount = k.split(/\s+/).length;
      if (wordCount >= 3) {
        score += 8;
      } else if (wordCount === 2) {
        score += 5;
      } else if (k.length > 8) {
        score += 4;
      } else if (k.length > 5) {
        score += 3;
      } else {
        score += 2;
      }
    }

    // Bonus for multiple keyword matches in the same intent
    if (matchCount >= 3) score += 4;
    else if (matchCount >= 2) score += 2;

    if (score > 0) {
      results.push({ id: intent.id, score, reply: intent.reply, matchCount });
    }
  }

  // Sort by score descending, then by matchCount
  results.sort((a, b) => b.score - a.score || b.matchCount - a.matchCount);
  return results;
}

/** Only true for hello / thanks / bye — everything else goes to AI first */
export function isPureGreetingOnly(userText) {
  const n = normalize(userText);
  if (!n) return true;

  const exact = new Set([
    'hi', 'hey', 'hello', 'hola', 'namaste', 'yo', 'sup', 'howdy',
    'ok', 'okay', 'k',
    'thanks', 'thank you', 'thx',
    'bye', 'goodbye',
    'good morning', 'good evening', 'good afternoon',
    'hi there', 'hey there', 'hello there',
  ]);
  if (exact.has(n)) return true;

  if (n.split(/\s+/).length === 1 && n.length <= 2 && !/\d/.test(n)) {
    return true;
  }

  return false;
}

/** @deprecated use isPureGreetingOnly */
export function isInstantLocalMessage(userText) {
  return isPureGreetingOnly(userText);
}

function composeContextualReply(normalized) {
  const isIndian =
    /\b(indian|india|from india|indian citizen|indian national)\b/.test(normalized);
  const isSA =
    /\bsouth africa\b/.test(normalized) ||
    (normalized.includes('africa') && normalized.includes('south'));
  const isStudent =
    /\b(student|study|studying|university|college|education)\b/.test(normalized);
  const isTourist = /\b(tourist|tourism|visit|holiday|travel)\b/.test(normalized);
  const isWork = /\b(work|working|employment|job)\b/.test(normalized);

  // Appointment rescheduling — specific compound question
  if (
    /\b(reschedule|rescheduling|change appointment|move appointment|postpone appointment)\b/.test(
      normalized,
    ) ||
    (/\b(appointment|interview|biometric)\b/.test(normalized) &&
      /\b(can i|how|change|reschedule|cancel)\b/.test(normalized))
  ) {
    return (
      'Visa appointments (biometrics, embassy interviews) are usually arranged after you apply.\n\n' +
      '1. Sign in and open your Dashboard to see any scheduled date, time, and location.\n' +
      '2. Check email and in-site notifications for updates from the embassy.\n' +
      '3. If you need a new date, use the reschedule option on your application in the Dashboard. ' +
      'If you don\'t see one, contact us via the Contact us page with your registered email and application reference.\n\n' +
      'Note: Slot availability depends on the embassy\'s schedule and policies.'
    );
  }

  // Indian student going to South Africa
  if (isStudent && isSA) {
    let reply =
      'South Africa student visa on Global Gateway:\n\n' +
      '1. Open the Countries page and select South Africa.\n' +
      '2. Open Visa Process — confirm student visa is listed and read requirements, fees, and documents.\n' +
      '3. Sign in on the Sign in page and complete the application form.\n' +
      '4. Upload documents (passport, admission letter, financial proof, etc.).\n' +
      '5. Pay at checkout and track status in your Dashboard.\n\n';
    if (isIndian) {
      reply +=
        'As an Indian passport holder, enter your nationality in the form and upload the documents listed for student visa. ' +
        'If anything is unclear, use the Contact us page with your course and university name.\n\n';
    }
    reply +=
      'If South Africa or student visa is not listed yet, contact us — we\'ll confirm availability for your case.';
    return reply;
  }

  // Indian student anywhere
  if (isIndian && isStudent && !isSA) {
    return (
      'For an Indian student visa application:\n\n' +
      '1. Go to the Countries page and choose your destination country.\n' +
      '2. Open Visa Process and select the student visa type if listed.\n' +
      '3. Apply on the Sign in page with your Indian passport details and required documents.\n' +
      '4. Upload all necessary documents and complete payment.\n' +
      '5. Track your application in your Dashboard.\n\n' +
      'Tell me the destination country and I can outline the exact steps!'
    );
  }

  // South Africa tourist/work
  if (isSA && (isTourist || isWork)) {
    const type = isWork ? 'work' : 'tourist';
    return (
      `For a South Africa ${type} visa:\n\n` +
      `1. Go to the Countries page and select South Africa\n` +
      `2. Open Visa Process to see ${type} visa requirements and fees\n` +
      `3. If ${type} visa is listed, you can apply online after signing in\n` +
      `4. Fill the application, upload documents, and pay\n\n` +
      `If ${type} visa is not listed, contact us via the Contact us page with your travel or job details.`
    );
  }

  // General availability question about visas
  if (
    /\b(available|availability|offer|do you have|can i get|is there)\b/.test(normalized) &&
    (isStudent || isTourist || isWork || isSA || normalized.includes('visa'))
  ) {
    return (
      'To check what we offer:\n\n' +
      '1. Open the Countries page and pick the destination\n' +
      '2. Open Visa Process — listed visa types are available to apply for online\n' +
      '3. Fees and documents are shown before payment\n\n' +
      'Not listed? Use the Contact us page with your nationality, destination, and visa type — we\'ll check availability.'
    );
  }

  return null;
}

function greetingReply() {
  const g = INTENTS.find((i) => i.id === 'greeting');
  return (
    g?.reply ??
    "Hi! I'm here to help with visas, countries, applications, fees, courses, and your dashboard. What would you like to know?"
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
      '• "What visa services do you offer?"\n' +
      '• "How do I apply for a student visa?"\n' +
      '• "What courses are available?"\n' +
      '• "How much does it cost?"'
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
    return formatChatReply(greetingReply());
  }

  // 0) Instant prepared response for common quick questions
  const prepared = getPreparedQuickReply(userText);
  if (prepared) return prepared;

  // 1) Pure greetings, thanks, bye
  if (isPureGreetingOnly(userText)) {
    if (/thank|thx/.test(normalized)) return formatChatReply(thanksReply());
    if (/bye|goodbye|later/.test(normalized)) {
      return formatChatReply(
        'Goodbye! Safe travels — message anytime if you need visa or site help.',
      );
    }
    if (/^ok(ay)?$/.test(normalized)) {
      return formatChatReply(
        'Sure! What would you like help with — a country, visa type, fees, courses, or how to apply?',
      );
    }
    const unclear = unclearShortInput(normalized);
    if (unclear) return formatChatReply(unclear);
    return formatChatReply(greetingReply());
  }

  // 2) Contextual compound questions (multi-entity)
  const contextual = composeContextualReply(normalized);
  if (contextual) return formatChatReply(contextual);

  // 3) Intent matching with improved scoring
  const ranked = scoreIntents(normalized);
  if (ranked.length > 0 && ranked[0].score >= 2 && ranked[0].reply) {
    return formatChatReply(ranked[0].reply);
  }

  // 4) Broad visa-related topic detection
  if (
    /\b(visa|passport|country|apply|student|tourist|work|course|ielts|payment|fee|dashboard|embassy|document|appointment|reschedule|refund|promo|cart|checkout|service|know|tell|help|info|information)\b/.test(
      normalized,
    )
  ) {
    const cap = INTENTS.find((i) => i.id === 'capabilities');
    if (cap) return formatChatReply(cap.reply);
  }

  // 5) Helpful default with capabilities
  const cap = INTENTS.find((i) => i.id === 'capabilities');
  return formatChatReply(
    cap?.reply ??
      'I can help with visa services, applications, courses, fees, and more!\n\n' +
      'Try asking something like:\n' +
      '• "What visa services do you offer?"\n' +
      '• "How to apply for a student visa?"\n' +
      '• "Tell me about IELTS courses"\n' +
      '• "How much does it cost?"\n' +
      '• "Track my application status"\n\n' +
      'Or visit the Contact us page for personalized support.',
  );
}

export function isWeakGenericReply(text) {
  const t = String(text ?? '').toLowerCase();
  return (
    t.includes('great to hear from you') ||
    t.includes('what country or visa are you interested') ||
    t.includes('try /country') ||
    t.includes('i can help with global gateway visas and the website') ||
    t.includes('what would you like to know?') ||
    t.includes('what would you like to know') ||
    t.includes('visa services & applications') ||
    t.includes('country-specific requirements') ||
    (t.includes('global gateway assistant') && t.length < 120) ||
    (t.includes('how can i help') && t.length < 100)
  );
}
