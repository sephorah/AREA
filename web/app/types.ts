import { StaticImageData } from "next/image"

export interface RegisterSchema {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export interface LoginSchema {
    username: string,
    password: string
}

export interface CreateAreaSchema {
    action?: string;
    reaction?: string;
    ownerId?: string;
    actionParams?: string;
    reactionParams?: string;
}

export interface IArea {
    name: string;
    enDescription: string,
    frDescription: string,
    params: string[];
}

export interface IServiceCard {
    name: string,
    redirectionTrigger: string,
    redirectionReaction: string,
}

export interface ICardForService {
    key: string,
    name: string,
    color: string,
    img: StaticImageData,
    redirectionTrigger: string
    redirectionReaction: string
}

export interface ICardForArea {
    key: number,
    title: string,
    description: string,
    params?: string[],
}

export interface ICardCreatedArea {
    key: string,
    actionLogo: StaticImageData,
    actionTitle: string,
    reactionLogo: StaticImageData,
    reactionTitle: string,
}

export interface ILogos {
    [name: string]: StaticImageData
}

export interface IColors {
    [name: string]: string
}

export interface ILanguage {
    [name: string]: string
}

export interface IResponseArea {
    id: string,
    ownerId: string,
    action: string,
    reaction: string,
    actionParams: string,
    reactionParams: string,
    descriptionEnAction: string, 
    descriptionFrAction: string,
    descriptionEnReaction: string,
    descriptionFrReaction: string,
}
