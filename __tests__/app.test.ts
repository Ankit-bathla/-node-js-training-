import * as request from "supertest";
import app from "../app";

afterEach((done) => {
    done();
    app.close();
});
const authToken =
    "Basic " + Buffer.from("admin:123", "binary").toString("base64");
test("should be able to test the app.ts and get request  /", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "hello Typescript" });
});
test("should be able to test the app.ts get request /signUp", async () => {
    const response = await request(app).get("/signUp");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "signUp here" });
});

test("should be able to test the app.ts get request /hello with correct auth token", async () => {
    const response = await request(app)
        .get("/hello")
        .set("Authorization", authToken);
    expect(response.status).toBe(200);
    expect(response.text).toEqual("world");
});

test("should be able to test the app.ts get request /echo/:name with correct auth token", async () => {
    const response = await request(app)
        .get("/echo/ankit")
        .set("Authorization", "Basic YWRtaW46MTIz");

    expect(response.status).toBe(200);
    expect(response.text).toEqual("hi ankit");
});
test("should be able to test the app.ts get request /echo and fetching response from query with correct auth token", async () => {
    const response = await await request(app)
        .get("/echo?person=ankit")
        .set("Authorization", authToken);

    expect(response.status).toBe(200);
    expect(response.text).toEqual("ankit");
});
test("should be able to test the app.ts get request /error with correct auth token", async () => {
    const response = await await request(app)
        .get("/error")
        .set("Authorization", authToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        error: { message: "internal server error", status: 500 },
    });
});

test("should be able to test the app.ts get request /error with incorrect auth token", async () => {
    const response = await await request(app)
        .get("/error")
        .set("Authorization", "Basic YWRtaW46MTIx");

    expect(response.body).toEqual({
        msg: "username or password wrong",
        status: 401,
    });
    expect(response.status).toBe(401);
});
test("should be able to test the app.ts get request /hello without  auth token", async () => {
    const response = await await request(app).get("/hello");

    expect(response.body).toEqual({
        msg: "not authenticated",
        status: 401,
    });
    expect(response.status).toBe(401);
});
test("should be able to test the app.ts get request /list  of todoApp with correct auth token", async () => {
    const response = await await request(app)
        .get("/list")
        .set("Authorization", authToken);

    expect(response.status).toBe(200);
});
test("should be able to test the app.ts post request /list  of todoApp with correct auth token", async () => {
    const response = await await request(app)
        .post("/list")
        .send({ new: "ankit" })
        .set("Authorization", authToken);
    expect(response.status).toBe(302);
});

test("should be able to test the app.ts post request /list/delete  of todoApp with correct auth token", async () => {
    const response = await await request(app)
        .get("/list/delete?id=1")
        .set("Authorization", authToken);

    expect(response.status).toBe(302);
});
test("should be able to test the app.ts post request /list  of todoApp with correct auth token but with empty item", async () => {
    const response = await await request(app)
        .post("/list")
        .send({ new: "" })
        .set("Authorization", authToken);

    expect(response.status).toBe(302);
});
