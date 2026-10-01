import { images } from "@/assets";

/**
 * Content layer between the Client site and the Admin CMS.
 *
 * The Admin app owns the database and exposes a read-only endpoint at
 * `/api/public/content/:slug`. The Client never talks to MySQL directly; it
 * fetches that endpoint and merges the result over the defaults below.
 *
 * The defaults are the single source of truth when the CMS is unreachable, so
 * the home page always renders even with no database configured.
 */

export type IconName = string;

export type Highlight = {
  icon: IconName;
  title: string;
  desc: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    secondary_cta_sub: string;
    image_url: string;
    image_alt: string;
    highlights: Highlight[];
  };
  features_overview: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    features: { icon: IconName; title: string; description: string }[];
    footer_note: string;
  };
  product_preview: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    image_url: string;
    image_alt: string;
    points: Highlight[];
  };
  pricing: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    cta_label: string;
    cta_href: string;
    plans: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      featured: boolean;
      badge: string;
      cta_label: string;
      cta_href: string;
    }[];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    items: {
      name: string;
      role: string;
      salon: string;
      avatar_url: string;
      rating: number;
      content: string;
    }[];
  };
  mobile_app: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    image_url: string;
    image_alt: string;
    app_store_url: string;
    play_store_url: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    categories: { id: string; label: string; icon: IconName }[];
    faqs: { question: string; answer: string }[];
  };
  cta_banner: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
    features: Highlight[];
    avatars: string[];
    trust_text: string;
    stat_label: string;
    stat_value: string;
    stat_delta: string;
    stat_note_title: string;
    stat_note_body: string;
  };
};

export type HomeSectionKey = keyof HomeContent;

export const HOME_SECTION_ORDER: HomeSectionKey[] = [
  "hero",
  "features_overview",
  "product_preview",
  "pricing",
  "testimonials",
  "mobile_app",
  "faq",
  "cta_banner",
];

/** Bundled imagery used whenever the CMS has no image set for a section. */
export const fallbackImages = {
  hero: images.heroImg,
  product_preview: images.salons,
  mobile_app: images.apps2,
  cta_banner: images.contact,
  features_hero: images.dashboardFeatures,
  features_platform: images.dashboardMockup,
  features_cta: images.dashboardFeatures,
  about_hero: images.aboutHero,
} as const;

