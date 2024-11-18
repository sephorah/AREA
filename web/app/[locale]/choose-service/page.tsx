"use client"
import { NavBarRegistered } from "@/app/components/NavBar";
import { useEffect, useState } from "react";
import { ICardForService } from "@/app/types";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { getAllReactionsOfAService, getAllServices } from "@/app/api/service";
import CardForService from "./(component)/CardForService";
import Logos from "@/app/components/Logos";
import Colors from "@/app/components/Colors";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

const ChooseService = () => {
    const translation = useTranslations("ChooseService");
    const router: AppRouterInstance = useRouter();
    const [cards, setCards] = useState<ICardForService[]>()
    const params: ReadonlyURLSearchParams | null = useSearchParams();
    const name: string | null | undefined = params?.get('name');

    useEffect(() => {
        getAllServices()
            .then((res) => {
                const newCards: ICardForService[] = res.data.services.map((element: ICardForService) => {
                    const redirectionTrigger: string = `choose-trigger?name=${element.name}&color=${Colors[element.name]}`
                    const redirectionReaction: string = `choose-reaction?name=${element.name}&color=${Colors[element.name]}`

                    return {
                        key: element.name,
                        name: element.name,
                        img: Logos[element.name],
                        color: Colors[element.name],
                        redirectionTrigger: redirectionTrigger,
                        redirectionReaction: redirectionReaction,
                    };
                });
                if (name == "reaction") {
                    const fetchCards = async () => {
                        const cardsWithoutEmptyService = await Promise.all(
                            newCards.map(async (element) => {
                                const res = await getAllReactionsOfAService(element.name);

                                if (res.data && (Array.isArray(res.data) ? res.data.length !== 0 : Object.keys(res.data).length !== 0)) {
                                    return {
                                        key: element.name,
                                        name: element.name,
                                        img: element.img,
                                        color: element.color,
                                        redirectionTrigger: element.redirectionTrigger,
                                        redirectionReaction: element.redirectionReaction,
                                    };
                                }
                                return null;
                            })
                        );
                        const filteredCards = cardsWithoutEmptyService.filter((card) => card !== null);
                        if (filteredCards) {
                            setCards(filteredCards);
                        }
                    };
                    fetchCards();
                } else {
                    setCards(newCards);
                }
            })
            .catch((err) => {
                console.log("error: ", err);
            });
    }, [])

    return (
        <div>
            <NavBarRegistered />
            <div className="flex mt-24">
                <div className="pl-40 basis-1/3 place-content-end">
                    <Button
                        className="px-14 py-8 rounded-3xl text-2xl font-murecho-bold text-white bg-[#1E3A8A]"
                        onClick={() => { router.back(); }}
                        aria-label="Go back to previous page"
                    >
                        {useTranslations('ButtonBack')('title')}
                    </Button>
                </div>

                <div className="flex justify-center basis-1/3 pt-8">
                    <p className="font-murecho-bold text-[#1E3A8A] text-6xl text-center" aria-label="Choose a service title">
                        {translation('title')}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center pt-20 mb-auto">
                <div className="grid grid-cols-3 gap-20">
                    {cards?.map((card) => {
                        return (<CardForService key={card.key} card={card} aria-label={`Card for ${card.name} service`} />)
                    })}
                </div>
            </div>
            <div className="mt-8"></div>
        </div>
    )
}

export default ChooseService;
