import axios from "axios";
import { HttpClient } from "../middleware/httpClient";

test(" should be able to test get function", async () => {
    const spy = jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve("ankit"));

    const http = new HttpClient(axios);
    const response = await http.get("", {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response).toEqual("ankit");
});

test(" should be able to test post function", async () => {
    const spy = jest
        .spyOn(axios, "post")
        .mockImplementation(() => Promise.resolve("ankit"));

    const http = new HttpClient(axios);
    const response = await http.post("", {}, {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response).toEqual("ankit");
});

test(" should be able to test put function", async () => {
    const spy = jest
        .spyOn(axios, "put")
        .mockImplementation(() => Promise.resolve("ankit"));

    const http = new HttpClient(axios);
    const response = await http.put("", {}, {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response).toEqual("ankit");
});

test(" should be able to test delete function", async () => {
    const spy = jest
        .spyOn(axios, "delete")
        .mockImplementation(() => Promise.resolve("ankit"));

    const http = new HttpClient(axios);
    const response = await http.delete("", {});
    expect(spy).toHaveBeenCalledTimes(1);
    expect(response).toEqual("ankit");
});
