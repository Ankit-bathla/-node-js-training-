import * as Koa from "koa";
import * as json from "koa-json";
import * as http from "http";
import { DefaultState, DefaultContext } from "koa";
import * as bodyParser from "koa-bodyparser";
import * as request from "supertest";
import home from "../typescriptRoutes/home";
let appTest;
beforeEach(async () => {
    const app: Koa<DefaultContext, DefaultState> = new Koa();
    app.use(bodyParser());
    app.use(json());
    app.use(home.routes).use(home.allowedMethods());
    appTest = request(http.createServer(app.callback()));
});
test("should be able to get hello typescript", async () => {
    const response = await appTest.get("/");
    expect(response.status).toBe(200);
});
