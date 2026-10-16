import { getPool, RowDataPacket } from "@/lib/db";

/**
 * The `faqs` table gained a `show_on_home` column after it was first created, so
 * existing databases created by an older `schema.sql` will not have it. Adding a
 * column is not covered by `CREATE TABLE IF NOT EXISTS`, and MySQL / MariaDB
 * have no portable `ADD COLUMN IF NOT EXISTS`, so we check the information
 * schema once per process and add the column only when it is missing.
 */
let ensurePromise: Promise<void> | null = null;

export function ensureFaqsSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const pool = getPool();
      const [columns] = await pool.query<RowDataPacket[]>(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'faqs' AND COLUMN_NAME = 'show_on_home'`
      );
      if (!columns.length) {
        await pool.query(
          "ALTER TABLE faqs ADD COLUMN show_on_home TINYINT(1) NOT NULL DEFAULT 0 AFTER is_published"
        );
      }
    })().catch((error) => {
      // Let the next request retry instead of caching a rejected promise.
      ensurePromise = null;
      throw error;
    });
  }
  return ensurePromise;
}

/** Normalises the various truthy shapes MySQL returns for a TINYINT(1). */
export function isTruthy(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}
