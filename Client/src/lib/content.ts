import { images } from "@/assets";
import heroVideo from "@/assets/images/home_hero.mp4";
import { fetchCmsFaqCategories, fetchHomeCmsFaqs, type CmsFaq } from "@/lib/cms/faqs";
import { fetchCmsFeaturePosts } from "@/lib/cms/features";

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
  title: string;
  desc: string;
};

export type HomeContent = {
  hero: {
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
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    features: {
      title: string;
      description: string;
      /** detail page slug, when the card came from a feature post */
      slug?: string;
      image_url?: string;
    }[];
  };
  product_preview: {
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
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    plans: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      image_url?: string;
      image_alt?: string;
      featured: boolean;
      badge: string;
      cta_label: string;
      cta_href: string;
    }[];
  };
  testimonials: {
    heading: string;
    heading_accent: string;
    subheading: string;
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
    categories: { id: string; label: string; icon: IconName; slug?: string }[];
    faqs: { question: string; answer: string; category?: string }[];
  };
  cta_banner: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    image_url: string;
    image_alt: string;
    features: { title: string }[];
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
  about_why: images.features2,
  blog_cover: images.product,
} as const;

const DEFAULTS: HomeContent = {
  hero: {
    heading: "Empower Your Salon",
    heading_accent: "Business",
    subheading:
      "Simplify bookings, manage staff, delight your customers and grow your salon with SalonAI — built for modern beauty businesses.",
    cta_label: "Get Started Today",
    cta_href: "/request-demo",
    secondary_cta_label: "Watch Video",
    secondary_cta_href: "#watch-video",
    secondary_cta_sub: "See how it works",
    image_url: heroVideo,
    image_alt: "SalonAI mobile app mockups in a modern salon",
    highlights: [
      { title: "Easy Booking", desc: "24/7 online appointments." },
      { title: "Manage Staff", desc: "Save time, work smarter." },
      { title: "Grow Revenue", desc: "Insights & reports." },
      { title: "Secure & Reliable", desc: "Your data is safe." },
    ],
  },
  features_overview: {
    heading: "Everything You Need to",
    heading_accent: "Run Your Salon Smarter",
    subheading:
      "Powerful tools to manage your salon, save time and deliver a better experience — all in one place.",
    cta_label: "See more",
    cta_href: "/features",
    features: [
      {
        title: "Booking Management",
        description: "Manage appointments, schedule and walk-ins effortlessly.",
      },
      {
        title: "Staff Management",
        description: "Organize staff, roles, commissions and performance.",
      },
      {
        title: "Customer Management",
        description: "Keep customer profiles, history, notes and preferences.",
      },
      {
        title: "AI Features",
        description: "Manage appointments with AI-powered workflows effortlessly.",
      },
    ],
  },
  product_preview: {
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
        title: "Easy Navigation",
        desc: "A clean and intuitive interface for everyone.",
      },
      {
        title: "Real-time Updates",
        desc: "Stay in sync with bookings, staff and customers.",
      },
      {
        title: "Advanced Analytics",
        desc: "Track performance and grow with clear insights.",
      },
      {
        title: "Secure & Cloud Based",
        desc: "Your salon data stays protected and accessible.",
      },
    ],
  },
  pricing: {
    heading: "Simple,",
    heading_accent: "Transparent Pricing",
    subheading:
      "Choose the plan that fits your salon. Upgrade, downgrade or cancel anytime — no hidden fees.",
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
    heading: "Loved by",
    heading_accent: "Salon Owners",
    subheading:
      "Real stories from salon owners who are growing their business with SalonAI.",
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
        category: "general",
        question: "What is SalonAI?",
        answer:
          "SalonAI is an all-in-one salon management platform that helps you handle bookings, staff, customers, and growth from one place.",
      },
      {
        category: "general",
        question: "Who is SalonAI built for?",
        answer:
          "SalonAI is designed for salons, spas, barbershops, and beauty studios of any size, from a single chair to multi-branch chains.",
      },
      {
        category: "general",
        question: "How long does it take to get started?",
        answer:
          "Most salons are up and running within a day. Import your services and staff, connect your calendar, and start taking bookings right away.",
      },
      {
        category: "general",
        question: "Do you offer onboarding support?",
        answer:
          "Yes. Every plan includes guided onboarding, and our support team is happy to help you import data and set up your workflow.",
      },
      {
        category: "general",
        question: "Can I use SalonAI on any device?",
        answer:
          "Yes. SalonAI runs in the browser and includes iOS and Android apps so you and your team can work from anywhere.",
      },
      {
        category: "features",
        question: "Can I manage multiple branches?",
        answer:
          "Absolutely. Higher plans support multi-branch management with shared reporting and staff controls.",
      },
      {
        category: "features",
        question: "Does SalonAI support online bookings?",
        answer:
          "Yes. Clients can book 24/7 through your booking page with real-time availability and instant confirmation.",
      },
      {
        category: "features",
        question: "Can I manage staff schedules and commissions?",
        answer:
          "Yes. You can set shifts, track performance, and calculate staff commissions automatically from one dashboard.",
      },
      {
        category: "features",
        question: "Does SalonAI send appointment reminders?",
        answer:
          "Yes. Automated SMS and email reminders help reduce no-shows and keep your clients on schedule.",
      },
      {
        category: "features",
        question: "Can I generate reports on bookings and revenue?",
        answer:
          "Yes. Real-time reports give you insights into bookings, revenue, staff performance, and client retention.",
      },
      {
        category: "billing",
        question: "Is there a free trial?",
        answer:
          "Yes. You can start with a free trial and explore the full platform before choosing a plan.",
      },
      {
        category: "billing",
        question: "How much does SalonAI cost?",
        answer:
          "Plans start at an affordable monthly rate and scale with your salon. Check the pricing page for the latest details.",
      },
      {
        category: "billing",
        question: "Can I change my plan later?",
        answer:
          "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.",
      },
      {
        category: "billing",
        question: "Do you offer refunds?",
        answer:
          "Yes. We offer a 30-day money-back guarantee if you are not satisfied with the platform.",
      },
      {
        category: "billing",
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards, and annual plans can be paid by invoice on request.",
      },
      {
        category: "security",
        question: "Is my data secure?",
        answer:
          "Yes. SalonAI uses secure cloud infrastructure with encryption and reliable backups to protect your salon data.",
      },
      {
        category: "security",
        question: "Where is my salon data stored?",
        answer:
          "Your data is stored in secure, industry-standard cloud data centers with strict access controls.",
      },
      {
        category: "security",
        question: "Do you back up my data?",
        answer:
          "Yes. We run automatic daily backups so your bookings, clients, and payments are always protected.",
      },
      {
        category: "security",
        question: "Is SalonAI GDPR compliant?",
        answer:
          "Yes. We follow strict data-protection and privacy rules to keep your information secure and compliant.",
      },
      {
        category: "security",
        question: "Who can access my salon's data?",
        answer:
          "Only the users you authorize. Role-based permissions let you control exactly what each staff member can see and do.",
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
    image_url: "",
    image_alt: "Salon professional at work",
    features: [
      { title: "Easy Setup" },
      { title: "Dedicated Support" },
      { title: "Grow Faster" },
    ],
  },
};

export const defaultHomeContent: HomeContent = DEFAULTS;

/**
 * Static FAQ content used by the FAQ page when neither the CMS nor the `faqs`
 * table returns any questions, so the page always renders a full set of
 * categories and answers instead of an empty state.
 */
