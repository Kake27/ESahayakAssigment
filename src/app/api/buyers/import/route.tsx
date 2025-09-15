import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { buyerSchemaRefined } from "@/lib/validation/newBuyer";
import Papa from "papaparse"


const BHK_MAP: Record<string, string> = {
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "Studio": "Studio",
};

const TIMELINE_MAP: Record<string, string> = {
    "0-3 Months": "M0_3",
    "3-6 Months": "M3_6",
    ">6 Months": "M6_plus",
    "Exploring": "Exploring",
    "0-3m": "M0_3",
    "3-6m": "M3_6",
    ">6m": "M6_plus",
}

const SOURCE_MAP: Record<string, string> = {
    "Walk In": "Walk_in",
    "Website": "Website",
    "Referral": "Referral",
    "Other": "Other",
    "Call": "Call",
}

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ownerId = formData.get("ownerId") as string;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const { data, errors: parseErrors } = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
    });

    if (parseErrors.length > 0) {
        return NextResponse.json({ errors: parseErrors }, { status: 400 });
    }

    if (data.length > 200) {
        return NextResponse.json({ error: "Max 200 rows allowed" }, { status: 400 });
    }

    const rowErrors: { row: number; message: string }[] = [];
    const validRows :any[] = [];

    data.forEach((row: any, i: number) => {
       
        if (row.budgetMin) row.budgetMin = Number(row.budgetMin);
        if (row.budgetMax) row.budgetMax = Number(row.budgetMax);
        
        if (row.tags) {
            row.tags = row.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter((t: string) => t.length > 0);
        } else {
            row.tags = [];
        }

        if (row.bhk) row.bhk = BHK_MAP[row.bhk] || row.bhk;
        if (row.timeline) row.timeline = TIMELINE_MAP[row.timeline] || row.timeline;
        if (row.source) row.source = SOURCE_MAP[row.source] || row.source;

        const parsed = buyerSchemaRefined.safeParse(row);

        if (!parsed.success) {
            rowErrors.push({
                row: i + 2, 
                message: parsed.error.issues.map((e) => e.message).join(", "),
            });
        } else {
            const normalized = {
                ...parsed.data,
                ownerId,
                
                bhk: parsed.data.bhk && parsed.data.bhk.trim() !== "" ? parsed.data.bhk : null,
                budgetMin: parsed.data.budgetMin ?? null,
                budgetMax: parsed.data.budgetMax ?? null,
                notes: parsed.data.notes && parsed.data.notes.trim() !== "" ? parsed.data.notes : null,
                tags: parsed.data.tags ?? [],
                status: parsed.data.status || "New", 
            };

            validRows.push(normalized);
        }
    });


    if (validRows.length === 0) {
        return NextResponse.json({ errors: rowErrors }, { status: 400 });
    }

    try {
        await prisma.$transaction(
            validRows.map((buyer) => prisma.buyer.create({ data: buyer }))
        );

        if (rowErrors.length > 0) {
            return NextResponse.json({
                success: true,
                inserted: validRows.length,
                errors: rowErrors,
            });
        }   

        return NextResponse.json({ success: true, inserted: validRows.length });
    } catch (err: any) {
        console.error("Prisma insert error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
