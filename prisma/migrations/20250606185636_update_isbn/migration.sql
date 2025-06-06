-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT,
    "isbn13" TEXT,
    "title" TEXT NOT NULL,
    "publication_year" INTEGER,
    "publisher" TEXT,
    "image_url" TEXT,
    "description" TEXT,
    "num_pages" INTEGER,
    "language_code" TEXT,
    "text_reviews_count" INTEGER,
    "ratings_count" INTEGER,
    "average_rating" DECIMAL,
    "popular_shelves" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "title_tsv" TEXT NOT NULL,
    "thumbhash" TEXT
);
INSERT INTO "new_Book" ("average_rating", "createdAt", "description", "id", "image_url", "isbn", "isbn13", "language_code", "metadata", "num_pages", "popular_shelves", "publication_year", "publisher", "ratings_count", "text_reviews_count", "thumbhash", "title", "title_tsv") SELECT "average_rating", "createdAt", "description", "id", "image_url", "isbn", "isbn13", "language_code", "metadata", "num_pages", "popular_shelves", "publication_year", "publisher", "ratings_count", "text_reviews_count", "thumbhash", "title", "title_tsv" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
