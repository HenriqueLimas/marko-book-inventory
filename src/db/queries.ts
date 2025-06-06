import { PrismaClient } from '#prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db'
        }
    }
})

export type SearchParams = {
    q?: string;
    yr?: string;
    rtg?: string;
    lng?: string;
    isbn?: string;
    page?: string;
}

export const ITEMS_PER_PAGE = 28;

export async function fetchBooksWithPagination(searchParams: SearchParams) {
    const requestedPage = Math.max(1, Number(searchParams.page) || 1)
    const offset = (requestedPage - 1) * ITEMS_PER_PAGE

    const paginatedBooks = await prisma.book.findMany({
        skip: offset,
        take: ITEMS_PER_PAGE
    })

    return paginatedBooks
}

export async function estimateTotalBooks(searchParams: SearchParams) {
    const result = await prisma.book.aggregate({
        _count: {
            id: true
        }
    })

    return result._count.id
}