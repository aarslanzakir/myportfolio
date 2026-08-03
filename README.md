# Ali Arslan Zakir, Portfolio

Client-facing portfolio site with a built-in admin panel for managing projects.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · no runtime dependencies beyond those.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
```

| Command         | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server with hot reload |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                     |

---

## Admin panel

**URL:** `/admin`. Your password is in `.env.local` under `ADMIN_PASSWORD`.

From there you can add, edit, reorder and delete projects. Changes appear on the
public site immediately (the page is revalidated on every write).

**The first two projects in the list get the large "spotlight" cards** at the top
of the Work section. Use the ↑ / ↓ buttons to control which ones those are.

### Fields

| Field            | Notes                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Title            | Required, 2 to 120 chars                                                                    |
| Category         | Drives the public filter tabs. Add options in `lib/project-schema.ts` → `CATEGORIES`      |
| Live URL         | A bare domain like `example.com` is auto-prefixed with `https://`                         |
| Summary          | Up to 600 chars                                                                          |
| Tech stack       | Comma separated                                                                          |
| **Feature this** | Adds a highlight icon on the card                                                         |
| **Needs login**  | Hides the URL and shows "Demo access on request" instead                                  |

> ⚠️ **Never put client passwords into a project record.** Anything you save is
> served publicly. That's what the "Needs login" toggle is for: it publishes the
> project without exposing the URL.

---

## Environment variables

`.env.local` was generated for you and is gitignored. Set the same values in your
host's dashboard when you deploy.

```ini
ADMIN_PASSWORD=…        # the password you log into /admin with, change this
ADMIN_SECRET=…          # random 32+ chars, signs the session cookie
NEXT_PUBLIC_SITE_URL=…  # your live domain, used for SEO tags and social cards
```

Changing `ADMIN_SECRET` invalidates any active admin session.

---

## Deploying

Projects are stored in `data/content.json`, written to disk by the admin panel.
**That means you need a host with a persistent filesystem:**

✅ **Works:** VPS (DigitalOcean, Hetzner, Contabo), Railway, Render, Fly.io,
cPanel Node app, or any Node server.

❌ **Won't work as-is:** Vercel and Netlify serverless. Their filesystem is
read-only, so admin edits are lost. The public site renders fine; only saving breaks.

### To deploy on Vercel/Netlify

Swap the storage layer for a database. Everything filesystem-related is isolated
in [`lib/store.ts`](lib/store.ts). Keep the exported function signatures
(`listProjects`, `createProject`, `updateProject`, `deleteProject`,
`reorderProject`) and replace the bodies with MongoDB queries. Nothing else in
the codebase touches the storage format.

### Backups

`data/content.json` is your entire project list. Commit it to git or copy it
somewhere safe before major changes.

---

## Editing the rest of the site

All static copy lives in one file: [`lib/content.ts`](lib/content.ts): name,
contact details, hero headline, services, skills, process steps, engagement
models and FAQs. No component changes needed to update wording.

**Pricing / engagement models** are the `engagementModels` array in that file
(hourly, weekly, fixed price). No figures are published on purpose, since the
rate depends on scope. Set `featured: true` on whichever model you want
badged "Most popular".

```
lib/content.ts          all site copy + contact details
lib/project-schema.ts   project type, categories, validation (client-safe)
lib/store.ts            JSON persistence (server only)
lib/auth.ts             admin session cookie
components/             public sections (Hero, Services, Projects, …)
components/admin/       login form + project manager
data/content.json       your project data
```

### The hero photo

The hero uses `public/mine.png` as a full-bleed banner. Two treatments,
both in [`components/Hero.tsx`](components/Hero.tsx):

- **Desktop (lg and up):** the photo sits behind the copy, anchored at
  `object-[78%_center]` so the subject stays in frame while the empty dark
  left side is what gets cropped on wide monitors. Two gradient scrims keep
  the headline legible.
- **Mobile and tablet:** the photo runs in flow below the copy instead, so
  no text lands on the subject's face and nothing important is cropped.

To swap the image, replace `public/mine.png` (keep a similar wide crop with
empty space on one side) or change the import at the top of `Hero.tsx`.
Next.js optimizes it automatically: the 1.7 MB source is served as ~48 KB at
mobile widths, with a blur placeholder and a preload hint.

---

## Design decisions

- **Obsidian and gold, dark only.** A deliberate single look rather than a
  half-polished light mode. All colour tokens live in `app/globals.css` under
  `@theme`: `ink-*` for surfaces, `mist-*` for text, `accent-*` and
  `ember-400` for the gold range. Change those four values and the whole site
  re-themes. Gold buttons use `text-ink-950`, never white, for contrast.
- **No long dashes in the copy.** All site text uses commas, colons and full
  stops instead of em or en dashes. Keep it that way when you edit
  `lib/content.ts` or add projects.
- **System fonts, no webfont request.** Renders instantly, no Google Fonts
  dependency and nothing to disclose in a privacy policy. Swap in a webfont via
  the commented instructions in `app/layout.tsx` if you prefer.
- **Contact form needs no back-end.** It composes a pre-filled email or WhatsApp
  message. To capture submissions server-side instead, add an API route and point
  `components/ContactForm.tsx` at it.
- **Accessibility.** Keyboard-navigable, skip link, `prefers-reduced-motion`
  disables all animation, and content still renders with JavaScript off.