export const defaultFaqPageContent: HomeContent["faq"] = {
  eyebrow: "Browse",
  heading: "Answers",
  heading_accent: "by Category",
  subheading: "Browse questions and answers.",
  cta_label: "Contact Support →",
  cta_href: "/contact",
  categories: [
    { id: "general", label: "General", icon: "BookOpen", slug: "" },
    { id: "billing", label: "Billing", icon: "Settings2", slug: "billing" },
    { id: "product", label: "Product", icon: "Sparkles", slug: "product" },
    { id: "features", label: "Features", icon: "LayoutGrid", slug: "features" },
    { id: "security", label: "Security", icon: "Shield", slug: "security" },
    { id: "support", label: "Support", icon: "LifeBuoy", slug: "support" },
  ],
  faqs: [
    {
      category: "General",
      question: "What is SalonAI?",
      answer:
        "SalonAI is an all-in-one salon management platform that helps you handle bookings, staff, customers, and growth from one place.",
    },
    {
      category: "General",
      question: "Who is SalonAI built for?",
      answer:
        "SalonAI is designed for salons, spas, barbershops, and beauty studios of any size, from a single chair to multi-branch chains.",
    },
    {
      category: "General",
      question: "How long does it take to get started?",
      answer:
        "Most salons are up and running within a day. Import your services and staff, connect your calendar, and start taking bookings right away.",
    },
    {
      category: "General",
      question: "Can I use SalonAI on any device?",
      answer:
        "Yes. SalonAI runs in the browser and includes iOS and Android apps so you and your team can work from anywhere.",
    },
    {
      category: "General",
      question: "Can I import my existing customer data?",
      answer:
        "Yes. You can import your existing customers, services and appointments from a spreadsheet or a previous system, and our team can help.",
    },
    {
      category: "Billing",
      question: "Is there a free trial?",
      answer:
        "Yes. You can start with a free trial and explore the full platform before choosing a plan.",
    },
    {
      category: "Billing",
      question: "How much does SalonAI cost?",
      answer:
        "Plans start at an affordable monthly rate and scale with your salon. Check the pricing page for the latest details.",
    },
    {
      category: "Billing",
      question: "Can I change my plan later?",
      answer:
        "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.",
    },
    {
      category: "Billing",
      question: "Do you offer refunds?",
      answer:
        "Yes. We offer a 30-day money-back guarantee if you are not satisfied with the platform.",
    },
    {
      category: "Billing",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards, and annual plans can be paid by invoice on request.",
    },
    {
      category: "Product",
      question: "Can I manage multiple branches?",
      answer:
        "Absolutely. Higher plans support multi-branch management with shared reporting and staff controls.",
    },
    {
      category: "Product",
      question: "Does SalonAI support online bookings?",
      answer:
        "Yes. Clients can book 24/7 through your booking page with real-time availability and instant confirmation.",
    },
    {
      category: "Product",
      question: "Can I manage staff schedules and commissions?",
      answer:
        "Yes. You can set shifts, track performance, and calculate staff commissions automatically from one dashboard.",
    },
    {
      category: "Product",
      question: "Does SalonAI send appointment reminders?",
      answer:
        "Yes. Automated SMS and email reminders help reduce no-shows and keep your clients on schedule.",
    },
    {
      category: "Product",
      question: "Does SalonAI work offline?",
      answer:
        "Your data syncs to the cloud, and the mobile apps let you keep working so updates are saved as soon as you are back online.",
    },
    {
      category: "Features",
      question: "Can I track inventory and retail products?",
      answer:
        "Yes. Track stock levels, get low-stock alerts, and sell retail products directly from the till.",
    },
    {
      category: "Features",
      question: "Can I create loyalty programs?",
      answer:
        "Yes. Build points, rewards and memberships to keep your clients coming back and spending more.",
    },
    {
      category: "Features",
      question: "Does SalonAI handle payments and invoices?",
      answer:
        "Yes. Accept payments, generate invoices and manage refunds securely from the platform.",
    },
    {
      category: "Features",
      question: "Can I send marketing campaigns?",
      answer:
        "Yes. Send targeted SMS and email promotions to the right clients at the right time.",
    },
    {
      category: "Features",
      question: "Does SalonAI offer reports and analytics?",
      answer:
        "Yes. Real-time dashboards show bookings, revenue, staff performance and client retention.",
    },
    {
      category: "Security",
      question: "Is my data secure?",
      answer:
        "Yes. SalonAI uses secure cloud infrastructure with encryption and reliable backups to protect your salon data.",
    },
    {
      category: "Security",
      question: "Where is my data stored?",
      answer:
        "Your data is stored in secure, industry-standard cloud data centers with strict access controls.",
    },
    {
      category: "Security",
      question: "Do you back up my data?",
      answer:
        "Yes. We run automatic daily backups so your bookings, clients and payments are always protected.",
    },
    {
      category: "Security",
      question: "Is SalonAI GDPR compliant?",
      answer:
        "Yes. We follow strict data-protection and privacy rules to keep your information secure and compliant.",
    },
    {
      category: "Security",
      question: "Who can access my salon's data?",
      answer:
        "Only the users you authorize. Role-based permissions let you control exactly what each staff member can see and do.",
    },
    {
      category: "Support",
      question: "How do I contact support?",
      answer:
        "You can reach our team by email or live chat from inside the app, and we aim to reply as quickly as possible.",
    },
    {
      category: "Support",
      question: "Do you offer onboarding and training?",
      answer:
        "Yes. Every plan includes guided onboarding, and higher plans include personalised training sessions.",
    },
    {
      category: "Support",
      question: "Is there a knowledge base or help center?",
      answer:
        "Yes. Our help center has step-by-step guides, videos and answers to the most common questions.",
    },
    {
      category: "Support",
      question: "What are your support hours?",
      answer:
        "Our support team is available on business days, and urgent issues are prioritised around the clock.",
    },
    {
      category: "Support",
      question: "Can you help migrate my data from another system?",
      answer:
        "Yes. Our team can help you import customers, services and appointments from your current system.",
    },
  ],
};

export type FeaturesContent = {
  hero: {
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
  };
  feature_grid: {
    heading: string;
    heading_accent: string;
    categories: { id: string; label: string }[];
    features: {
      title: string;
      description: string;
      category: string;
      icon: IconName;
      href: string;
      /** detail page URL at `/features/<slug>` */
      slug?: string;
      image_url?: string;
      image_alt?: string;
    }[];
  };
  platform_showcase: {
    heading: string;
    heading_accent: string;
    body: string;
    /** CMS uploads for the photo collage; blank falls back to the bundled images. */
    image_left?: string;
    image_center?: string;
    image_right?: string;
    benefits: { title: string; desc: string }[];
  };
};

export type FeaturesSectionKey = keyof FeaturesContent;

export const FEATURES_SECTION_ORDER: FeaturesSectionKey[] = [
  "hero",
  "feature_grid",
  "platform_showcase",
];

