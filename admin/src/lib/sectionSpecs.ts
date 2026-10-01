/**
 * Declarative field specs for each page section.
 *
 * The admin editor renders itself from these, so adding a new editable
 * field to a section is a one-line change here instead of new UI code.
 *
 * A field with a `column` is stored in its own `page_sections` column.
 * Everything else lives inside the `extra_json` object, so the shape of
 * `extra_json` is fully described by the specs below.
 */

export type ColumnKey =
  | "heading"
  | "subheading"
  | "body"
  | "cta_label"
  | "cta_href"
  | "image_url";

type BaseField = {
  /** Property name, either a page_sections column or an `extra_json` key. */
  key: string;
  label: string;
  help?: string;
  placeholder?: string;
  /** Route the value into a dedicated page_sections column. */
  column?: ColumnKey;
  /** Render full width inside the 2 column grid. */
  full?: boolean;
};

export type FieldSpec =
  | (BaseField & { kind: "text" })
  | (BaseField & { kind: "textarea"; rows?: number })
  | (BaseField & { kind: "url" })
  | (BaseField & { kind: "number"; min?: number; max?: number })
  | (BaseField & { kind: "toggle" })
  | (BaseField & { kind: "image"; compact?: boolean; imageOnly?: boolean })
  | (BaseField & { kind: "image-list"; itemLabel: string })
  | (BaseField & { kind: "string-list"; itemLabel?: string })
  | (BaseField & { kind: "list"; itemLabel: string; fields: FieldSpec[] })
  | (BaseField & { kind: "json"; rows?: number });

export type SectionSpec = {
  key: string;
  label: string;
  description: string;
  fields: FieldSpec[];
};

/** Fields shared by the "heading + highlighted second line" pattern. */
const headingPair = (secondLineLabel = "Highlighted line", secondLineHelp?: string): FieldSpec[] => [
  { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
  {
    kind: "text",
    key: "heading_accent",
    label: secondLineLabel,
    help: secondLineHelp ?? "Rendered on its own line in the accent colour.",
    full: true,
  },
];

const iconField = (label = "Icon"): FieldSpec => ({
  kind: "text",
  key: "icon",
  label,
  help: "Lucide icon name, e.g. CalendarDays, Sparkles, Zap.",
  placeholder: "Sparkles",
});

const eyebrowField: FieldSpec = {
  kind: "text",
  key: "eyebrow",
  label: "Eyebrow",
  help: "Small uppercase label above the heading.",
};

const subheadingField: FieldSpec = {
  kind: "textarea",
  key: "subheading",
  column: "subheading",
  label: "Subheading",
  rows: 2,
  full: true,
};

const imageAltField: FieldSpec = {
  kind: "text",
  key: "image_alt",
  label: "Image alt text",
  help: "Leave blank to fall back to the built-in default image.",
  full: true,
};

export const SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "Hero",
    description: "Top of the home page. Headline, both CTAs, the photo and the four highlights.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Primary button label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Primary button link" },
      {
        kind: "text",
        key: "secondary_cta_label",
        label: "Secondary button label",
        placeholder: "Watch Video",
      },
      { kind: "url", key: "secondary_cta_href", label: "Secondary button link" },
      {
        kind: "text",
        key: "secondary_cta_sub",
        label: "Secondary button sub-label",
        placeholder: "See how it works",
      },
      { kind: "image", key: "image_url", column: "image_url", label: "Hero media", full: true },
      imageAltField,
      {
        kind: "list",
        key: "highlights",
        label: "Highlights",
        itemLabel: "Highlight",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
    ],
  },
  {
    key: "features_overview",
    label: "Features Overview",
    description: "Four feature cards plus the 'See more' pill link.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Link URL" },
      {
        kind: "list",
        key: "features",
        label: "Feature cards",
        itemLabel: "Feature",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "description", label: "Description", rows: 2 },
        ],
      },
      { kind: "text", key: "footer_note", label: "Footer note", full: true },
    ],
  },
  {
    key: "product_preview",
    label: "Product Preview",
    description: "Split section: photo on the right, checklist of points on the left.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Button label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Button URL" },
      { kind: "image", key: "image_url", column: "image_url", label: "Photo or video", full: true },
      imageAltField,
      {
        kind: "list",
        key: "points",
        label: "Checklist points",
        itemLabel: "Point",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Description" },
        ],
      },
    ],
  },
  {
    key: "pricing",
    label: "Pricing Preview",
    description: "Compact pricing cards shown on the home page.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      { kind: "text", key: "cta_label", column: "cta_label", label: "Header link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Header link URL" },
      {
        kind: "list",
        key: "plans",
        label: "Plans",
        itemLabel: "Plan",
        fields: [
          { kind: "text", key: "name", label: "Plan name" },
          { kind: "text", key: "price", label: "Price", help: "Text, e.g. $19 or Custom." },
          { kind: "text", key: "period", label: "Period", placeholder: "/month" },
          { kind: "textarea", key: "description", label: "Description", rows: 2 },
          { kind: "string-list", key: "features", label: "Included features", itemLabel: "Feature" },
          { kind: "toggle", key: "featured", label: "Highlight as most popular" },
          { kind: "text", key: "badge", label: "Badge text", placeholder: "Most Popular" },
          { kind: "text", key: "cta_label", label: "Button label" },
          { kind: "url", key: "cta_href", label: "Button URL" },
        ],
      },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Customer quotes shown on the home page.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Header link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Header link URL" },
      {
        kind: "list",
        key: "items",
        label: "Testimonials",
        itemLabel: "Testimonial",
        fields: [
          { kind: "text", key: "name", label: "Name" },
          { kind: "text", key: "role", label: "Role" },
          { kind: "text", key: "salon", label: "Salon" },
          { kind: "image", key: "avatar_url", label: "Avatar", compact: true, imageOnly: true },
          { kind: "number", key: "rating", label: "Rating (1-5)", min: 1, max: 5 },
          { kind: "textarea", key: "content", label: "Quote", rows: 3 },
        ],
      },
    ],
  },
  {
    key: "mobile_app",
    label: "Mobile App Showcase",
    description: "App download section with the two store badges.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "image", key: "image_url", column: "image_url", label: "Image or video", full: true },
      imageAltField,
      { kind: "url", key: "app_store_url", label: "App Store URL" },
      { kind: "url", key: "play_store_url", label: "Google Play URL" },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    description: "Category sidebar plus the accordion of questions.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Link URL" },
      {
        kind: "list",
        key: "categories",
        label: "Categories",
        itemLabel: "Category",
        fields: [iconField(), { kind: "text", key: "label", label: "Label" }],
      },
      {
        kind: "list",
        key: "faqs",
        label: "Questions",
        itemLabel: "Question",
        fields: [
          { kind: "text", key: "question", label: "Question" },
          { kind: "textarea", key: "answer", label: "Answer", rows: 3 },
        ],
      },
    ],
  },
  {
    key: "cta_banner",
    label: "CTA Banner",
    description: "Closing call to action with the image, avatars and floating stat cards.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Primary button label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Primary button URL" },
      { kind: "text", key: "secondary_cta_label", label: "Secondary button label" },
      { kind: "url", key: "secondary_cta_href", label: "Secondary button URL" },
      { kind: "image", key: "image_url", column: "image_url", label: "Image or video", full: true },
      imageAltField,
      {
        kind: "list",
        key: "features",
        label: "Reason cards",
        itemLabel: "Reason",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Description" },
        ],
      },
      { kind: "image-list", key: "avatars", label: "Avatar images", itemLabel: "Avatar" },
      { kind: "text", key: "trust_text", label: "Trust line", full: true },
      { kind: "text", key: "stat_label", label: "Floating stat: label" },
      { kind: "text", key: "stat_value", label: "Floating stat: value" },
      { kind: "text", key: "stat_delta", label: "Floating stat: change" },
      { kind: "text", key: "stat_note_title", label: "Floating note: title" },
      { kind: "textarea", key: "stat_note_body", label: "Floating note: body", rows: 2 },
    ],
  },
];

