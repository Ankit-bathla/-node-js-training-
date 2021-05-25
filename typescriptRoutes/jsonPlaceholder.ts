import * as Router from "koa-router";
import { KoaContext } from "../types";
import { routeHelper } from "./routerHandler";
import { IHttpClient } from "../interface";
import { HttpClient } from "../middleware/httpClient";
import { methods } from "../types";

interface IJsonPlaceHolder {
    handleGetRequest: () => {};
    handlePostRequest: (ctx: KoaContext) => {};
    handlePutRequest?: (ctx: KoaContext) => {};
    handleDeleteRequest?: (ctx: KoaContext) => {};
}

export class JsonPlaceHolder implements IJsonPlaceHolder {
    public http: IHttpClient;
    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    handleGetRequest = async () => {
        const res = await this.http.get(
            "https://jsonplaceholder.typicode.com/posts",
            {}
        );
        return res.data;
    };
    handlePostRequest = async (ctx: KoaContext) => {
        const userId = ctx?.query?.userId;
        const title = ctx?.query?.title;
        const body = ctx?.query?.body;

        const data = {
            userId: userId,
            title: title,
            body: body,
        };
        const request = await this.http.post(
            "https://jsonplaceholder.typicode.com/posts",
            data,
            {}
        );
        return request.config.data;
    };
    handlePutRequest = async (ctx: KoaContext) => {
        const userId = ctx?.request?.query?.userId;
        const title = ctx?.query?.title;
        const body = ctx?.query?.body;
        let id: any = ctx?.request?.query?.id;
        id = parseInt(id);
        const data = {
            userId: userId,
            title: title,
            body: body,
            id: parseInt(id),
        };
        const request = await this.http.put(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            data,
            {}
        );
        return request.config.data;
    };

    handleDeleteRequest = async (ctx: KoaContext) => {
        let id: any = ctx?.query?.id;
        id = parseInt(id);
        await this.http.delete(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            {}
        );
        return {
            method: "delete",
            message: "item deleted",
        };
    };
}

const router = new Router();
const jsonPlaceholderInstance = new JsonPlaceHolder(HttpClient.getInstance());
const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/posts",
        methods: ["GET"],
        route: jsonPlaceholderInstance.handleGetRequest,
    },
    {
        url: "/posts",
        methods: ["POST"],
        route: jsonPlaceholderInstance.handlePostRequest,
    },
    {
        url: "/posts",
        methods: ["PUT"],
        route: jsonPlaceholderInstance.handlePutRequest,
    },
    {
        url: "/posts",
        methods: ["DELETE"],
        route: jsonPlaceholderInstance.handleDeleteRequest,
    },
];

routeHelper(routes, router);
export default router;
