const KoaRouter = require("koa-router");
const router = new KoaRouter();

router.get("/signUp", (ctx) => {
    ctx.body = {
        msg: "signup here to get started",
    };
});

module.exports = router;
