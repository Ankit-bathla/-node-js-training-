import * as Koa from "koa";
import inBoundRequestLogger from "./middleware/winston";
import * as bodyParser from "koa-bodyparser";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as json from "koa-json";
import * as serve from "koa-static";
import * as path from "path";
import * as render from "koa-ejs";
import home from "./typescriptRoutes/home";
import signUp from "./typescriptRoutes/signUp";
import taskOne from "./typescriptRoutes/task1";
import todoApp from "./typescriptRoutes/todoApp";
const app: Koa<DefaultContext, DefaultState> = new Koa();
interface Error {
    status?: number;
    message?: string;
    body?: Object;
}
app.use(bodyParser());
app.use(json());
app.use(
    async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        try {
            await next();
        } catch (err) {
            ctx.status = 401;
            ctx.body = err.body;
        }
    }
);
app.use(inBoundRequestLogger);
app.use(
    async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        if (
            ctx.path === "/" ||
            ctx.path === "/signUp" ||
            ctx.path === "/helloWorld"
        ) {
            await next();
        } else {
            let authHeader = ctx.headers.authorization;
            if (!authHeader) {
                let err: Error = new Error();
                ctx.set("WWW-Authenticate", "Basic");
                err.message = "not authenticated";
                err.status = 401;
                err.body = {
                    msg: "not authenticated",
                    status: 401,
                };
                ctx.throw(err);
            }

            let data = authHeader.split(" ")[1];
            let auth = Buffer.from(data, "base64").toString().split(":");
            let username: string = auth[0];
            let password: string = auth[1];
            if (username === "admin" && password === "123") {
                await next();
            } else {
                let err: Error = new Error();
                ctx.set("WWW-Authenticate", "Basic");
                err.message = "username or password wrong";
                err.status = 401;
                err.body = {
                    msg: "username or password wrong",
                    status: 401,
                };

                ctx.throw(err);
            }
        }
    }
);
app.use(serve("."));
app.use(serve(path.join(__dirname, "/public")));
render(app, {
    root: path.join(__dirname, "views"),
    layout: "layout",
});

app.use(home.routes()).use(home.allowedMethods());
app.use(signUp.routes()).use(signUp.allowedMethods());
app.use(taskOne.routes()).use(taskOne.allowedMethods());
app.use(
    async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        if (ctx.path === "/error") {
            ctx.throw("custom error");
        } else {
            await next();
        }
    }
);
app.use(todoApp.routes()).use(todoApp.allowedMethods());
const server = app.listen(3002).on("listening", () => {
    console.log("typescript server started");
});
export default server;
