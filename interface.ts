import { AxiosResponse } from "axios";
import { ParameterizedContext, DefaultContext, DefaultState } from "koa";
import { RouterContext } from "koa-router";
export interface IHttpClient {
    get<T>(url: string, config: {}): Promise<AxiosResponse<T>>;
    post<T>(url: string, data: any, config: {}): Promise<AxiosResponse<T>>;
    put<T>(url: string, data: any, config: {}): Promise<AxiosResponse<T>>;
    delete<T>(url: string, config: {}): Promise<T>;
}

export interface AppMiddlewareContext
    extends ParameterizedContext<AppState, AppContext> {}

export interface AppState extends DefaultState {}

export interface AppContext extends DefaultContext {
    params?: any;
    query?: any;
    request?: any;
    header?: any;
    logger?: Function;
}

export interface AppRouterContext extends RouterContext<AppState, AppContext> {}
