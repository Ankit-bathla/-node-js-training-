import home from "./home";
import signUp from "./signUp";
import taskOne from "./task1";
import factorial from "./factorial";
import todoApp from "./todoApp";
import jsonPlaceholder from "./jsonPlaceholder";
import * as Router from "koa-router";

export const getRoutes: Array<Router> = [
    home,
    signUp,
    taskOne,
    todoApp,
    factorial,
    jsonPlaceholder,
];
