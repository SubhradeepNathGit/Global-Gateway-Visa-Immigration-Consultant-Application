const PATH_LABELS = {
  country: 'Countries page',
  authentication: 'Sign in page',
  dashboard: 'your Dashboard',
  contact: 'Contact us page',
  course: 'Courses page',
  about: 'About page',
  admin: 'Admin login',
  'reset-password': 'password reset page',
};

/**
 * Cleans and formats AI reply text.
 * Strips reasoning tokens, normalizes whitespace, and converts known route paths to friendly labels.
 * Preserves bold/bullet formatting and avoids mangling English words containing slashes (e.g. and/or, credit/debit).
 */
export function formatChatReply(text) {
  if (text == null) return '';
  let t = String(text);

  // Strip <think> reasoning tokens
  t = t.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Strip code blocks or heading markers if any
  t = t.replace(/```[\s\S]*?```/g, '');
  t = t.replace(/^#+\s+/gm, '');

  // Replace ONLY actual URL paths (e.g. " /dashboard " or "(/country)") with human readable labels
  // Avoid replacing words like and/or, credit/debit, single/multiple entry
  t = t.replace(/(^|[\s("'])(\/([a-z][a-z0-9-]*))\b/gi, (match, prefix, fullPath, segment) => {
    const key = segment.toLowerCase();
    const label = PATH_LABELS[key];
    if (label) {
      return `${prefix}${label}`;
    }
    return match;
  });

  t = t.replace(/\s+→\s+/g, ' → ');
  t = t.replace(/\n{3,}/g, '\n\n');

  return t.trim();
}
