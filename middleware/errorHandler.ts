import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

interface IErrorHandler {
    handleError: (
        ctx: ParameterizedContext<DefaultState, DefaultContext>,
        next: () => Promise<any>
    ) => void;
}

class ErrorHandler implements IErrorHandler {
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

const ErrorHandlerInstance = new ErrorHandler();

export default ErrorHandlerInstance.handleError;
