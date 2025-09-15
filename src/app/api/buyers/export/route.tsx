import { prisma } from "@/lib/prisma";;    
import { NextResponse } from "next/server";
import {Parser} from "json2csv";


export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)

    const where: Record<string, unknown> = {}
    if (searchParams.get("city")) where.city = searchParams.get("city");
    if (searchParams.get("propertyType")) where.propertyType = searchParams.get("propertyType");
    if (searchParams.get("status")) where.status = searchParams.get("status");
    if (searchParams.get("timeline")) where.timeline = searchParams.get("timeline"); 

    if (searchParams.get("query")) {
        where.OR = [
        { fullName: { contains: searchParams.get("query")!, mode: "insensitive" } },
        { phone: { contains: searchParams.get("query")! } },
        { email: { contains: searchParams.get("query")!, mode: "insensitive" } },
        ];
    }

    const buyers = await prisma.buyer.findMany({
        where,
        orderBy: { updatedAt: "desc" },
    });

    const data = buyers.map((b) => ({
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        city: b.city,
        propertyType: b.propertyType,
        bhk: b.bhk,
        purpose: b.purpose,
        budgetMin: b.budgetMin,
        budgetMax: b.budgetMax,
        timeline: b.timeline,
        source: b.source,
        notes: b.notes,
        tags: b.tags?.join(", "),
        status: b.status,
        updatedAt: b.updatedAt.toISOString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    return new NextResponse(csv, {
        headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=buyers.csv",
        },
    });
}
