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
    calcFactorial(num: number) {
        if (num === 1 || num === 0) {
            return num;
        }
        return num * this.calcFactorial(num - 1);
    }
}

class NumFactorial implements INumFactorial {
    private fact: ICalculateFactorial;

    constructor(val: ICalculateFactorial) {
        this.fact = val;
    }
    getFactorial(num: number) {
        return this.fact.calcFactorial(num);
    }
}

class FactRouter implements IFactRouter {
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
                result = new NumFactorial(new Memo(num)).getFactorial(num);
                finishTime = Date.now();
            } else if (method === "slow") {
                startTime = Date.now();
                result = new NumFactorial(new Recursive()).getFactorial(num);
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
const FactRouterInstance = new FactRouter();

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
