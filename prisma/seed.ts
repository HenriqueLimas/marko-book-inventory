import { PrismaClient } from "prisma-app/client";
import fs from "node:fs";
import { join, dirname } from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url"; // Use 'node:url' for explicit built-in module import

const __dirname = dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database");

  console.log('Seeding authors')
  const authorFileStream = fs.createReadStream(
    join(__dirname, "/authors.json"),
  );
  const authorReadline = readline.createInterface({
    input: authorFileStream,
    crlfDelay: Infinity,
  });

  for await (const line of authorReadline) {
    try {
      const author = JSON.parse(line);
      await prisma.author.upsert({
        where: { id: Number(author.author_id) },
        update: {},
        create: {
          id: Number(author.author_id),
          name: author.name,
          average_rating: Number(author.average_rating),
          text_reviews_count: Number(author.text_reviews_count) || 0,
          ratings_count: Number(author.ratings_count) || 0,
        },
      });
    } catch (error) {
      console.error(`Error parsing author ${line}`, error);
      throw error;
    }
  }

  console.log('Seeding books')
  const bookFileStream = fs.createReadStream(
    join(__dirname, "/books.json"),
  );
  const bookReadline = readline.createInterface({
    input: bookFileStream,
    crlfDelay: Infinity,
  });

  let counter = 0;
  for await (const line of bookReadline) {
    if (++counter > 680000) break;

    try {
      const book = JSON.parse(line);
      await prisma.book.upsert({
        where: { id: Number(book.book_id) },
        update: {},
        create: {
          id: Number(book.book_id),
          isbn: book.isbn || undefined,
          isbn13: book.isbn13,
          title: book.title,
          publication_year: Number(book.publication_year) || null,
          publisher: book.publisher,
          image_url: book.image_url,
          description: book.description,
          num_pages: Number(book.num_pages),
          language_code: book.language_code,
          text_reviews_count: Number(book.text_reviews_count),
          ratings_count: Number(book.ratings_count),
          average_rating: Number(book.average_rating),
          popular_shelves: book.popular_shelves,
          metadata: book.metadata,
          title_tsv: book.title_tsv || "",
          thumbhash: book.thumbhash,
        },
      });

      for (const author of book.authors) {
        await prisma.bookToAuthor.upsert({
          where: {
            bookId_authorId: {
              bookId: Number(book.book_id),
              authorId: Number(author.author_id),
            },
          },
          update: {},
          create: {
            bookId: Number(book.book_id),
            authorId: Number(author.author_id),
          },
        });
      }
    } catch (error) {
      console.error(`Error parsing book ${line}`, error);
      throw error;
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
