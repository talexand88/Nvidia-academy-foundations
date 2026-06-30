# Self-hosted backend plan

This folder is the future home for the small server that will power:

- Asset metadata.
- Download records.
- Uploads.
- Anchored review comments.
- Comment thread status.

## Storage Choice

The files do not need a third-party storage service.

Recommended first version:

- SQLite database for metadata and comments.
- Local server filesystem for downloadable files.
- A persistent storage root configured by environment variable.

Example production layout:

```text
/srv/nvidia-academy/app
/srv/nvidia-academy/storage
/srv/nvidia-academy/data/academy.sqlite
```

Example local layout:

```text
server/data/academy.sqlite
storage/assets/
storage/previews/
storage/tmp/
```

## Database Schema

`schema.sql` defines the first-pass relational model.

The app should run that schema at startup or through a small migration command before serving traffic.

## File Handling Rules

- Store files under the configured storage root.
- Store relative paths in the database.
- Never trust user-provided file names as storage paths.
- Generate stable asset ids and version folders.
- Keep temporary uploads in `storage/tmp/` until they are validated.
- Log downloads in the `downloads` table when useful.

## Future API Shape

```text
GET    /api/pages
GET    /api/assets
POST   /api/assets
POST   /api/assets/:id/files
GET    /api/review/comments?page=:pageId
POST   /api/review/comments
PATCH  /api/review/threads/:id
```

Authentication and permissions should be added before upload endpoints are enabled for a shared deployment.
