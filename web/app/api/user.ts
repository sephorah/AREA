import api from "./api";

const getInfoByUserId = (userId: string) => {
    return api.get(`/user/${userId}/info`);
}

const getAreasByUserId = (userId: string) => {
    return api.get(`/user/${userId}/areas`);
}

const logout = () => {
    return api.post('logout')
}

export { getInfoByUserId, getAreasByUserId, logout };
