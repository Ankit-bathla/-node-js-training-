import * as Router from "koa-router";
import routerHandler from "./routerHandler";

interface SignUpRouter {
    signUpHere: () => {};
}

class SignUp implements SignUpRouter {
    public static instance: SignUp | undefined = undefined;

    public static getInstance(): SignUp {
        if (this.instance !== undefined) return this.instance;
        this.instance = new SignUp();
        return this.instance;
    }
    constructor() {}

    signUpHere = () => {
        return { msg: "signUp here" };
    };
}

const router = new Router();

const signUpInstance = new SignUp();

type methods = "GET";

const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/signUp",
        methods: ["GET"],
        route: signUpInstance.signUpHere,
    },
];
for (let item of routes) {
    const { url, methods, route } = item;
    router.register(url, methods, routerHandler(route));
}
export default router;
