import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";
interface HomeRouter {
    getHello: () => {};
}

class Home implements HomeRouter {
    public static instance: Home | undefined = undefined;

    public static getInstance(): Home {
        if (this.instance !== undefined) return this.instance;
        this.instance = new Home();
        return this.instance;
    }

    constructor() {}

    getHello() {
        return {
            msg: "hello Typescript",
        };
    }
}
const router = new Router();

const homeInstance = new Home();

type methods = "GET";

const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/",
        methods: ["GET"],
        route: homeInstance.getHello,
    },
];

function routerHandler(route: Function) {
    return async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        const response = await route();
        ctx.status = 200;
        ctx.body = response;
    };
}

for (let item of routes) {
    const { url, methods, route } = item;
    router.register(url, methods, routerHandler(route));
}
export default router;
