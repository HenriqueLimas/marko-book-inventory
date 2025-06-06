import { PrismaClient } from '#prisma/client'
import type { SearchParams } from '../utils';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db'
        }
    }
})

export const ITEMS_PER_PAGE = 28;

export async function fetchBooksWithPagination(searchParams: SearchParams) {
    const requestedPage = Math.max(1, Number(searchParams.page) || 1)
    const offset = (requestedPage - 1) * ITEMS_PER_PAGE

    const paginatedBooks = await prisma.book.findMany({
        skip: offset,
        take: ITEMS_PER_PAGE,
        where: {
            isbn: searchParams.isbn && {
                in: searchParams.isbn.split(',')
            },
            average_rating: searchParams.rtg && {
                gte: searchParams.rtg
            },
            publication_year: searchParams.yr ? {
                gte: 1950,
                lte: Math.max(1950, Math.min(new Date().getFullYear(), Number(searchParams.yr)))
            } : {
                gte: 1950,
                lte: new Date().getFullYear()
            },
            language_code: searchParams.lng === 'en' ? {
                in: ['eng', 'en-US', 'en-GB']
            } : searchParams.lng,
            num_pages: {
                lte: Math.min(1000, Number(searchParams.pgs) || 1000)
            }
        }
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