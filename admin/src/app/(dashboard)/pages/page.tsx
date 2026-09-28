import Link from "next/link";
import { getPool, RowDataPacket } from "@/lib/db";

export default async function PagesListPage() {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT p.id, p.slug, p.title, p.status, p.updated_at, COUNT(s.id) AS section_count
     FROM pages p
     LEFT JOIN page_sections s ON s.page_id = p.id
     GROUP BY p.id
     ORDER BY p.title ASC`
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Pages</h2>
        <p className="text-sm text-slate-600">Edit content sections for each Client website page.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sections</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((page) => (
              <tr key={page.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{page.title}</td>
                <td className="px-4 py-3 text-slate-500">/{page.slug}</td>
                <td className="px-4 py-3">{Number(page.section_count)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/pages/${page.slug}`}
                    className="font-semibold text-[#0D1140] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
