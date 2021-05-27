import * as Koa from "koa";
import ErrorHandler from "./middleware/errorHandler";
import inBoundRequestLogger, { WinstonLogger } from "./middleware/winston";
import auth from "./middleware/authentication";
import * as bodyParser from "koa-bodyparser";
import { AppContext, AppState, AppMiddlewareContext } from "./interface";
import * as json from "koa-json";
import * as serve from "koa-static";
import * as path from "path";
import * as render from "koa-ejs";
import { getRoutes } from "./typescriptRoutes/index";
import { LogLevel } from "./types";
const app: Koa<AppState, AppContext> = new Koa<AppState, AppContext>();
app.context.logger = function (LogMessage: any) {
    const createWinstonLogger = () => WinstonLogger.getInstance(); // adding winston logger to context
    createWinstonLogger().log(LogMessage);
};

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
for (let routes of getRoutes) {
    app.use(routes.routes()).use(routes.allowedMethods());
}
app.use(async (ctx: AppMiddlewareContext, next: () => Promise<any>) => {
    if (ctx.path === "/error") {
        ctx.logger({
            level: LogLevel.Error,
            message: "custom error of taskOne",
        }); // testing that winston logger has been added to AppContext
        ctx.throw("custom error");
    } else {
        await next();
    }
});
const server = app.listen(3002).on("listening", () => {
    console.log("typescript server started");
});
export default server;