const DEFAULTS: HomeContent = {
  hero: {
    eyebrow: "All-in-One Salon Management App",
    heading: "Empower Your",
    heading_accent: "Salon Business",
    subheading:
      "Simplify bookings, manage staff, delight your customers and grow your salon with SalonAI — built for modern beauty businesses.",
    cta_label: "Get Started Today",
    cta_href: "/request-demo",
    secondary_cta_label: "Watch Video",
    secondary_cta_href: "#watch-video",
    secondary_cta_sub: "See how it works",
    image_url: "",
    image_alt: "SalonAI mobile app mockups in a modern salon",
    highlights: [
      { icon: "CalendarDays", title: "Easy Booking", desc: "24/7 online appointments." },
      { icon: "Users", title: "Manage Staff", desc: "Save time, work smarter." },
      { icon: "Sparkles", title: "Grow Revenue", desc: "Insights & reports." },
      { icon: "ShieldCheck", title: "Secure & Reliable", desc: "Your data is safe." },
    ],
  },
  features_overview: {
    eyebrow: "Features",
    heading: "Everything You Need to",
    heading_accent: "Run Your Salon Smarter",
    subheading:
      "Powerful tools to manage your salon, save time and deliver a better experience — all in one place.",
    cta_label: "See more",
    cta_href: "/features",
    features: [
      {
        icon: "CalendarClock",
        title: "Booking Management",
        description: "Manage appointments, schedule and walk-ins effortlessly.",
      },
      {
        icon: "UsersRound",
        title: "Staff Management",
        description: "Organize staff, roles, commissions and performance.",
      },
      {
        icon: "UserRoundCog",
        title: "Customer Management",
        description: "Keep customer profiles, history, notes and preferences.",
      },
      {
        icon: "Cpu",
        title: "AI Features",
        description: "Manage appointments with AI-powered workflows effortlessly.",
      },
    ],
    footer_note: "Beauty Meets Technology",
  },
  product_preview: {
    eyebrow: "Platform",
    heading: "A Powerful Platform",
    heading_accent: "Designed for Salons",
    subheading:
      "SalonAI brings all your business operations together in one beautiful and intelligent platform.",
    cta_label: "Book a Demo",
    cta_href: "/request-demo",
    image_url: "",
    image_alt: "Modern salon interior",
    points: [
      {
        icon: "CalendarDays",
        title: "Easy Navigation",
        desc: "A clean and intuitive interface for everyone.",
      },
      {
        icon: "Zap",
        title: "Real-time Updates",
        desc: "Stay in sync with bookings, staff and customers.",
      },
      {
        icon: "ChartColumnIncreasing",
        title: "Advanced Analytics",
        desc: "Track performance and grow with clear insights.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure & Cloud Based",
        desc: "Your salon data stays protected and accessible.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    heading: "Simple,",
    heading_accent: "Transparent Pricing",
    cta_label: "View Full Pricing →",
    cta_href: "/pricing",
    plans: [
      {
        name: "Starter",
        price: "$19",
        period: "/month",
        description: "Perfect for small salons getting started.",
        features: ["Up to 2 Staff", "Basic Features", "Email Support"],
        featured: false,
        badge: "",
        cta_label: "Get Started",
        cta_href: "/request-demo",
      },
      {
        name: "Growth",
        price: "$39",
        period: "/month",
        description: "Great for growing salons.",
        features: ["Up to 10 Staff", "Advanced Features", "Priority Support"],
        featured: false,
        badge: "",
        cta_label: "Get Started",
        cta_href: "/request-demo",
      },
      {
        name: "Pro",
        price: "$69",
        period: "/month",
        description: "For large salons & multi-branches.",
        features: ["Unlimited Staff", "All Features", "24/7 Support"],
        featured: true,
        badge: "Most Popular",
        cta_label: "Get Started",
        cta_href: "/request-demo",
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For large enterprises.",
        features: ["Custom Solutions", "Dedicated Support", "Onboarding & Training"],
        featured: false,
        badge: "",
        cta_label: "Contact Sales",
        cta_href: "/contact",
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: "Loved by",
    heading_accent: "Salon Owners",
    subheading:
      "Real stories from salon owners who are growing their business with SalonAI.",
    cta_label: "View All Testimonials →",
    cta_href: "/#testimonials",
    items: [
      {
        name: "Priya Sharma",
        role: "Owner",
        salon: "Looks Salon",
        avatar_url:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        content:
          "SalonAI has completely transformed the way we manage our salon. Booking, staff, customers — everything is now so easy and automated.",
      },
      {
        name: "Ananya Patel",
        role: "Founder",
        salon: "Glow & Shine Studio",
        avatar_url:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        content:
          "Our no-shows dropped by 40% in the first month! The automated reminders alone have been a total game-changer for us.",
      },
      {
        name: "Rohan Kapoor",
        role: "Managing Director",
        salon: "Urban Cut Barbers",
        avatar_url:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        content:
          "Managing staff commission and inventory used to take hours every weekend. Now SalonAI handles accounting in real-time.",
      },
    ],
  },
  mobile_app: {
    eyebrow: "Mobile App",
    heading: "On the Go,",
    heading_accent: "Always in Control",
    subheading:
      "Manage your salon anytime, anywhere with our beautiful mobile apps for you and your customers.",
    image_url: "",
    image_alt: "SalonAI mobile apps for owners and customers",
    app_store_url: "#",
    play_store_url: "#",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Frequently Asked",
    heading_accent: "Questions",
    subheading: "Quick answers to the most common questions about SalonAI.",
    cta_label: "View All FAQs →",
    cta_href: "/faq",
    categories: [
      { id: "general", label: "General", icon: "HelpCircle" },
      { id: "features", label: "Features", icon: "Sparkles" },
      { id: "billing", label: "Billing", icon: "Settings2" },
      { id: "security", label: "Security", icon: "Shield" },
    ],
    faqs: [
      {
        question: "What is SalonAI?",
        answer:
          "SalonAI is an all-in-one salon management platform that helps you handle bookings, staff, customers, and growth from one place.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes. You can start with a free trial and explore the full platform before choosing a plan.",
      },
      {
        question: "Can I manage multiple branches?",
        answer:
          "Absolutely. Higher plans support multi-branch management with shared reporting and staff controls.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. SalonAI uses secure cloud infrastructure with encryption and reliable backups to protect your salon data.",
      },
    ],
  },
  cta_banner: {
    eyebrow: "Get Started",
    heading: "Ready to Transform",
    heading_accent: "Your Salon Business?",
    subheading:
      "Join 10,000+ salon owners who are saving time, increasing bookings and growing their business with SalonAI.",
    cta_label: "Book a Demo",
    cta_href: "/request-demo",
    secondary_cta_label: "Contact Sales",
    secondary_cta_href: "/contact",
    image_url: "",
    image_alt: "Salon professional at work",
    features: [
      { icon: "CalendarDays", title: "Easy Setup", desc: "Get started in minutes." },
      { icon: "Users", title: "Dedicated Support", desc: "Real help when you need it." },
      {
        icon: "ChartColumnIncreasing",
        title: "Grow Faster",
        desc: "Insights that drive bookings.",
      },
    ],
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
    ],
    trust_text: "Trusted by 10,000+ salon owners worldwide",
    stat_label: "Bookings This Month",
    stat_value: "1,248",
    stat_delta: "+12.5%",
    stat_note_title: "More Time For What You Love",
    stat_note_body: "Spend less time on admin and more time with your clients.",
  },
};

export const defaultHomeContent: HomeContent = DEFAULTS;

export type FeaturesContent = {
  hero: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
    highlights: Highlight[];
  };
  feature_grid: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    categories: { id: string; label: string; icon: IconName }[];
    features: {
      title: string;
      description: string;
      category: string;
      icon: IconName;
      href: string;
    }[];
  };
  platform_showcase: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    body: string;
    image_url: string;
    image_alt: string;
    benefits: Highlight[];
  };
  stats_bar: {
    stats: { icon: IconName; value: string; label: string }[];
  };
  cta_banner: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    body: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
  };
};

