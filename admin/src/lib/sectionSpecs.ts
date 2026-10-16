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

export const iconField = (label = "Icon"): FieldSpec => ({
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
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
    ],
  },
  {
    key: "features_overview",
    label: "Features Overview",
    description:
      "Heading and the 'See more' pill link. The cards come from Content → Features Posts.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Link URL" },
    ],
  },
  {
    key: "product_preview",
    label: "Product Preview",
    description: "Split section: photo on the right, checklist of points on the left.",
    fields: [
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
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Description" },
        ],
      },
    ],
  },
  {
    key: "pricing",
    label: "Pricing Preview",
    description:
      "Compact pricing cards shown on the home page. Plans are managed under the Pricing page.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Header link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Header link URL" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Customer quotes shown on the home page.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
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
    description:
      "Heading, intro copy and the link to the full FAQ page. The questions come from Content → FAQs (showing the 5 newest) and the category tabs come from Pages → FAQ → Categories & Questions.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Link label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Link URL" },
    ],
  },
  {
    key: "cta_banner",
    label: "CTA Banner",
    description: "Closing call to action with a video or image and the list of reason chips.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "cta_label", column: "cta_label", label: "Primary button label" },
      { kind: "url", key: "cta_href", column: "cta_href", label: "Primary button URL" },
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Video or image",
        help: "Upload an MP4/WebM video or an image. Leave empty to keep the built-in video.",
        full: true,
      },
      {
        kind: "text",
        key: "image_alt",
        label: "Media label",
        help: "Accessible label for the video or image.",
        full: true,
      },
      {
        kind: "list",
        key: "features",
        label: "Reason chips",
        itemLabel: "Reason",
        fields: [{ kind: "text", key: "title", label: "Title" }],
      },
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
    description: "Top of the features page: headline, subtext and both buttons.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      ...ctaPair("Primary button label"),
    ],
  },
  {
    key: "feature_grid",
    label: "Feature Grid",
    description:
      "Category filter tabs for the grid. The feature cards themselves are managed under Features Posts in the sidebar; this section only controls the tabs and whether the grid is shown.",
    fields: [
      ...headingPair("Highlighted line"),
      {
        kind: "list",
        key: "categories",
        label: "Category tabs",
        itemLabel: "Category",
        fields: [
          { kind: "text", key: "id", label: "ID", help: "Used by the cards below. Use all for the default tab." },
          { kind: "text", key: "label", label: "Label" },
        ],
      },
    ],
  },
  {
    key: "platform_showcase",
    label: "Platform Showcase",
    description:
      "Split section: the three photo-collage images on the left and the numbered benefits on the right.",
    fields: [
      ...headingPair("Highlighted line"),
      { kind: "textarea", key: "body", column: "body", label: "Paragraph", rows: 3, full: true },
      {
        kind: "image",
        key: "image_left",
        label: "Collage image: left",
        imageOnly: true,
        full: true,
        help: "Leave blank to keep the built-in image.",
      },
      {
        kind: "image",
        key: "image_center",
        label: "Collage image: center",
        imageOnly: true,
        full: true,
        help: "Leave blank to keep the built-in image.",
      },
      {
        kind: "image",
        key: "image_right",
        label: "Collage image: right",
        imageOnly: true,
        full: true,
        help: "Leave blank to keep the built-in image.",
      },
      {
        kind: "list",
        key: "benefits",
        label: "Benefits",
        itemLabel: "Benefit",
        fields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
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
    description: "Top of the about page: headline, subtext, both buttons and the hero media.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      ...ctaPair("Primary button label"),
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Hero video or image",
        full: true,
        help: "Leave blank to keep the built-in video.",
      },
      {
        kind: "text",
        key: "image_alt",
        label: "Hero media alt text",
        help: "Describes the hero media for screen readers.",
        full: true,
      },
    ],
  },
  {
    key: "mission_stats",
    label: "Mission & Vision",
    description: "The two mission/vision cards.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "mission_title", label: "Mission card title", full: true },
      { kind: "textarea", key: "mission_body", label: "Mission card text", rows: 3, full: true },
      { kind: "text", key: "vision_title", label: "Vision card title", full: true },
      { kind: "textarea", key: "vision_body", label: "Vision card text", rows: 3, full: true },
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
    key: "journey",
    label: "Our Journey",
    description: "The horizontal milestone timeline.",
    fields: [
      ...headingPair("Highlighted line"),
      {
        kind: "list",
        key: "milestones",
        label: "Milestones",
        itemLabel: "Milestone",
        fields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "desc", label: "Description", rows: 3 },
        ],
      },
    ],
  },
  {
    key: "why_choose",
    label: "Why Salons Choose SalonAI",
    description: "The closing band: headline, subtext, the photo and the reasons.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Photo",
        full: true,
        help: "Leave blank to keep the built-in image.",
      },
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

