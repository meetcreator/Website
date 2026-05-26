import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    log(message: string) {
        const fs = require('fs');
        fs.appendFileSync('debug_auth.log', new Date().toISOString() + ': ' + message + '\n');
    }

    async validateUser(email: string, pass: string): Promise<any> {
        this.log(`ValidateUser called with email: ${email}, pass: ${pass}`);
        try {
            // Check for hardcoded admin credentials first
            if (email === 'admin' && pass === 'admin@321') {
                this.log('Admin credentials matched hardcoded check');
                // Determine if we need to find or create this admin in the DB to have a valid ID
                // Since we need to save user added data, we need a valid User ID.
                let user = await this.prisma.user.findFirst({
                    where: { email: 'admin' } // Treating 'admin' as email for this special case
                });

                if (!user) {
                    // Create the admin user if it doesn't exist
                    const hashedPassword = await bcrypt.hash('admin@321', 10);
                    // We need a tenant for the user. Check if a default tenant exists or create one.
                    let tenant = await this.prisma.tenant.findFirst({
                        where: { name: 'Admin Tenant' }
                    });

                    if (!tenant) {
                        tenant = await this.prisma.tenant.create({
                            data: {
                                name: 'Admin Tenant',
                                email: 'admin@archshield.io'
                            }
                        });
                    }

                    user = await this.prisma.user.create({
                        data: {
                            email: 'admin',
                            password: hashedPassword,
                            name: 'Super Admin',
                            role: 'SUPER_ADMIN', // Giving super admin role
                            tenantId: tenant.id
                        }
                    });
                }

                const { password, ...result } = user;
                return result;
            }

            const user = await this.prisma.user.findUnique({
                where: { email },
                include: { tenant: true },
            });
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            console.error('Validate User Error:', error);
            this.log(`Validate User Error: ${JSON.stringify(error)}`);
            return null;
        }
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            tenantId: user.tenantId,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
            }
        };
    }
}
