import * as request from "supertest";
import app from "../app";
import MockDate from "mockdate";

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
    const response = await request(app)
        .post("/list")
        .send({ new: "" })
        .set("Authorization", authToken);

    expect(response.status).toBe(302);
});

test("should be able to test app.ts get request /factorial/:number of factorial.ts with correct auth token with request to fast ", async () => {
    const dateNowSpy = jest
        .spyOn(Date, "now")
        .mockImplementation(() => 1487076708000);
    const response = await request(app)
        .get("/factorial/5?Request=fast")
        .set("Authorization", authToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        data: { factorial: { value: 120, timeTaken: 0 } },
    });
});
test("should be able to test app.ts get request /factorial/:number of factorial.ts with correct auth token with request to slow ", async () => {
    const dateNowSpy = jest
        .spyOn(Date, "now")
        .mockImplementation(() => 1487076708000);
    const response = await request(app)
        .get("/factorial/5?Request=slow")
        .set("Authorization", authToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        data: { factorial: { value: 120, timeTaken: 0 } },
    });
});

test("should be able to test app.ts get request /factorial/:number of factorial.ts with correct auth token with request neither be slow nor fast ", async () => {
    MockDate.set("2000-11-22");
    const response = await request(app)
        .get("/factorial/5?Request=abc")
        .set("Authorization", authToken);
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
        error: {
            reason: " invalid input Request : should be fast or slow",
            dateTime: "2000-11-22T00:00:00.000Z",
            message: " invalid Query Input",
        },
    });
});
test("should be able to test app.ts get request /factorial/:number of factorial.ts with correct auth token with number not btw 0 and 10^8 ", async () => {
    MockDate.set("2000-11-22");
    const response = await request(app)
        .get("/factorial/-5?Request=slow")
        .set("Authorization", authToken);
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
        error: {
            reason: " invalid input number : should be btw 0 and 10^8",
            dateTime: "2000-11-22T00:00:00.000Z",
            message: " invalid input",
        },
    });
});
