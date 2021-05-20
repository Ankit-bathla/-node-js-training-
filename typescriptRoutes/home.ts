import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";
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

const homeInstance = Home.getInstance();

type methods = "GET";

const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/",
        methods: ["GET"],
        route: homeInstance.getHello,
    },
];
routeHelper(routes, router);
export default router;
