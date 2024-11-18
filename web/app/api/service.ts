import { CreateAreaSchema } from "../types";
import api from "./api";

const getAllServices = () => {
    return api.get(`/services`);
}

const getAllReactionsOfAService = (name: string) => {
    return api.get(`/service/${name}/reactions`);
}

const getAllActionsOfAService = (name: string) => {
    return api.get(`/service/${name}/actions`);
}

const createArea = (data: CreateAreaSchema) => {
    return api.post(`/create/area`, {
        action: data.action,
        reaction: data.reaction,
        ownerId: data.ownerId,
        actionParams: data.actionParams,
        reactionParams: data.reactionParams
    });
}

export { getAllServices, getAllReactionsOfAService, getAllActionsOfAService, createArea };
