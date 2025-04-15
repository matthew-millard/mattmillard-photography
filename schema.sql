-- Drop existing tables and triggers
DROP TRIGGER IF EXISTS update_images_timestamp;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    lqip_url TEXT NOT NULL,
    alt_text TEXT,
    category TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_images_timestamp 
AFTER UPDATE ON images
BEGIN
  UPDATE images SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;
