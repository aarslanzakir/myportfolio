# Writing a case study

Everything technical is built. A case study becomes a live, indexed page
the moment you add it to the `caseStudies` array in `lib/case-studies.ts`
and push. You never touch a component.

You get, generated automatically:

- the page at `/case-studies/<slug>`
- `<title>`, meta description, canonical tag
- an Open Graph preview card naming the client
- `Article` + `BreadcrumbList` structured data linked to your Person entity
- a sitemap entry
- two-way links between the case study and the services it used

---

## The only hard rule

**Do not invent anything.** No made-up percentages, no imagined quotes,
no results you cannot point at. A prospect who checks one figure and
finds it false is gone, and Google gives you nothing for the metric
either way. `results` and `testimonial` are both optional. Leave them
out rather than fill them in.

If a client will not let you name them, use `"Confidential fintech
client"` and describe the work without identifying details. That is
normal and costs you nothing.

---

## What to write

Aim for **400–700 words** across the three sections. Write like you are
explaining it to another developer, not pitching.

### `challenge` — what was actually wrong

The single most common mistake is being vague here. Compare:

> ❌ "The client had an outdated website with poor performance."

> ✅ "Their booking flow timed out whenever more than about 200 people
> were on the site at once, which in practice meant every Monday morning.
> Support was manually re-entering the bookings that failed."

The second version is specific, and specificity is what makes a reader
think *that sounds like my problem*.

### `approach` — what you built, and **why that way**

Include the reasoning, especially where you rejected the obvious option.
This is the section that demonstrates judgement, which is what someone is
actually buying.

> ✅ "The obvious fix was more server capacity, but the real problem was
> that every page load recalculated availability across all rooms. I
> moved that into a materialised view refreshed on booking changes, which
> meant the existing hosting was suddenly more than enough."

### `outcome` — what changed

If you have numbers, use them. If you do not, say what shipped and what
the client can now do that they could not before. "Still running two
years later with no maintenance calls" is a real, credible outcome.

---

## Which projects to pick

Pick **5–8** from `data/content.json`. Choose on:

1. **Recognisable or relatable client** — beats a more impressive build
   for an industry nobody knows.
2. **A story you remember** — if you cannot recall what was hard, it will
   read as filler.
3. **Work you want more of** — these pages attract more of what they
   describe. Do not lead with the work you disliked.
4. **Spread across services** — each case study strengthens the service
   page it links to, so covering several services beats five web builds.

Do not write all eight before publishing. Write one, push it, see it
live. The second is much faster.

---

## Steps

1. Open `lib/case-studies.ts`.
2. Copy the `TEMPLATE` block at the bottom.
3. Paste it inside `caseStudies = [ ... ]` and fill in every field.
4. `services` must contain slugs that exist in `lib/services.ts`:
   - `full-stack-web-development`
   - `ai-integration-automation`
   - `mobile-app-development`
   - `laravel-wordpress-development`
   - `blockchain-web3-development`
   - `python-api-cloud-development`
5. Run `npm run build` to confirm it compiles.
6. Commit and push.

Once the first one is live, submit `/case-studies` in Search Console
under **URL inspection → Request indexing**.

---

## Slugs are permanent

`slug` becomes the public URL. Changing it later breaks any link anyone
has shared and discards whatever ranking the page has earned. Pick it
once, keep it short, and use words a person would actually search:
`acme-booking-platform`, not `project-4`.
