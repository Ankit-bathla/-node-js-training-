import { homeRoutes } from "./home";
import { signUPRoutes } from "./signUp";
import { taskOneRoutes } from "./task1";
import { FactorialRoutes } from "./factorial";
import { todoAppRoutes } from "./todoApp";
import { JsonRoutes } from "./jsonPlaceholder";
import * as Router from "koa-router";
import { RoutesArray } from "../types";
import { routeHelper } from "./routerHandler";

const router = new Router();

const routerArray: Array<RoutesArray> = [
    homeRoutes,
    signUPRoutes,
    taskOneRoutes,
    FactorialRoutes,
    todoAppRoutes,
    JsonRoutes,
];

for (let routes of routerArray) {
    routeHelper(routes, router);
}

export { router };
