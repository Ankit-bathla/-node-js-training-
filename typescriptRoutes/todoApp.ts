import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";

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
    public static instance: TodoApp | undefined = undefined;
    public static getInstance(): TodoApp {
        if (this.instance !== undefined) return this.instance;
        this.instance = new TodoApp();
        return this.instance;
    }

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
function routerHandler(route: Function) {
    return async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        const response = await route(ctx);
        ctx.status = 200;
        if (
            ctx.path === "/list/delete" ||
            (ctx.path === "/list" && ctx.method === "POST")
        ) {
            ctx.redirect("/list");
        } else {
            return response;
        }
    };
}
for (let item of routes) {
    const { url, methods, route } = item;
    router.register(url, methods, routerHandler(route));
}
export default router;
