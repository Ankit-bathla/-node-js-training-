import { AppRouterContext } from "../interface";
import { JsonPlaceHolder } from "../typescriptRoutes/jsonPlaceholder";
import { MockHttpClient } from "../utils/MockHttp";

afterEach(() => {
    jest.resetAllMocks();
});
describe("Json PlaceHolder test ", () => {
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
        const ctx = {
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const response = await jsonPlaceholderInstanceMock.handleGetRequest(
            ctx
        );

        expect(response).toEqual(res);
    });
    test("should be able to check the jsonPlaceholder handleGetRequest function and log the error when something went wrong in Api call ", async () => {
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(
            new MockHttpClient(undefined)
        );
        const ctx = {
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const response = await jsonPlaceholderInstanceMock.handleGetRequest(
            ctx
        );
        expect(ctx.logger).toHaveBeenCalledTimes(1);
    });

    test("should be able to check the handlePostRequest", async () => {
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
        const error = {
            body: {
                error: {
                    status: 422,
                    message: " query param missing in post request",
                },
            },
        };
        const ctx = {
            query: {
                userId: 1,
                title: "ankit",
                body: "bathla",
            },
            throw: jest.fn(() => error),
            logger: jest.fn(),
        } as unknown as AppRouterContext;

        const response = await jsonPlaceholderInstanceMock.handlePostRequest(
            ctx
        );
        expect(response).toEqual({ userId: 1, title: "ankit", body: "bathla" });
    });
    test("should be able to check the handlePostRequest and throw error when the query is undefined", async () => {
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
        const error = {
            body: {
                error: {
                    status: 422,
                    message: " query param missing in post request",
                },
            },
        };
        const ctx = {
            throw: jest.fn(() => error),
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        await jsonPlaceholderInstanceMock.handlePostRequest(ctx);
        expect(ctx.throw).toHaveBeenCalledTimes(1);
    });
    test("should be able to check the handlePostRequest and log error using Winston logger when the is error in Api call", async () => {
        const MockHttp = new MockHttpClient();
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
        MockHttp.setResponse({}, undefined);
        const error = {
            body: {
                error: {
                    status: 422,
                    message: " query param missing in post request",
                },
            },
        };
        const ctx = {
            query: {
                userId: 1,
                title: "ankit",
                body: "bathla",
            },
            throw: jest.fn(() => error),
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        await jsonPlaceholderInstanceMock.handlePostRequest(ctx);
        expect(ctx.logger).toHaveBeenCalledTimes(1);
    });
    test("should be able to check the handlePutRequest", async () => {
        const config = {
            data: {
                id: 1,
                userId: 1,
                title: "ankit",
                body: "bathla",
            },
        };

        const ctx = {
            query: {
                id: 1,
                userId: 1,
                title: "ankit",
                body: " bathla",
            },
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const MockHttp = new MockHttpClient();
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
        MockHttp.setResponse({}, config);
        const response = await jsonPlaceholderInstanceMock.handlePutRequest(
            ctx
        );
        expect(response).toEqual({
            userId: 1,
            title: "ankit",
            body: "bathla",
            id: 1,
        });
    });
    test("should be able to check the handlePutRequest and log error using winston logger when Put request of JsonPlaceholder fails", async () => {
        const ctx = {
            query: {
                id: 1,
                userId: 1,
                title: "ankit",
                body: " bathla",
            },
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const MockHttp = new MockHttpClient();
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
        MockHttp.setResponse({}, undefined);
        const response = await jsonPlaceholderInstanceMock.handlePutRequest(
            ctx
        );
        expect(ctx.logger).toHaveBeenCalledTimes(1);
    });

    test("should be able to check the handlePutRequest and throw error if query is undefined", async () => {
        const config = {
            data: {
                userId: 1,
                title: "ankit",
                body: "bathla",
            },
        };
        const error = {
            body: {
                error: {
                    status: 422,
                    message: " query param missing in put request",
                },
            },
        };
        const ctx = {
            throw: jest.fn(() => error),
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const MockHttp = new MockHttpClient();
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
        MockHttp.setResponse({}, config);
        await jsonPlaceholderInstanceMock.handlePutRequest(ctx);
        expect(ctx.throw).toHaveBeenCalledTimes(1);
    });
    test("should be able to check the handleDeleteRequest", async () => {
        const ctx = {
            query: {
                id: 1,
            },
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const MockHttp = new MockHttpClient();
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
        const response = await jsonPlaceholderInstanceMock.handleDeleteRequest(
            ctx
        );
        expect(response).toEqual({ method: "delete", message: "item deleted" });
    });

    test("should be able to check the handleDeleteRequest and throw error if query is undefined", async () => {
        const error = {
            body: {
                error: {
                    status: 422,
                    message: " query param missing in delete request",
                },
            },
        };
        const ctx = {
            query: {
                id: undefined,
            },
            throw: jest.fn(() => error),
            logger: jest.fn(),
        } as unknown as AppRouterContext;
        const MockHttp = new MockHttpClient();
        const jsonPlaceholderInstanceMock = new JsonPlaceHolder(MockHttp);
        await jsonPlaceholderInstanceMock.handleDeleteRequest(ctx);
        expect(ctx.throw).toHaveBeenCalledTimes(1);
    });
});