/** Fields shared by every section that ends in a call to action. */
const ctaPair = (primaryLabel: string, primaryHelp?: string): FieldSpec[] => [
  { kind: "text", key: "cta_label", column: "cta_label", label: primaryLabel },
  { kind: "url", key: "cta_href", column: "cta_href", label: "Primary button link" },
  { kind: "text", key: "secondary_cta_label", label: "Secondary button label" },
  { kind: "url", key: "secondary_cta_href", label: "Secondary button link" },
  ...(primaryHelp ? [{ kind: "text" as const, key: "secondary_cta_sub", label: "Secondary button sub-label" } satisfies FieldSpec] : []),
];

/**
 * Specs for the `features` page.
 *
 * Kept separate from the home page specs even though both use keys like
 * `hero`, because the two pages need completely different fields.
 */
export const FEATURES_SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "Features Hero",
    description: "Top of the features page: headline, both buttons, the photo and four highlights.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      ...ctaPair("Primary button label", "shown under the label"),
      { kind: "image", key: "image_url", column: "image_url", label: "Hero media", full: true },
      imageAltField,
      {
        kind: "list",
        key: "highlights",
        label: "Highlights",
        itemLabel: "Highlight",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
    ],
  },
  {
    key: "feature_grid",
    label: "Feature Grid",
    description: "Category filter tabs plus the filterable grid of feature cards.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      {
        kind: "list",
        key: "categories",
        label: "Category tabs",
        itemLabel: "Category",
        fields: [
          { kind: "text", key: "id", label: "ID", help: "Used by the cards below. Use all for the default tab." },
          { kind: "text", key: "label", label: "Label" },
          iconField(),
        ],
      },
      {
        kind: "list",
        key: "features",
        label: "Feature cards",
        itemLabel: "Feature",
        fields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "description", label: "Description", rows: 2 },
          {
            kind: "text",
            key: "category",
            label: "Category ID",
            help: "Must match one of the category IDs above, or the card hides on that tab.",
          },
          iconField(),
          { kind: "url", key: "href", label: "Learn more link", placeholder: "/features/booking" },
        ],
      },
    ],
  },
  {
    key: "platform_showcase",
    label: "Platform Showcase",
    description: "Split section: the six benefits on the right, photo on the left.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      { kind: "textarea", key: "body", column: "body", label: "Paragraph", rows: 3, full: true },
      { kind: "image", key: "image_url", column: "image_url", label: "Image or video", full: true },
      imageAltField,
      {
        kind: "list",
        key: "benefits",
        label: "Benefits",
        itemLabel: "Benefit",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
    ],
  },
  {
    key: "stats_bar",
    label: "Stats Bar",
    description: "The five numbers across the middle of the page.",
    fields: [
      {
        kind: "list",
        key: "stats",
        label: "Stats",
        itemLabel: "Stat",
        fields: [
          iconField(),
          { kind: "text", key: "value", label: "Value", placeholder: "10,000+" },
          { kind: "text", key: "label", label: "Label", placeholder: "Salons Worldwide" },
        ],
      },
    ],
  },
  {
    key: "cta_banner",
    label: "CTA Banner",
    description: "Closing call to action with the image and both buttons.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      { kind: "textarea", key: "body", column: "body", label: "Paragraph", rows: 2, full: true },
      ...ctaPair("Primary button label"),
      { kind: "image", key: "image_url", column: "image_url", label: "Image or video", full: true },
      imageAltField,
    ],
  },
];

