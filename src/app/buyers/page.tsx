import {prisma} from "../../lib/prisma"
import BuyersClient from "./BuyersClient";

const PAGE_SIZE = 10;

export default async function Buyers({searchParams}: { searchParams: Promise<Record<string, string | undefined>> }) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10)
    const where: any = {}


    if (params.city) where.city = params.city;
    if (params.propertyType) where.propertyType = params.propertyType;
    if (params.status) where.status = params.status;
    if (params.timeline) where.timeline = params.timeline;

    if (params.query && params.query.trim()!=="") {
        where.OR = [
            { fullName: { contains: params.query, mode: "insensitive" } },
            { phone: { contains: params.query } },
            { email: { contains: params.query, mode: "insensitive" } },
            { notes: { contains: params.query, mode: "insensitive" } }
        ];
    }

    const buyers = await prisma.buyer.findMany({
        where,
        orderBy: {updatedAt: "desc"},
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE
    })

    const total = await prisma.buyer.count({where})

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <BuyersClient
            buyers={buyers}
            totalPages={totalPages} 
            currentPage={page}
            params={params}
        />
    )
}