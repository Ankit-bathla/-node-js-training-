import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";

interface SignUpRouter {
    signUpHere: () => {};
}

class SignUp implements SignUpRouter {
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
routeHelper(routes, router);
export default router;
