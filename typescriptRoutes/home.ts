import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";

const router: Router = new Router();

router.get(
    "/",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        ctx.body = { msg: "Hello typescript" };
    }
);
export default router;