export type FeaturesSectionKey = keyof FeaturesContent;

export const FEATURES_SECTION_ORDER: FeaturesSectionKey[] = [
  "hero",
  "feature_grid",
  "platform_showcase",
  "stats_bar",
  "cta_banner",
];

const FEATURES_DEFAULTS: FeaturesContent = {
  hero: {
    eyebrow: "Features",
    heading: "Everything You Need to",
    heading_accent: "Run Your Salon Smarter",
    subheading:
      "SalonAI comes with all the tools you need to manage your salon efficiently, delight your clients, and grow your business faster than ever.",
    cta_label: "Book a Demo",
    cta_href: "/request-demo",
    secondary_cta_label: "Our Story",
    secondary_cta_href: "/about",
    image_url: "",
    image_alt: "SalonAI Dashboard Interface",
    highlights: [
      { icon: "Sparkles", title: "Easy to Use", desc: "Onboard in minutes." },
      { icon: "Cpu", title: "AI-Powered", desc: "Smarter workflows." },
      { icon: "ShieldCheck", title: "Secure & Reliable", desc: "Your data is safe." },
      { icon: "Cloud", title: "Cloud Based", desc: "Access anywhere." },
    ],
  },
  feature_grid: {
    eyebrow: "Everything Included",
    heading: "Explore Our",
    heading_accent: "Powerful Features",
    categories: [
      { id: "all", label: "All Features", icon: "LayoutGrid" },
      { id: "bookings", label: "Bookings", icon: "Calendar" },
      { id: "customers", label: "Customers", icon: "Users" },
      { id: "staff", label: "Staff", icon: "UserCheck" },
      { id: "business", label: "Business", icon: "Briefcase" },
      { id: "marketing", label: "Marketing", icon: "Megaphone" },
      { id: "reports", label: "Reports", icon: "BarChart3" },
      { id: "integrations", label: "Integrations", icon: "Puzzle" },
    ],
    features: [
      { title: "Online Booking", description: "Let clients book appointments 24/7 with real-time availability and instant confirmation.", category: "bookings", icon: "Calendar", href: "/features/booking" },
      { title: "Customer Management", description: "Store customer profiles, history, preferences, notes and keep relationships stronger.", category: "customers", icon: "Users", href: "/features/customers" },
      { title: "Staff Management", description: "Manage staff roles, schedules, commissions and performance in one place.", category: "staff", icon: "UserCheck", href: "/features/staff" },
      { title: "Service Management", description: "Organize services, duration, pricing and resources effortlessly.", category: "business", icon: "Scissors", href: "/features/services" },
      { title: "Payments & Invoices", description: "Accept payments, generate invoices and manage refunds securely.", category: "business", icon: "CreditCard", href: "/features/payments" },
      { title: "Loyalty Programs", description: "Build customer loyalty with points, rewards, memberships and special offers.", category: "marketing", icon: "Gift", href: "/features/loyalty" },
      { title: "SMS & Email Notifications", description: "Send automated reminders, promotions and personalized messages.", category: "marketing", icon: "Bell", href: "/features/notifications" },
      { title: "Reports & Analytics", description: "Get real-time insights and detailed reports to grow your business.", category: "reports", icon: "BarChart3", href: "/features/analytics" },
      { title: "AI Insights", description: "AI-powered recommendations to optimize bookings, staff and services.", category: "reports", icon: "Sparkles", href: "/features/ai" },
      { title: "Multi-branch Management", description: "Manage multiple branches seamlessly from a single dashboard.", category: "business", icon: "Network", href: "/features/multi-branch" },
      { title: "Roles & Permissions", description: "Set custom roles and permissions to keep your data secure and organized.", category: "staff", icon: "ShieldCheck", href: "/features/permissions" },
      { title: "Integrations", description: "Connect with your favorite tools like accounting, marketing and payment gateways.", category: "integrations", icon: "Puzzle", href: "/features/integrations" },
    ],
  },
  platform_showcase: {
    eyebrow: "Platform",
    heading: "A Powerful Platform",
    heading_accent: "Designed for Your Success",
    body: "SalonAI is more than just software. It's a complete management solution that helps you save time, improve customer experience and grow your salon.",
    image_url: "",
    image_alt: "SalonAI Laptop and Mobile App Interface",
    benefits: [
      { icon: "Clock", title: "Save Time", desc: "Automate tasks and focus on what matters most." },
      { icon: "Globe", title: "Work from Anywhere", desc: "Access your salon data anytime, on any device." },
      { icon: "Shield", title: "Increase Revenue", desc: "Boost sales with smart insights and retention." },
      { icon: "Zap", title: "Scalable Solution", desc: "From single salons to large enterprises." },
      { icon: "Smile", title: "Delight Customers", desc: "Provide exceptional service and experience." },
      { icon: "RefreshCw", title: "Always Improving", desc: "We innovate and ship new features regularly." },
    ],
  },
  stats_bar: {
    stats: [
      { icon: "Users", value: "10,000+", label: "Salons Worldwide" },
      { icon: "Smile", value: "500K+", label: "Happy Customers" },
      { icon: "CalendarCheck", value: "1M+", label: "Appointments Managed" },
      { icon: "TrendingUp", value: "95%", label: "Customer Satisfaction" },
      { icon: "Headset", value: "24/7", label: "Customer Support" },
    ],
  },
  cta_banner: {
    eyebrow: "Get Started",
    heading: "Ready to Experience",
    heading_accent: "All Features?",
    body: "Join thousands of salon owners who are running their business smarter with SalonAI.",
    cta_label: "Book a Demo",
    cta_href: "/request-demo",
    secondary_cta_label: "Contact Sales",
    secondary_cta_href: "/contact",
    image_url: "",
    image_alt: "SalonAI Dashboard",
  },
};

