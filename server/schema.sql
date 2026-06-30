PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  href TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL CHECK (content_type IN ('home', 'hub', 'guide', 'pattern', 'tool', 'asset_page', 'placeholder')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  summary TEXT,
  owner_email TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_sections (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  review_key TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  UNIQUE (page_id, review_key)
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  parent_id TEXT,
  category_type TEXT NOT NULL CHECK (category_type IN ('content', 'asset', 'pattern', 'tag_group')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('icon_library', 'logo', 'template', 'deck', 'image', 'font', 'plugin', 'document', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'coming_soon', 'retired', 'archived')),
  category_id TEXT,
  summary TEXT,
  source_url TEXT,
  owner_email TEXT,
  primary_page_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (primary_page_id) REFERENCES pages(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS asset_files (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  version_label TEXT NOT NULL DEFAULT 'v1',
  display_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_href TEXT,
  content_type TEXT,
  file_size_bytes INTEGER,
  checksum_sha256 TEXT,
  width_px INTEGER,
  height_px INTEGER,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'retired', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  UNIQUE (asset_id, version_label, file_name)
);

CREATE TABLE IF NOT EXISTS asset_previews (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  asset_file_id TEXT,
  storage_path TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_file_id) REFERENCES asset_files(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS asset_tags (
  asset_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (asset_id, tag_id),
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review_targets (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('page', 'section', 'asset', 'element', 'text_selection')),
  target_key TEXT NOT NULL,
  selector TEXT,
  label TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  UNIQUE (page_id, target_key)
);

CREATE TABLE IF NOT EXISTS review_threads (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  target_id TEXT,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'archived')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_by TEXT,
  assigned_to TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES review_targets(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS review_comments (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  parent_comment_id TEXT,
  body TEXT NOT NULL,
  selected_text TEXT,
  viewport_x REAL,
  viewport_y REAL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES review_threads(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES review_comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  asset_file_id TEXT NOT NULL,
  requested_by TEXT,
  requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  referrer TEXT,
  FOREIGN KEY (asset_file_id) REFERENCES asset_files(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS page_sections_page_id_idx ON page_sections(page_id);
CREATE INDEX IF NOT EXISTS assets_category_id_idx ON assets(category_id);
CREATE INDEX IF NOT EXISTS asset_files_asset_id_idx ON asset_files(asset_id);
CREATE INDEX IF NOT EXISTS asset_tags_tag_id_idx ON asset_tags(tag_id);
CREATE INDEX IF NOT EXISTS review_targets_page_id_idx ON review_targets(page_id);
CREATE INDEX IF NOT EXISTS review_threads_page_status_idx ON review_threads(page_id, status);
CREATE INDEX IF NOT EXISTS review_comments_thread_id_idx ON review_comments(thread_id);
CREATE INDEX IF NOT EXISTS downloads_asset_file_id_idx ON downloads(asset_file_id);
