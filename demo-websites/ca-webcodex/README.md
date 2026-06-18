# Rao & Mehta Chartered Accountants Static Website

Lightweight static HTML/CSS/vanilla JS site for an Indian Chartered Accountancy firm. The copy is intentionally restrained to stay compatible with ICAI-style professional communication.

## Pages

- `index.html` - Home
- `about.html` - Firm history, mission, partner qualifications and values
- `services.html` - Detailed service breakdown
- `industries.html` - Industries served
- `resources.html` - Compliance calendar
- `careers.html` - Articleship, internship and staff openings
- `team.html` - Partner and staff profiles
- `contact.html` - Contact details, map embed and enquiry form
- `privacy.html` and `sitemap.html`

## Replace Before Publishing

- Firm name if required
- ICAI Firm Registration Number: currently `012345S`
- Partner ICAI membership numbers: currently `XXXXXX`
- Address, phone, email, office hours and map location
- Team photos, if real approved photography is available
- Privacy policy wording after legal review
- Form submission endpoint

## Image Sources and License

All images are loaded from Unsplash CDN with `auto=format`, width constraints and WebP/JPG fallbacks. Unsplash states that photos may be used for free, including commercial purposes, without attribution, subject to the Unsplash License restrictions. Verify each final image before launch if the firm has strict procurement requirements.

License page: https://unsplash.com/license

| Use | CDN URL | Source |
| --- | --- | --- |
| Home hero office | `https://images.unsplash.com/photo-1497366754035-f200968a6e72` | Unsplash |
| Home meeting/about context | `https://images.unsplash.com/photo-1517048676732-d65bc937f952` | Unsplash |
| About ledger/calculator | `https://images.unsplash.com/photo-1554224155-6726b3ff858f` | Unsplash |
| Services tax documents | `https://images.unsplash.com/photo-1554224154-26032ffc0d07` | Unsplash |
| Team portrait placeholder 1 | `https://images.unsplash.com/photo-1556157382-97eda2d62296` | Unsplash |
| Team portrait placeholder 2 | `https://images.unsplash.com/photo-1507679799987-c73779587ccf` | Unsplash |
| Team discussion placeholder | `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4` | Unsplash |
| Contact office workspace | `https://images.unsplash.com/photo-1497366811353-6870744d04b2` | Unsplash |

## Performance Notes

- No frontend framework or animation library.
- CSS is a single local file; JS only handles mobile navigation and the static form message.
- Images are lazy-loaded below the fold and constrained through CDN sizing.
- Typography uses system serif/sans stacks to avoid external font weight.
