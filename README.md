# Adrian Voss — Portfolio

A premium, single-page portfolio built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Run it

Open `index.html` directly in a browser, or serve the folder locally (recommended, since certificates load via `fetch`):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## File structure

```
index.html              Page markup, all sections
style.css                Design tokens + all styling
script.js                All interactivity (theme, animations, modal, filters, slider, form)
data/certificates.json   Certificate content — edit this to update the Certificates section
assets/
  certificates/          Certificate preview images (SVG placeholders — swap for real images)
  images/                Reserved for your profile photo / project screenshots
  icons/                 Reserved for extra icon assets
```

## Editing content

- **Text**: everything lives directly in `index.html` — name, role, bio, timeline, skills, project copy, testimonials, contact details. Search for the section by its `<section id="...">` comment.
- **Profile photo**: the hero currently uses a CSS gradient placeholder with initials (`.portrait-avatar` / `.portrait-initials` in `index.html`). Replace that `<div>` with an `<img>` pointing at `assets/images/your-photo.jpg`.
- **Projects**: duplicate a `.project-card` block inside `#projects`, update the `data-category` attribute (`product`, `design`, or `fullstack`) so it works with the filter buttons.
- **Certificates**: edit `data/certificates.json` only. Each object becomes one card automatically, including the modal content:

```json
{
  "id": "cert-07",
  "title": "Your Certificate Title",
  "organization": "Issuing Organization",
  "date": "Month Year",
  "image": "assets/certificates/your-image.jpg",
  "shortDescription": "One line shown on the card.",
  "fullDescription": "Longer paragraph shown inside the modal.",
  "skills": ["Skill One", "Skill Two"],
  "tags": ["Category"],
  "credentialId": "ABC-123",
  "verifyUrl": "https://verify-link.example.com"
}
```

- **Colors / fonts**: all design tokens are CSS custom properties at the top of `style.css` under `:root` (dark mode) and `[data-theme="light"]` (light mode overrides).

## Notes

- The contact form is front-end only (no backend). Wire `#contactForm`'s submit handler in `script.js` to a service like Formspree, Netlify Forms, or your own API endpoint.
- Respects `prefers-reduced-motion`.
- Custom cursor and particle effects are automatically disabled on touch/narrow screens.