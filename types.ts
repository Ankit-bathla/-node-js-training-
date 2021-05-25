import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

export type KoaContext = ParameterizedContext<DefaultState, DefaultContext>;

export type methods = "GET" | "POST" | "PUT" | "DELETE";
