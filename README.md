# Emotivate — Website

Online counselling site for **Emotivate** (Next.js + TypeScript + Tailwind + Framer Motion).

---

## Home page (top → bottom)

| # | Section | What it is |
|---|---------|------------|
| 1 | **Navbar** | Logo, links (About, Services, Why Emotivate, Testimonials, Contact, FAQ), Contact button |
| 2 | **Hero** | Main headline, rotating quotes, “Explore our Services” |
| 3 | **About** | Therapist intro, photo, client feedback cards |
| 4 | **Quote divider** | Short inspirational quote |
| 5 | **Marquee** | “However you feel right now…” scrolling topic tags + tooltips |
| 6 | **Image strip** | Full-width landscape image |
| 7 | **Services** | Four service cards → each links to its own page |
| 8 | **Why Emotivate** | Accordion-style “what makes us special” points |
| 9 | **Quote divider** | Second quote |
| 10 | **Testimonials** | Scrolling client stories |
| 11 | **Image strip** | Second full-width image |
| 12 | **Contact** | “We’d love to hear from you”, email, Instagram, online note |
| 13 | **FAQ** | Expandable questions |
| 14 | **Footer** | Links, services shortcuts, copyright |

---

## Other pages

- **`/services/[slug]`** — Detail + pricing for each service (e.g. `individual-therapy`, `couples-therapy`).

---

## Project folders (simple map)

```
Draft-2/
├── public/           → Images (logo, about photo)
├── src/
│   ├── app/          → Routes, layout, global styles
│   │   ├── page.tsx  → Home (order of sections)
│   │   └── services/[slug]/page.tsx
│   └── components/   → One file per section above
├── package.json
└── tailwind.config.ts
```

---

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
