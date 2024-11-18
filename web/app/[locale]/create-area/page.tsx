"use client";

import { NavBarRegistered } from "@/app/components/NavBar";
import DivActionReaction from "./(components)/DivActionReaction";
import LongArrowDownIcon from "@/public/icons/LongArrowDown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import dynamic from 'next/dynamic';
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { CookieValueTypes, deleteCookie, getCookie, hasCookie } from "cookies-next";
import { createArea } from "@/app/api/service";
import { useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const DivActionReactionWithNoSSR = dynamic(() => import('./(components)/DivActionReaction'), { ssr: false });

function deleteCookieForArea() {
    deleteCookie('actionService');
    deleteCookie('reactionService');
    deleteCookie('actionNameForCreateArea');
    deleteCookie('reactionNameForCreateArea');
    deleteCookie('actionNameForDisplay');
    deleteCookie('reactionNameForDisplay');
    deleteCookie('actionParams');
    deleteCookie('reactionParams');
    deleteCookie('actionService');
    deleteCookie('reactionService');
}

const CreateArea = () => {
    const translation = useTranslations('CreateArea');
    const router: AppRouterInstance = useRouter();
    const hasAction: boolean = hasCookie('actionService');
    const hasReaction: boolean = hasCookie('reactionService');
    const actionService: CookieValueTypes = getCookie('actionService');
    const reactionService: CookieValueTypes = getCookie('reactionService');
    const actionTitle: CookieValueTypes = getCookie('actionNameForDisplay');
    const reactionTitle: CookieValueTypes = getCookie('reactionNameForDisplay');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messageInPopover, setMessageInPopover] = useState<string>("");
    const locale: string = useLocale();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            timer = setTimeout(() => {
                setIsOpen(false);
                deleteCookieForArea();
                router.replace(`/${locale}/areas-created`);
            }, 2000);
        }

        return () => {
            clearTimeout(timer);
        }
    });

    const handleClick = async () => {
        const ownerId: CookieValueTypes = getCookie("userId");
        const action: CookieValueTypes = getCookie("actionNameForCreateArea");
        const reaction: CookieValueTypes = getCookie("reactionNameForCreateArea");
        let actionParams: CookieValueTypes = getCookie("actionParams")
        let reactionParams: CookieValueTypes = getCookie("reactionParams")

        if (reactionParams) {
            const objReactionParams = JSON.parse(reactionParams);
            reactionParams = JSON.stringify(objReactionParams)
        }
        if (actionParams) {
            const objActionParams = JSON.parse(actionParams);
            actionParams = JSON.stringify(objActionParams)
        }
        await createArea({ ownerId, action, reaction, actionParams, reactionParams })
            .then(() => {
                setIsOpen(true);
                setMessageInPopover(translation('successful'));
            })
            .catch((err) => {
                setIsOpen(true);
                setMessageInPopover(translation('failed'));
                console.log("error: ", err);
            })
    }

    return (
        <>
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
                    <p className="font-murecho-bold text-[#1E3A8A] text-6xl text-center" aria-label="Create area title">
                        {translation('title')}
                    </p>
                </div>
                {/* <div className="pl-40 basis-1/3 place-content-end">
                    <Button
                        className="px-14 py-8 rounded-3xl text-2xl font-murecho-bold text-white bg-[#1E3A8A]"
                        onClick={() => {
                            deleteCookieForArea();
                            router.replace(`/${locale}/create-area`);
                        }}
                    >
                        {useTranslations('ButtonNewArea')('title')}
                    </Button>
                </div> */}
            </div>
            <div className="flex flex-col pt-28">
                <div className="flex justify-center">
                    {hasAction ?
                        <DivActionReactionWithNoSSR isEnable={true} label={`${translation('if')}`} nextRoute={`choose-service?name=trigger`} service={actionService} title={actionTitle} />
                        :
                        <DivActionReactionWithNoSSR isEnable={true} label={`${translation('if this')}  ...`} nextRoute={`choose-service?name=trigger`} service={undefined} title={undefined} />
                    }
                </div>

                <div className="flex justify-center">
                    <LongArrowDownIcon aria-label="Arrow indicating action-to-reaction flow" />
                </div>

                <div className="flex justify-center mt-8">
                    {hasReaction ?
                        <DivActionReaction isEnable={true} label={`${translation('then')}`} nextRoute={`choose-service?name=reaction`} service={reactionService} title={reactionTitle}/>
                        :
                        <DivActionReaction isEnable={hasAction} label={`${translation('then that')}  ...`} nextRoute={`choose-service?name=reaction`} service={undefined} title={undefined} />
                    }
                </div>
                <div className="flex justify-center mt-8 mb-8">
                    {(hasAction && hasReaction) &&
                        <Popover placement="top" isOpen={isOpen}>
                            <PopoverTrigger >
                                <Button
                                    className="text-3xl font-murecho-bold text-white bg-[#1E3A8A] p-8"
                                    onClick={() => {
                                        handleClick();
                                    }}
                                >
                                    {translation('submit')}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent>
                                <div className="px-1 py-2">
                                    <div className="text-small font-bold">
                                        {messageInPopover}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    }
                </div>
            </div>
        </>
    );
}

export default CreateArea;
