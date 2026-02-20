import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // Return user if validated, otherwise return null (instead of throwing 401)
        if (err || !user) {
            return null;
        }
        return user;
    }
}
