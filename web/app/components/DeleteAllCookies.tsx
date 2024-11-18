import { deleteCookie } from "cookies-next";

const deleteAllCookies = () => {
    const cookies: string[] = document.cookie.split(";");

    for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        deleteCookie(cookieName)
    }
}

export default deleteAllCookies;