-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "average_rating" DECIMAL,
    "text_reviews_count" INTEGER,
    "ratings_count" INTEGER
);

-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "BookToAuthor" (
    "bookId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    PRIMARY KEY ("bookId", "authorId"),
    CONSTRAINT "BookToAuthor_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookToAuthor_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
