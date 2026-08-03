/**
 * ============================================================
 *  SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 *  Edit this file to update the portfolio. No component
 *  changes needed for copy, services, skills or projects.
 * ============================================================
 */

export const profile = {
  name: "Ali Arslan Zakir",
  /** Shown under the name in the hero */
  role: "Full-Stack Engineer · AI & Automation Specialist",
  yearsExperience: 8,
  email: "aliarslanzakir@gmail.com",
  phone: "+92 300 444 9205",
  /** Digits only, used to build the wa.me link */
  whatsapp: "923004449205",
  location: "Pakistan · Working with clients worldwide",
  timezone: "PKT (UTC+5)",
  /** Optional: leave a value as "" to hide that social link */
  socials: {
    github: "",
    linkedin: "",
    upwork: "",
  },
};

export const whatsappUrl = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
  `Hi ${profile.name.split(" ")[0]}, I found your portfolio and I'd like to discuss a project.`,
)}`;

export const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
  "Project enquiry",
)}`;

/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Available for new projects",
  headlinePre: "I build",
  /** Rotated word-by-word in the hero headline */
  headlineRotating: [
    "web platforms",
    "mobile apps",
    "AI automations",
    "SaaS products",
    "Web3 products",
  ],
  headlinePost: "that grow your business.",
  subline:
    "8 years turning ideas into fast, reliable software: MERN, MEAN and Laravel web apps, React Native apps live on both stores, Python back-ends, blockchain platforms and AI automation that removes manual work.",
};

/**
 * `projectCount` comes from the live project store, so the headline
 * figure is always your real number. The rest are derived from this
 * file or are commitments rather than past-performance claims.
 */
export const buildStats = (projectCount: number) => [
  { value: `${projectCount}+`, label: "Projects delivered" },
  { value: "8+", label: "Years building software" },
  { value: "6", label: "Core service areas" },
  { value: "<24h", label: "Reply to every enquiry" },
];

/* ------------------------------------------------------------------ */

export type Service = {
  title: string;
  blurb: string;
  bullets: string[];
  /** Key into the ICONS map in components/Icon.tsx */
  icon: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    title: "Full-Stack Web Development",
    blurb:
      "Production web applications built on the MERN and MEAN stacks, with the architecture and test coverage to keep shipping after launch.",
    bullets: [
      "React & Next.js front-ends",
      "Angular enterprise dashboards",
      "Node.js / Express / NestJS APIs",
      "REST & GraphQL design",
    ],
    icon: "code",
    featured: true,
  },
  {
    title: "AI Integration & Automation",
    blurb:
      "Put language models to work on the parts of your business that still run on copy-paste. Chatbots, document pipelines, and internal copilots.",
    bullets: [
      "Claude & OpenAI API integration",
      "RAG over your own documents",
      "Custom support chatbots",
      "Workflow automation (n8n, Zapier)",
    ],
    icon: "sparkles",
    featured: true,
  },
  {
    title: "Mobile & Cross-Platform Apps",
    blurb:
      "One codebase, both stores. I've shipped React Native apps live on the App Store and Google Play, including submission and review.",
    bullets: [
      "React Native & Expo",
      "iOS + Android from one codebase",
      "Offline-first data sync",
      "App Store & Play submission",
    ],
    icon: "phone",
    featured: true,
  },
  {
    title: "Laravel & WordPress Websites",
    blurb:
      "Business sites and PHP platforms that your own team can edit, from custom Laravel applications to conversion-focused WordPress builds.",
    bullets: [
      "Laravel with Vue or React",
      "Custom WordPress themes",
      "On-page SEO & Core Web Vitals",
      "Client-editable content",
    ],
    icon: "layers",
  },
  {
    title: "Blockchain & Web3",
    blurb:
      "Multi-chain products built and shipped: DeFi platforms, NFT marketplaces, DAO governance and wallet integrations.",
    bullets: [
      "Ethereum, Avalanche, XDC & Hedera",
      "NFT minting & auction systems",
      "DAO and tokenomics logic",
      "Trust Wallet & MetaMask flows",
    ],
    icon: "plug",
  },
  {
    title: "Python, APIs & Cloud",
    blurb:
      "The unglamorous layer that decides whether your product survives real traffic, plus the integrations that tie your systems together.",
    bullets: [
      "Django, FastAPI & Flask",
      "Stripe, Square & CRM integrations",
      "AWS, Docker & CI/CD",
      "Retainer-based maintenance",
    ],
    icon: "server",
  },
];

/* ------------------------------------------------------------------ */

export const skillGroups = [
  {
    name: "Front-End",
    items: [
      "React",
      "Next.js",
      "Angular",
      "Vue.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Redux / Zustand",
      "Tailwind CSS",
      "SCSS",
    ],
  },
  {
    name: "Back-End",
    items: [
      "Node.js",
      "Express",
      "NestJS",
      "Python",
      "Django",
      "FastAPI",
      "Flask",
      "PHP",
      "Laravel",
      "REST",
      "GraphQL",
      "WebSockets",
    ],
  },
  {
    name: "Blockchain & Web3",
    items: [
      "Solidity",
      "Ethereum",
      "Avalanche",
      "XDC",
      "Hedera",
      "NFT / ERC-721",
      "Web3.js / Ethers",
      "DAO governance",
      "Wallet integration",
    ],
  },
  {
    name: "CMS & E-Commerce",
    items: ["WordPress", "Custom themes", "Elementor", "WooCommerce", "Stripe", "Square"],
  },
  {
    name: "AI & Automation",
    items: [
      "Claude API",
      "OpenAI API",
      "LangChain",
      "RAG / Vector DBs",
      "Prompt engineering",
      "n8n",
      "Selenium",
      "Playwright",
      "Pandas",
    ],
  },
  {
    name: "Databases",
    items: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Firebase",
      "Prisma",
      "Mongoose",
    ],
  },
  {
    name: "Mobile",
    items: ["React Native", "Expo", "PWA", "Push notifications", "App Store / Play"],
  },
  {
    name: "Cloud & DevOps",
    items: [
      "AWS",
      "Docker",
      "Nginx",
      "GitHub Actions",
      "Vercel",
      "Linux",
      "Git",
    ],
  },
];

