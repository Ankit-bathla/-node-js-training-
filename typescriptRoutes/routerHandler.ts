import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

function routerHandler(route: Function) {
    return async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        try {
            await next();
            const response = await route(ctx);
            ctx.status = 200;
            if (
                ctx.path === "/list/delete" ||
                (ctx.path === "/list" && ctx.method === "POST")
            ) {
                ctx.redirect("/list");
            } else if (ctx.path === "/list" && ctx.method === "GET") {
                return response;
            } else {
                ctx.body = response;
            }
        } catch (err) {
            const response = await route(ctx);
            ctx.body = response;
        }
    };
}
export default routerHandler;