export const PRICING_SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "Pricing Hero",
    description: "Title, subtitle, billing toggle text and optional hero media.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      { kind: "text", key: "monthly_label", label: "Toggle label: monthly", placeholder: "Monthly" },
      { kind: "text", key: "annual_label", label: "Toggle label: annual", placeholder: "Annual" },
      {
        kind: "text",
        key: "per_month_suffix",
        label: "Price suffix",
        help: "Shown after the price, e.g. /month.",
        placeholder: "/month",
      },
    ],
  },
  {
    key: "pricing_cards",
    label: "Plans Grid",
    description:
      "Wraps the pricing packages. The packages themselves are managed under Pricing in the sidebar; this section only controls whether the grid is shown.",
    fields: [
      { kind: "text", key: "empty_message", label: "Message shown when there are no packages", full: true, placeholder: "Pricing packages are on the way." },
    ],
  },
  {
    key: "comparison",
    label: "Comparison Table",
    description:
      "Heading plus every comparison row. Each value is either text (e.g. 'Up to 10') or true/false for a tick or a dash.",
    fields: [
      { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
      { kind: "text", key: "subheading", column: "subheading", label: "Subheading", full: true },
      { kind: "text", key: "feature_column_label", label: "First column header", placeholder: "Features" },
      {
        kind: "string-list",
        key: "plan_columns",
        label: "Plan column headers",
        itemLabel: "Plan",
        help: "Left to right. Keep these in the same order as the packages under Pricing.",
      },
      {
        kind: "list",
        key: "rows",
        label: "Comparison rows",
        itemLabel: "Row",
        fields: [
          iconField(),
          { kind: "text", key: "name", label: "Row label" },
          {
            kind: "list",
            key: "values",
            label: "Value per plan",
            itemLabel: "Value",
            fields: [
              {
                kind: "text",
                key: "value",
                label: "Value",
                help: "Leave empty for a dash. Any other text is shown as written.",
              },
              { kind: "toggle", key: "yes", label: "Show a tick" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "closing_cta",
    label: "Still Not Sure CTA",
    description: "The closing call-to-action above the 'All plans include' strip.",
    fields: [
      { kind: "text", key: "title", label: "Title", full: true },
      { kind: "textarea", key: "subtitle", label: "Subtitle", rows: 2 },
      { kind: "text", key: "cta_label", label: "CTA label" },
      { kind: "url", key: "cta_href", label: "CTA href" },
      { kind: "text", key: "secondary_cta_label", label: "Secondary CTA label" },
      { kind: "url", key: "secondary_cta_href", label: "Secondary CTA href" },
      { kind: "image", key: "image_url", column: "image_url", label: "Media", full: true },
      imageAltField,
    ],
  },
  {
    key: "banner",
    label: "All Plans Include",
    description: "The 'all plans include' strip.",
    fields: [
      { kind: "text", key: "strip_heading", label: "Strip heading", placeholder: "All plans include" },
      {
        kind: "list",
        key: "items",
        label: "Included items",
        itemLabel: "Item",
        fields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "desc", label: "Short description" },
        ],
      },
    ],
  },
  {
    key: "faq_cta",
    label: "FAQ & CTA",
    description: "Pricing FAQs plus the closing 'get started' card.",
    fields: [
      { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
      { kind: "text", key: "subheading", column: "subheading", label: "Subheading", full: true },
      {
        kind: "list",
        key: "faqs",
        label: "FAQs",
        itemLabel: "FAQ",
        fields: [
          { kind: "textarea", key: "question", label: "Question", rows: 2 },
          { kind: "textarea", key: "answer", label: "Answer", rows: 3 },
        ],
      },
      { kind: "text", key: "cta_heading", label: "CTA card heading" },
      { kind: "text", key: "cta_heading_accent", label: "CTA card highlighted line" },
      { kind: "textarea", key: "cta_subheading", label: "CTA card sub-copy", rows: 2 },
      { kind: "text", key: "cta_label", label: "CTA card button label" },
      { kind: "url", key: "cta_href", label: "CTA card button URL" },
      { kind: "text", key: "cta_secondary_label", label: "CTA card secondary button label" },
      { kind: "url", key: "cta_secondary_href", label: "CTA card secondary button URL" },
      { kind: "image", key: "image_url", column: "image_url", label: "CTA card media", full: true },
      imageAltField,
    ],
  },
];

/**
 * Fields shared by the contact and request-demo forms (they render the same
 * `ContactFormSection` component on the Client).
 */
const contactFormFields: FieldSpec[] = [
  { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
  { kind: "text", key: "subheading", column: "subheading", label: "Sub-copy", full: true },
  { kind: "text", key: "name_label", label: "Name field label" },
  { kind: "text", key: "name_placeholder", label: "Name field placeholder" },
  { kind: "text", key: "email_label", label: "Email field label" },
  { kind: "text", key: "email_placeholder", label: "Email field placeholder" },
  { kind: "text", key: "phone_label", label: "Phone field label" },
  { kind: "text", key: "phone_placeholder", label: "Phone field placeholder" },
  { kind: "text", key: "subject_label", label: "Subject field label" },
  {
    kind: "text",
    key: "subject_placeholder",
    label: "Subject default option",
    help: "The first, empty choice shown in the subject dropdown.",
  },
  { kind: "text", key: "message_label", label: "Message field label" },
  { kind: "textarea", key: "message_placeholder", label: "Message field placeholder", rows: 2 },
  { kind: "text", key: "submit_label", label: "Submit button label" },
  { kind: "textarea", key: "success_message", label: "Message shown after sending", rows: 2 },
  { kind: "text", key: "privacy_note", label: "Small note under the button" },
  { kind: "text", key: "details_heading", label: "Contact info panel heading" },
  { kind: "text", key: "socials_heading", label: "Social panel heading" },
  {
    kind: "list",
    key: "details",
    label: "Contact details",
    itemLabel: "Detail",
    fields: [
      iconField(),
      { kind: "text", key: "label", label: "Label" },
      { kind: "text", key: "value", label: "Value" },
    ],
  },
  {
    kind: "string-list",
    key: "subjects",
    label: "Subject dropdown options",
    itemLabel: "Subject option",
    help: "The choices in the subject dropdown. Each one is stored on the enquiry.",
  },
];

export const CONTACT_SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "Contact Hero",
    description: "Top of the contact page: the headline, intro line and the video or image on the right.",
    fields: [
      { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
      subheadingField,
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Hero video or image",
        full: true,
        help: "Leave blank to keep the built-in video.",
      },
      imageAltField,
    ],
  },
  {
    key: "contact_form",
    label: "Contact Form",
    description:
      "The form itself. Anything a visitor submits is saved to the database and shows up under Enquiries.",
    fields: contactFormFields,
  },
  {
    key: "location_map",
    label: "Location & Map",
    description: "The address, directions link and the embedded map.",
    fields: [
      { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
      { kind: "textarea", key: "body", column: "body", label: "Description", rows: 2, full: true },
      { kind: "text", key: "address", label: "Address" },
      { kind: "text", key: "map_query", label: "Map search query", help: "e.g. Colombo Sri Lanka" },
      { kind: "text", key: "directions_label", label: "Directions link label" },
      { kind: "url", key: "directions_href", label: "Directions link" },
    ],
  },
];

/**
 * Request Demo page sections.
 *
 * Separate from the contact specs even though the layout reuses the same form
 * and closing banner: the copy, the subject options and the enquiry source all
 * differ, so the two pages must not share an editor schema.
 */
export const REQUEST_DEMO_SECTION_SPECS: SectionSpec[] = [
  {
    key: "demo_hero",
    label: "Demo Hero",
    description: "Top of the request demo page: eyebrow, headline and the intro line.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
    ],
  },
  {
    key: "contact_form",
    label: "Demo Request Form",
    description:
      "The form itself. Anything a visitor submits is saved to the database and shows up under Enquiries with source 'request-demo'.",
    fields: contactFormFields,
  },
  {
    key: "cta_banner",
    label: "CTA Banner",
    description: "Closing band with the copy, both buttons and an optional image or video.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Banner video or image",
        full: true,
        help: "Leave blank to keep the built-in image.",
      },
      imageAltField,
      ...ctaPair("Primary button label"),
    ],
  },
];

/**
 * Blog page sections.
 *
 * The articles themselves are edited on the dedicated Blog screen, which talks
 * to `blog_posts` rather than `page_sections`. These specs cover the copy and
 * layout wrapped around that list.
 */
export const BLOG_SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "Blog Hero",
    description:
      "Headline, intro copy, the hero media, the search box and the category dropdown. The dropdown options come from the Categories section below.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Hero video or image",
        full: true,
        help: "Leave blank to keep the built-in video.",
      },
      {
        kind: "text",
        key: "image_alt",
        label: "Hero media alt text",
        help: "Describes the hero media for screen readers.",
        full: true,
      },
      { kind: "text", key: "search_placeholder", label: "Search box placeholder" },
      { kind: "text", key: "search_label", label: "Category dropdown default option" },
    ],
  },
  {
    key: "categories",
    label: "Categories",
    description:
      "Category filter buttons. Counts are generated from published posts, so only the labels and icons are editable here.",
    fields: [
      {
        kind: "list",
        key: "items",
        label: "Categories",
        itemLabel: "Category",
        full: true,
        help: "Leave the slug blank to show every category.",
        fields: [
          iconField(),
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "slug", label: "Slug", placeholder: "management" },
        ],
      },
    ],
  },
  {
    key: "latest",
    label: "Latest Articles",
    description: "Heading above the article grid and the empty state message.",
    fields: [
      ...headingPair("Highlighted line"),
      { kind: "text", key: "empty_message", label: "Shown when no articles match", full: true },
    ],
  },
  {
    key: "popular",
    label: "Popular Posts",
    description:
      "Heading above the three most recent articles. The list itself is generated from published posts.",
    fields: [
      { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
      { kind: "text", key: "empty_message", label: "Empty state message", full: true },
    ],
  },
];

