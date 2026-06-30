# Content, Storage, and Review Architecture

This portal can stay fast and simple on the front end while becoming much easier to manage behind the scenes.

The recommended model is:

- Store page, asset, download, and review metadata in a database.
- Store downloadable files on the same server filesystem, not in the database.
- Store only relative file paths in the database.
- Keep uploaded files outside the deployable web source when the site is running in production.

## Why File Storage Should Stay On The Server

Files such as PPTX masters, PDFs, images, templates, ZIP files, and source assets should not be stored inside database rows. The database should answer questions such as:

- What is this asset called?
- Which category and tags does it belong to?
- Which version is current?
- Where is the downloadable file?
- Who uploaded it?
- Is it draft, published, retired, or archived?

The file itself should live on disk.

For a self-hosted deployment, that means a persistent server folder such as:

```text
/srv/nvidia-academy/storage
```

For local development in this repository, the equivalent folder is:

```text
storage/
```

## Production Storage Rule

Do not rely on the application source folder as the permanent place for uploaded files in production. Deployments can replace source files. Uploaded content should live in a persistent server directory or mounted volume that survives deploys.

Use an environment setting later, for example:

```text
ACADEMY_STORAGE_ROOT=/srv/nvidia-academy/storage
```

The database then stores paths relative to that root:

```text
assets/powerpoint-master/v1/nvidia-academy-master-light.pptx
previews/powerpoint-master/v1/cover.png
```

## Recommended Database

Start with SQLite for the first self-hosted version. It is simple, portable, and enough for a small internal content and review portal.

Move to PostgreSQL later only if the site needs:

- Many simultaneous editors.
- Advanced reporting.
- Integration with other internal systems.
- Stronger admin and audit tooling.

## Core Content Model

```text
pages
page_sections
categories
tags
assets
asset_files
asset_previews
asset_tags
review_targets
review_threads
review_comments
downloads
```

The most important separation is:

```text
Asset = the thing users search for
File = a specific downloadable version of that thing
```

Example:

```text
Asset:
  NVIDIA Academy PowerPoint Master

Files:
  nvidia-academy-master_Light.pptx
  nvidia-academy-master_Dark.pptx
  future v2 file
  preview image
```

## Review Side Panel Model

The review panel should not attach comments only to screen coordinates. Coordinates break when layout changes.

Use stable page anchors instead:

```html
<section data-review-id="assets.powerpoint-master">
```

A comment can then store:

- The page id.
- The review target id.
- A CSS selector or `data-review-id`.
- Optional selected text.
- Optional x/y position as a fallback.
- Thread status.

This lets reviewers comment on a specific heading, paragraph, image, card, button, or downloadable asset.

## Suggested Build Sequence

1. Add the schema and catalog structure.
2. Add stable `data-review-id` attributes to major page sections and cards.
3. Replace hardcoded asset listings with database-backed or catalog-backed rendering.
4. Add a self-hosted API for comments and asset metadata.
5. Add the right-side review panel.
6. Add uploads and admin workflow.

The current repository now includes the first layer: schema, storage convention, and a seed catalog.
