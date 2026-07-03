/**
 * Backfill script: computes rolling 30-day sales velocity for every product
 * and writes it to Inventory.salesVelocity.
 *
 * Run once after migration:
 *   npx ts-node -r tsconfig-paths/register src/scripts/backfill-velocity.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cutoff = new Date(Date.now() - 30 * 86400_000);

    const products = await prisma.product.findMany({
        select: { id: true, tenantId: true },
    });

    let updated = 0;
    for (const product of products) {
        const result = await prisma.orderItem.aggregate({
            where: {
                productId: product.id,
                order: { createdAt: { gte: cutoff } },
            },
            _sum: { quantity: true },
        });

        const totalQty = result._sum.quantity ?? 0;
        const velocity = totalQty / 30; // units per day

        const inv = await prisma.inventory.findFirst({
            where: { productId: product.id },
        });

        if (inv) {
            await prisma.inventory.update({
                where: { id: inv.id },
                data: { salesVelocity: velocity },
            });
            updated++;
        }
    }

    console.log(`✅ Backfilled salesVelocity for ${updated} inventory records.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