const FEATURES_DEFAULTS: FeaturesContent = {
  hero: {
    heading: "Everything You Need to",
    heading_accent: "Run Your Salon Smarter",
    subheading:
      "SalonAI comes with all the tools you need to manage your salon efficiently, delight your clients, and grow your business faster than ever.",
    cta_label: "Book a Demo",
    cta_href: "/request-demo",
    secondary_cta_label: "Our Story",
    secondary_cta_href: "/about",
  },
  feature_grid: {
    heading: "Explore Our",
    heading_accent: "Powerful Features",
    categories: [
      { id: "all", label: "All Features" },
      { id: "bookings", label: "Bookings" },
      { id: "customers", label: "Customers" },
      { id: "staff", label: "Staff" },
      { id: "business", label: "Business" },
      { id: "marketing", label: "Marketing" },
      { id: "reports", label: "Reports" },
      { id: "integrations", label: "Integrations" },
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
    heading: "A Powerful Platform",
    heading_accent: "Designed for Your Success",
    body: "SalonAI is more than just software. It's a complete management solution that helps you save time, improve customer experience and grow your salon.",
    image_left: "",
    image_center: "",
    image_right: "",
    benefits: [
      { title: "Save Time", desc: "Automate tasks and focus on what matters most." },
      { title: "Work from Anywhere", desc: "Access your salon data anytime, on any device." },
      { title: "Increase Revenue", desc: "Boost sales with smart insights and retention." },
      { title: "Scalable Solution", desc: "From single salons to large enterprises." },
      { title: "Delight Customers", desc: "Provide exceptional service and experience." },
      { title: "Always Improving", desc: "We innovate and ship new features regularly." },
    ],
  },
};

export const defaultFeaturesContent: FeaturesContent = FEATURES_DEFAULTS;

/**
 * One feature card plus the body of its own detail page, served at
 * `/features/<slug>` when "Learn more" is clicked on the features grid.
 *
 * The card fields double as the detail page header, so the summary and hero are
 * always in step with the grid.
 */
export type FeaturePost = {
  id: number;
  title: string;
  slug: string;
  description: string;
  /** markdown body of the detail page */
  content?: string;
  category: string;
  icon: IconName;
  image_url: string;
  image_alt: string;
  /** external link, when it replaces the detail page */
  href?: string;
  sort_order: number;
};

export type AboutContent = {
  hero: {
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
  };
  mission_stats: {
    heading: string;
    heading_accent: string;
    subheading: string;
    mission_title: string;
    mission_body: string;
    vision_title: string;
    vision_body: string;
  };
  journey: {
    heading: string;
    heading_accent: string;
    milestones: { title: string; desc: string }[];
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
    subheading: string;
    image_url: string;
    features: { title: string; desc: string }[];
  };
};

export type AboutSectionKey = keyof AboutContent;

export const ABOUT_SECTION_ORDER: AboutSectionKey[] = [
  "hero",
  "mission_stats",
  "team",
  "journey",
  "why_choose",
];

export type PricingPlan = {
  name: string;
  icon?: IconName;
  monthly: string;
  annual: string;
  billed?: string;
  billedMonthly?: string;
  desc?: string;
  description?: string;
  features: string[];
  /** Optional per-plan image or video, uploaded from the admin. */
  image_url?: string;
  image_alt?: string;
  featured: boolean;
  badge?: string;
  cta: string;
  cta_label?: string;
  href: string;
  cta_href?: string;
};

/** One line of the comparison table. Each cell is either text or a tick. */
export type PricingComparisonValue = {
  value?: string;
  yes?: boolean;
};

export type PricingComparisonRow = {
  icon?: IconName;
  name: string;
  values: PricingComparisonValue[];
};

export type PricingIncludedItem = {
  title: string;
  desc?: string;
};

export type PricingFaq = {
  question: string;
  answer: string;
};

export type PricingContent = {
  hero: {
    heading: string;
    heading_accent?: string;
    subheading: string;
    monthly_label?: string;
    annual_label?: string;
    per_month_suffix?: string;
  };
pricing_cards: {
    plans: PricingPlan[];
    /** Shown when every package is unpublished or deleted. */
    empty_message?: string;
  };
  comparison: {
    heading?: string;
    subheading?: string;
    feature_column_label?: string;
    plan_columns?: string[];
    rows?: PricingComparisonRow[];
  };
  closing_cta?: {
    title?: string;
    subtitle?: string;
    cta_label?: string;
    cta_href?: string;
    secondary_cta_label?: string;
    secondary_cta_href?: string;
    image_url?: string;
    image_alt?: string;
  };
  banner?: {
    strip_heading?: string;
    items?: PricingIncludedItem[];
  };
  faq_cta?: {
    heading?: string;
    subheading?: string;
    faqs?: PricingFaq[];
    cta_heading?: string;
    cta_heading_accent?: string;
    cta_subheading?: string;
    cta_label?: string;
    cta_href?: string;
    cta_secondary_label?: string;
    cta_secondary_href?: string;
    image_url?: string;
    image_alt?: string;
  };
};

export type ContactContent = {
  hero: {
    heading: string;
    subheading: string;
    image_url: string;
    image_alt: string;
  };
  contact_form: {
    heading: string;
    subheading: string;
    name_label: string;
    name_placeholder: string;
    email_label: string;
    email_placeholder: string;
    phone_label: string;
    phone_placeholder: string;
    subject_label: string;
    subject_placeholder: string;
    message_label: string;
    message_placeholder: string;
    submit_label: string;
    success_message: string;
    privacy_note: string;
    details_heading: string;
    socials_heading: string;
    details: { icon: IconName; label: string; value: string }[];
    subjects: string[];
  };
  location_map: {
    heading: string;
    body: string;
    address: string;
    map_query: string;
    directions_label: string;
    directions_href: string;
  };
};

/**
 * Closing CTA banner shared with the request-demo page. The contact page no
 * longer renders one, so this type no longer lives inside `ContactContent`.
 */
export type ContactCtaBannerContent = {
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
};

export type ContactSectionKey = keyof ContactContent;

export const CONTACT_SECTION_ORDER: ContactSectionKey[] = [
  "hero",
  "contact_form",
  "location_map",
];

const ABOUT_DEFAULTS: AboutContent = {
  hero: {
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
  },
  mission_stats: {
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
  },
  journey: {
    heading: "Milestones That",
    heading_accent: "Shaped Us",
    milestones: [
      {
        title: "The Beginning",
        desc: "SalonAI was founded with a vision to modernize salon operations with technology and innovation.",
      },
      {
        title: "Early Growth",
        desc: "We launched our platform and onboarded our first 1,000+ salons, improving bookings and operations.",
      },
      {
        title: "Expanding Features",
        desc: "AI features, analytics, loyalty programs, and mobile apps were introduced to empower salons even more.",
      },
      {
        title: "Global Reach",
        desc: "We reached 10,000+ salons worldwide and continue to grow our global community every day.",
      },
      {
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
      { name: "Elena Rodriguez", role: "Marketing Lead", image_url: "" },
      { name: "Tom Becker", role: "Backend Engineer", image_url: "" },
    ],
  },
  why_choose: {
    heading: "Why Salons Choose",
    heading_accent: "SalonAI",
    subheading:
      "Everything you need to run and grow a modern salon — powerful enough for enterprises, simple enough for a single chair.",
    image_url: "",
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

const PRICING_DEFAULTS: PricingContent = {
  hero: {
    heading: "Simple, Transparent",
    heading_accent: "Pricing for Every Salon",
    subheading: "Choose the perfect plan for your salon. Upgrade, downgrade or cancel anytime.",
    monthly_label: "Monthly",
    annual_label: "Annual",
    per_month_suffix: "/month",
  },
  pricing_cards: {
    plans: [
      {
        name: "Starter",
        icon: "Send",
        monthly: "$25",
        annual: "$19",
        billed: "Billed annually $228",
        billedMonthly: "Billed monthly",
        desc: "Perfect for small salons just getting started.",
        features: ["Up to 2 Staff", "Booking Management", "Customer Management", "Email Support"],
        featured: false,
        cta: "Get Started",
        href: "/request-demo",
      },
      {
        name: "Growth",
        icon: "TrendingUp",
        monthly: "$49",
        annual: "$39",
        billed: "Billed annually $468",
        billedMonthly: "Billed monthly",
        desc: "Great for growing salons and beauty businesses.",
        features: [
          "Up to 10 Staff",
          "Everything in Starter",
          "Advanced Reports",
          "Loyalty Programs",
          "SMS & Email Notifications",
          "Priority Support",
        ],
        featured: true,
        cta: "Get Started",
        href: "/request-demo",
      },
      {
        name: "Pro",
        icon: "Crown",
        monthly: "$89",
        annual: "$69",
        billed: "Billed annually $828",
        billedMonthly: "Billed monthly",
        desc: "For large salons & multi-branch businesses.",
        features: [
          "Unlimited Staff",
          "Everything in Growth",
          "Multi-branch Management",
          "Custom Roles & Permissions",
          "24/7 Priority Support",
          "AI Insights & Analytics",
        ],
        featured: false,
        cta: "Get Started",
        href: "/request-demo",
      },
      {
        name: "Enterprise",
        icon: "Building2",
        monthly: "Custom",
        annual: "Custom",
        billed: "Let's build the best plan for your business.",
        billedMonthly: "Let's build the best plan for your business.",
        desc: "For large enterprises with custom requirements.",
        features: [
          "Everything in Pro",
          "Dedicated Account Manager",
          "White-label Options",
          "SLA & Custom Integrations",
          "Onboarding & Training",
        ],
        featured: false,
        cta: "Contact Sales",
        href: "/contact",
      },
    ],
  },
  comparison: {
    heading: "Compare Plans",
    subheading: "Find the perfect fit for your salon's size and growth goals.",
    feature_column_label: "Features",
    plan_columns: ["Starter", "Growth", "Pro", "Enterprise"],
    rows: [
      {
        icon: "Users",
        name: "Staff Users",
        values: [
          { value: "Up to 2" },
          { value: "Up to 10" },
          { value: "Unlimited" },
          { value: "Unlimited" },
        ],
      },
      { icon: "Calendar", name: "Bookings & Appointments", values: [{ yes: true }, { yes: true }, { yes: true }, { yes: true }] },
      { icon: "UserCheck", name: "Customer Management", values: [{ yes: true }, { yes: true }, { yes: true }, { yes: true }] },
      {
        icon: "BarChart2",
        name: "Reports & Analytics",
        values: [{ value: "Basic" }, { value: "Advanced" }, { value: "Advanced" }, { value: "Advanced + Custom" }],
      },
      { icon: "Sparkles", name: "AI Insights", values: [{}, { yes: true }, { yes: true }, { yes: true }] },
      { icon: "Gift", name: "Loyalty Programs", values: [{}, { yes: true }, { yes: true }, { yes: true }] },
      { icon: "Network", name: "Multi-branch Management", values: [{}, {}, { yes: true }, { yes: true }] },
      { icon: "ShieldCheck", name: "Custom Roles & Permissions", values: [{}, {}, { yes: true }, { yes: true }] },
      { icon: "Puzzle", name: "Custom Integrations", values: [{}, {}, {}, { yes: true }] },
      {
        icon: "Headphones",
        name: "Priority Support",
        values: [{ value: "Email" }, { value: "Priority" }, { value: "24/7 Priority" }, { value: "Dedicated" }],
      },
      { icon: "GraduationCap", name: "Onboarding & Training", values: [{}, {}, {}, { yes: true }] },
      { icon: "ShieldAlert", name: "SLA & Uptime Guarantee", values: [{}, {}, {}, { yes: true }] },
    ],
  },
  banner: {
    strip_heading: "All plans include",
    items: [
      {
        title: "Cloud Based",
        desc: "Your salon data lives securely in the cloud and stays synced across every device, so you can work from anywhere.",
      },
      {
        title: "Automatic Updates",
        desc: "New features, improvements and fixes are delivered automatically — no manual installs or downtime.",
      },
      {
        title: "Data Backup",
        desc: "Automatic daily backups keep your bookings, clients and records safe and recoverable.",
      },
      {
        title: "Mobile Apps",
        desc: "Run your salon on the go with dedicated iOS and Android apps for you and your team.",
      },
      {
        title: "GDPR Compliant",
        desc: "We follow strict data-protection and privacy rules to keep your information secure.",
      },
    ],
  },
  closing_cta: {
    title: "Still not sure\u00A0which\u00A0plan is right for you?",
    subtitle: "Our team is happy to help you choose the perfect plan for your salon.",
    cta_label: "Talk to Sales",
    cta_href: "/contact",
    secondary_cta_label: "Start Free Trial",
    secondary_cta_href: "#",
    image_url: "",
    image_alt: "SalonAI platform",
  },
  faq_cta: {
    heading: "Frequently Asked Questions",
    subheading: "Got questions? We've got answers.",
    faqs: [
      {
        question: "Can I change my plan later?",
        answer:
          "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.",
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes! We offer a 14-day free trial on all plans with no credit card required.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee if you are not satisfied with our platform.",
      },
      {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade encryption and daily automated backups.",
      },
      {
        question: "Can I manage multiple branches?",
        answer: "Yes, multi-branch management is supported on our Pro and Enterprise plans.",
      },
    ],
    cta_heading: "Ready to Transform",
    cta_heading_accent: "Your Salon?",
    cta_subheading:
      "Join thousands of salon owners who are streamlining their operations with SalonAI.",
    cta_label: "Book a Demo →",
    cta_href: "/request-demo",
    cta_secondary_label: "Contact Sales",
    cta_secondary_href: "/contact",
    image_url: "",
    image_alt: "SalonAI Dashboard Laptop View",
  },
};

const CONTACT_DEFAULTS: ContactContent = {
  hero: {
    heading: "Let’s build a better salon business together",
    subheading: "Have a question or want a demo? Reach out and we’ll help.",
    image_url: "",
    image_alt: "SalonAI support team",
  },
  contact_form: {
    heading: "Send Us a Message",
    subheading: "Fill out the form below and we'll get back to you within 24 hours.",
    name_label: "Full Name *",
    name_placeholder: "Enter your full name",
    email_label: "Email Address *",
    email_placeholder: "Enter your email",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your phone number",
    subject_label: "Subject *",
    subject_placeholder: "Select a subject",
    message_label: "Message *",
    message_placeholder: "Tell us how we can help you...",
    submit_label: "Send Message →",
    success_message: "Thanks! Your message has been sent. We'll get back to you shortly.",
    privacy_note: "Your information is safe with us.",
    details_heading: "Contact Information",
    socials_heading: "Follow Us",
    details: [
      { icon: "Mail", label: "Email Us", value: "hello@avenque.com" },
      { icon: "Phone", label: "Call Us", value: "+94 11 234 5678" },
      { icon: "MapPin", label: "Visit Our Office", value: "No. 123, Innovation Drive, Colombo 00500" },
    ],
    subjects: ["Sales & Pricing", "Technical Support"],
  },
  location_map: {
    heading: "Find Us",
    body: "Visit our office or get directions to meet with our team.",
    address: "No. 123, Innovation Drive, Colombo 00500, Sri Lanka",
    map_query: "Colombo Sri Lanka",
    directions_label: "Get Directions",
    directions_href: "https://maps.google.com/?q=Colombo+Sri+Lanka",
  },
};

export const defaultContactContent: ContactContent = CONTACT_DEFAULTS;
export const defaultPricingContent: PricingContent = PRICING_DEFAULTS;

/* -------------------------------------------------------------------------- */
/* Request Demo                                                               */
/* -------------------------------------------------------------------------- */

export type RequestDemoContent = {
  demo_hero: {
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
  };
  contact_form: ContactContent["contact_form"];
  cta_banner: ContactCtaBannerContent;
};

export type RequestDemoSectionKey = keyof RequestDemoContent;

export const REQUEST_DEMO_SECTION_ORDER: RequestDemoSectionKey[] = [
  "demo_hero",
  "contact_form",
  "cta_banner",
];

const REQUEST_DEMO_DEFAULTS: RequestDemoContent = {
  demo_hero: {
    eyebrow: "Book a Demo",
    heading: "See SalonAI",
    heading_accent: "in Action",
    subheading:
      "Tell us a bit about your salon and we'll schedule a personalized walkthrough.",
  },
  contact_form: {
    heading: "Send Us a Message",
    subheading: "Fill out the form below and we'll get back to you within 24 hours.",
    name_label: "Full Name *",
    name_placeholder: "Enter your full name",
    email_label: "Email Address *",
    email_placeholder: "Enter your email",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your phone number",
    subject_label: "Subject *",
    subject_placeholder: "Select a subject",
    message_label: "Message *",
    message_placeholder: "Tell us how we can help you...",
    submit_label: "Send Message →",
    success_message: "Thanks! Your message has been sent. We'll get back to you shortly.",
    privacy_note: "Your information is safe with us.",
    details_heading: "Contact Information",
    socials_heading: "Follow Us",
    details: [
      { icon: "Mail", label: "Email Us", value: "hello@avenque.com" },
      { icon: "Phone", label: "Call Us", value: "+94 11 234 5678" },
      { icon: "MapPin", label: "Visit Our Office", value: "No. 123, Innovation Drive, Colombo 00500" },
    ],
    subjects: ["Book a Demo", "Sales & Pricing", "Technical Support", "General Enquiry"],
  },
  cta_banner: {
    eyebrow: "Need help choosing?",
    heading: "Talk to Our Team",
    heading_accent: "Before You Start",
    subheading:
      "Have questions about SalonAI? Our team will walk you through the platform and help you find the right plan for your salon.",
    cta_label: "Contact Support",
    cta_href: "/contact",
    secondary_cta_label: "Book a Demo",
    secondary_cta_href: "/request-demo",
    image_url: "",
    image_alt: "SalonAI team",
  },
};

export const defaultRequestDemoContent: RequestDemoContent = REQUEST_DEMO_DEFAULTS;

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export type FooterLink = { label: string; href: string };
export type FooterContact = { label: string; value: string; href: string };
export type FooterSocial = { label: string; href: string; icon?: string };

export type FooterContent = {
  footer: {
    logo_url: string;
    heading: string;
    subheading: string;
    explore_heading: string;
    explore_links: FooterLink[];
    company_heading: string;
    company_links: FooterLink[];
    contact_heading: string;
    contacts: FooterContact[];
    socials: FooterSocial[];
    copyright: string;
    footer_note: string;
  };
  newsletter: {
    heading: string;
    subheading: string;
    email_placeholder: string;
    submit_label: string;
    success_message: string;
  };
};

export type FooterSectionKey = keyof FooterContent;

export const FOOTER_SECTION_ORDER: FooterSectionKey[] = ["footer", "newsletter"];

const FOOTER_DEFAULTS: FooterContent = {
  footer: {
    logo_url: "",
    heading: "Manage. Grow. Shine.",
    subheading:
      "Simplify bookings, manage staff, delight your customers and grow your salon — all from one elegant platform.",
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
    socials: [],
    copyright: "Avenque. All rights reserved.",
    footer_note: "Beauty Meets Technology",
  },
  newsletter: {
    heading: "Stay Updated with the Latest Insights",
    subheading:
      "Subscribe to our newsletter and get the latest tips, trends, and product updates straight to your inbox.",
    email_placeholder: "Enter your email address",
    submit_label: "Subscribe",
    success_message: "Thanks for subscribing! Watch your inbox for the next issue.",
  },
};

export const defaultFooterContent: FooterContent = FOOTER_DEFAULTS;

/* -------------------------------------------------------------------------- */
/* Blog                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * One row of `blog_posts`, shaped for the site.
 *
 * `content` is the markdown body and is only present on the single article
 * endpoint; the list endpoint omits it to keep the blog index light.
 */
export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image: string;
  cover_video: string;
category: string;
  author: string;
  author_image: string;
  tags: string[];
  read_time: string;
  is_featured: boolean;
  /** Tickable in the CMS; popular posts fill the Popular Posts section. */
  is_popular: boolean;
  view_count: number;
  published_at: string;
  date_label: string;
};

export type BlogContent = {
  hero: {
    heading: string;
    heading_accent: string;
    subheading: string;
    search_placeholder: string;
    search_label: string;
    image_url: string;
    image_alt: string;
  };
  categories: {
    items: { icon: IconName; label: string; slug: string }[];
  };
  latest: {
    heading: string;
    heading_accent: string;
    empty_message: string;
  };
  popular: {
    heading: string;
    empty_message: string;
  };
};

export type BlogSectionKey = keyof BlogContent;

export const BLOG_SECTION_ORDER: BlogSectionKey[] = ["hero", "categories", "latest", "popular"];

const BLOG_DEFAULTS: BlogContent = {
  hero: {
    heading: "Insights That Help",
    heading_accent: "Your Salon Grow",
    subheading:
      "Expert tips, industry trends, and product updates to help you run a smarter, more profitable salon business.",
    search_placeholder: "Search articles...",
    search_label: "All Categories",
    image_url: "",
    image_alt: "",
  },
  categories: {
    items: [
      { icon: "LayoutGrid", label: "All Posts", slug: "" },
      { icon: "Briefcase", label: "Management", slug: "management" },
      { icon: "Megaphone", label: "Marketing", slug: "marketing" },
      { icon: "Cpu", label: "Technology", slug: "technology" },
      { icon: "Smile", label: "Customer Experience", slug: "customer-experience" },
      { icon: "Rocket", label: "Product Updates", slug: "product-updates" },
    ],
  },
  latest: {
    heading: "Latest",
    heading_accent: "Articles",
    empty_message: "No articles have been published yet. Check back soon.",
  },
  popular: {
    heading: "Popular Posts",
    empty_message: "Popular articles will show up here once the blog is live.",
  },
};

export const defaultBlogContent: BlogContent = BLOG_DEFAULTS;

/**
 * Articles shown when the CMS is unreachable, so the blog page is never blank.
 *
 * Their markdown bodies are real rather than empty, because the detail page
 * falls back to these same rows: a card that links to a 404 is worse than no
 * card at all. These only render while the Admin API cannot be reached.
 */
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: -1,
    title: "How AI is Transforming Salon Management",
    slug: "how-ai-is-transforming-salon-management",
    excerpt:
      "Discover how artificial intelligence helps salon owners save time, increase revenue and delight customers.",
    content: [
      "Running a salon means juggling bookings, staff schedules, stock and client relationships at the same time. AI takes the repetitive parts off your plate so the team can spend its attention where it actually matters.",
      "## Where AI saves the most time",
      "- **Automatic confirmations and reminders.** No-shows usually cost a busy chair more than a quiet one.",
      "- **Smarter booking.** Clients pick a stylist and a slot that is actually free, without phoning the salon.",
      "- **Client history in one place.** Preferences, formulas and past visits, ready before the client sits down.",
      "",
      "## What it does not replace",
      "AI does the admin work, not the relationship work. The consultation, the finish, the conversation about a new treatment: that part stays human, and it is the part that brings people back.",
    ].join("\n"),
    cover_image: "",
    cover_video: "",
    category: "Technology",
author: "Sarah Johnson",
    author_image: "",
    tags: ["AI", "Automation"],
    read_time: "5 min read",
    is_featured: true,
    is_popular: true,
    view_count: 0,
    published_at: "",
    date_label: "",
  },
  {
    id: -2,
    title: "10 Ways to Improve Salon Efficiency and Save Time",
    slug: "10-ways-to-improve-salon-efficiency",
    excerpt: "Streamline your daily operations and cut down on no-shows with these proven strategies.",
    content: [
      "Efficiency is not about rushing clients. It is about removing the friction that has nothing to do with the work itself.",
      "## Start with the calendar",
      "1. Keep one booking calendar for every stylist, not a paper diary alongside a phone.",
      "2. Block out buffer time so one late appointment does not cascade through the day.",
      "3. Confirm every booking automatically the moment it is made.",
      "",
      "## Then look at the stock",
      "- Track colour and retail usage per client, so you reorder before you run out.",
      "- Remove anything that has not sold in three months; the shelf space is worth more.",
      "",
      "## Finally, agree the handovers",
      "A two minute handover between stylists stops a client repeating their history. It is the cheapest efficiency win on this list.",
    ].join("\n"),
    cover_image: "",
    cover_video: "",
    category: "Management",
author: "Michael Brown",
    author_image: "",
    tags: ["Efficiency", "Workflow"],
    read_time: "4 min read",
    is_featured: false,
    is_popular: true,
    view_count: 0,
    published_at: "",
    date_label: "",
  },
  {
    id: -3,
    title: "Salon Marketing Ideas That Actually Bring in More Clients",
    slug: "salon-marketing-ideas-that-work",
    excerpt:
      "Creative and affordable marketing ideas to help you attract and keep more customers.",
    content: [
      "Most salon marketing fails because it is broadcast rather than useful. The campaigns that work give a reason to come back, not just a reason to notice you.",
      "## Keep the existing clients",
      "- **A gap offer.** Target the clients you have not seen in eight weeks, with a treatment they already love.",
      "- **Birthday and anniversary messages.** Small, personal, and far more effective than a blanket discount.",
      "",
      "## Win new ones locally",
      "- **Show the work, not the room.** Before and after photographs travel better than interior shots.",
      "- **Partner with the businesses nearby.** Gyms, photographers and bridal shops all have clients with money and time.",
      "",
      "## Measure it properly",
      "Track rebooking rate rather than likes. A full chair next month is the only metric that pays the bills.",
    ].join("\n"),
    cover_image: "",
    cover_video: "",
    category: "Marketing",
author: "Emily Roberts",
    author_image: "",
    tags: ["Marketing", "Retention"],
    read_time: "6 min read",
    is_featured: false,
    is_popular: true,
    view_count: 0,
    published_at: "",
    date_label: "",
  },
];

/** `MYSQL DATETIME` arrives without a zone, so parse it as UTC then format locally. */
function formatPostDate(value: unknown): string {
  if (!value) return "";
  const raw = String(value);
  const iso = raw.includes("T") ? raw : `${raw.replace(" ", "T")}Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Normalises a category string so the two sides always compare equal.
 *
 * The admin types free text into the category box ("Management"), while the
 * filter chips configured under Pages > Blog carry a lowercase slug
 * ("management"). Comparing those two directly is case sensitive and silently
 * matches nothing, so both sides go through this key first.
 */
export function categoryKey(value: string | undefined | null): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Accepts a comma separated string or an array so either storage shape works. */
function toTagList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/** Normalises one `blog_posts` row into the shape the components render. */
function toBlogPost(row: Record<string, unknown>): BlogPost {
  const tags = toTagList(row.tags);
  const content = String(row.content ?? "");
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return {
    id: Number(row.id ?? 0),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content,
    cover_image: String(row.cover_image ?? ""),
    cover_video: String(row.cover_video ?? ""),
    category: String(row.category ?? ""),
author: String(row.author ?? ""),
    author_image: String(row.author_image ?? ""),
    tags,
    // Fall back to a rough estimate so a card always shows something sensible.
    read_time: String(row.read_time ?? "") || (wordCount ? `${Math.max(1, Math.round(wordCount / 200))} min read` : ""),
    is_featured: Boolean(row.is_featured),
    is_popular: Boolean(row.is_popular),
    view_count: Number(row.view_count ?? 0),
    published_at: String(row.published_at ?? ""),
    date_label: formatPostDate(row.published_at),
  };
}

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
): Promise<{
  content: T;
  hidden: Set<string>;
  source: "cms" | "defaults";
  sections: ApiSection[];
}> {
  const base = adminBaseUrl();
  if (!base) return { content: defaults, hidden: new Set(), source: "defaults", sections: [] };

  try {
    const res = await fetch(`${base}/api/public/content/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    const sections: ApiSection[] = Array.isArray(data?.sections) ? data.sections : [];
    if (!sections.length) throw new Error("CMS returned no sections");

    return { ...applyApiSections(defaults, order, sections), source: "cms", sections };
  } catch {
    // Never let a CMS outage take the marketing site down.
    return { content: defaults, hidden: new Set(), source: "defaults", sections: [] };
  }
}

