DROP TABLE IF EXISTS ImageCategory;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Image;

-- Main images table with common properties
CREATE TABLE IF NOT EXISTS Images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL,
    title TEXT NOT NULL,
    altText TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Categories table
CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- Junction table for many-to-many relationship between images and categories
CREATE TABLE IF NOT EXISTS ImageCategories (
    imageId INTEGER,
    categoryId INTEGER,
    PRIMARY KEY (imageId, categoryId),
    FOREIGN KEY (imageId) REFERENCES Image(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE
);

-- Insert some default categories
INSERT INTO Categories (name, slug) VALUES 
    ('Drinks', 'drinks'),
    ('Food', 'food'),
    ('People', 'people'),
    ('Interior', 'interior'),
    ('Studio', 'studio');

-- Insert some fake images
INSERT INTO Images (imageUrl, title, altText) VALUES
('https://myimage.com/first', 'First Image', 'A fake image'),
('https://myimage.com/second', 'Second Image', 'A fake image'),
('https://myimage.com/third', 'Third Image', 'A fake image');



