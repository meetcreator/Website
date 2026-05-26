import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Guest Demo Data seeding...');

    const demoEmail = 'demo@archshield.io';
    const demoPassword = 'demo123';
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    // 1. Create/Update Demo Tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'demo-tenant-id' }, // Use a fixed ID for easy reference/cleanup
        update: {},
        create: {
            id: 'demo-tenant-id',
            name: 'Archshield Demo Corp',
            email: demoEmail,
        },
    });

    // 2. Create/Update Demo User
    const user = await prisma.user.upsert({
        where: { email: demoEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            tenantId: tenant.id,
        },
        create: {
            email: demoEmail,
            password: hashedPassword,
            name: 'Demo Admin',
            role: 'ADMIN',
            tenantId: tenant.id,
        },
    });

    // 3. Clear existing guest data for a fresh start (Optional but good for demo)
    await prisma.orderItem.deleteMany({ where: { order: { tenantId: tenant.id } } });
    await prisma.order.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.inventory.deleteMany({ where: { product: { tenantId: tenant.id } } });
    await prisma.product.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.strategicClient.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.campaign.deleteMany({ where: { tenantId: tenant.id } });
    await prisma.customer.deleteMany({ where: { tenantId: tenant.id } });

    // 4. Create Products & Inventory
    const productData = [
        { name: 'Quantum Server Node', sku: 'QN-100', price: 1200, cost: 500, stock: 45, min: 20 },
        { name: 'Neural Link Interface', sku: 'NL-200', price: 450, cost: 150, stock: 12, min: 25 },
        { name: 'Optic Fiber Hub', sku: 'OF-300', price: 800, cost: 300, stock: 85, min: 30 },
        { name: 'Shield Firewall Unit', sku: 'SF-400', price: 2100, cost: 900, stock: 5, min: 10 },
        { name: 'Data Storage Array', sku: 'DS-500', price: 1500, cost: 700, stock: 120, min: 50 },
        { name: 'Crypto Key Module', sku: 'CK-600', price: 95, cost: 20, stock: 450, min: 100 },
        { name: 'Edge Compute Blade', sku: 'EB-700', price: 3200, cost: 1400, stock: 8, min: 5 },
        { name: 'AI Accelerator Card', sku: 'AA-800', price: 1800, cost: 800, stock: 65, min: 20 },
    ];

    for (const p of productData) {
        await prisma.product.create({
            data: {
                name: p.name,
                sku: p.sku,
                price: p.price,
                cost: p.cost,
                tenantId: tenant.id,
                inventory: {
                    create: {
                        quantity: p.stock,
                        minThreshold: p.min,
                    },
                },
            },
        });
    }

    // 5. Create Strategic Clients
    const clientData = [
        { name: 'Global Tech Industries', value: 450000, growth: '+12.4%' },
        { name: 'Nexus Logistics', value: 280000, growth: '+8.2%' },
        { name: 'Horizon Fintech', value: 620000, growth: '+15.1%' },
        { name: 'Cyberdyne Systems', value: 150000, growth: '-2.4%' },
        { name: 'Omni Consumer Products', value: 890000, growth: '+5.7%' },
        { name: 'Stark Enterprises', value: 1200000, growth: '+22.8%' },
    ];

    for (const c of clientData) {
        await prisma.strategicClient.create({
            data: {
                ...c,
                tenantId: tenant.id,
            },
        });
    }

    // 6. Create Campaigns
    const campaigns = [
        { name: 'Summer Ops Boost', segment: 'Enterprise', status: 'DEPLOYED' },
        { name: 'Security Audit Q3', segment: 'Mid-Market', status: 'PAUSED' },
        { name: 'Cloud Migration 2026', segment: 'SMB', status: 'DEPLOYED' },
        { name: 'AI Integration Beta', segment: 'Early Adopters', status: 'DRAFT' },
    ];

    for (const cam of campaigns) {
        await prisma.campaign.create({
            data: {
                ...cam,
                tenantId: tenant.id,
            },
        });
    }

    // 7. Create Customers & Historical Orders
    const customer = await prisma.customer.create({
        data: {
            name: 'Industrial Consortium',
            email: 'procurement@indcon.com',
            tenantId: tenant.id,
        },
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let currentRevenue = 50000;

    for (let i = 0; i < 12; i++) {
        const monthRev = currentRevenue + (Math.random() * 10000 - 2000);
        const monthCost = monthRev * 0.6;

        await prisma.order.create({
            data: {
                orderNumber: `DMO-2025-${i}`,
                customerId: customer.id,
                totalAmount: monthRev,
                totalCost: monthCost,
                revenue: monthRev,
                profit: monthRev - monthCost,
                tenantId: tenant.id,
                createdAt: new Date(2025, i, 15),
            },
        });
        currentRevenue = monthRev;
    }

    // 8. Create Forecasts
    for (let i = 0; i < 6; i++) {
        await prisma.forecast.create({
            data: {
                tenantId: tenant.id,
                period: `Next ${i + 1}`,
                value: currentRevenue * (1 + (i * 0.05)),
                confidence: 0.85 - (i * 0.05),
            },
        });
    }

    console.log('✅ Guest Demo Data seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