/** Server side only: reads the home page content from the Admin CMS. */
export function getHomeContent(): Promise<{
  content: HomeContent;
  hidden: Set<HomeSectionKey>;
  source: "cms" | "defaults";
}> {
  // The home teaser reuses the pricing packages, so the packages are the single
  // source of truth: an edit under Admin -> Pricing is reflected here too. The
  // home section owns only its own heading/CTA fields. Both requests are
  // independent, so they run together instead of one after the other.
  return Promise.all([
    fetchPageContent<HomeContent>("home", DEFAULTS, HOME_SECTION_ORDER),
    getPricingPlans(),
    fetchCmsFaqCategories(),
    fetchHomeCmsFaqs(HOME_FAQ_LIMIT),
    fetchCmsFeaturePosts(),
  ]).then(([page, plans, faqCategories, homeFaqs, featurePosts]) => {
    // Feature posts feed the home features section: the cards ticked "Feature
    // on the home page" lead, then the remaining published cards fill out the
    // four slot layout (Admin -> Features Posts). With nothing ticked the
    // section keeps its own built in cards.
    const featuredPosts = featurePosts.filter((post) => post.featured);
    if (featuredPosts.length > 0) {
      const ordered = [
        ...featuredPosts,
        ...featurePosts.filter((post) => !post.featured),
      ].slice(0, 4);
      page.content.features_overview = {
        ...page.content.features_overview,
        features: ordered.map((post) => ({
          icon: (post.icon ?? "Sparkles") as IconName,
          title: post.title,
          description: post.description ?? "",
          slug: post.slug ?? "",
          image_url: post.image_url ?? "",
        })),
      };
    }
    if (plans.length > 0) {
      page.content.pricing = {
        ...page.content.pricing,
        plans: plans.map(toHomePlan),
      };
    }
    // FAQs live in the `faqs` table and the category tabs live on the FAQ page.
    // The home teaser shows the questions ticked "Show on home" in Admin -> FAQs
    // (falling back to the newest few when nothing is ticked). The tabs are then
    // trimmed to only the categories those questions actually use, so the
    // section never renders empty tabs.
    const faqSourceCategories = faqCategories.length
      ? faqCategories.map((c) => ({
          id: c.id,
          label: c.label,
          icon: c.icon,
          slug: c.slug,
        }))
      : page.content.faq.categories;
    page.content.faq = {
      ...page.content.faq,
      categories: homeFaqs.length
        ? categoriesForFaqs(homeFaqs, faqSourceCategories)
        : page.content.faq.categories,
      faqs: homeFaqs.length
        ? homeFaqs.map((f) => ({
            question: f.question,
            answer: f.answer,
            category: f.category ?? "",
          }))
        : page.content.faq.faqs,
    };
    return {
      content: page.content,
      hidden: page.hidden as Set<HomeSectionKey>,
      source: page.source,
    };
  });
}

