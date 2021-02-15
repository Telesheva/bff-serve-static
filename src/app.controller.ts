import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { join } from "path";
import { SessionGuard } from "./guards/session.guard";
import { Response } from "express";
import { IGetFilesRequestBody, IRequest } from "./interface/request.interface";

@Controller()
export class AppController {
  @Post("set-token")
  setTokenInSession(@Req() req: IRequest, @Body() body: IGetFilesRequestBody) {
    req.session.realm = body.realm;
    req.session.token = body.token;
  }

  @Get("([0-9])+.*.js")
  @UseGuards(SessionGuard)
  getJsFiles(@Req() req: IRequest, @Res() res: Response) {
    const filename = req.url.substr(1);
    res.sendFile(filename, {
      root: join(__dirname, "../client/dist"),
    });
  }
}
