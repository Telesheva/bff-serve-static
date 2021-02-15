import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {KeycloakService} from "../keycloak/keycloak.service";
import {IRequest} from "../interface/request.interface";

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private keycloakService: KeycloakService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: IRequest = context.switchToHttp().getRequest();
        const realm = req.session.realm;
        const token = req.session.token;
        return await this.keycloakService.verifyToken(token, realm, context);
    }
}
