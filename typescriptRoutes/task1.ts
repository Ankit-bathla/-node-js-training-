import * as Router from "koa-router";
import { KoaContext } from "../types";
import { routeHelper } from "./routerHandler";

interface taskOneRouter {
    getWorld: () => {};
    getQueryName: (ctx: KoaContext) => {};
    getParamsName: (ctx: KoaContext) => {};
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
    getQueryName = (ctx: KoaContext) => {
        return ctx.query.person;
    };
    getParamsName = (ctx: KoaContext) => {
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
const taskOneInstance = TaskOne.getInstance();
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

routeHelper(routes, router);
export default router;