export const defaultFeaturesContent: FeaturesContent = FEATURES_DEFAULTS;

export type AboutContent = {
  hero: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
    highlights: { icon: string; title: string; desc: string }[];
  };
  mission_stats: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    mission_title: string;
    mission_body: string;
    vision_title: string;
    vision_body: string;
    stats: { value: string; label: string }[];
  };
  journey: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    milestones: { icon: string; title: string; desc: string }[];
  };
  team: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    members: { name: string; role: string; image_url: string }[];
  };
  why_choose: {
    heading: string;
    heading_accent: string;
    features: { title: string; desc: string }[];
  };
};

export type AboutSectionKey = keyof AboutContent;

export const ABOUT_SECTION_ORDER: AboutSectionKey[] = [
  "hero",
  "mission_stats",
  "journey",
  "team",
  "why_choose",
];

const ABOUT_DEFAULTS: AboutContent = {
  hero: {
    eyebrow: "About SalonAI",
    heading: "Building Intelligent",
    heading_accent: "Solutions for Modern Salons",
    subheading:
      "SalonAI is more than just software — it's our commitment to empower salon and beauty businesses with AI-powered tools that simplify operations, delight customers, and drive growth.",
    cta_label: "Book a Demo",
    cta_href: "/request-demo",
    secondary_cta_label: "Explore Features",
    secondary_cta_href: "/features",
    image_url: "",
    image_alt: "SalonAI platform overview",
    highlights: [
      { icon: "Sparkles", title: "AI-Powered", desc: "Smarter tools, less admin." },
      { icon: "Users", title: "10,000+ Salons", desc: "Trusted worldwide." },
      { icon: "TrendingUp", title: "Proven Growth", desc: "Real results, daily." },
      { icon: "ShieldCheck", title: "Secure", desc: "Enterprise-grade data safety." },
    ],
  },
  mission_stats: {
    eyebrow: "Our Mission",
    heading: "Our Mission, Vision",
    heading_accent: "& Values",
    subheading:
      "We are driven by a purpose to transform the beauty and wellness industry through innovation and technology.",
    mission_title: "Our Mission",
    mission_body:
      "To simplify salon management and empower businesses with AI-driven tools that enhance productivity, improve customer experience, and drive growth.",
    vision_title: "Our Vision",
    vision_body:
      "To be the leading intelligent salon management platform, powering every salon to achieve excellence and scale effortlessly.",
    stats: [
      { value: "10,000+", label: "Salons Worldwide" },
      { value: "500K+", label: "Happy Customers" },
      { value: "1M+", label: "Appointments Managed" },
      { value: "95%", label: "Customer Satisfaction" },
      { value: "24/7", label: "Customer Support" },
    ],
  },
  journey: {
    eyebrow: "Our Journey",
    heading: "Milestones That",
    heading_accent: "Shaped Us",
    milestones: [
      {
        icon: "Sparkles",
        title: "The Beginning",
        desc: "SalonAI was founded with a vision to modernize salon operations with technology and innovation.",
      },
      {
        icon: "Rocket",
        title: "Early Growth",
        desc: "We launched our platform and onboarded our first 1,000+ salons, improving bookings and operations.",
      },
      {
        icon: "BarChart2",
        title: "Expanding Features",
        desc: "AI features, analytics, loyalty programs, and mobile apps were introduced to empower salons even more.",
      },
      {
        icon: "Globe",
        title: "Global Reach",
        desc: "We reached 10,000+ salons worldwide and continue to grow our global community every day.",
      },
      {
        icon: "Star",
        title: "What's Next",
        desc: "We're building the future of salon management with smarter AI, more integrations, and limitless possibilities.",
      },
    ],
  },
  team: {
    eyebrow: "Our Team",
    heading: "The Team Behind",
    heading_accent: "SalonAI",
    subheading:
      "We are a passionate team of innovators, designers, engineers, and dreamers working together to build technology that makes a real impact.",
    members: [
      { name: "Alex Johnson", role: "Lead Software Engineer", image_url: "" },
      { name: "Priya Sharma", role: "Head of Product", image_url: "" },
      { name: "Marcus Lee", role: "AI & Data Lead", image_url: "" },
      { name: "Sara Bennett", role: "Customer Success", image_url: "" },
      { name: "Daniel Osei", role: "Design Lead", image_url: "" },
    ],
  },
  why_choose: {
    heading: "Why Salons Choose",
    heading_accent: "SalonAI",
    features: [
      { title: "Easy to Use", desc: "Simple, intuitive and built for salons of all sizes." },
      { title: "AI-Powered", desc: "Smart insights and automation to save time and grow faster." },
      {
        title: "Secure & Reliable",
        desc: "Enterprise-grade security to keep your data safe and protected.",
      },
      { title: "Scalable", desc: "From single salons to multi-branch enterprises." },
      {
        title: "Always Improving",
        desc: "We listen, we innovate and we continuously make things better.",
      },
    ],
  },
};

