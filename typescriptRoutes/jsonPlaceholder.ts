import * as Router from "koa-router";
import { AppRouterContext } from "../interface";
import { routeHelper } from "./routerHandler";
import { IHttpClient } from "../interface";
import { HttpClient } from "../middleware/httpClient";
import { methods, LogLevel } from "../types";
import { createTextChangeRange } from "typescript";

interface IJsonPlaceHolder {
    handleGetRequest: (ctx: AppRouterContext) => {};
    handlePostRequest: (ctx: AppRouterContext) => {};
    handlePutRequest?: (ctx: AppRouterContext) => {};
    handleDeleteRequest?: (ctx: AppRouterContext) => {};
}

export class JsonPlaceHolder implements IJsonPlaceHolder {
    public http: IHttpClient;
    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    handleGetRequest = async (ctx: AppRouterContext) => {
        const res = await this.http.get(
            "https://jsonplaceholder.typicode.com/posts",
            {}
        );
        console.log(res);
        if (res.data === undefined) {
            ctx.logger({
                level: LogLevel.Error,
                message:
                    "something went wrong during get call of jsonPlaceholder Api",
            });
        }
        return res.data;
    };
    handlePostRequest = async (ctx: AppRouterContext) => {
        const userId = ctx?.query?.userId;
        const title = ctx?.query?.title;
        const body = ctx?.query?.body;
        if (userId !== undefined && title !== undefined && body !== undefined) {
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
            if (request === undefined || request?.config === undefined) {
                ctx.logger({
                    level: LogLevel.Error,
                    message:
                        "something went wrong  during post call for jsonPlaceholder Api",
                });
            }
            return request?.config?.data;
        } else {
            ctx.throw(422, {
                body: {
                    error: {
                        status: 422,
                        message: " query param missing in post request",
                    },
                },
            });
        }
    };
    handlePutRequest = async (ctx: AppRouterContext) => {
        const userId = ctx?.query?.userId;
        const title = ctx?.query?.title;
        const body = ctx?.query?.body;
        let id: any = ctx?.query?.id;
        if (
            userId !== undefined &&
            title !== undefined &&
            body !== undefined &&
            id !== undefined
        ) {
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
            if (request === undefined || request?.config === undefined) {
                ctx.logger({
                    level: LogLevel.Error,
                    message:
                        "something went wrong  during post call for jsonPlaceholder Api",
                });
            }
            return request?.config?.data;
        } else {
            ctx.throw(422, {
                body: {
                    error: {
                        status: 422,
                        message: " query param missing in put request",
                    },
                },
            });
        }
    };

    handleDeleteRequest = async (ctx: AppRouterContext) => {
        let id: any = ctx?.query?.id;

        if (id !== undefined) {
            id = parseInt(id);
            await this.http.delete(
                `https://jsonplaceholder.typicode.com/posts/${id}`,
                {}
            );
            return {
                method: "delete",
                message: "item deleted",
            };
        } else {
            ctx.throw(422, {
                body: {
                    error: {
                        status: 422,
                        message: " query param missing in delete request",
                    },
                },
            });
        }
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
