import { AxiosResponse } from "axios";
import { IHttpClient } from "../interface";

export class MockHttpClient implements IHttpClient {
    public response: AxiosResponse<any> = {
        data: {},
        statusText: "",
        status: 200,
        config: {},
        headers: {},
    };

    constructor(data: any = undefined) {
        this.response = {
            ...this.response,
            data,
        };
    }
    setResponse<T>(data: T, config: {}, status: number = 200) {
        this.response = {
            ...this.response,
            data,
            status,
            config,
        };
    }
    async get<T>(url: string, config: {}): Promise<AxiosResponse<T>> {
        return Promise.resolve(this.response);
    }
    async post<T>(
        url: string,
        data: any,
        config: {}
    ): Promise<AxiosResponse<T>> {
        return Promise.resolve(this.response);
    }
    async put<T>(
        url: string,
        data: any,
        config: {}
    ): Promise<AxiosResponse<T>> {
        return Promise.resolve(this.response);
    }
    async delete<T>(url: string, config: {}): Promise<T> {
        const data: any = {
            method: "delete",
            message: " item deleted",
        };
        return Promise.resolve(data);
    }
}
