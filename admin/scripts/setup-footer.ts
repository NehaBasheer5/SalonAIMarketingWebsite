import { getPool } from "../src/lib/db";

/**
 * Creates or updates the footer page in the database so admins can manage
 * social links, contact details, and other footer content from the CMS.
 */
async function setupFooter() {
  const pool = getPool();

  try {
    // Check if footer page exists
    const [existing] = await pool.query("SELECT id FROM pages WHERE slug = 'footer'");

    let pageId: number;

    if (Array.isArray(existing) && existing.length > 0) {
      pageId = (existing[0] as { id: number }).id;
      console.log(`✓ Footer page already exists (ID: ${pageId})`);
    } else {
      // Create footer page
      const [result] = await pool.query(
        "INSERT INTO pages (slug, title, status) VALUES ('footer', 'Footer', 'published')"
      );
      pageId = (result as { insertId: number }).insertId;
      console.log(`✓ Created footer page (ID: ${pageId})`);
    }

    // Check if sections exist
    const [sections] = await pool.query(
      "SELECT section_key FROM page_sections WHERE page_id = ?",
      [pageId]
    );

    const existingKeys = new Set(
      Array.isArray(sections) ? sections.map((s: { section_key: string }) => s.section_key) : []
    );

    // Default footer section data
    const footerSection = {
      heading: "Manage. Grow. Shine.",
      subheading:
        "Simplify bookings, manage staff, delight your customers and grow your salon — all from one elegant platform.",
      extra_json: JSON.stringify({
        explore_heading: "Explore",
        explore_links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Request a Demo", href: "/request-demo" },
          { label: "Login", href: "/login" },
        ],
        company_heading: "Company",
        company_links: [
          { label: "About Us", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
        ],
        contact_heading: "Get in Touch",
        contacts: [
          { label: "Email Us", value: "hello@avenque.com", href: "mailto:hello@avenque.com" },
          { label: "Call Us", value: "+94 11 234 5678", href: "tel:+94112345678" },
          {
            label: "Visit Us",
            value: "No. 123, Innovation Drive, Colombo 00500",
            href: "https://maps.google.com/?q=Colombo+Sri+Lanka",
          },
        ],
        socials: [
          { label: "Instagram", href: "https://www.instagram.com/yourpage", icon: "instagram" },
          { label: "Facebook", href: "https://www.facebook.com/yourpage", icon: "facebook" },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/yourpage", icon: "linkedin" },
          { label: "YouTube", href: "https://www.youtube.com/@yourpage", icon: "youtube" },
        ],
        copyright: "Avenque. All rights reserved.",
        footer_note: "Beauty Meets Technology",
      }),
    };

    if (!existingKeys.has("footer")) {
      await pool.query(
        `INSERT INTO page_sections (page_id, section_key, heading, subheading, extra_json, is_visible, sort_order)
         VALUES (?, 'footer', ?, ?, ?, 1, 0)`,
        [pageId, footerSection.heading, footerSection.subheading, footerSection.extra_json]
      );
      console.log("✓ Created footer section with default socials");
    } else {
      console.log("✓ Footer section already exists");
    }

    // Newsletter section
    const newsletterSection = {
      heading: "Stay Updated with the Latest Insights",
      subheading:
        "Subscribe to our newsletter and get the latest tips, trends, and product updates straight to your inbox.",
      extra_json: JSON.stringify({
        email_placeholder: "Enter your email address",
        submit_label: "Subscribe",
        success_message: "Thanks for subscribing! Watch your inbox for the next issue.",
      }),
    };

    if (!existingKeys.has("newsletter")) {
      await pool.query(
        `INSERT INTO page_sections (page_id, section_key, heading, subheading, extra_json, is_visible, sort_order)
         VALUES (?, 'newsletter', ?, ?, ?, 1, 1)`,
        [
          pageId,
          newsletterSection.heading,
          newsletterSection.subheading,
          newsletterSection.extra_json,
        ]
      );
      console.log("✓ Created newsletter section");
    } else {
      console.log("✓ Newsletter section already exists");
    }

    console.log("\n✅ Footer setup complete!");
    console.log("\nYou can now:");
    console.log("1. Visit Admin -> Pages -> Footer to edit content");
    console.log("2. Update social media links in the Footer section");
    console.log("3. Changes will appear immediately on the Client site");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up footer:", error);
    process.exit(1);
  }
}

setupFooter();
