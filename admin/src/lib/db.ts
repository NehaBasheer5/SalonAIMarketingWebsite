import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __salonDbPool: Pool | undefined;
}

export function getPool() {
  if (!global.__salonDbPool) {
    global.__salonDbPool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return global.__salonDbPool;
}

export type { RowDataPacket, ResultSetHeader };
