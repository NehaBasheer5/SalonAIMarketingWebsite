import { getPool, RowDataPacket } from "@/lib/db";
import {
  normalizeSiteSettings,
  parseSettingsJson,
  type SiteSettings,
} from "@/lib/siteSettings";

/**
 * Single-row store for the site settings.
 *
 * A brand new database gets its table from `sql/schema.sql`, but an existing one
 * may not have run `npm run db:setup` since, so the table is created lazily once
 * per process before the first read or write.
 */
let ensured: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!ensured) {
    ensured = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS site_settings (
           id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
           data_json JSON NULL,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
      )
      .then(() => undefined)
      .catch((error) => {
        // Let the next call retry instead of caching a failed promise forever.
        ensured = null;
        throw error;
      });
  }
  return ensured;
}

/** Reads the site settings, falling back to the defaults when there is no row. */
export async function loadSiteSettings(): Promise<SiteSettings> {
  await ensureTable();
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT data_json FROM site_settings WHERE id = 1 LIMIT 1"
  );
  return normalizeSiteSettings(parseSettingsJson(rows[0]?.data_json));
}

/** Writes the whole settings object back as the single row. */
export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await ensureTable();
  await getPool().query(
    `INSERT INTO site_settings (id, data_json) VALUES (1, ?)
     ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)`,
    [JSON.stringify(settings)]
  );
}