/**
 * FAQ page sections.
 *
 * The questions themselves come from the `faqs` table via the CMS FAQ API; the
 * articles/cards around them are edited here. Split into its own list (not the
 * home page `faq` section) because the layouts are completely different.
 */
export const FAQ_SECTION_SPECS: SectionSpec[] = [
  {
    key: "hero",
    label: "FAQ Hero",
    description:
      "Top of the FAQ page: headline, intro copy, the background media and the search box.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Hero video or image",
        full: true,
        help: "Leave blank to keep the built-in video.",
      },
      {
        kind: "text",
        key: "image_alt",
        label: "Hero media alt text",
        help: "Describes the hero media for screen readers.",
        full: true,
      },
      { kind: "text", key: "search_placeholder", label: "Search box placeholder", placeholder: "Search for answers..." },
      { kind: "text", key: "search_label", label: "Search button label", placeholder: "Search" },
    ],
  },
  {
    key: "categories",
    label: "Categories & Questions",
    description:
      "Category sidebar plus the intro copy above it. Categories added here appear as the filter tabs under Content → FAQs, where you pick a category and add its questions.",
    fields: [
      ...headingPair("Highlighted line"),
      subheadingField,
      {
        kind: "list",
        key: "categories",
        label: "Categories",
        itemLabel: "Category",
        help: "Add a category here with + Add category. Then open Content → FAQs, select this category and add its questions — each FAQ's category must match the Label or Slug above.",
        fields: [
          { kind: "text", key: "id", label: "ID", help: "Unique short name, used for filtering. Use general for the default tab." },
          iconField(),
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "slug", label: "Slug", help: "Optional. Match an FAQ's category to this to group it under this tab." },
        ],
      },
    ],
  },
  {
    key: "cta_banner",
    label: "Support CTA",
    description: "The closing call to action with the support team message, both buttons and the photo.",
    fields: [
      eyebrowField,
      ...headingPair("Highlighted line"),
      subheadingField,
      ...ctaPair("Primary button label"),
      {
        kind: "image",
        key: "image_url",
        column: "image_url",
        label: "Support photo",
        full: true,
        help: "Leave blank to keep the built-in image.",
      },
      imageAltField,
    ],
  },
];

