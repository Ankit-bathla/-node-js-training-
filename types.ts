import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

export type KoaContext = ParameterizedContext<DefaultState, DefaultContext>;

export type methods = "GET" | "POST" | "PUT" | "DELETE";

export enum LogLevel {
    Debug = "debug",
    Verbose = "notice",
    Info = "info",
    Warn = "warning",
    Error = "error",
}

export type RoutesArray = {
    url: string;
    methods: methods[];
    route: Function;
}[];