export const defaultAboutContent: AboutContent = ABOUT_DEFAULTS;

type ApiSection = {
  key: string;
  sortOrder?: number;
  isVisible?: boolean;
  content?: Record<string, unknown>;
};

/** Drops empty strings so a blank admin field falls back to the default. */
function mergeSection<T extends object>(defaults: T, content: Record<string, unknown>): T {
  const merged: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const [key, value] of Object.entries(content)) {
    if (value === null || value === undefined) continue;
    if (value === "" && merged[key]) continue;
    if (!(key in merged)) continue;
    merged[key] = value;
  }
  return merged as T;
}

/** Overlays the CMS payload for one page over that page's built-in defaults. */
function applyApiSections<T extends Record<string, object>>(
  defaults: T,
  order: readonly string[],
  sections: ApiSection[]
): { content: T; hidden: Set<string> } {
  const content = JSON.parse(JSON.stringify(defaults)) as Record<string, object>;
  const source = defaults as Record<string, object>;
  const hidden = new Set<string>();

  for (const section of sections) {
    if (!section || !order.includes(section.key)) continue;
    const key = section.key;
    if (!(key in source)) continue;

    if (section.isVisible === false) {
      hidden.add(key);
      continue;
    }
    content[key] = mergeSection(source[key], section.content ?? {});
  }

  return { content: content as T, hidden };
}

