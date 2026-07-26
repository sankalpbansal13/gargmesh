/**
 * Allow only same-origin relative paths for post-action redirects.
 * Rejects protocol-relative (//), schemes, backslashes, and control chars.
 */
function safeRedirectPath(raw, fallback) {
  const fb = fallback || '/';
  if (typeof raw !== 'string') return fb;
  const t = raw.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return fb;
  if (t.includes('\\') || /[\x00-\x1f\x7f]/.test(t)) return fb;
  // Reject anything that looks like a URL with a scheme (e.g. /http:evil)
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(t)) return fb;
  return t;
}

module.exports = { safeRedirectPath };
