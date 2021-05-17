import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

interface Error {
    status?: number;
    message?: string;
    body?: Object;
}

interface IAuthentication {
    handleAuth: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => void;
}

class Auth implements IAuthentication {
    public static instance: Auth | undefined = undefined;
    public static getInstance(): Auth {
        if (this.instance !== undefined) return this.instance;
        this.instance = new Auth();
        return this.instance;
    }
    constructor() {}

    handleAuth = async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        if (
            ctx.path === "/" ||
            ctx.path === "/signUp" ||
            ctx.path === "/helloWorld"
        ) {
            await next();
        } else {
            let authHeader = ctx.headers.authorization;
            if (!authHeader) {
                let err: Error = new Error();
                ctx.set("WWW-Authenticate", "Basic");
                err.message = "not authenticated";
                err.status = 401;
                err.body = {
                    msg: "not authenticated",
                    status: 401,
                };
                ctx.throw(err);
            }

            let data = authHeader.split(" ")[1];
            let auth = Buffer.from(data, "base64").toString().split(":");
            let username: string = auth[0];
            let password: string = auth[1];
            if (username === "admin" && password === "123") {
                await next();
            } else {
                let err: Error = new Error();
                ctx.set("WWW-Authenticate", "Basic");
                err.message = "username or password wrong";
                err.status = 401;
                err.body = {
                    msg: "username or password wrong",
                    status: 401,
                };

                ctx.throw(err);
            }
        }
    };
}

const authInstance = new Auth();

export default authInstance.handleAuth;
