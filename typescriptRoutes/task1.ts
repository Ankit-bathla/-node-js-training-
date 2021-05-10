import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";

const router: Router = new Router();

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
export default router;
