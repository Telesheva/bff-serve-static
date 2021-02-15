import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import {KeycloakConnectModule} from "./keycloak";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        "..",
        "client/dist"
      ),
    }),
    KeycloakConnectModule.register({
      authServerUrl: "https://keycloak-url.example.com/auth",
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