export const FOOTER_SECTION_SPECS: SectionSpec[] = [
  {
    key: "footer",
    label: "Footer",
    description:
      "Site-wide footer: brand block, link columns, contact details, socials and the bottom bar.",
    fields: [
      {
        kind: "image",
        key: "logo_url",
        label: "Footer logo",
        help: "Replaces the SalonAI wordmark in the footer brand block. Leave blank to keep the wordmark.",
        imageOnly: true,
        full: true,
      },
      {
        kind: "text",
        key: "heading",
        column: "heading",
        label: "Brand tagline",
        help: "Small line under the SalonAI wordmark.",
        full: true,
      },
      {
        kind: "textarea",
        key: "subheading",
        column: "subheading",
        label: "Brand description",
        rows: 2,
        full: true,
      },
      { kind: "text", key: "explore_heading", label: "Explore column title", full: true },
      {
        kind: "list",
        key: "explore_links",
        label: "Explore links",
        itemLabel: "Link",
        full: true,
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "url", key: "href", label: "Link" },
        ],
      },
      { kind: "text", key: "company_heading", label: "Company column title", full: true },
      {
        kind: "list",
        key: "company_links",
        label: "Company links",
        itemLabel: "Link",
        full: true,
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "url", key: "href", label: "Link" },
        ],
      },
      { kind: "text", key: "contact_heading", label: "Contact column title", full: true },
      {
        kind: "list",
        key: "contacts",
        label: "Contact details",
        itemLabel: "Contact",
        full: true,
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "value", label: "Value" },
          { kind: "url", key: "href", label: "Link" },
        ],
      },
      {
        kind: "list",
        key: "socials",
        label: "Social links",
        itemLabel: "Social",
        full: true,
        help: "The icon is picked from the profile URL (instagram.com, facebook.com, linkedin.com, youtube.com, x.com, tiktok.com, whatsapp, telegram, pinterest).",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "url", key: "href", label: "Profile URL" },
          {
            kind: "text",
            key: "icon",
            label: "Icon override",
            help: "Instagram, Facebook, LinkedIn, YouTube, X, TikTok, WhatsApp, Telegram, Pinterest. Blank = auto from URL.",
          },
        ],
      },
      {
        kind: "text",
        key: "copyright",
        label: "Copyright text",
        help: "Rendered after © and the current year.",
        full: true,
      },
      { kind: "text", key: "footer_note", label: "Bottom-right tagline", full: true },
    ],
  },
  {
    key: "newsletter",
    label: "Newsletter Band",
    description:
      "Subscribe strip above the bottom bar. Turn Visible off to remove it from the site.",
    fields: [
      { kind: "text", key: "heading", column: "heading", label: "Heading", full: true },
      subheadingField,
      { kind: "text", key: "email_placeholder", label: "Email field placeholder" },
      { kind: "text", key: "submit_label", label: "Button label" },
      { kind: "text", key: "success_message", label: "Success message", full: true },
    ],
  },
];

