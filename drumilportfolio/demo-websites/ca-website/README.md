# Mehta & Associates — CA Firm Website

Static HTML/CSS website for an Indian Chartered Accountancy firm.
9 pages · no frameworks · mobile-first · ICAI ethics-compliant copy.

---

## File Structure

```
ca-website/
├── index.html          Home
├── about.html          About the Firm
├── services.html       Services (all practice areas)
├── industries.html     Industries Served
├── resources.html      Knowledge Hub + Compliance Calendar
├── careers.html        Articleship & Staff Openings
├── team.html           Partners & Staff
├── contact.html        Contact + Map + Enquiry Form
├── privacy.html        Privacy Policy
├── css/
│   └── style.css       Unified design system
├── js/
│   └── main.js         Nav toggle, tabs, form validation
└── README.md           This file
```

---

## Before Going Live — Required Updates

Search for `[TO BE UPDATED]` across all files. Replace every occurrence:

| Placeholder | Replace With |
|---|---|
| `[TO BE UPDATED]` (firm name) | Actual registered firm name |
| `[Street Address — TO BE UPDATED]` | Full office address |
| `+91-79-XXXX-XXXX` | Actual phone number |
| `info@mehtaandassociates.in` | Actual email address |
| `careers@mehtaandassociates.in` | Actual careers email |
| `www.mehtaandassociates.in` | Actual domain |
| ICAI Firm Reg. No. `[TO BE UPDATED]` | ICAI FRN |
| ICAI Membership No. `[TO BE UPDATED]` | Each partner's membership number |
| Partner names (CA Rajesh Mehta, etc.) | Real partner names |
| Partner photos (stand-in Unsplash) | Actual partner photographs |
| OpenStreetMap coordinates | Actual lat/lon of office |

---

## Image Sources

All images are from **Unsplash** under the [Unsplash License](https://unsplash.com/license).
Free for commercial use. No attribution required (attribution included below for verification).

| Page / Use | Unsplash Photo ID | Direct URL | Photographer |
|---|---|---|---|
| **Home hero** — office interior | `IYfp2Ixe9nM` | https://images.unsplash.com/photo-1497366216548-37526070297c | Annie Spratt |
| **About** — professional team meeting | `5973dc0f32e7` | https://images.unsplash.com/photo-1556761175-5973dc0f32e7 | Campaign Creators |
| **Services** accent — documents/calculator | `6726b3ff858f` | https://images.unsplash.com/photo-1554224155-6726b3ff858f | Towfiqu barbhuiya |
| **Team** — Partner 1 stand-in (male) | `0b93528c311a` | https://images.unsplash.com/photo-1560250097-0b93528c311a | Amy Hirschi |
| **Team** — Partner 2 stand-in (female) | `b8d87734a5a2` | https://images.unsplash.com/photo-1573496359142-b8d87734a5a2 | Tima Miroshnichenko |
| **Team** — Partner 3 stand-in (male) | `af0119f7cbe7` | https://images.unsplash.com/photo-1519085360753-af0119f7cbe7 | LinkedIn Sales Solutions |
| **Contact** — calm workspace | `e2822e304c36` | https://images.unsplash.com/photo-1524758631624-e2822e304c36 | Bench Accounting |

> **Note:** Team partner photos are explicitly stand-ins and must be replaced with
> actual photographs of the firm's partners before the site is published.
> The `alt` text on each stand-in image states this clearly.

### Verifying Image Licenses

To verify each image's license, visit `https://unsplash.com/photos/{photo-id}`.
The Unsplash License permits:
- Free use for commercial and non-commercial purposes.
- No attribution required (though appreciated).
- Modification and redistribution allowed.
- **Not** permitted: selling unaltered copies of Unsplash photos.

---

## Third-Party Dependencies

| Dependency | Source | Purpose | License |
|---|---|---|---|
| Google Fonts — Playfair Display | fonts.googleapis.com | Heading typography | Free / Open Font License |
| Google Fonts — DM Sans | fonts.googleapis.com | Body typography | Free / Open Font License |
| OpenStreetMap embed | openstreetmap.org | Map on Contact page | ODbL (open data) |
| Unsplash CDN | images.unsplash.com | Photography | Unsplash License |

No npm packages, no JavaScript frameworks, no build step required.

---

## Design System Summary

**Palette**
- `--ink` `#0E1A2B` — primary text
- `--navy` `#1B3252` — header, dark sections
- `--gold` `#C8912A` — accent, CTAs, borders
- `--cream` `#F7F3EB` — alternate section bg
- `--white` `#FEFDFB` — base background

**Typography**
- Headings: `Playfair Display` 700 / 900 (serif)
- Body / UI: `DM Sans` 400 / 500 / 600 (humanist sans)

**Breakpoints**
- `≤ 900px` — mobile nav, stacked layouts
- `≤ 600px` — tighter spacing, single-column footer

---

## Compliance & Ethics Notes

All copy is written to comply with **ICAI's Code of Ethics** (as applicable to
CA firm advertising):
- No comparative or superlative claims ("best", "No. 1", "guaranteed").
- No fabricated testimonials, invented statistics, or fake client logos.
- No solicitation-style language.
- Every page carries the standard disclaimer footer.
- The contact form disclaimer makes clear that form submission does not
  create a professional engagement.

---

## Deployment

This is a fully static site. It can be served from:
- Any static hosting (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
- A shared cPanel / FTP hosting.
- No server-side processing required.

For production, consider:
1. Running images through a WebP converter and hosting locally (removes Unsplash CDN dependency after replacing stand-ins).
2. Adding a real form backend (e.g., Formspree, Netlify Forms, or a PHP mailer) to the contact form.
3. Updating the OpenStreetMap iframe coordinates to the actual office location.
4. Adding `robots.txt` and `sitemap.xml`.
