import { LoginSchema, RegisterSchema } from "../types";
import api from "./api";

const login = (data: LoginSchema) => {
    return api.post('/login', data);
}

const register = (data: RegisterSchema) => {
    return api.post("/register", data);
}

const getUrlToLogin = (service: string) => {
    return api.get(`/oauth2/provider/${service}`);
}

const loginWithService = (service: string, code: string) => {
    return api.get(`/oauth2/login/${service}?code=${code}`);
}

const getUrlToSubscribe = (service: string) => {
    return api.get(`/oauth2/subscribe/${service}`);
}

const getAccessTokenbyService = (service: string, code: string) => {
    return api.get(`/oauth2/${service}/accessToken?code=${code}`);
}

const userIsSubscribedToAService = (service: string) => {
    return api.get(`/oauth2/service/${service}/subscribed`)
}

export { login, register, loginWithService, getUrlToSubscribe, getUrlToLogin, getAccessTokenbyService, userIsSubscribedToAService };
