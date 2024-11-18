"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { NavBarLanding, NavBarRegistered } from "@/app/components/NavBar";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, Card } from "@nextui-org/react";
import CardForService from "./choose-service/(component)/CardForService";
import Logos from "../components/Logos";
import Colors from "../components/Colors";
import { useEffect, useState } from "react";
import { getAllServices } from "../api/service";
import { ICardForService } from "../types";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface IContributor {
    name: string,
    color: string,
    imagePath: string
}

const LandingPage = () => {
    const params: ReadonlyURLSearchParams | null = useSearchParams();
    const isAbout: string | null | undefined = params?.get('about');
    const translate = useTranslations("LandingPage");
    const [cardsServices, setCardsServices] = useState<ICardForService[]>()
    const contributors: IContributor[] = [
        {
            name: "Ismaïel",
            color: "#2196F3",
            imagePath: "/(assets)/Ismaïel.png"

        },
        {
            name: "Baptiste",
            color: "#4CAF50",
            imagePath: "/(assets)/Baptiste.png"
        },
        {
            name: "Sephorah",
            color: "#9C27B0",
            imagePath: "/(assets)/Sephorah.png"
        },
        {
            name: "Yasmine",
            color: "#FF4081",
            imagePath: "/(assets)/Yasmine.png"
        }
    ];

    useEffect(() => {
        getAllServices()
            .then((res) => {
                const newCards: ICardForService[] = res.data.services.map((element: ICardForService) => {
                    return {
                        key: element.name,
                        name: element.name,
                        img: Logos[element.name],
                        color: Colors[element.name],
                        redirectionTrigger: "",
                        redirectionReaction: "",
                    };
                });
                setCardsServices(newCards);
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    })

    return (
        <div>
            <div className="overflow-auto h-screen">
            {isAbout !== null ?
                <NavBarRegistered />
                :
                <NavBarLanding />
            }
                <div className="mt-24 flex justify-center pt-16" aria-label={translate("title")}>
                    <p className="font-murecho-bold text-6xl text-[#1E3A8A]">
                        {translate('title')}
                    </p>
                </div>
                <div className="flex justify-center pt-16 sm:px-80" aria-label={translate("description")}>
                    <p className="font-murecho-bold indent-6 text-center text-2xl text-[#1E3A8A]">
                        {translate('description')}
                    </p>
                </div>
                <div className="flex justify-center pt-16" aria-label={translate("services")}>
                    <p className="font-murecho-bold text-6xl text-[#1E3A8A]">
                        {translate('services')}
                    </p>
                </div>
                <div className="grid grid-cols-3 pt-10 gap-x-0 justify-items-center" aria-label="Services List">
                    {cardsServices?.map((card) => (
                        <div key={card.key} className="transform scale-90" aria-label={`Service Card for ${card.name}`}>
                            <CardForService card={card} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-16" aria-label={translate("contributors")}>
                    <p className="font-murecho-bold text-6xl text-[#1E3A8A]">
                        {translate('contributors')}
                    </p>
                </div>
                <div className="grid grid-flow-col justify-center gap-14 py-10" aria-label="Contributors List">
                    {contributors.map((card, i) =>
                        <Card
                            radius="lg"
                            className="w-52 h-52"
                            style={{ backgroundColor: card.color }}
                            key={card.name}
                            aria-label={`Contributor card for ${card.name}`}
                        >
                            <div className="flex flex-col justify-center h-full items-center pb-3">
                                <Avatar alt={`Avatar of contributor ${card.name}`} src={card.imagePath} className="w-20 h-20 text-large border-4 border-white-500/100" />
                                <p className="font-murecho-bold text-3xl text-white mt-2">
                                    {card.name}
                                </p>
                            </div>

                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LandingPage;