export function applyHomeApiSections(sections: ApiSection[]): {
  content: HomeContent;
  hidden: Set<HomeSectionKey>;
} {
  const { content, hidden } = applyApiSections(DEFAULTS, HOME_SECTION_ORDER, sections);
  return { content, hidden: hidden as Set<HomeSectionKey> };
}

/**
 * Turns a CMS image value into something the browser can load.
 *
 * Uploads live in the Admin app, so `/uploads/...` has to be pointed at the
 * Admin origin. Absolute URLs and Client-local `/images/...` paths pass through.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  const value = (url ?? "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/uploads/")) {
    const base = (process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001").replace(/\/$/, "");
    return `${base}${value}`;
  }
  return value;
}

function adminBaseUrl(): string {
  return (process.env.CONTENT_API_URL || "http://localhost:3001").replace(/\/$/, "");
}

const VIDEO_EXT_PATH = /\.(mp4|webm|mov|ogv)$/i;

/**
 * Section media fields accept an image or a video, so callers need to know
 * which one they got before reaching for `next/image`.
 */
export function isVideoPath(url: string | undefined | null): boolean {
  if (!url) return false;
  return VIDEO_EXT_PATH.test(url.split("?")[0].split("#")[0]);
}

/** Server side only: reads one page's content from the Admin CMS. */
async function fetchPageContent<T extends Record<string, object>>(
  slug: string,
  defaults: T,
  order: readonly string[]
): Promise<{ content: T; hidden: Set<string>; source: "cms" | "defaults" }> {
  const base = adminBaseUrl();
  if (!base) return { content: defaults, hidden: new Set(), source: "defaults" };

  try {
    const res = await fetch(`${base}/api/public/content/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    const sections: ApiSection[] = Array.isArray(data?.sections) ? data.sections : [];
    if (!sections.length) throw new Error("CMS returned no sections");

    return { ...applyApiSections(defaults, order, sections), source: "cms" };
  } catch {
    // Never let a CMS outage take the marketing site down.
    return { content: defaults, hidden: new Set(), source: "defaults" };
  }
}

/** Server side only: reads the home page content from the Admin CMS. */
export function getHomeContent(): Promise<{
  content: HomeContent;
  hidden: Set<HomeSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("home", DEFAULTS, HOME_SECTION_ORDER) as Promise<{
    content: HomeContent;
    hidden: Set<HomeSectionKey>;
    source: "cms" | "defaults";
  }>;
}

/** Server side only: reads the features page content from the Admin CMS. */
export function getFeaturesContent(): Promise<{
  content: FeaturesContent;
  hidden: Set<FeaturesSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("features", FEATURES_DEFAULTS, FEATURES_SECTION_ORDER) as Promise<{
    content: FeaturesContent;
    hidden: Set<FeaturesSectionKey>;
    source: "cms" | "defaults";
  }>;
}

/** Server side only: reads the about page content from the Admin CMS. */
export function getAboutContent(): Promise<{
  content: AboutContent;
  hidden: Set<AboutSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("about", ABOUT_DEFAULTS, ABOUT_SECTION_ORDER) as Promise<{
    content: AboutContent;
    hidden: Set<AboutSectionKey>;
    source: "cms" | "defaults";
  }>;
}
