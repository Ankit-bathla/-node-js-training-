const KoaRouter = require("koa-router");
const router = new KoaRouter();
router.get("/", (ctx) => {
    ctx.body = { msg: "Hello world" };
});

module.exports = router;
