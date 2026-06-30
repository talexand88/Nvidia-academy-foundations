# NVIDIA Academy Visual Foundations

The design reference portal for everyone producing NVIDIA Academy materials — slides, video, and web.

Design standards, downloadable assets, and production tools in one place.

## What's inside

- **Content** — practical guides for typography, color, frames & cards, spacing, logos, code & CLI, and charts. Specs by surface (PowerPoint and After Effects), do / don't examples, quick-reference tables.
- **Assets** — searchable library of 672 NVIDIA marketing icons, plus the asset categories for logos, photography, fonts, and starter templates.
- **Toolkit** — a pattern picker that recommends the right pattern from three quick questions, a screenshot reviewer (UI mockup), and a PowerPoint deck validator (UI mockup).
- **Motion** — reserved for v2. Will mirror the Icons library structure, paired 1:1 with Lottie animations.

## Run locally

The site is static HTML, CSS, and JavaScript — no build step.

Open `index.html` in any modern browser. For the icon library, run a small local server so the data files load via `<script>` tags (they're set up to work from `file://` too, but a server is more reliable):

```
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy via GitHub Pages

1. Create a new repo on github.com (e.g. `nvidia-academy-foundations`)
2. From this folder, push the contents:

   ```
   git init
   git add .
   git commit -m "Initial commit — NVIDIA Academy Visual Foundations v0.1"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

3. On GitHub, go to repo **Settings → Pages**, set **Source** to the `main` branch / root, and save.
4. Within a minute, the site is live at `https://<your-username>.github.io/<your-repo>/`.

## Content platform plan

The current portal is static HTML. The next version can add a self-hosted backend without using a third-party file storage service:

- SQLite stores page, asset, download, and review-comment metadata.
- Server disk stores uploaded and downloadable files.
- The database stores relative paths to files, not file contents.
- Review comments anchor to stable page targets with `data-review-id`.

See `docs/content-storage-architecture.md`, `server/schema.sql`, and `storage/README.md`.

## File structure

```
portal/
├── index.html                home (hero, footer menu)
├── content.html              guides hub
├── assets.html               assets hub
├── toolkit.html              tools hub
├── motion.html               v2 placeholder
├── search.html               search results
├── typography.html           guide
├── color.html                guide
├── frames-cards.html         guide
├── spacing.html              guide
├── icons.html                live icon library (672 icons)
├── logos.html                logos asset page (download lockups)
├── templates.html            templates asset page (PowerPoint master, AE)
├── logos-hero.html           guide (Logos)
├── imagery.html              guide
├── code-cli.html             guide
├── charts.html               guide
├── patterns.html             patterns hub (banners, notifications, …)
├── topologies.html           guide (network and system diagrams, draft)
├── banners.html              pattern: Kaizen banner (info/warning/error/success)
├── notifications.html        pattern: Kaizen notification (white card + stripe)
├── tables.html               pattern: Academy table (green titles, zebra rows, ✓/✗)
├── lists.html                pattern: 3-level bullets, NVIDIA-green dots
├── timeline.html             pattern: horizontal stops + progress bar
├── hero.html                 pattern: Kaizen hero (eyebrow / title / body / CTAs)
├── pattern-tree.html         tool
├── screenshot-review.html    tool (UI mockup)
├── pptx-validator.html       tool (UI mockup)
├── shared/
│   └── tokens.css            design tokens + shared component CSS
├── data/
│   ├── icons.js              672 icons metadata
│   ├── svg-paths.js          SVG path strings keyed by hash
│   └── synonyms.js           search synonym expansion
└── downloads/
    ├── logos/                NVIDIA wordmark PNGs (6 variants)
    └── templates/            PowerPoint masters (Light, Dark)
```

## Status

Version 0.1 — Draft. Topic guides are complete; AI-powered toolkit tools (screenshot review, deck validator) are UI mockups pending backend integration.

## Feedback

Email <academy-design@nvidia.com> with comments and suggestions.
