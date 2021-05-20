import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";
interface ToDoAppRouter {
    getTodoList: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {};
    postTodoItem: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => void;
    deleteTodoItem: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => void;
}
let list: Array<{ name: string; id: number }> = [];

class TodoApp implements ToDoAppRouter {
    constructor() {}
    getTodoList = async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {
        return await ctx.render("todoApp", {
            list: list,
        });
    };
    postTodoItem = (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {
        const item: string = ctx.request.body.new;
        const id: number = Date.now();
        const todoItem = {
            name: item,
            id: id,
        };
        if (item !== "") {
            list.push(todoItem);
        }
    };
    deleteTodoItem = (
        ctx: ParameterizedContext<DefaultState, DefaultContext>
    ) => {
        const id: any = ctx.request.query.id;
        list = list.filter((item) => item.id !== parseInt(id));
    };
}
const router = new Router();

const toDoAppInstance = new TodoApp();

type methods = "GET" | "POST";
const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/list",
        methods: ["GET"],
        route: toDoAppInstance.getTodoList,
    },
    {
        url: "/list",
        methods: ["POST"],
        route: toDoAppInstance.postTodoItem,
    },
    {
        url: "/list/delete",
        methods: ["GET"],
        route: toDoAppInstance.deleteTodoItem,
    },
];
routeHelper(routes, router);
export default router;
