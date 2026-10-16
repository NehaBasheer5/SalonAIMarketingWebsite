CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  title VARCHAR(160) NOT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS page_sections (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id INT UNSIGNED NOT NULL,
  section_key VARCHAR(80) NOT NULL,
  heading VARCHAR(255) NULL,
  subheading TEXT NULL,
  body TEXT NULL,
  cta_label VARCHAR(120) NULL,
  cta_href VARCHAR(255) NULL,
  image_url VARCHAR(500) NULL,
  extra_json JSON NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_page_section (page_id, section_key),
  CONSTRAINT fk_section_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  excerpt TEXT NULL,
  -- Article body, stored as markdown. `![alt](/uploads/x.jpg)` for images and
  -- `![alt](/uploads/x.mp4)` for videos, both resolved by the Client renderer.
  content MEDIUMTEXT NULL,
  cover_image VARCHAR(500) NULL,
  -- Optional video used instead of the cover image on the featured article.
  cover_video VARCHAR(500) NULL,
  category VARCHAR(120) NULL,
  author VARCHAR(191) NULL,
  -- Optional portrait shown inside the author avatar circle on the article page.
  author_image VARCHAR(500) NULL,
  -- Comma separated. Rendered as the tag chips on the blog cards.
  tags VARCHAR(500) NULL,
  read_time VARCHAR(40) NULL,
  -- Legacy hero flag, no longer rendered. Kept so old rows stay valid.
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  -- Tick "Show in Popular Posts": many articles can be popular at once and
  -- they fill the Popular Posts section on the Client blog index.
  is_popular TINYINT(1) NOT NULL DEFAULT 0,
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_blog_status_published (status, published_at),
  KEY idx_blog_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pricing packages shown on the pricing page and the home teaser.
-- Kept as its own table (like blog_posts) so `/pricing` in the CMS can add,
-- edit, reorder and publish packages without touching page copy, which lives
-- in `page_sections` and is edited under Pages -> Pricing.
-- `monthly`/`annual` are display strings ("$49" or "Custom"), not numbers.
CREATE TABLE IF NOT EXISTS pricing_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  -- lucide icon name used when the plan has no image_url
  icon VARCHAR(60) NULL,
  monthly VARCHAR(60) NOT NULL DEFAULT '',
  annual VARCHAR(60) NOT NULL DEFAULT '',
  -- small print under the price, shown for the matching billing cycle
  billed VARCHAR(255) NULL,
  billed_monthly VARCHAR(255) NULL,
  short_desc VARCHAR(500) NULL,
  description TEXT NULL,
  -- JSON array of feature bullet strings
  features_json JSON NULL,
  -- optional per-plan image or video; replaces the icon when set
  image_url VARCHAR(500) NULL,
  image_alt VARCHAR(255) NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  badge VARCHAR(120) NULL,
  cta_label VARCHAR(120) NULL DEFAULT 'Get Started',
  cta_href VARCHAR(255) NULL DEFAULT '/request-demo',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pricing_plans_order (is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS faqs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(120) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  show_on_home TINYINT(1) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Feature cards shown in the Client features page grid, plus a dedicated detail
-- page for each card served at /features/<slug>.
-- These used to live in the `feature_grid` section's `extra_json.features` array
-- (edited under Pages -> Features). They now have their own table so
-- Admin -> Features Posts can add, edit, reorder and publish individual cards
-- and their detail page, while the category filter tabs stay in `page_sections`.
CREATE TABLE IF NOT EXISTS feature_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  -- detail page URL: /features/<slug>
  slug VARCHAR(191) NOT NULL UNIQUE,
  -- short line shown on the card and as the detail page summary
  description TEXT NULL,
  -- detail page body, stored as markdown
  content MEDIUMTEXT NULL,
  -- category id (e.g. "bookings"), matching a tab in the `feature_grid` section
  category VARCHAR(120) NULL,
  -- lucide icon name used when the card has no image_url
  icon VARCHAR(60) NULL,
  -- optional card image; also the detail page hero when set
  image_url VARCHAR(500) NULL,
  image_alt VARCHAR(255) NULL,
  -- optional external link that overrides the detail page on the card
  href VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  -- shown in the home page "features overview" section; any number can be
  -- featured and they are listed before the other cards
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_feature_posts_order (is_published, sort_order),
  INDEX idx_feature_posts_featured (is_featured, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pricing plans used to live in the `pricing_cards` section of the pricing page
-- (`page_sections.extra_json`). They now have their own table above, so
-- Admin -> Pricing manages the packages and Pages -> Pricing edits the page
-- copy around them. Both are served to the marketing site without a rebuild.

-- Messages sent from the marketing site's contact / demo forms.
CREATE TABLE IF NOT EXISTS enquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(60) NULL,
  subject VARCHAR(160) NULL,
  message TEXT NOT NULL,
  -- which form it came from: "contact" or "request-demo"
  source VARCHAR(60) NOT NULL DEFAULT 'contact',
  status ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
  notes TEXT NULL,
  ip VARCHAR(64) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_enquiries_status (status),
  INDEX idx_enquiries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site-wide settings edited under Admin -> Settings: the navbar logo and brand
-- text, the navigation links, and the header action buttons. Stored as a single
-- row (id = 1) holding one JSON object, so new settings can be added later
-- without another migration. The Client reads it from /api/public/settings.
CREATE TABLE IF NOT EXISTS site_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  data_json JSON NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
