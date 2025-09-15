import { NextResponse } from "next/server";
import { buyerSchemaRefined } from "@/lib/validation/newBuyer";
import { BHK, City, PrismaClient, Purpose, Source, Timeline } from '../../../../generated/prisma/'
import { rateLimit } from "@/lib/rateLimiter";


const prisma = new PrismaClient()

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const limit = rateLimit(ip)

    if(!limit.success) {
        return NextResponse.json(
            {error: `Rate limit exceeded. Please try again in ${Math.ceil((limit.retryAfter ?? 0)/1000)}s`},
            {status: 429}
        )
    }

    try {
        const body = await req.json();
        const parsed = buyerSchemaRefined.safeParse(body)

        if(!body.ownerId) return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });

        if(!parsed.success) {
            return NextResponse.json({error: parsed.error})
        }

        const newBuyer = await prisma.buyer.create({
            data: {
                ...parsed.data, 
                city: parsed.data.city as City,
                bhk: parsed.data.bhk as BHK,
                purpose: parsed.data.purpose as Purpose,
                timeline: parsed.data.timeline as Timeline,
                source: parsed.data.source as Source,
                owner: {
                    connect: {id: body.ownerId}
                }
            },
        })

        await prisma.buyerHistory.create({
            data: {
                buyerId: newBuyer.id,
                changedBy: parsed.data?.fullName || "",
                diff: {
                    created: newBuyer
                }
            }
        })
        return NextResponse.json(newBuyer, { status: 201 });
    }
    catch(err) {
        console.error(err);
        return NextResponse.json(
            { message: err || "Server error" },
            { status: 400 }
        );
    }
};

