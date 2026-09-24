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

/** Plain chat text: no markdown, no slash paths. */
export function formatChatReply(text) {
  if (text == null) return '';
  let t = String(text);

  // Strip markdown formatting
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1');
  t = t.replace(/\*([^*]+)\*/g, '$1');
  t = t.replace(/__([^_]+)__/g, '$1');
  t = t.replace(/_([^_]+)_/g, '$1');
  t = t.replace(/^#+\s+/gm, '');
  t = t.replace(/`([^`]+)`/g, '$1');

  // Replace /paths with human-readable labels
  t = t.replace(/\/([a-z][a-z0-9-]*)/gi, (_, segment) => {
    const key = segment.toLowerCase();
    const label = PATH_LABELS[key];
    if (label) return label;
    return `the ${segment} section`;
  });

  t = t.replace(/\s+→\s+/g, ' → ');
  t = t.replace(/\n{3,}/g, '\n\n');

  return t.trim();
}
