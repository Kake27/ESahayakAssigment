
import { PrismaClient } from "../../generated/prisma"
import Link from "next/link"
import BuyersClient from "./BuyersClient";

interface BuyersPageProps {
    searchParams: {
        page?: string;
        city?: string;
        propertyType?: string;
        status?: string;
        timeline?: string;
        query?: string; 
    }
}

const PAGE_SIZE = 10;

const prisma = new PrismaClient()

export default async function Buyers({searchParams}: { searchParams: Promise<Record<string, string | undefined>> }) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10)
    const where: any = {}

    // const {user, logout} = useUser()
    // const router = useRouter()


    if (params.city) where.city = params.city;
    if (params.propertyType) where.propertyType = params.propertyType;
    if (params.status) where.status = params.status;
    if (params.timeline) where.timeline = params.timeline;

    if (params.query) {
        where.OR = [
            { fullName: { contains: params.query, mode: "insensitive" } },
            { phone: { contains: params.query } },
            { email: { contains: params.query, mode: "insensitive" } },
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