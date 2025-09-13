import { NextResponse } from "next/server";
import { buyerSchemaRefined } from "@/lib/validation/newBuyer";
import { PrismaClient } from '../../../../generated/prisma/'


const prisma = new PrismaClient()

export async function POST(req: Request) {

    try {
        const body = await req.json();
        const parsed = buyerSchemaRefined.safeParse(body)

        if(!body.ownerId) return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });

        const newBuyer = await prisma.buyer.create({
            data: {
                ...parsed.data, 
                ownerId: body.ownerId,
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

