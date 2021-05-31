import { RoutesArray } from "../types";
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

const signUpInstance = SignUp.getInstance();

export const signUPRoutes: RoutesArray = [
    {
        url: "/signUp",
        methods: ["GET"],
        route: signUpInstance.signUpHere,
    },
];
