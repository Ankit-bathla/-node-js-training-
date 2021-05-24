import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";
import { KoaContext } from "../types";
interface ToDoAppRouter {
    getTodoList: (ctx: KoaContext) => {};
    postTodoItem: (ctx: KoaContext) => void;
    deleteTodoItem: (ctx: KoaContext) => void;
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
    getTodoList = async (ctx: KoaContext) => {
        return await ctx.render("todoApp", {
            list: list,
        });
    };
    postTodoItem = (ctx: KoaContext) => {
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
    deleteTodoItem = (ctx: KoaContext) => {
        const id: any = ctx.request.query.id;
        list = list.filter((item) => item.id !== parseInt(id));
    };
}
const router = new Router();

const toDoAppInstance = TodoApp.getInstance();

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
