import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: `http://${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
});

export default api;