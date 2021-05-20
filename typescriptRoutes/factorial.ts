import * as Router from "koa-router";
import { routeHelper } from "./routerHandler";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

interface INumFactorial {
    getFactorial(num: number): number;
}
interface ICalculateFactorial {
    calcFactorial(num: number): number;
}

interface IFactRouter {
    getVal: (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {};
}
class Memo implements ICalculateFactorial {
    public static instance: Memo | undefined = undefined;
    public static getInstance(num: number): Memo {
        if (this.instance !== undefined) return this.instance;
        this.instance = new Memo(num);
        return this.instance;
    }
    private factArray: Array<number> = [];
    constructor(num: number) {
        let result = 1;
        this.factArray.push(1);
        for (var val = 1; val <= num; val++) {
            result = result * val;
            this.factArray.push(result);
        }
    }
    calcFactorial = (num: number) => {
        return this.factArray[num];
    };
}

class Recursive implements ICalculateFactorial {
    public static instance: Recursive | undefined = undefined;
    public static getInstance(num: number): Recursive {
        if (this.instance !== undefined) return this.instance;
        this.instance = new Recursive();
        return this.instance;
    }
    calcFactorial(num: number) {
        if (num === 1 || num === 0) {
            return num;
        }
        return num * this.calcFactorial(num - 1);
    }
}

class NumFactorial implements INumFactorial {
    public static instance: NumFactorial | undefined = undefined;
    public static getInstance(val: ICalculateFactorial): NumFactorial {
        if (this.instance !== undefined) return this.instance;
        this.instance = new NumFactorial(val);
        return this.instance;
    }
    private fact: ICalculateFactorial;

    constructor(val: ICalculateFactorial) {
        this.fact = val;
    }
    getFactorial(num: number) {
        return this.fact.calcFactorial(num);
    }
}

class FactRouter implements IFactRouter {
    public static instance: FactRouter | undefined = undefined;
    public static getInstance(): FactRouter {
        if (this.instance !== undefined) return this.instance;
        this.instance = new FactRouter();
        return this.instance;
    }
    getVal = (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
        const num: number = parseInt(ctx.params.number);
        if (num < 0 || num > 100000000) {
            let reason = " invalid input number : should be btw 0 and 10^8";
            let dateTime = new Date();
            let message = " invalid input";
            ctx.throw(422, {
                body: {
                    error: {
                        reason: reason,
                        dateTime: dateTime,
                        message: message,
                    },
                },
            });
        } else {
            const method = ctx.query.Request;
            let result: number;
            let startTime: number;
            let finishTime: number;
            if (method === "fast") {
                startTime = Date.now();
                result = NumFactorial.getInstance(
                    Memo.getInstance(num)
                ).getFactorial(num);
                finishTime = Date.now();
            } else if (method === "slow") {
                startTime = Date.now();
                result = NumFactorial.getInstance(
                    Recursive.getInstance(num)
                ).getFactorial(num);
                finishTime = Date.now();
            } else {
                let reason = " invalid input Request : should be fast or slow";
                let dateTime = new Date();
                let message = " invalid Query Input";
                ctx.throw(422, {
                    body: {
                        error: {
                            reason: reason,
                            dateTime: dateTime,
                            message: message,
                        },
                    },
                });
            }
            return {
                data: {
                    factorial: {
                        value: result,
                        timeTaken: finishTime - startTime,
                    },
                },
            };
        }
    };
}
const router = new Router();
const FactRouterInstance = FactRouter.getInstance();

type methods = "GET";
const routes: { url: string; methods: methods[]; route: Function }[] = [
    {
        url: "/factorial/:number",
        methods: ["GET"],
        route: FactRouterInstance.getVal,
    },
];

routeHelper(routes, router);
export default router;
