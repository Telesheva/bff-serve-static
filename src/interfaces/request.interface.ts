import {Request} from "express";

export interface IRequest extends Request {
    session: any;
}

export  interface IGetFilesRequestBody {
    realm?: string,
    token: string
}
