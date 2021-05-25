import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IHttpClient } from "../interface";

export class HttpClient implements IHttpClient {
    public static instance: HttpClient | undefined = undefined;
    public static getInstance(): HttpClient {
        if (this.instance !== undefined) return this.instance;
        this.instance = new HttpClient(axios.create());
        return this.instance;
    }

    constructor(private readonly axios: AxiosInstance) {}

    async get<T>(url: string, config: {}) {
        const response: AxiosResponse<T> = await this.axios.get<
            any,
            AxiosResponse<T>
        >(url, { ...config });

        return response;
    }
    async post<T>(url: string, data: any, config: {}): Promise<T> {
        const request = await this.axios.post<any, T>(url, data, config);
        return request;
    }
    async put<T>(url: string, data: any, config: {}): Promise<T> {
        const request = await this.axios.put<any, T>(url, data, config);
        return request;
    }
    async delete<T>(url: string, config: {}): Promise<T> {
        const request = await this.axios.delete<any, T>(url, config);
        return request;
    }
}
