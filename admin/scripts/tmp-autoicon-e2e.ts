const fs = require("fs");

async function main() {
  const env = Object.fromEntries(
    fs
      .readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .filter((l: string) => l.includes("=") && !l.startsWith("#"))
      .map((l: string) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
  );

  const admin = "http://localhost:3001";
  const login = await fetch(admin + "/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@avenque.com", password: env.ADMIN_PASSWORD || "admin123" }),
  });
  const setCookies =
    typeof login.headers.getSetCookie === "function"
      ? login.headers.getSetCookie()
      : [login.headers.get("set-cookie")];
  const cookie = (setCookies[0] || "").split(";")[0];
  console.log("login:", login.status);

  const data = await fetch(admin + "/api/pages/footer", { headers: { cookie } }).then((r) => r.json());
  const f = data.sections.find((s: any) => s.section_key === "footer");
  const original = JSON.parse(JSON.stringify(f.extra.socials));

  f.extra.socials = [
    { label: "Follow us", href: "instagram.com/mysalon" },
    { label: "Watch", href: "https://youtu.be/abc123" },
    { label: "Pin it", href: "pinterest.com/mysalon" },
    { label: "Reviews", href: "https://trustpilot.com/review/mysalon" },
  ];
  const put = await fetch(admin + "/api/pages/footer", {
    method: "PUT",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ title: data.page.title, status: data.page.status, sections: data.sections }),
  });
  console.log("put:", put.status, await put.text());
  await new Promise((r) => setTimeout(r, 500));

  const html = await fetch("http://localhost:3000/").then((r) => r.text());
  const idx = html.indexOf("Follow us");
  const seg = html.slice(idx, idx + 3500);
  console.log("icons in socials row:", (seg.match(/lucide-[a-z0-9-]+/g) || []).join(","));
  console.log(
    "instagram->camera:", seg.includes("lucide-camera"),
    "| youtu.be->video:", seg.includes("lucide-video"),
    "| pinterest->pin:", seg.includes("lucide-pin"),
    "| unknown->globe:", seg.includes("lucide-globe")
  );

  f.extra.socials = original;
  const restore = await fetch(admin + "/api/pages/footer", {
    method: "PUT",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ title: data.page.title, status: data.page.status, sections: data.sections }),
  });
  console.log("restore:", restore.status, await restore.text());
}

main();