const BY_KEY = new Map(SECTION_SPECS.map((s) => [s.key, s]));
const FEATURES_BY_KEY = new Map(FEATURES_SECTION_SPECS.map((s) => [s.key, s]));
const ABOUT_BY_KEY = new Map(ABOUT_SECTION_SPECS.map((s) => [s.key, s]));
const CONTACT_BY_KEY = new Map(CONTACT_SECTION_SPECS.map((s) => [s.key, s]));
const REQUEST_DEMO_BY_KEY = new Map(REQUEST_DEMO_SECTION_SPECS.map((s) => [s.key, s]));
const PRICING_BY_KEY = new Map(PRICING_SECTION_SPECS.map((s) => [s.key, s]));
const BLOG_BY_KEY = new Map(BLOG_SECTION_SPECS.map((s) => [s.key, s]));
const FAQ_BY_KEY = new Map(FAQ_SECTION_SPECS.map((s) => [s.key, s]));
const FOOTER_BY_KEY = new Map(FOOTER_SECTION_SPECS.map((s) => [s.key, s]));

/** Specs are page aware: each page with its own `hero` gets its own spec list. */
export function getSectionSpec(slug: string, key: string): SectionSpec | undefined {
  if (slug === "features") return FEATURES_BY_KEY.get(key);
  if (slug === "about") return ABOUT_BY_KEY.get(key);
  if (slug === "contact") return CONTACT_BY_KEY.get(key);
  if (slug === "request-demo") return REQUEST_DEMO_BY_KEY.get(key);
  if (slug === "pricing") return PRICING_BY_KEY.get(key);
  if (slug === "blog") return BLOG_BY_KEY.get(key);
  if (slug === "faq") return FAQ_BY_KEY.get(key);
  if (slug === "footer") return FOOTER_BY_KEY.get(key);
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
