import * as Router from "koa-router";
import routerHandler from "./routerHandler";
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

    getHello = () => {
        return {
            msg: "hello Typescript",
        };
    };
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
for (let item of routes) {
    const { url, methods, route } = item;
    router.register(url, methods, routerHandler(route));
}
export default router;
