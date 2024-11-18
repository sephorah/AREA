import { setCookie } from "cookies-next";

export const setAccessToken = (token: string) => {
    setCookie("accessToken", token, {
        maxAge: 60 * 60 * 24,
        path: "/",
        httpOnly: false,
    });
};