"use client";

import { NavBarRegistered } from "@/app/components/NavBar";
import { IArea, ICardForArea } from "@/app/types";
import { Button } from "@nextui-org/react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import CardForArea from "./CardForArea";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useLocale, useTranslations } from "next-intl";
import { getAllReactionsOfAService, getAllActionsOfAService } from "../api/service";
import { getAccessTokenbyService, getUrlToSubscribe, userIsSubscribedToAService } from "../api/auth";
import Colors from "./Colors";
import Logos from "./Logos";
import { Image } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { StaticImageData } from "next/image";

const ChooseArea = ({
    page
}: {
    page: string,
}) => {
    const searchParams: ReadonlyURLSearchParams | null = useSearchParams();
    const actionName: string | null | undefined = searchParams?.get('name');
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();
    const [cards, setCards] = useState<ICardForArea[]>([]);
    let actionColor: string = "";
    let translation;
    let myWindow: Window | null;
    let color: string = '';
    let logo: StaticImageData | undefined;
    const [connectedService, setConnectedService] = useState<boolean>(false);


    if (page === "Trigger") {
        translation = useTranslations('ChooseAction');
    } else {
        translation = useTranslations('ChooseReaction');
    }

    if (actionName) {
        actionColor = '#' + Colors[actionName];
        color = actionColor;
        logo = Logos[actionName]
    }

    useEffect(() => {
        if (actionName) {
            if (actionName == "weather_time" || actionName == "islamic_prayer") {
                setConnectedService(true);
            } else {
                userIsSubscribedToAService(actionName)
                    .then((res) => {
                        setConnectedService(res.data.connected);
                    })
                    .catch((err) => {
                        console.log("error: ", err);
                    })
            }
        }
    }, [actionName]);

    const handleOnClick = async () => {
        let authUrl: string = '';

        if (actionName) {
            await getUrlToSubscribe(actionName)
                .then((res) => {
                    authUrl = res.data.url;
                })
                .catch((err) => {
                    console.log("error: ", err);
                })
        }

        myWindow = window.open(
            authUrl,
            '_blank',
            'width=600,height=600,top=100,left=100'
        )

        const checkIfClosed = setInterval(() => {
            if (myWindow?.closed) {
                const fetchAccessToken = async () => {
                    const code = getCookie("code");

                    if (code) {
                        try {
                            if (actionName) {
                                await getAccessTokenbyService(actionName, code);
                                setConnectedService(true);
                            }
                        } catch (error) {
                            console.error("Error fetching access token:", error);
                        }
                        deleteCookie("code");
                    }
                };

                fetchAccessToken();
                clearInterval(checkIfClosed);
            }
        }, 500);
    }

    useEffect(() => {
        if (actionName) {
            const expires: Date = new Date();
            const minutes = 10;
            expires.setTime(expires.getTime() + minutes * 60 * 1000);

            if (page === "Trigger") {
                getAllActionsOfAService(actionName)
                    .then((res) => {
                        const newCards: ICardForArea[] = res.data.areas.map((element: IArea, idx: number) => {
                            const newParams: string[] = element?.params;
                            let description: string;

                            if (locale === "en") {
                                description = element.enDescription;
                            } else {
                                description = element.frDescription;
                            }
                            return {
                                key: idx,
                                title: element.name.split(".")[1],
                                description: description,
                                params: newParams,
                            };
                        });
                        setCards(newCards);
                    })
                    .catch((err) => {
                        console.log("error: ", err);
                    })
                setCookie('actionService', actionName, {
                    expires: expires,
                });
            } else {
                getAllReactionsOfAService(actionName)
                    .then((res) => {
                        const newCards: ICardForArea[] = res.data.areas.map((element: IArea, idx: number) => {
                            const newParams: string[] = element?.params;
                            let description: string;

                            if (locale === "en") {
                                description = element.enDescription;
                            } else {
                                description = element.frDescription;
                            }
                            return {
                                key: idx,
                                title: element.name.split(".")[1],
                                description: description,
                                params: newParams,
                            };
                        });
                        setCards(newCards);
                    })
                    .catch((err) => {
                        console.log("error: ", err);
                    })
                setCookie('reactionService', actionName, {
                    expires: expires,
                });
            }
        }
    })

    return (
        <div>
            <NavBarRegistered />
            <div className="mt-24 flex w-full h-100 pb-16" style={{ backgroundColor: color, borderColor: color }}>
                <div className="pl-40 mt-10 basis-1/3 place-content-end h-1/3">
                    <Button
                        className="outline outline-4 px-14 py-8 rounded-3xl text-2xl font-murecho-bold text-white"
                        variant="light"
                        onClick={() => { router.back() }}
                    >
                        {useTranslations('ButtonBack')('title')}
                    </Button>
                </div>
                <div className="basis-1/3 flex flex-col items-center justify-center mt-10">
                    <p className="font-murecho-bold text-white text-5xl mb-6">
                        {translation('title')}
                    </p>

                    {logo && (
                        <div className="flex justify-center mb-4">
                            <Image
                                src={logo.src}
                                width={150}
                                height={170}
                                className="rounded-full"
                                alt={`${actionName} logo`}
                            />
                        </div>
                    )}
                    <p className="text-white font-murecho-bold text-5xl">
                        {actionName!.charAt(0).toUpperCase() + actionName!.slice(1).toLowerCase()}
                    </p>
                </div>
            </div>

            {connectedService ?
                <div className="flex items-center justify-center pt-20">
                    <div className="grid grid-cols-4 gap-20">
                        {cards.map((e) =>
                            <div key={e.key}>
                                <CardForArea card={e} color={actionColor} key={e.key} page={page} nameService={actionName ? actionName : undefined} />
                            </div>
                        )}
                    </div>
                </div>
                :
                <div className="flex justify-center pt-32">
                    <Button
                        variant="light"
                        className="flex justify-center w-72 h-28 border-4 rounded-full hover:animate-pulse"
                        style={{ backgroundColor: actionColor, borderColor: actionColor }}
                        onClick={() => { handleOnClick() }}
                    >
                        <p className="text-3xl font-murecho-bold text-white">
                            {translation('connectButton')}
                        </p>
                    </Button>
                </div>
            }
            <div className="mt-8" ></div>
        </div >
    )
}

export default ChooseArea;