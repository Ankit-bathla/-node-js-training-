import { DefaultState, DefaultContext, ParameterizedContext } from "koa";

export type KoaContext = ParameterizedContext<DefaultState, DefaultContext>;
