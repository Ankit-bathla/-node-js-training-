import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";
interface HomeRouter {
    getHello: () => {};
}

class Home implements HomeRouter {
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
routeHelper(routes, router);
export default router;
