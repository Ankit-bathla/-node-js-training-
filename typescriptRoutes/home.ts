import { RoutesArray } from "../types";
interface HomeRouter {
    getHello: () => {};
}

class Home implements HomeRouter {
    public static instance: Home | undefined = undefined;
    public static getInstance(): Home {
        if (this.instance !== undefined) return this.instance;
        this.instance = new Home();
        return this.instance;
    }
    constructor() {}

    getHello = () => {
        return {
            msg: "hello Typescript",
        };
    };
}

const homeInstance = Home.getInstance();

type methods = "GET";

export const homeRoutes: RoutesArray = [
    {
        url: "/",
        methods: ["GET"],
        route: homeInstance.getHello,
    },
];
