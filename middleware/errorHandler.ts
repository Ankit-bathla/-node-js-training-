import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

interface IErrorHandler {
    handleError: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => void;
}

class ErrorHandler implements IErrorHandler {
    public static instance: ErrorHandler | undefined = undefined;

    public static getInstance(): ErrorHandler {
        if (this.instance !== undefined) return this.instance;
        this.instance = new ErrorHandler();
        return this.instance;
    }
    constructor() {}

    handleError = async (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status;
            ctx.body = err.body;
        }
    };
}

const ErrorHandlerInstance = ErrorHandler.getInstance();

export default ErrorHandlerInstance.handleError;
