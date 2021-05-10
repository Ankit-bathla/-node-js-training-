const KoaRouter = require("koa-router");
const router = new KoaRouter();

let list = [];
router.get("/list", async (ctx) => {
    await ctx.render("todoApp", {
        list: list,
    });
});

router.post("/list", async (ctx) => {
    const item = ctx.request.body.new;
    const id = Date.now();
    const todoItem = {
        name: item,
        id: id,
    };
    if (item !== "") {
        list.push(todoItem);
    }
    ctx.redirect("/list");
});
router.get("/list/delete", async (ctx) => {
    const id = ctx.request.query.id;
    list = list.filter((item) => parseInt(item.id) !== parseInt(id));
    ctx.redirect("/list");
});

module.exports = router;
