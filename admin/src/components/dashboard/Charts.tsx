"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#0D1140";
const GOLD = "#a68b67";
const BLUE = "#3b82f6";
const TEAL = "#14b8a6";
const AMBER = "#f59e0b";
const GREEN = "#10b981";
const GREY = "#94a3b8";

export const STATUS_COLORS: Record<string, string> = {
  new: BLUE,
  read: AMBER,
  replied: GREEN,
  archived: GREY,
};

const tooltipStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
  fontSize: 12,
  color: "#0f172a",
  padding: "6px 10px",
};

function axisProps() {
  return {
    stroke: "#94a3b8",
    tick: { fill: "#64748b", fontSize: 11 },
    tickLine: false,
    axisLine: { stroke: "#e2e8f0" },
  } as const;
}

export function EmptyChart({ label }: { label: string }) {
  return (
    <div className="grid h-64 place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
      {label}
    </div>
  );
}

export function EnquiriesTrendChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  if (!data.length) return <EmptyChart label="No enquiries in the last 30 days" />;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NAVY} stopOpacity={0.28} />
            <stop offset="100%" stopColor={NAVY} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="label" {...axisProps()} interval="preserveStartEnd" minTickGap={24} />
        <YAxis allowDecimals={false} {...axisProps()} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#cbd5e1" }} />
        <Area
          type="monotone"
          dataKey="count"
          name="Enquiries"
          stroke={NAVY}
          strokeWidth={2.25}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 4, fill: NAVY, stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (!total) return <EmptyChart label="No enquiries yet" />;
  return (
    <div className="flex h-64 items-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? GREY} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SourceBarChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  if (!data.length) return <EmptyChart label="No enquiries yet" />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="name" {...axisProps()} />
        <YAxis allowDecimals={false} {...axisProps()} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey="count" name="Enquiries" radius={[8, 8, 0, 0]} maxBarSize={64}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={i % 2 === 0 ? NAVY : GOLD} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ContentBarChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
        <XAxis dataKey="name" {...axisProps()} />
        <YAxis allowDecimals={false} {...axisProps()} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey="count" name="Items" radius={[8, 8, 0, 0]} maxBarSize={56} fill={BLUE} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopPostsBarChart({
  data,
}: {
  data: { title: string; views: number }[];
}) {
  if (!data.length) return <EmptyChart label="No blog posts yet" />;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...axisProps()} />
        <YAxis
          type="category"
          dataKey="short"
          width={120}
          {...axisProps()}
          tick={{ fill: "#64748b", fontSize: 11 }}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey="views" name="Views" radius={[0, 8, 8, 0]} maxBarSize={22} fill={TEAL} />
      </BarChart>
    </ResponsiveContainer>
  );
}
