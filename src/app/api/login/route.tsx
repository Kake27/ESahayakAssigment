import { NextResponse } from "next/server";
import { PrismaClient } from '../../../generated/prisma/'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const {name} = await req.json()

        if(!name || name.trim().length < 2) return NextResponse.json({error: "Name must be at least 2 characters long"}, {status: 400});

        let user = await prisma.user.findFirst({
            where: {name: name.trim()}
        })

        if(!user) {
            user = await prisma.user.create({
                data: {name: name.trim()}
            });
        }

        return NextResponse.json({id: user.id, name: user.name}, {status: 200});
    }
    catch(err) {
        console.error(err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
