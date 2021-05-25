import { KoaContext } from "../types";
import { JsonPlaceHolder } from "../typescriptRoutes/jsonPlaceholder";
import { MockHttpClient } from "../utils/MockHttp";

test("should be able to check the jsonPlaceholder handleGetRequest function ", async () => {
    const res = {
        data: [
            {
                id: 1,
                userId: 1,
                title: "ankit",
                body: "bathla",
            },
        ],
    };
    const jsonPlaceholderInstanceMock = new JsonPlaceHolder(
        new MockHttpClient(res)
    );
    const response = await jsonPlaceholderInstanceMock.handleGetRequest();

    expect(response).toEqual(res);
});

test("should be able to check the handlePostRequest", async () => {
    let ctx: KoaContext;
    const config = {
        data: {
            userId: 1,
            title: "ankit",
            body: "bathla",
        },
    };
    const MockHttp = new MockHttpClient();
    const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
    MockHttp.setResponse({}, config);
    const response = await jsonPlaceholderInstanceMock.handlePostRequest(ctx);
    expect(response).toEqual({ userId: 1, title: "ankit", body: "bathla" });
});
test("should be able to check the handlePutRequest", async () => {
    let ctx: KoaContext;
    const config = {
        data: {
            userId: 1,
            title: "ankit",
            body: "bathla",
        },
    };
    const MockHttp = new MockHttpClient();
    const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
    MockHttp.setResponse({}, config);
    const response = await jsonPlaceholderInstanceMock.handlePutRequest(ctx);
    expect(response).toEqual({ userId: 1, title: "ankit", body: "bathla" });
});

test("should be able to check the handleDeleteRequest", async () => {
    let ctx: KoaContext;
    const MockHttp = new MockHttpClient();
    const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
    const response = await jsonPlaceholderInstanceMock.handleDeleteRequest(ctx);
    expect(response).toEqual({ method: "delete", message: "item deleted" });
});
