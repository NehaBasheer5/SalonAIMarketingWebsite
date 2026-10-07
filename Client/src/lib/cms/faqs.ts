const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || process.env.ADMIN_URL || 'http://localhost:3001';

export async function fetchCmsFaqs() {
  try {
    const res = await fetch(`${ADMIN_URL}/api/public/faqs`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.faqs) ? data.faqs : [];
  } catch {
    return [];
  }
}

export type FaqCmsSections = {
  hero?: Record<string, unknown>;
  categories?: Record<string, unknown>;
  cta_banner?: Record<string, unknown>;
};

/**
 * Reads the FAQ page sections from the Admin CMS.
 *
 * The FAQ page is seeded with `hero`, `categories` and `cta_banner` sections.
 * Each is returned as a flat content object so callers can spread it over the
 * built-in defaults (columns merged with extra_json by the public API).
 */
export async function fetchCmsFaqPageContent(): Promise<FaqCmsSections | null> {
  try {
    const res = await fetch(`${ADMIN_URL}/api/public/content/faq`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const sections = Array.isArray(data?.sections) ? data.sections : [];
    const byKey: FaqCmsSections = {};
    for (const s of sections) {
      if (typeof s?.key === 'string' && s.content && typeof s.content === 'object') {
        if (s.key === 'hero' || s.key === 'categories' || s.key === 'cta_banner') {
          byKey[s.key] = s.content as Record<string, unknown>;
        }
      }
    }
    return Object.keys(byKey).length ? byKey : null;
  } catch {
    return null;
  }
}