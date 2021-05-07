import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";
import * as json from "koa-json";
import * as serve from "koa-static";
import * as path from "path";
import * as render from "koa-ejs";

const app: Koa<DefaultContext, DefaultState> = new Koa();

const router: Router = new Router();
app.use(bodyParser());
app.use(json());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve("."));
app.use(serve(path.join(__dirname, "/public")));
render(app, {
    root: path.join(__dirname, "views"),
    layout: "layout",
});

let list: Array<{ name: string; id: number }> = [];
router.get(
    "/",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        ctx.body = { msg: "Hello world" };
    }
);
router.get(
    "/signUp",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        ctx.body = { msg: "signUp here" };
    }
);
router.get(
    "/error",
    async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        try {
            await next();
        } catch (err) {
            ctx.body = {
                error: {
                    message: "internal server error",
                    status: 500,
                },
            };
        }
    }
);
app.use(async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
    ctx.throw("custom error");
});
router.get(
    "/hello",
    (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        ctx.body = "world";
    }
);
router.get(
    "/echo",
    (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        ctx.body = `${ctx.query.person}`;
    }
);
router.get(
    "/echo/:name",
    (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        ctx.body = `hi ${ctx.params.name}`;
    }
);
router.get(
    "/list",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        console.log(list, "list");
        await ctx.render("todoApp", {
            list: list,
        });
    }
);
router.post(
    "/list",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        const item: string = ctx.request.body.new;
        const id: number = Date.now();
        const todoItem = {
            name: item,
            id: id,
        };
        if (item !== "") {
            list.push(todoItem);
        }
        ctx.redirect("/list");
    }
);
router.get(
    "/list/delete",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        const id: any = ctx.request.query.id;
        list = list.filter((item) => item.id !== parseInt(id));
        ctx.redirect("/list");
    }
);
app.listen(3002, () => {
    console.log("typescript server started");
});
