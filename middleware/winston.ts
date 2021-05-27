import * as winstonLog from "winston";
import { AppMiddlewareContext } from "../interface";
import { LogLevel } from "../types";
interface LoggerMessage {
    startTimeStamp: number;
    duration: number;
    routeName: string;
    message: string;
    level: LogLevel;
    method: string;
}

interface IWinstonLogger {
    log(LogMessage: LoggerMessage): void;
}

export class WinstonLogger implements IWinstonLogger {
    public logger: winstonLog.Logger;

    public static instance: WinstonLogger | undefined = undefined;
    public static getInstance(): WinstonLogger {
        if (this.instance !== undefined) return this.instance;
        this.instance = new WinstonLogger(winstonLog);
        return this.instance;
    }

    constructor(parameter: typeof winstonLog) {
        this.logger = parameter.createLogger({
            format: parameter.format.json(),
            transports: [
                new parameter.transports.File({
                    filename: "info.txt",
                    dirname: "log",
                }),
                new parameter.transports.Console(),
            ],
        });
    }

    log = (LogMessage: LoggerMessage) => {
        const { level, ...rest } = LogMessage;
        this.logger.log(level, "", rest);
    };
}

const createWinstonLogger = () => WinstonLogger.getInstance();

const inBoundRequestLogger = async (
    ctx: AppMiddlewareContext,
    next: () => Promise<any>
) => {
    const startTimeStamp = Date.now();
    try {
        await next();
        const finishTimeStamp = Date.now();
        const duration = finishTimeStamp - startTimeStamp;
        createWinstonLogger().log({
            level: LogLevel.Info,
            startTimeStamp,
            duration,
            routeName: ctx.url,
            message: ctx.message,
            method: ctx.method,
        });
    } catch (err) {
        const finishTimeStamp = Date.now();
        const duration = finishTimeStamp - startTimeStamp;
        createWinstonLogger().log({
            level: LogLevel.Error,
            startTimeStamp,
            duration,
            routeName: ctx.url,
            message: err?.body?.msg || err?.body?.error?.message,
            method: ctx.method,
        });
        ctx.throw(err);
    }
};

export default inBoundRequestLogger;
