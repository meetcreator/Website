import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from '../../../node_modules/rxjs/dist/types';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.tenantId) {
            // Allow auth routes to pass without tenantId
            const path = request.url;
            if (path.includes('/auth/login')) {
                return next.handle();
            }
            throw new BadRequestException('Tenant context missing');
        }

        return next.handle();
    }
}
