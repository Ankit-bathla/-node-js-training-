import * as Koa from "koa";
import ErrorHandler from "./middleware/errorHandler";
import inBoundRequestLogger from "./middleware/winston";
import auth from "./middleware/authentication";
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
app.use(bodyParser());
app.use(json());
app.use(ErrorHandler);
app.use(inBoundRequestLogger);
app.use(auth);
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
