import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from '../../../node_modules/rxjs/dist/types';
export declare class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
