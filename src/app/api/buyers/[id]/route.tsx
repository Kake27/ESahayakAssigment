import { PrismaClient } from "../../../../generated/prisma";
import { buyerSchema } from "@/lib/validation/newBuyer";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const parsed = buyerSchema.parse(body)

        const param = await params
        const id = param.id
        
        const buyer = await prisma.buyer.findUnique({where: {id:params.id}})

        if(!buyer) return NextResponse.json({error: "Not found"}, {status:404});

        if (new Date(body.updatedAt).getTime() !== buyer.updatedAt.getTime()) {
            return NextResponse.json(
                { error: "Record changed, please refresh" },
                { status: 409 }
            );
        }

        const updated = await prisma.buyer.update({
            where: {id: id},
            data: parsed,
        })

        await prisma.buyerHistory.create({
        data: {
            buyerId: updated.id,
            changedBy: "TODO: userName", // get from context or frontend
            diff: { old: buyer, new: updated },
        },
        });

        return NextResponse.json(updated);
    }
    catch(err:any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
    
}