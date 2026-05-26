"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt.hash('password123', 10);
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Acme Corp',
            email: 'admin@acme.com',
        },
    });
    const user = await prisma.user.create({
        data: {
            email: 'user@acme.com',
            password,
            name: 'Acme Admin',
            role: 'ADMIN',
            tenantId: tenant.id,
        },
    });
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
    const customer = await prisma.customer.create({
        data: {
            name: 'Global Retailers',
            email: 'contact@global.com',
            tenantId: tenant.id,
        },
    });
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
//# sourceMappingURL=seed.js.map