-- Drop existing tables and triggers
DROP TRIGGER IF EXISTS update_admin_timestamp;
DROP TRIGGER IF EXISTS update_images_timestamp;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS admins;


-- Create admins table
CREATE TABLE admins(
  id TEXT PRIMARY KEY, -- Generate a UUID in application
  email TEXT UNIQUE NOT NULL, -- Force valid email format in application
  password TEXT NOT NULL, -- Store salted hash only
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE images(
    id TEXT PRIMARY KEY,
    cloudflare_id TEXT NOT NULL,
    url TEXT NOT NULL,
    lqip_url TEXT NOT NULL,
    alt_text TEXT,
    category TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers
CREATE TRIGGER update_admin_timestamp 
AFTER UPDATE ON admins
BEGIN
  UPDATE admins SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE TRIGGER update_images_timestamp 
AFTER UPDATE ON images
BEGIN
  UPDATE images SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;



