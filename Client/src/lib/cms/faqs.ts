const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || process.env.ADMIN_URL || 'http://localhost:3001';

export type CmsFaq = {
  id?: number;
  question: string;
  answer: string;
  category?: string | null;
  sort_order?: number;
  created_at?: string;
};

export type CmsFaqCategory = {
  id: string;
  label: string;
  icon: string;
  slug?: string;
};

export async function fetchCmsFaqs(): Promise<CmsFaq[]> {
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

/**
 * The most recently added FAQs, newest first. `created_at` comes from the DB;
 * when two rows share a timestamp we fall back to the auto-increment id so the
 * ordering is always stable.
 */
export async function fetchRecentCmsFaqs(limit: number): Promise<CmsFaq[]> {
  const faqs = await fetchCmsFaqs();
  return [...faqs]
    .sort((a, b) => {
      const at = a.created_at ? Date.parse(a.created_at) : 0;
      const bt = b.created_at ? Date.parse(b.created_at) : 0;
      if (bt !== at) return bt - at;
      return (b.id ?? 0) - (a.id ?? 0);
    })
    .slice(0, Math.max(0, limit));
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

/**
 * The category tabs shared by the FAQ page, the home FAQ section and the Admin
 * FAQs screen. They live in the FAQ page's `categories` section so there is a
 * single place to add or reorder them. If that list is empty, the tabs are
 * derived from the categories actually used by the questions in the database so
 * the two never drift apart.
 */
export async function fetchCmsFaqCategories(): Promise<CmsFaqCategory[]> {
  const cms = await fetchCmsFaqPageContent();
  const list = cms?.categories?.categories;
  if (Array.isArray(list) && list.length) {
    return list
      .map((c: Record<string, unknown>, idx: number): CmsFaqCategory => {
        const id = String(c.id ?? c.slug ?? idx) || String(idx);
        return {
          id,
          label: String(c.label ?? c.name ?? c.id ?? 'Category'),
          icon: typeof c.icon === 'string' ? c.icon : 'HelpCircle',
          slug: c.slug === undefined || c.slug === null ? '' : String(c.slug),
        };
      })
      .filter((c) => c.id.length > 0);
  }

  // CMS category list unavailable: fall back to the categories used by the
  // published questions so the FAQ page still groups them correctly.
  const faqs = await fetchCmsFaqs();
  const byKey = new Map<string, CmsFaqCategory>();
  for (const faq of faqs) {
    const label = String(faq.category ?? '').trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (byKey.has(key)) continue;
    byKey.set(key, {
      id: slugify(label) || key,
      label,
      icon: 'HelpCircle',
      slug: slugify(label),
    });
  }
  return [...byKey.values()];
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}