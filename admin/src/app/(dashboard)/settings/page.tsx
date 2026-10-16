"use client";

import SiteSettingsEditor from "@/components/SiteSettingsEditor";

/**
 * Settings shortcut in the sidebar.
 *
 * Manages the site-wide navbar: logo, navigation links and header action
 * buttons. Stored in the `site_settings` table and served to the marketing site
 * through `/api/public/settings`.
 */
export default function SettingsAdminPage() {
  return <SiteSettingsEditor />;
}
