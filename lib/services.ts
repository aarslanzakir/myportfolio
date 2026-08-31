/**
 * ============================================================
 *  SERVICES: home page cards *and* their own landing pages
 *
 *  Each entry drives /services/<slug>. `intro`, `deliverables`
 *  and `faqs` are what make that page worth indexing on its own
 *  rather than a near-duplicate of the home page section, so if
 *  you add a service, give it real copy here.
 * ============================================================
 */

export type Service = {
  /** URL segment: /services/<slug>. Changing it breaks existing links. */
  slug: string;
  title: string;
  /** <title> for the service page. The root layout appends "| <name>". */
  metaTitle: string;
  metaDescription: string;
  /** One-liner on the home page card */
  blurb: string;
  /** The service page's own copy, one string per paragraph */
  intro: string[];
  bullets: string[];
  /** What the client actually receives. Rendered as a checklist. */
  deliverables: string[];
  /** Project categories to pull real work from, as proof on the page */
  categories: string[];
  /** Objections specific to this service, not the general site FAQ */
  faqs: { q: string; a: string }[];
  /** Key into the ICONS map in components/Icon.tsx */
  icon: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "full-stack-web-development",
    title: "Full-Stack Web Development",
    metaTitle: "Full-Stack Web Developer (MERN & MEAN)",
    metaDescription:
      "Freelance full-stack developer with 8+ years on the MERN and MEAN stacks. React, Next.js, Angular, Node.js and NestJS web applications built to keep shipping after launch.",
    blurb:
      "Production web applications built on the MERN and MEAN stacks, with the architecture and test coverage to keep shipping after launch.",
    intro: [
      "Most web applications do not fail at launch. They fail six months later, when the first developer has moved on and nobody can change anything without breaking something else. That is an architecture problem, and it is far cheaper to avoid than to fix.",
      "I build on the MERN and MEAN stacks: React or Next.js on the front end, Node.js with Express or NestJS behind it, MongoDB or PostgreSQL underneath, and Angular where an enterprise dashboard calls for it. The stack matters less than how it is put together, so I keep the boundaries between layers explicit and the data model honest to what your business actually does.",
      "You see working software every week rather than a status report. That means the direction can change while changing it is still cheap, and it means you are never taking my word for how far along things are.",
    ],
    bullets: [
      "React & Next.js front-ends",
      "Angular enterprise dashboards",
      "Node.js / Express / NestJS APIs",
      "REST & GraphQL design",
    ],
    deliverables: [
      "A written scope, milestone plan and fixed quote before any code",
      "A clickable, deployed build at the end of every week",
      "Source code in your own repository from day one",
      "API documentation and a database schema you can hand to anyone",
      "Deployment setup and a recorded walkthrough at handover",
      "A warranty window for bug fixes after launch",
    ],
    categories: ["Web Development", "MERN Stack", "Next.js", "Python & React"],
    faqs: [
      {
        q: "MERN or MEAN: which should I pick?",
        a: "Usually MERN, because React has the deeper hiring pool and you will eventually need to hire. MEAN earns its place when your team already knows Angular, or when the app is a large internal dashboard where Angular's opinionated structure keeps a big codebase consistent. I will tell you which applies to your case on the call rather than defaulting to whichever I feel like writing.",
      },
      {
        q: "Can you work with my existing team?",
        a: "Yes. I have joined codebases as an extra pair of hands, as the person who sets the architecture others then build on, and as the one reviewing pull requests. Tell me which of those you need and I will fit around your team's process rather than the other way around.",
      },
      {
        q: "Do you write tests?",
        a: "For the parts where a bug is expensive: business logic, payment flows, permissions and anything touching money or data integrity. I do not chase a coverage percentage, because a high number on trivial code buys you nothing and bills you for the privilege.",
      },
    ],
    icon: "code",
    featured: true,
  },
  {
    slug: "ai-integration-automation",
    title: "AI Integration & Automation",
    metaTitle: "AI Integration & Automation Developer",
    metaDescription:
      "Freelance AI developer building Claude and OpenAI integrations, RAG over your own documents, support chatbots and workflow automation that removes manual work.",
    blurb:
      "Put language models to work on the parts of your business that still run on copy-paste. Chatbots, document pipelines, and internal copilots.",
    intro: [
      "The useful question about AI is not what a model can do in a demo. It is which specific task in your business currently costs a person hours a week, and whether a model can do that task reliably enough that nobody has to check its work.",
      "That framing rules a lot of ideas out, which saves you money. What survives it tends to be narrow and unglamorous and genuinely valuable: answering the same forty support questions, pulling structured data out of invoices and PDFs, drafting a first pass a human then edits, routing enquiries to the right person.",
      "I build these with the Claude and OpenAI APIs, retrieval over your own documents so answers are grounded in your content rather than the model's guesses, and evaluation against your real examples so you can see the failure rate before it reaches a customer. Where an off-the-shelf workflow tool like n8n does the job, I will use it and tell you, rather than bill you for custom code you did not need.",
    ],
    bullets: [
      "Claude & OpenAI API integration",
      "RAG over your own documents",
      "Custom support chatbots",
      "Workflow automation (n8n, Zapier)",
    ],
    deliverables: [
      "A shortlist of the tasks worth automating, and the ones that are not",
      "Working integration against your real data, not a sandbox demo",
      "An evaluation set so you can measure accuracy before going live",
      "Guardrails and a human handoff path for low-confidence cases",
      "Token cost projections at your expected volume",
      "Prompt and pipeline documentation your team can edit without me",
    ],
    categories: ["AI & Automation", "Python & React"],
    faqs: [
      {
        q: "Will this hallucinate and embarrass us in front of customers?",
        a: "It can, which is why the design around the model matters more than the model. Retrieval grounds answers in your own documents, confidence thresholds route uncertain cases to a person instead of guessing, and the evaluation set tells you the real error rate before launch rather than after. For anything customer-facing I will usually recommend the model drafts and a human sends, at least until live data shows it can be trusted alone.",
      },
      {
        q: "What will the API costs be?",
        a: "That depends on your volume and how much context each request carries, so I project it against your actual numbers before we build, not after. In most business workflows it lands well under the cost of the hours it replaces, and where it does not, I will tell you rather than build it anyway.",
      },
      {
        q: "Does our data get used to train the model?",
        a: "Not under the standard commercial API terms of either Anthropic or OpenAI, which is one reason I build on those rather than on consumer chat products. If you handle regulated or genuinely sensitive data, say so up front and we scope the architecture around that constraint from the start.",
      },
    ],
    icon: "sparkles",
    featured: true,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile & Cross-Platform Apps",
    metaTitle: "React Native App Developer (iOS & Android)",
    metaDescription:
      "Freelance React Native and Expo developer. One codebase shipped to both the App Store and Google Play, including store submission and review, offline sync and push notifications.",
    blurb:
      "One codebase, both stores. I've shipped React Native apps live on the App Store and Google Play, including submission and review.",
    intro: [
      "Two native codebases means two of everything: two builds, two bug backlogs, two sets of changes every time a feature moves. For the large majority of business apps that cost buys nothing a user can perceive, and React Native removes it.",
      "I build with React Native and Expo, sharing one codebase across iOS and Android and dropping to native modules only where a feature genuinely needs it. Offline-first data sync, push notifications, biometric login and in-app payments are well-trodden ground rather than research projects.",
      "Getting an app finished is not the same as getting it live. App Store review rejects builds for reasons that have nothing to do with code, and a first submission that has not been prepared for that will bounce. I handle submission, the review back-and-forth and the store listing, and I have taken apps through it to both stores.",
    ],
    bullets: [
      "React Native & Expo",
      "iOS + Android from one codebase",
      "Offline-first data sync",
      "App Store & Play submission",
    ],
    deliverables: [
      "One React Native codebase running on both platforms",
      "Signed builds, with certificates and keys in your own accounts",
      "App Store and Play Store submission, including review responses",
      "Store listing copy, screenshots and privacy declarations",
      "Crash reporting and analytics wired up before launch",
      "A release process your team can run without me",
    ],
    categories: ["Mobile Apps"],
    faqs: [
      {
        q: "Will a React Native app feel slower than native?",
        a: "For a business app, a marketplace, a booking flow or anything CRUD-shaped, users cannot tell. Where it genuinely shows is heavy real-time graphics, complex camera or AR work, and games. If your app is one of those I will say so and recommend native, rather than take the work and hope.",
      },
      {
        q: "Do I need an Apple Developer account before we start?",
        a: "Yes, and it should be in your company's name rather than mine. Apple charges 99 USD a year and Google Play a one-off 25 USD. Owning those accounts yourself means the app stays yours if we stop working together, which is the entire point.",
      },
      {
        q: "How long does App Store review take?",
        a: "Usually 24 to 48 hours once the build is clean, but a first submission is where rejections happen, and they are more often about privacy declarations, account deletion or metadata than about your code. I budget for at least one round of that rather than promise a date the reviewer controls.",
      },
    ],
    icon: "phone",
    featured: true,
  },
  {
    slug: "laravel-wordpress-development",
    title: "Laravel & WordPress Websites",
    metaTitle: "Laravel & WordPress Developer",
    metaDescription:
      "Freelance Laravel and WordPress developer. Custom PHP platforms with Vue or React, bespoke WordPress themes, Core Web Vitals and on-page SEO, and content your own team can edit.",
    blurb:
      "Business sites and PHP platforms that your own team can edit, from custom Laravel applications to conversion-focused WordPress builds.",
    intro: [
      "The build itself is rarely the expensive part of a business website. What costs you is the year after, when every text change needs a developer because the site was built to look right in a screenshot rather than to be edited by the people who own it.",
      "So I build these to be handed over. On WordPress that means a custom theme with properly structured fields, not a page builder stacked on a bought template that breaks the first time it updates. On Laravel it means a real application with a considered data model, paired with Vue or React where the interface needs to be interactive.",
      "Speed and search visibility are decided during the build, not bolted on afterwards. Core Web Vitals, semantic markup, structured data and a sensible URL structure are all cheaper to get right at the start than to retrofit once you have traffic and rankings to protect.",
    ],
    bullets: [
      "Laravel with Vue or React",
      "Custom WordPress themes",
      "On-page SEO & Core Web Vitals",
      "Client-editable content",
    ],
    deliverables: [
      "A custom theme or application, never a resold template",
      "Editable content fields mapped to how your team actually works",
      "Core Web Vitals passing on mobile at launch",
      "Structured data, sitemap, canonical tags and clean URLs",
      "A staging environment and a safe deployment process",
      "A recorded walkthrough of editing the site yourself",
    ],
    categories: ["Laravel", "WordPress"],
    faqs: [
      {
        q: "Should I use WordPress or a custom Laravel build?",
        a: "WordPress when the site is mainly content and your team needs to publish without a developer, which covers most business sites. Laravel when there is real application logic underneath: accounts, bookings, dashboards, billing, permissions. Forcing an application into WordPress with a pile of plugins is how sites become unmaintainable, and that conversation is worth having before starting rather than after.",
      },
      {
        q: "Can you redesign our site without losing our Google rankings?",
        a: "Yes, and this is the part most redesigns get wrong. Existing URLs get mapped and redirected, titles and metadata are carried across deliberately, and the structure is preserved where it already earns traffic. A redesign that silently changes every URL is how sites lose years of accumulated ranking overnight.",
      },
      {
        q: "Will I be able to edit it myself?",
        a: "That is the point. You get named, structured fields rather than one freeform blob, and a recorded walkthrough of making the changes you will actually make. If you need a developer to change a headline, the build has failed.",
      },
    ],
    icon: "layers",
  },
  {
    slug: "blockchain-web3-development",
    title: "Blockchain & Web3",
    metaTitle: "Blockchain & Web3 Developer",
    metaDescription:
      "Freelance blockchain developer across Ethereum, Avalanche, XDC and Hedera. NFT marketplaces, DeFi platforms, DAO governance, minting and auction systems, and wallet integration.",
    blurb:
      "Multi-chain products built and shipped: DeFi platforms, NFT marketplaces, DAO governance and wallet integrations.",
    intro: [
      "On-chain code is unusual in that mistakes are permanent and immediately expensive. A bug in a normal web application costs you an afternoon; the same bug in a deployed contract holding funds is not recoverable, and no amount of moving fast makes that trade worth it.",
      "I have shipped across Ethereum, Avalanche, XDC and Hedera: NFT minting and auction systems, DeFi mechanics, DAO governance and tokenomics, and the wallet flows through MetaMask and Trust Wallet that decide whether ordinary users can actually complete a transaction.",
      "Most of the real work sits either side of the contract. Deciding what genuinely needs to be on chain and what does not, keeping gas costs sane, and building an interface that does not assume the user already understands nonces and gas limits. A product only crypto-native users can operate has chosen its own ceiling.",
    ],
    bullets: [
      "Ethereum, Avalanche, XDC & Hedera",
      "NFT minting & auction systems",
      "DAO and tokenomics logic",
      "Trust Wallet & MetaMask flows",
    ],
    deliverables: [
      "Solidity contracts with a test suite covering the failure paths",
      "Testnet deployment you can use before anything touches mainnet",
      "A front end that works for users who have never held a token",
      "Wallet integration across MetaMask and Trust Wallet",
      "Gas cost analysis on the flows users will run most",
      "Deployment scripts, verified source and handover documentation",
    ],
    categories: ["Blockchain"],
    faqs: [
      {
        q: "Do you audit contracts before mainnet?",
        a: "I write tests covering the failure paths and review the contract carefully, and for anything holding meaningful value you should also commission an independent audit from a specialist firm. I am not going to claim my own review substitutes for that: the whole value of an audit is that it is not done by the person who wrote the code.",
      },
      {
        q: "Which chain should we launch on?",
        a: "It follows from where your users already are and what your transactions cost, not from which chain is currently being talked about. If users pay gas on every action, a high-fee chain will quietly kill the product regardless of how good it is. I have shipped on Ethereum, Avalanche, XDC and Hedera and will give you a straight recommendation rather than a preference.",
      },
      {
        q: "Do we actually need a blockchain for this?",
        a: "Often not, and I would rather say so at the start than build it anyway. It earns its place when you need verifiable ownership, trustless settlement between parties who do not trust each other, or a public audit trail. If a database would do the job, a database is cheaper, faster and easier to fix.",
      },
    ],
    icon: "plug",
  },
  {
    slug: "python-api-cloud-development",
    title: "Python, APIs & Cloud",
    metaTitle: "Python, API & Cloud Developer",
    metaDescription:
      "Freelance Python developer building Django, FastAPI and Flask back-ends, Stripe, Square and CRM integrations, and AWS, Docker and CI/CD infrastructure. Retainer maintenance available.",
    blurb:
      "The unglamorous layer that decides whether your product survives real traffic, plus the integrations that tie your systems together.",
    intro: [
      "Nobody asks for infrastructure. They ask for it once the site has fallen over during a launch, or a payment has been taken twice, or the deploy that was supposed to take ten minutes has taken a day. It is the least visible part of a product and the part that decides whether the visible parts stay up.",
      "I build Python back-ends in Django, FastAPI and Flask, and the integrations that connect them to the systems you already run: Stripe and Square for payments, CRMs, and third-party APIs that each have their own opinions about rate limits, retries and what counts as an error.",
      "Around that sits the deployment: AWS, Docker, Nginx and CI/CD, set up so that shipping a change is routine rather than an event. If a release is frightening, releases become rare, and rare releases are how small problems accumulate into large ones.",
    ],
    bullets: [
      "Django, FastAPI & Flask",
      "Stripe, Square & CRM integrations",
      "AWS, Docker & CI/CD",
      "Retainer-based maintenance",
    ],
    deliverables: [
      "A documented API with real schemas, not a guess from example payloads",
      "Payment integrations with webhook handling and idempotency",
      "Containerised deployment reproducible from a clean machine",
      "CI/CD that runs the tests and deploys on merge",
      "Monitoring and alerting on the things that should actually page someone",
      "Backups, and a restore you have watched work at least once",
    ],
    categories: ["Python & React", "AI & Automation", "MERN Stack"],
    faqs: [
      {
        q: "Can you take over a project someone else built?",
        a: "Yes, and a large share of my work is exactly that. I audit the repository first and give you an honest read on whether extending it or rebuilding it is the cheaper path, including when the answer is the one that means less work for me.",
      },
      {
        q: "Do you offer ongoing maintenance?",
        a: "Yes, on a monthly retainer covering dependency and security updates, monitoring, and a defined response time when something breaks. It is optional and it is not a condition of the build: you get handover documentation either way, so staying with me stays a choice rather than a dependency.",
      },
      {
        q: "Django or FastAPI?",
        a: "Django when you want the batteries included and the admin interface for free, which suits most products with users, content and permissions. FastAPI when the service is primarily an API, especially one serving models or handling high-concurrency async work. Both are safe choices, and the wrong one is rarely fatal.",
      },
    ],
    icon: "server",
  },
];

/** Lookup used by the /services/[slug] route. */
export const serviceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);
