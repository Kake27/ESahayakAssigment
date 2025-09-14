import { PrismaClient } from "../../../generated/prisma";
import BuyerClient from "./BuyerClient";

const prisma = new PrismaClient()

export default async function ViewAndEditPage({
    params,
    searchParams,
} : {
    params: { id: string };
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const param = await params
    const id = param.id;

    const query = await searchParams
    const mode = query.mode === "edit" ? "edit" : "view";

    const buyer = await prisma.buyer.findUnique({ where: {id} , })

    if(!buyer) {
        return <div className="p-6">Buyer not found</div>
    }

    const history = await prisma.buyerHistory.findMany({
        where: { buyerId: id },
        orderBy: { changedAt: "desc" },
        take: 5,
    });

  return (
    <BuyerClient buyer={buyer} history={history} mode={mode} />
  );
}