"use client";

import { useId } from "react";
import MediaPickerField from "./MediaPickerField";
import type { FieldSpec } from "@/lib/sectionSpecs";

export type FieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | FieldValue[]
  | { [key: string]: FieldValue };

type Props = {
  spec: FieldSpec;
  value: FieldValue;
  onChange: (next: FieldValue) => void;
  nested?: boolean;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400";
const labelClass = "text-xs font-semibold text-slate-600";
const helpClass = "mt-1 text-[11px] leading-snug text-slate-400";

function emptyValueFor(spec: FieldSpec): FieldValue {
  switch (spec.kind) {
    case "number":
      return 0;
    case "toggle":
      return false;
    case "list":
    case "image-list":
    case "string-list":
      return [];
    default:
      return "";
  }
}

export default function SectionField({ spec, value, onChange, nested }: Props) {
  const label = (
    <label className={labelClass}>
      {spec.label}
      {spec.help ? <span className="mt-0.5 block font-normal text-slate-400">{spec.help}</span> : null}
    </label>
  );

  if (spec.kind === "list") {
    const items = Array.isArray(value) ? (value as Record<string, FieldValue>[]) : [];
    return (
      <div className={nested ? "space-y-2" : "sm:col-span-2 space-y-3"}>
        {!nested ? label : null}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {spec.itemLabel} {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <IconButton
                    label="Move up"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...items];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      onChange(next);
                    }}
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    label="Move down"
                    disabled={index === items.length - 1}
                    onClick={() => {
                      const next = [...items];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      onChange(next);
                    }}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    label="Remove"
                    danger
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                  >
                    Remove
                  </IconButton>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {spec.fields.map((child) => (
                  <SectionField
                    key={child.key}
                    spec={child}
                    nested
                    value={item?.[child.key]}
                    onChange={(next) => {
                      const updated = [...items];
                      updated[index] = { ...updated[index], [child.key]: next };
                      onChange(updated);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange([
                ...items,
                Object.fromEntries(spec.fields.map((f) => [f.key, emptyValueFor(f)])),
              ])
            }
            className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
          >
            + Add {spec.itemLabel.toLowerCase()}
          </button>
        </div>
      </div>
    );
  }

  if (spec.kind === "image-list") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="sm:col-span-2 space-y-2">
        {label}
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {spec.itemLabel} {index + 1}
                </span>
                <IconButton
                  label="Remove"
                  danger
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  Remove
                </IconButton>
              </div>
              <MediaPickerField
                compact
                imageOnly
                value={String(item ?? "")}
                onChange={(next) => {
                  const updated = [...items];
                  updated[index] = next;
                  onChange(updated);
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          + Add {spec.itemLabel.toLowerCase()}
        </button>
      </div>
    );
  }

  if (spec.kind === "string-list") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="sm:col-span-2 space-y-2">
        {label}
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={String(item ?? "")}
                placeholder={spec.itemLabel}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = e.target.value;
                  onChange(next);
                }}
                className={inputClass}
              />
              <IconButton
                label="Remove"
                danger
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                Remove
              </IconButton>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...items, ""])}
            className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
          >
            + Add {(spec.itemLabel ?? "item").toLowerCase()}
          </button>
        </div>
      </div>
    );
  }

  if (spec.kind === "image") {
    return (
      <MediaPickerField
        label={spec.label}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        compact={spec.compact}
        imageOnly={spec.imageOnly}
      />
    );
  }

  if (spec.kind === "toggle") {
    return (
      <div className="sm:col-span-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          {spec.label}
        </label>
        {spec.help ? <p className={helpClass}>{spec.help}</p> : null}
      </div>
    );
  }

  if (spec.kind === "json") {
    return (
      <div className="sm:col-span-2 space-y-1">
        {label}
        <textarea
          value={typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2)}
          rows={spec.rows ?? 6}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              onChange(e.target.value);
            }
          }}
          className={`${inputClass} font-mono text-xs`}
        />
        {spec.help ? <p className={helpClass}>{spec.help}</p> : null}
      </div>
    );
  }

  if (spec.kind === "textarea") {
    return (
      <div className={spec.full || nested ? "sm:col-span-2" : ""}>
        {label}
        <textarea
          value={typeof value === "string" ? value : ""}
          rows={spec.rows ?? 3}
          placeholder={spec.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
        {spec.help ? <p className={helpClass}>{spec.help}</p> : null}
      </div>
    );
  }

  if (spec.kind === "number") {
    return (
      <div className={spec.full || nested ? "sm:col-span-2" : ""}>
        {label}
        <input
          type="number"
          min={spec.min}
          max={spec.max}
          value={typeof value === "number" ? value : Number(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
        {spec.help ? <p className={helpClass}>{spec.help}</p> : null}
      </div>
    );
  }

  return (
    <div className={spec.full || nested ? "sm:col-span-2" : ""}>
      {label}
      <input
        type={spec.kind === "url" ? "text" : "text"}
        value={typeof value === "string" ? value : ""}
        placeholder={spec.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {spec.help ? <p className={helpClass}>{spec.help}</p> : null}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition disabled:opacity-40 ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
