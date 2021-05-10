const KoaRouter = require("koa-router");
const router = new KoaRouter();

router.get("/hello", (ctx) => {
    ctx.body = "world";
});
router.get("/echo", (ctx) => {
    ctx.body = `${ctx.request.query.person}`;
});
router.get("/echo/:name", (ctx) => {
    ctx.body = `hi ${ctx.request.params.name}`;
});
router.get("/error", async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = {
            error: {
                message: "error",
                status: 500,
            },
        };
    }
});

module.exports = router;
