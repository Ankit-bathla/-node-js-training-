import * as winston from "winston";
import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

enum LogLevel {
    Debug = "debug",
    Verbose = "notice",
    Info = "info",
    Warn = "warning",
    Error = "error",
}
interface LoggerMessage {
    startTimeStamp: number;
    duration: number;
    routeName: string;
    message: string;
    level: LogLevel;
    method: string;
}

interface WinstonClass {
    log(LogMessage: LoggerMessage): void;
}

class WinstonLogger implements WinstonClass {
    public logger: winston.Logger;

    public static instance: WinstonLogger | undefined = undefined;
    public static getInstance(): WinstonLogger {
        if (this.instance !== undefined) return this.instance;
        this.instance = new WinstonLogger(winston);
        return this.instance;
    }

    constructor(parameter: typeof winston) {
        this.logger = parameter.createLogger({
            transports: [
                new parameter.transports.File({
                    filename: "info.txt",
                    dirname: "log",
                }),
                new parameter.transports.Console(),
            ],
            format: winston.format.json(),
        });
    }

    log = (LogMessage: LoggerMessage) => {
        const { level, ...rest } = LogMessage;
        this.logger.log(level, "", rest);
    };
}

const createWinstonLogger = new WinstonLogger(winston);

const inBoundRequestLogger = async (
    ctx: ParameterizedContext<DefaultState, DefaultContext>,
    next: () => Promise<any>
) => {
    try {
        const startTimeStamp = Date.now();
        await next();
        const finishTimeStamp = Date.now();
        const duration = finishTimeStamp - startTimeStamp;
        createWinstonLogger.log({
            level: LogLevel.Info,
            startTimeStamp,
            duration,
            routeName: ctx.url,
            message: ctx.message,
            method: ctx.method,
        });
    } catch (err) {
        const startTimeStamp = Date.now();
        const finishTimeStamp = Date.now();
        const duration = finishTimeStamp - startTimeStamp;
        createWinstonLogger.log({
            level: LogLevel.Error,
            startTimeStamp,
            duration,
            routeName: ctx.url,
            message: err.body.msg,
            method: ctx.method,
        });
        ctx.throw(err);
    }
};

export default inBoundRequestLogger;
