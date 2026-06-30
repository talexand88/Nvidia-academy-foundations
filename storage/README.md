# Server-managed file storage

This folder documents the self-hosted file storage convention.

In local development, files can live here. In production, use a persistent server folder or mounted volume and point the app to it with an environment variable such as:

```text
ACADEMY_STORAGE_ROOT=/srv/nvidia-academy/storage
```

## Layout

```text
storage/
  assets/
    {asset-id}/
      {version}/
        original-file.ext
  previews/
    {asset-id}/
      {version}/
        preview.png
  tmp/
    uploads/
```

## What Goes In Git

The folder convention and `.gitkeep` files can be tracked.

Uploaded files should not be committed by default. They are ignored so the server can manage them safely.

Existing curated downloads that are part of the source-controlled portal can remain in `downloads/` until the backend migration moves them into server-managed storage.