/**
 * Specs for the `about` page.
 *
 * Page aware like `features`, because the about hero shares its `hero` key with
 * the home page hero but needs completely different fields.
 */
export const ABOUT_SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "About Hero",
    description: "Top of the about page: headline, both buttons, the media and four highlights.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      ...ctaPair("Primary button label"),
      { kind: "image", key: "image_url", column: "image_url", label: "Hero media", full: true },
      imageAltField,
      {
        kind: "list",
        key: "highlights",
        label: "Highlights",
        itemLabel: "Highlight",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
    ],
  },
  {
    key: "mission_stats",
    label: "Mission & Vision + Stats",
    description: "The two mission/vision cards followed by the row of numbers.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "mission_title", label: "Mission card title", full: true },
      { kind: "textarea", key: "mission_body", label: "Mission card text", rows: 3, full: true },
      { kind: "text", key: "vision_title", label: "Vision card title", full: true },
      { kind: "textarea", key: "vision_body", label: "Vision card text", rows: 3, full: true },
      {
        kind: "list",
        key: "stats",
        label: "Stats",
        itemLabel: "Stat",
        fields: [
          { kind: "text", key: "value", label: "Value", placeholder: "10,000+" },
          { kind: "text", key: "label", label: "Label", placeholder: "Salons Worldwide" },
        ],
      },
    ],
  },
  {
    key: "journey",
    label: "Our Journey",
    description: "The horizontal milestone timeline.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      {
        kind: "list",
        key: "milestones",
        label: "Milestones",
        itemLabel: "Milestone",
        fields: [
          iconField(),
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "desc", label: "Description", rows: 3 },
        ],
      },
    ],
  },
  {
    key: "team",
    label: "Our Team",
    description: "The team half circle. Only the middle member shows a name and role.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      {
        kind: "list",
        key: "members",
        label: "Team members",
        itemLabel: "Member",
        help: "The middle member is the one shown with a name and role. Order matters — they sit on a half circle.",
        fields: [
          { kind: "text", key: "name", label: "Name" },
          { kind: "text", key: "role", label: "Position" },
          {
            kind: "image",
            key: "image_url",
            label: "Photo",
            compact: true,
            imageOnly: true,
            help: "Optional. Initials are shown when left empty.",
          },
        ],
      },
    ],
  },
  {
    key: "why_choose",
    label: "Why Salons Choose SalonAI",
    description: "The closing band of five reasons.",
    fields: [
      ...headingPair("Highlighted line"),
      {
        kind: "list",
        key: "features",
        label: "Reasons",
        itemLabel: "Reason",
        fields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "desc", label: "Description", rows: 2 },
        ],
      },
    ],
  },
];

const BY_KEY = new Map(SECTION_SPECS.map((s) => [s.key, s]));
const FEATURES_BY_KEY = new Map(FEATURES_SECTION_SPECS.map((s) => [s.key, s]));
const ABOUT_BY_KEY = new Map(ABOUT_SECTION_SPECS.map((s) => [s.key, s]));

/** Specs are page aware: `features`, `about` and `home` all have their own `hero`. */
export function getSectionSpec(slug: string, key: string): SectionSpec | undefined {
  if (slug === "features") return FEATURES_BY_KEY.get(key);
  if (slug === "about") return ABOUT_BY_KEY.get(key);
  return BY_KEY.get(key);
}

/** Column backed fields for a section, used by the generic fallback editor. */
export const COLUMN_KEYS: ColumnKey[] = [
  "heading",
  "subheading",
  "body",
  "cta_label",
  "cta_href",
  "image_url",
];