/** Names scrolled in the marquee band under the hero */
export const marqueeTech = [
  "React",
  "Next.js",
  "Node.js",
  "Angular",
  "Vue.js",
  "TypeScript",
  "Python",
  "Laravel",
  "MongoDB",
  "PostgreSQL",
  "Django",
  "FastAPI",
  "React Native",
  "Claude API",
  "LangChain",
  "Solidity",
  "Web3",
  "WordPress",
  "Docker",
  "AWS",
];

/* ------------------------------------------------------------------ */

export const processSteps = [
  {
    title: "Discovery call",
    body: "A free 30-minute call to understand the goal, the users and the constraints. You leave knowing whether I'm the right fit, with no pitch deck.",
  },
  {
    title: "Scope & fixed quote",
    body: "A written breakdown of deliverables, milestones, timeline and price. No hourly surprises; changes are quoted before any work starts.",
  },
  {
    title: "Build in weekly slices",
    body: "You get a working, clickable link every week instead of a status report. Feedback goes straight into the next slice.",
  },
  {
    title: "Launch & aftercare",
    body: "Deployment, handover docs and a warranty window for bug fixes. Optional monthly retainer if you'd like me to stay on.",
  },
];

/* ------------------------------------------------------------------ */


export const reasons = [
  {
    title: "One person, whole stack",
    body: "Front-end, back-end, database, deployment and the AI layer. No hand-offs between agencies, no gaps where responsibility disappears.",
    icon: "layers",
  },
  {
    title: "Fixed scope, fixed price",
    body: "You approve a written scope and a number before I start. If the scope changes, you see the revised quote first.",
    icon: "shield",
  },
  {
    title: "Communication in plain English",
    body: "Weekly demo links and updates you can forward to a non-technical stakeholder without translating anything.",
    icon: "chat",
  },
  {
    title: "Built to be handed over",
    body: "Readable code, documented setup and a walkthrough recording, so you're never locked into me to keep the product alive.",
    icon: "check",
  },
];

/* ------------------------------------------------------------------ */

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */

/**
 * How clients can engage. No figures are quoted here on purpose: the
 * rate depends on scope, and you agree it on the discovery call.
 */
export const engagementModels = [
  {
    title: "Hourly",
    tagline: "Pay for the time you use",
    body: "Best for small changes, bug fixes, code reviews and ongoing tweaks where the work isn't fully defined yet. You get a logged breakdown of every hour, so you can see exactly what the time went on.",
    bestFor: [
      "Small fixes and improvements",
      "Work with an unclear scope",
      "Consulting and code audits",
      "Emergency support",
    ],
    icon: "clock",
  },
  {
    title: "Weekly",
    tagline: "A block of my week, reserved",
    body: "You book capacity by the week and I work through an agreed priority list, shipping something you can click on every week. Ideal for longer builds where the direction may shift as you learn from users.",
    bestFor: [
      "Ongoing product development",
      "Evolving or long-running scopes",
      "Teams needing steady velocity",
      "Retainer-style maintenance",
    ],
    icon: "layers",
    featured: true,
  },
  {
    title: "Fixed price",
    tagline: "One number, agreed upfront",
    body: "For clearly defined projects I quote a single price against a written scope and milestone plan. You know the total before anything starts, and any change is re-quoted before I act on it.",
    bestFor: [
      "Well-defined project briefs",
      "Fixed budgets and deadlines",
      "New websites and apps",
      "One-off integrations",
    ],
    icon: "shield",
  },
];

export const faqs = [
  {
    q: "How do you charge?",
    a: "Three ways, and the right one depends entirely on the scope: hourly for small or loosely defined work, weekly when you want reserved capacity on a longer build, and a fixed price when the brief is clear enough to quote a single number. We settle on which fits during the discovery call, and you get it in writing before anything starts.",
  },
  {
    q: "What does a typical project cost?",
    a: "It scales with scope, so I won't invent a figure before understanding yours. Send a short brief and you'll get a real number, or an hourly or weekly rate, along with an honest view of whether the budget you have in mind matches the work you're describing.",
  },
  {
    q: "How quickly can you start?",
    a: "Usually within a week. Send the brief and I'll confirm availability and a realistic start date on the discovery call.",
  },
  {
    q: "Can you take over an existing codebase?",
    a: "Yes. A large share of my work is rescuing or extending apps someone else started. I'll audit the repo first and tell you honestly whether extending or rebuilding is the cheaper path.",
  },
  {
    q: "Do you sign NDAs and work-for-hire agreements?",
    a: "Always, and gladly. You own 100% of the code and assets on final payment.",
  },
  {
    q: "Which time zones do you work with?",
    a: `I'm on ${profile.timezone} and keep overlapping hours with the UK, EU, Middle East and US East Coast. Async updates mean you're never waiting on a call.`,
  },
];
