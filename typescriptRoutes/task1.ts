import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";

interface taskOneRouter {
    getWorld: () => {};
    getQueryName: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {};
    getParamsName: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {};
    getError: () => {};
}

class TaskOne implements taskOneRouter {
    public static instance: TaskOne | undefined = undefined;
    public static getInstance(): TaskOne {
        if (this.instance !== undefined) return this.instance;
        this.instance = new TaskOne();
        return this.instance;
    }
    constructor() {}

    getWorld = () => {
        return "world";
    };
    getQueryName = (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {
        return ctx.query.person;
    };
    getParamsName = (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {
        return `hi ${ctx.params.name}`;
    };
    getError = () => {
        return {
            error: {
                message: "internal server error",
                status: 500,
            },
        };
    };
}

const router = new Router();
const taskOneInstance = new TaskOne();
type methods = "GET";

const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/hello",
        methods: ["GET"],
        route: taskOneInstance.getWorld,
    },
    {
        url: "/echo",
        methods: ["GET"],
        route: taskOneInstance.getQueryName,
    },
    {
        url: "/echo/:name",
        methods: ["GET"],
        route: taskOneInstance.getParamsName,
    },
    {
        url: "/error",
        methods: ["GET"],
        route: taskOneInstance.getError,
    },
];
function routerHandler(route: Function) {
    return async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        try {
            await next();
            const response = await route(ctx);
            ctx.status = 200;
            ctx.body = response;
        } catch (err) {
            const response = await route(ctx);
            ctx.body = response;
        }
    };
}
for (let item of routes) {
    const { url, methods, route } = item;
    router.register(url, methods, routerHandler(route));
}
export default router;
