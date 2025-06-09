import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from "prisma-app/client";
import type { SearchParams } from "../utils";

const adapter = new PrismaLibSQL({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})
const prisma = new PrismaClient({ adapter }).$extends(withAccelerate());

export const ITEMS_PER_PAGE = 28;

function createFilter(searchParams: SearchParams) {
  return {
    title: searchParams.q && {
      contains: searchParams.q,
    },
    isbn: searchParams.isbn && {
      in: searchParams.isbn.split(","),
    },
    average_rating: searchParams.rtg && {
      gte: searchParams.rtg,
    },
    publication_year: searchParams.yr
      ? {
          gte: 1950,
          lte: Math.max(
            1950,
            Math.min(new Date().getFullYear(), Number(searchParams.yr)),
          ),
        }
      : {
          gte: 1950,
          lte: new Date().getFullYear(),
        },
    language_code:
      searchParams.lng === "en"
        ? {
            in: ["eng", "en-US", "en-GB"],
          }
        : searchParams.lng,
    num_pages: {
      lte: Math.min(1000, Number(searchParams.pgs) || 1000),
    },
  };
}

export async function fetchBooksWithPagination(searchParams: SearchParams) {
  const requestedPage = Math.max(1, Number(searchParams.page) || 1);
  const offset = (requestedPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = await prisma.book.findMany({
    skip: offset,
    take: ITEMS_PER_PAGE,
    where: createFilter(searchParams),
  });

  return paginatedBooks;
}

export async function estimateTotalBooks(searchParams: SearchParams) {
  const result = await prisma.book.aggregate({
    _count: {
      id: true,
    },
    where: createFilter(searchParams),
  });

  if (typeof result?._count === 'object') {
    return result._count.id || 0
  }
  return 0;
}

export async function fetchBookById(id: string) {
  const data = await prisma.book.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      BookToAuthor: {
        include: {
          author: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  const book = {
    id: data?.id,
    isbn: data?.isbn,
    title: data?.title,
    image_url: data?.image_url,
    publication_year: data?.publication_year,
    ratings_count: data?.ratings_count,
    description: data?.description,
    num_pages: data?.num_pages,
    language_code: data?.language_code,
    average_rating: data?.average_rating,
    authors: data?.BookToAuthor?.map(bookToAuthor => bookToAuthor.author.name)
  }

  return book;
}
