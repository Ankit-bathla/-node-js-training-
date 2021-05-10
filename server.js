const Koa = require("koa");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");
const render = require("koa-ejs");
const path = require("path");
const serve = require("koa-static");
const home = require("./routes/home");
const signUp = require("./routes/signUp");
const taskOne = require("./routes/task1");
const todoApp = require("./routes/todoApp");
const app = new Koa();
app.use(json());
app.use(bodyParser());
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.throw(err);
    }
});
app.use(async (ctx, next) => {
    if (ctx.path === "/" || ctx.path === "/signUp") {
        await next();
    } else {
        let authHeader = ctx.headers.authorization;
        if (!authHeader) {
            let err = new Error();
            ctx.set("WWW-Authenticate", "Basic");
            err.status = 401;
            err.message = "not authenticated";
            ctx.throw(err);
        }
        let auth = new Buffer.from(authHeader.split(" ")[1], "base64")
            .toString()
            .split(":");

        let username = auth[0];
        let password = auth[1];
        if (username === "admin" && password === "123") {
            await next();
        } else {
            let err = new Error();
            ctx.set("WWW-Authenticate", "Basic");
            err.status = 401;
            err.message = "username or password wrong";
            ctx.throw(err);
        }
    }
});
app.use(serve("."));
app.use(serve(path.join(__dirname, "/public")));
render(app, {
    root: path.join(__dirname, "./views"),
    layout: "layout",
});
app.use(home.routes()).use(home.allowedMethods());
app.use(signUp.routes()).use(signUp.allowedMethods());
app.use(taskOne.routes()).use(taskOne.allowedMethods());
app.use(async (ctx, next) => {
    if (ctx.path === "/error") {
        ctx.throw();
    } else {
        await next();
    }
});
app.use(todoApp.routes()).use(todoApp.allowedMethods());

app.listen(3001, () => {
    console.log(" javascript server started");
});
