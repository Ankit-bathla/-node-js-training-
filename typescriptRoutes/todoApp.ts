import { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import * as Router from "koa-router";

const router: Router = new Router();
let list: Array<{ name: string; id: number }> = [];

router.get(
    "/list",
    async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
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

export default router;
