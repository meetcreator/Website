import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // Create Tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Acme Corp',
            email: 'admin@acme.com',
        },
    });

    // Create User
    const user = await prisma.user.create({
        data: {
            email: 'user@acme.com',
            password,
            name: 'Acme Admin',
            role: 'ADMIN',
            tenantId: tenant.id,
        },
    });

    // Create Products & Inventory
    const products = [
        { name: 'Ultra-Widget', sku: 'UW-001', price: 99.99, cost: 40.0 },
        { name: 'Mega-Grip', sku: 'MG-001', price: 49.99, cost: 20.0 },
    ];

    for (const p of products) {
        const product = await prisma.product.create({
            data: {
                ...p,
                tenantId: tenant.id,
                inventory: {
                    create: {
                        quantity: Math.floor(Math.random() * 100),
                        minThreshold: 10,
                    },
                },
            },
        });
    }

    // Create Sample Customer
    const customer = await prisma.customer.create({
        data: {
            name: 'Global Retailers',
            email: 'contact@global.com',
            tenantId: tenant.id,
        },
    });

    // Create Sample Orders
    for (let i = 0; i < 5; i++) {
        const revenue = Math.random() * 500 + 100;
        const cost = revenue * 0.4;
        await prisma.order.create({
            data: {
                orderNumber: `ORD-${1000 + i}`,
                customerId: customer.id,
                totalAmount: revenue,
                totalCost: cost,
                revenue,
                profit: revenue - cost,
                tenantId: tenant.id,
            },
        });
    }

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
