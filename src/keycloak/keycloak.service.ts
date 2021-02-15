import {
  Injectable,
  Inject,
  Scope,
  UnauthorizedException, ExecutionContext,
} from "@nestjs/common";
import requestPromise = require("request-promise");
import { KeycloakConnectOptions } from "../interfaces/keycloak-connect-options.interface";
import { KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_INSTANCE } from "../constants";
import { KeycloakedRequest } from "./keycloaked-request";
import { REQUEST } from "@nestjs/core";
import { Keycloak } from "keycloak-connect";
import {IRequest} from "../interfaces/request.interface";

@Injectable({ scope: Scope.REQUEST })
export class KeycloakService {
  constructor(
    @Inject(KEYCLOAK_INSTANCE) private keycloak: Keycloak,
    @Inject(KEYCLOAK_CONNECT_OPTIONS) private options: KeycloakConnectOptions,
    @Inject(REQUEST) private request: KeycloakedRequest<Request>,
  ) {}
  async login(username: string, password: string): Promise<unknown> {
    try {
      return await requestPromise.post(
        `${this.options.authServerUrl}/realms/${this.options.realm}/protocol/openid-connect/token`,
        {
          form: {
            grant_type: "password",
            client_id: this.options.clientId,
            username: username,
            password: password,
          },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async verifyToken(token: string, realm: string = this.options.realm, context: ExecutionContext): Promise<boolean> {
    const req: IRequest = context.switchToHttp().getRequest();
    try {
      const url = `${this.options.authServerUrl}/realms/${realm}/protocol/openid-connect/userinfo`;

      const response = await requestPromise.get(url, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization: `Bearer ${token}`,
        },
      });

      return !!response;
    } catch (error) {
      req.session.destroy();
      throw new UnauthorizedException(error);
    }
  }
}
