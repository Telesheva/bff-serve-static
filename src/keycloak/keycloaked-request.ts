import { Grant } from "keycloak-connect";

export type KeycloakedRequest<T = Request> = {
  user: {
    sub: string,
    email_verified: boolean,
    preferred_username: string
  },
  destroySession(cb:any):void;
  grant: Grant | undefined,
  session: {[key: string]: any},
} & T;
