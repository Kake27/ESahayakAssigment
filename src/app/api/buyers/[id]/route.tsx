import { PrismaClient, City, PropertyType, BHK, Purpose, Timeline, Source, Status } from "../../../../generated/prisma";
import { buyerSchemaRefined } from "@/lib/validation/newBuyer";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function PUT(req: Request, { params }: { params: Promise<{id:string}>}) {
    try {
        const body = await req.json()
        const parsed = buyerSchemaRefined.parse(body)

        const param = await params
        const id = param.id
        
        const buyer = await prisma.buyer.findUnique({where: {id: id}})

        if(!buyer) return NextResponse.json({error: "Not found"}, {status:404});

        if (new Date(body.updatedAt).getTime() !== buyer.updatedAt.getTime()) {
            return NextResponse.json(
                { error: "Record changed, please refresh" },
                { status: 409 }
            );
        }

        const updated = await prisma.buyer.update({
            where: {id: id},
            data : {
                fullName: parsed.fullName,
                email: parsed.email,
                phone: parsed.phone,
                city: parsed.city as City,
                propertyType: parsed.propertyType as PropertyType,
                bhk: parsed.bhk ? (parsed.bhk as BHK) : null,
                purpose: parsed.purpose as Purpose,
                budgetMin: parsed.budgetMin,
                budgetMax: parsed.budgetMax,
                timeline: parsed.timeline as Timeline,
                source: parsed.source as Source,
                status: parsed.status as Status,
                notes: parsed.notes,
                tags: parsed.tags,
            },

        })

        await prisma.buyerHistory.create({
            data: {
                buyerId: updated.id,
                changedBy: body.changedBy, 
                diff: { old: buyer, new: updated },
            },
        });

        return NextResponse.json(updated);
    }
    catch(err) {
        const errorMessage = typeof err === "object" && err !== null && "message" in err ? (err as { message: string }).message : "An error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
}

export async function DELETE(req: NextRequest, {params}:  {params: Promise<{id:string}>}) {
    try {
        const param = await params
        const id  = param.id

        await prisma.buyerHistory.deleteMany({
            where: {buyerId: id}
        })

        await prisma.buyer.delete({
            where: {id}
        })

        return NextResponse.json({success: true}, {status: 200});
    }
    catch(err) {
        const errorMessage = typeof err === "object" && err !== null && "message" in err ? (err as { message: string }).message : "Failed to delete buyer";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}