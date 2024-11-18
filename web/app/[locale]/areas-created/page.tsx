"use client";
import { NavBarRegistered } from "@/app/components/NavBar";
import { Button } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import CardCreatedArea from "./(components)/CardCreatedArea";
import { ICardCreatedArea, IResponseArea } from "@/app/types";
import { CookieValueTypes, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { getAreasByUserId } from "@/app/api/user";
import Logos from "@/app/components/Logos";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const AreasCreated = () => {
    const translation = useTranslations('AreasCreated')
    const router: AppRouterInstance = useRouter()
    const locale: string = useLocale();
    const [areas, setAreas] = useState<ICardCreatedArea[]>([]);

    useEffect(() => {
        const userId: CookieValueTypes = getCookie("userId");

        if (userId) {
            const fetchData = async () => {
                try {
                    const data: IResponseArea[] = (await getAreasByUserId(userId)).data.areas;
                    if (data) {
                        const newAreas: ICardCreatedArea[] = data.map((data: IResponseArea) => {
                            let actionTitle: string;
                            let reactionTitle: string;

                            if (locale === "en") {
                                actionTitle = data.descriptionEnAction;
                                reactionTitle = data.descriptionEnReaction;
                            } else {
                                actionTitle = data.descriptionFrAction;
                                reactionTitle = data.descriptionFrReaction;
                            }

                            const createdArea: ICardCreatedArea = {
                                key: data.id,
                                actionLogo: Logos[data.action.split(".")[0]],
                                actionTitle: actionTitle,
                                reactionLogo: Logos[data.reaction.split(".")[0]],
                                reactionTitle: reactionTitle,
                            };
                            return createdArea;
                        });
                        setAreas(newAreas);
                    }
                } catch (err) {
                    console.log("error: ", err);
                }
            }
            fetchData();
        }
    });

    return (
        <div>
            <NavBarRegistered/>
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
                    <p className="font-murecho-bold text-[#1E3A8A] text-6xl text-center" aria-label="Page title">
                        {translation('title')}
                    </p>
                </div>
                <div className="pl-40 basis-1/3 place-content-end">
                    <Button
                        className="px-14 py-8 rounded-3xl text-2xl font-murecho-bold text-white bg-[#1E3A8A]"
                        onClick={() => { router.replace(`/${locale}/create-area`); }}
                        aria-label="Create a new area"
                    >
                        {useTranslations('ButtonNewArea')('title')}
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-center pt-20">
                <div className="grid grid-cols-3 pt-10 gap-10" aria-label="List of created areas">
                    {areas.map((area) =>
                        <CardCreatedArea key={area.key} card={area} />
                    )}
                </div>
            </div>
            <div className="mt-8"> </div>
        </div>
    );
};

export default AreasCreated;
