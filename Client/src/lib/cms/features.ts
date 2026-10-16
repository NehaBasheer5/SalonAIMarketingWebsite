const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL || process.env.ADMIN_URL || 'http://localhost:3001';

export type CmsFeaturePost = {
  id?: number;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  category?: string;
  icon?: string;
  image_url?: string;
  image_alt?: string;
  href?: string;
  sort_order?: number;
  featured?: boolean;
};

export async function fetchCmsFeaturePosts(): Promise<CmsFeaturePost[]> {
  try {
    const res = await fetch(`${ADMIN_URL}/api/public/features-posts`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.posts) ? data.posts : [];
  } catch {
    return [];
  }
}
