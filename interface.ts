import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface IHttpClient {
    get<T>(url: string, config: {}): Promise<AxiosResponse<T>>;
    post<T>(url: string, data: any, config: {}): Promise<AxiosResponse<T>>;
    put<T>(url: string, data: any, config: {}): Promise<AxiosResponse<T>>;
    delete<T>(url: string, config: {}): Promise<T>;
}
