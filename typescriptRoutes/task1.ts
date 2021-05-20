import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";

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

routeHelper(routes, router);
export default router;