/** How many of the newest FAQs the home page teaser shows. */
export const HOME_FAQ_LIMIT = 5;

/**
 * The category tabs the home FAQ section should show: only the categories that
 * the home questions actually use, mapped back to the Admin defined categories
 * so the label, icon and slug are preserved. Questions whose category is not
 * defined in Admin still get a tab so they never disappear from the section.
 */
function categoriesForFaqs(
  faqs: CmsFaq[],
  source: HomeContent["faq"]["categories"]
): HomeContent["faq"]["categories"] {
  const norm = (value: unknown) => String(value ?? "").trim().toLowerCase();
  const findCategory = (label: string) => {
    const needle = norm(label);
    if (!needle) return undefined;
    return source.find(
      (c) => norm(c.id) === needle || norm(c.label) === needle || norm(c.slug) === needle
    );
  };

  const result: HomeContent["faq"]["categories"] = [];
  const seen = new Set<string>();
  for (const faq of faqs) {
    const label = String(faq.category ?? "").trim();
    const match = findCategory(label);
    const key = match ? match.id : norm(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const slug = slugifyText(label);
    result.push(match ?? { id: slug || key, label, icon: "HelpCircle", slug });
  }
  return result;
}

function slugifyText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/** Narrows a full pricing page plan down to the fields the home cards render. */
function toHomePlan(plan: PricingPlan): HomeContent["pricing"]["plans"][number] {
  return {
    name: plan.name,
    // The home teaser shows the cheaper annual figure, matching the pricing page default.
    price: plan.annual || plan.monthly,
    period: "",
    description: plan.desc || plan.description || "",
    features: plan.features || [],
    image_url: plan.image_url ?? "",
    image_alt: plan.image_alt ?? "",
    featured: Boolean(plan.featured),
    badge: plan.badge ?? "",
    cta_label: plan.cta || plan.cta_label || "Get Started",
    cta_href: plan.href || plan.cta_href || "/request-demo",
  };
}

/** Server side only: reads the features page content from the Admin CMS. */
export function getFeaturesContent(): Promise<{
  content: FeaturesContent;
  hidden: Set<FeaturesSectionKey>;
  source: "cms" | "defaults";
}> {
  // The feature cards live in the `feature_posts` table (Admin -> Features
  // Posts), so the grid mirrors that instead of keeping its own copy under
  // Pages -> Features. The two requests are independent, so they run together.
  return Promise.all([
    fetchPageContent("features", FEATURES_DEFAULTS, FEATURES_SECTION_ORDER),
    fetchCmsFeaturePosts(),
  ]).then(([page, posts]) => {
    if (posts.length > 0) {
      page.content.feature_grid = {
        ...page.content.feature_grid,
        features: posts.map((post) => ({
          title: post.title,
          description: post.description ?? "",
          category: post.category ?? "",
          icon: post.icon ?? "Sparkles",
          href: post.href ?? "",
          slug: post.slug ?? "",
          image_url: post.image_url ?? "",
          image_alt: post.image_alt ?? "",
        })),
      };
    }
    return {
      content: page.content as FeaturesContent,
      hidden: page.hidden as Set<FeaturesSectionKey>,
      source: page.source,
    };
  });
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Server side only: reads one feature post and its siblings from the Admin CMS. */
export async function getFeaturePost(
  slug: string
): Promise<{ post: FeaturePost; related: FeaturePost[] } | null> {
  const base = adminBaseUrl();
  if (!slug) return null;

  // Only an unreachable CMS falls back to the built-in cards; a reachable CMS
  // that answers 404 really has no such (or no longer published) feature.
  const fromDefaults = (): { post: FeaturePost; related: FeaturePost[] } | null => {
    const match = FEATURES_DEFAULTS.feature_grid.features.find(
      (feature) => toSlug(feature.title) === slug
    );
    if (!match) return null;
    const build = (feature: (typeof FEATURES_DEFAULTS.feature_grid.features)[number], id: number): FeaturePost => ({
      id,
      title: feature.title,
      slug: toSlug(feature.title),
      description: feature.description,
      content: "",
      category: feature.category,
      icon: feature.icon,
      image_url: "",
      image_alt: "",
      href: feature.href,
      sort_order: id,
    });
    return {
      post: build(match, 1),
      related: FEATURES_DEFAULTS.feature_grid.features
        .filter((feature) => feature !== match)
        .slice(0, 3)
        .map((feature, index) => build(feature, index + 2)),
    };
  };

  try {
    const res = await fetch(`${base}/api/public/features-posts/${encodeURIComponent(slug)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    if (!data?.post) return null;

    const build = (row: Record<string, unknown>): FeaturePost => ({
      id: Number(row.id ?? 0),
      title: String(row.title ?? ""),
      slug: String(row.slug ?? slug),
      description: String(row.description ?? ""),
      content: row.content ? String(row.content) : "",
      category: String(row.category ?? ""),
      icon: String(row.icon ?? "Sparkles"),
      image_url: String(row.image_url ?? ""),
      image_alt: String(row.image_alt ?? ""),
      href: row.href ? String(row.href) : undefined,
      sort_order: Number(row.sort_order ?? 0),
    });

    return {
      post: build(data.post),
      related: Array.isArray(data.related) ? data.related.map(build) : [],
    };
  } catch {
    return fromDefaults();
  }
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

/**
 * Server side only: reads the published pricing packages from the Admin CMS.
 *
 * Packages are managed under Admin -> Pricing and live in their own table, so
 * they arrive from `/api/public/pricing` rather than from the pricing page's
 * sections. The built-in defaults are used if the CMS is unreachable.
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  const base = adminBaseUrl();
  if (!base) return PRICING_DEFAULTS.pricing_cards.plans;

  try {
    const res = await fetch(`${base}/api/public/pricing`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    const plans: unknown = data?.plans;
    if (!Array.isArray(plans) || plans.length === 0) throw new Error("CMS returned no plans");

    return plans as PricingPlan[];
  } catch {
    return PRICING_DEFAULTS.pricing_cards.plans;
  }
}

/** Server side only: reads the pricing page content from the Admin CMS. */
export function getPricingContent(): Promise<{
  content: PricingContent;
  hidden: Set<string>;
  source: "cms" | "defaults";
}> {
  // The page copy and the packages are independent requests, so fetch them
  // together rather than waiting on one before starting the other.
  return Promise.all([
    fetchPageContent("pricing", PRICING_DEFAULTS, [
      "hero",
      "pricing_cards",
      "comparison",
      "closing_cta",
      "banner",
      "faq_cta",
    ] as readonly string[]),
    getPricingPlans(),
  ]).then(([page, plans]) => {
    const comparison = page.content.comparison;

    // Packages are managed separately from the comparison section, so the
    // column headers can drift out of step when one is added or removed. Fall
    // back to the package names whenever the counts disagree.
    const planColumns =
      comparison.plan_columns && comparison.plan_columns.length === plans.length
        ? comparison.plan_columns
        : plans.map((plan) => plan.name);

    const content: PricingContent = {
      ...page.content,
      pricing_cards: { ...page.content.pricing_cards, plans },
      comparison: { ...comparison, plan_columns: planColumns },
    };
    return { content, hidden: page.hidden, source: page.source };
  });
}

/** Server side only: reads the contact page content from the Admin CMS. */
export function getContactContent(): Promise<{
  content: ContactContent;
  hidden: Set<ContactSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("contact", CONTACT_DEFAULTS, CONTACT_SECTION_ORDER) as Promise<{
    content: ContactContent;
    hidden: Set<ContactSectionKey>;
    source: "cms" | "defaults";
  }>;
}

/** Server side only: reads the request demo page content from the Admin CMS. */
export function getRequestDemoContent(): Promise<{
  content: RequestDemoContent;
  hidden: Set<RequestDemoSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("request-demo", REQUEST_DEMO_DEFAULTS, REQUEST_DEMO_SECTION_ORDER) as Promise<{
    content: RequestDemoContent;
    hidden: Set<RequestDemoSectionKey>;
    source: "cms" | "defaults";
  }>;
}

/** Server side only: reads the blog page copy from the Admin CMS. */
export function getBlogContent(): Promise<{
  content: BlogContent;
  hidden: Set<BlogSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("blog", BLOG_DEFAULTS, BLOG_SECTION_ORDER) as Promise<{
    content: BlogContent;
    hidden: Set<BlogSectionKey>;
    source: "cms" | "defaults";
  }>;
}

/** Server side only: reads the site-wide footer from the Admin CMS. */
export function getFooterContent(): Promise<{
  content: FooterContent;
  hidden: Set<FooterSectionKey>;
  source: "cms" | "defaults";
}> {
  return fetchPageContent("footer", FOOTER_DEFAULTS, FOOTER_SECTION_ORDER) as Promise<{
    content: FooterContent;
    hidden: Set<FooterSectionKey>;
    source: "cms" | "defaults";
  }>;
}

export type BlogFeed = {
  posts: BlogPost[];
  /** Category names with counts, generated by the CMS from published posts. */
  categories: { name: string; count: number }[];
};

/**
 * Server side only: reads published articles from the Admin CMS.
 *
 * Deliberately uncached: `Cache-Control: no-store` on the CMS response means an
 * admin edit should be visible on the next page load, so nothing is memoised
 * here beyond the lifetime of a single request.
 */
async function fetchBlogFeed(endpoint: string, fallback: BlogPost[]): Promise<BlogFeed> {
  const base = adminBaseUrl();
  if (!base) return { posts: fallback, categories: [] };

  try {
    const res = await fetch(`${base}${endpoint}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    const rows: unknown[] = Array.isArray(data?.posts) ? data.posts : [];

    // An empty list from a reachable CMS is a real answer: the admin deleted
    // every post. Only an unreachable CMS falls back to the built-in articles,
    // whose detail pages would not exist.
    return {
      posts: (rows as Record<string, unknown>[]).map(toBlogPost),
      categories: Array.isArray(data?.categories)
        ? data.categories
            .map((item: Record<string, unknown>) => ({
              name: String(item?.name ?? ""),
              count: Number(item?.count ?? 0),
            }))
            .filter((item: { name: string }) => item.name)
        : [],
    };
  } catch {
    // Never let a CMS outage take the marketing site down.
    return { posts: fallback, categories: [] };
  }
}

/**
 * Published articles plus the CMS category counts, in one request.
 *
 * The blog index needs both to build its filters, so they are fetched together
 * rather than making the page call the feed twice.
 */
export function getBlogFeed(limit = 50): Promise<BlogFeed> {
  const suffix = limit > 0 ? `?limit=${limit}` : "";
  return fetchBlogFeed(`/api/public/blog${suffix}`, FALLBACK_POSTS);
}

/** All published articles, newest first, with the featured one first. */
export function getBlogPosts(limit = 50): Promise<BlogPost[]> {
  return getBlogFeed(limit).then((feed) => feed.posts);
}

/** Category names and counts, used to label the filter chips. */
export function getBlogCategories(): Promise<{ name: string; count: number }[]> {
  return getBlogFeed().then((feed) => feed.categories);
}

/** One published article plus its related reads, for the detail page. */
export async function getBlogPost(
  slug: string
): Promise<{ post: BlogPost; related: BlogPost[]; source: "cms" | "defaults" } | null> {
  const base = adminBaseUrl();
  if (!slug) return null;

  // Only an unreachable CMS falls back. A reachable CMS that answers 404 really
  // has no such article, and saying so is the honest answer.
  const fromDefaults = (): { post: BlogPost; related: BlogPost[]; source: "defaults" } | null => {
    const post = FALLBACK_POSTS.find((item) => item.slug === slug);
    if (!post) return null;
    return {
      post,
      related: FALLBACK_POSTS.filter((item) => item.slug !== slug),
      source: "defaults",
    };
  };

  if (!base) return fromDefaults();

  try {
    const res = await fetch(`${base}/api/public/blog/${encodeURIComponent(slug)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    if (!data?.post) return null;

    return {
      post: toBlogPost(data.post),
      related: Array.isArray(data.related)
        ? (data.related as Record<string, unknown>[]).map(toBlogPost)
        : [],
      source: "cms",
    };
  } catch {
    return fromDefaults();
  }
}

/** The article the blog hero should showcase, if one is flagged in the CMS. */
export function pickFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
  return posts.find((post) => post.is_featured) ?? posts[0];
}

/** One filter option, resolved from the CMS chip list and the published posts. */
export type BlogCategoryOption = {
  /** Text shown on the chip and in the dropdown. */
  label: string;
  /** Value written to the shared filter state; empty means "no filter". */
  value: string;
  /** Every key a post's `category` may normalise to and still match this option. */
  keys: string[];
  /** Lucide icon name from the CMS, when the chip has one. */
  icon: string;
  /** Number of articles behind this option. */
  count: number;
};

/**
 * Builds the category filters shown on the blog page.
 *
 * The chip labels and icons come from Pages > Blog > Categories, but only the
 * categories that actually have published articles behind them are worth
 * offering, and the counts come from the CMS `GROUP BY` on `blog_posts`. A chip
 * matches a post when either its label or its slug normalises to the same key,
 * so both "Management" and "management" resolve to the same option. Anything
 * the CMS list does not cover is appended, so no article is ever unreachable
 * behind the filters.
 */
export function resolveBlogCategories(
  items: BlogContent["categories"]["items"] = [],
  posts: BlogPost[] = [],
  counts: { name: string; count: number }[] = []
): BlogCategoryOption[] {
  const countByKey = new Map<string, number>();
  for (const post of posts) {
    const key = categoryKey(post.category);
    if (!key) continue;
    countByKey.set(key, (countByKey.get(key) ?? 0) + 1);
  }

  const cmsByKey = new Map<string, number>();
  for (const entry of counts) {
    const key = categoryKey(entry.name);
    if (!key) continue;
    cmsByKey.set(key, (cmsByKey.get(key) ?? 0) + Number(entry.count ?? 0));
  }

  const options: BlogCategoryOption[] = [];
  const claimed = new Set<string>();

  for (const item of items) {
    const label = String(item?.label ?? "").trim();
    const keys = [categoryKey(label), categoryKey(item?.slug)].filter(
      (key, index, all) => key && all.indexOf(key) === index
    );
    if (!label || !keys.length) continue;

    const count = keys.reduce((sum, key) => sum + (cmsByKey.get(key) ?? countByKey.get(key) ?? 0), 0);
    // A chip nobody can filter to is just noise, so drop it.
    if (!count) continue;

    for (const key of keys) claimed.add(key);
    options.push({ label, value: keys[0], keys, icon: String(item?.icon ?? ""), count });
  }

  for (const [key, count] of countByKey) {
    if (claimed.has(key)) continue;
    const post = posts.find((item) => categoryKey(item.category) === key);
    options.push({
      label: post?.category || key,
      value: key,
      keys: [key],
      icon: "",
      count: cmsByKey.get(key) ?? count,
    });
  }

  return options;
}

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export type SiteNavItem = { label: string; href: string; is_visible: boolean };

/**
 * Site-wide settings managed under Admin -> Settings: the navbar logo/brand and
 * the navigation links plus header buttons. Stored in the Admin database and
 * read from `/api/public/settings`, falling back to the defaults below whenever
 * the CMS is unreachable.
 */
export type SiteSettings = {
  logo_url: string;
  logo_alt: string;
  brand_name: string;
  brand_accent: string;
  tagline: string;
  nav_items: SiteNavItem[];
  secondary_label: string;
  secondary_href: string;
  cta_label: string;
  cta_href: string;
};

export const defaultSiteSettings: SiteSettings = {
  logo_url: "",
  logo_alt: "",
  brand_name: "Salon",
  brand_accent: "AI",
  tagline: "Manage. Grow. Shine.",
  nav_items: [
    { label: "Home", href: "/", is_visible: true },
    { label: "Features", href: "/features", is_visible: true },
    { label: "For Business", href: "/about", is_visible: true },
    { label: "Pricing", href: "/pricing", is_visible: true },
    { label: "Blog", href: "/blog", is_visible: true },
    { label: "FAQ", href: "/faq", is_visible: true },
    { label: "Contact", href: "/contact", is_visible: true },
  ],
  secondary_label: "Login",
  secondary_href: "/login",
  cta_label: "Get Started",
  cta_href: "/request-demo",
};

function toSettingsString(value: unknown, fallback: string): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/** Overlays a stored payload over the defaults so a partial one still renders. */
export function normalizeSiteSettings(value: unknown): SiteSettings {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  const navItems: SiteNavItem[] = Array.isArray(raw.nav_items)
    ? (raw.nav_items as unknown[])
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const item = entry as Record<string, unknown>;
          const label = String(item.label ?? "").trim();
          const href = String(item.href ?? "").trim();
          if (!label && !href) return null;
          return { label, href, is_visible: item.is_visible !== false } as SiteNavItem;
        })
        .filter((item): item is SiteNavItem => item !== null)
    : defaultSiteSettings.nav_items;

  return {
    logo_url: toSettingsString(raw.logo_url, defaultSiteSettings.logo_url),
    logo_alt: toSettingsString(raw.logo_alt, defaultSiteSettings.logo_alt),
    brand_name: toSettingsString(raw.brand_name, defaultSiteSettings.brand_name),
    brand_accent: toSettingsString(raw.brand_accent, defaultSiteSettings.brand_accent),
    tagline: toSettingsString(raw.tagline, defaultSiteSettings.tagline),
    nav_items: navItems,
    secondary_label: toSettingsString(raw.secondary_label, defaultSiteSettings.secondary_label),
    secondary_href: toSettingsString(raw.secondary_href, defaultSiteSettings.secondary_href),
    cta_label: toSettingsString(raw.cta_label, defaultSiteSettings.cta_label),
    cta_href: toSettingsString(raw.cta_href, defaultSiteSettings.cta_href),
  };
}

/** Server side only: reads the site settings from the Admin CMS. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const base = adminBaseUrl();
  if (!base) return defaultSiteSettings;

  try {
    const res = await fetch(`${base}/api/public/settings`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const data = await res.json();
    return normalizeSiteSettings(data?.settings);
  } catch {
    // Never let a CMS outage take the marketing site down.
    return defaultSiteSettings;
  }
}
