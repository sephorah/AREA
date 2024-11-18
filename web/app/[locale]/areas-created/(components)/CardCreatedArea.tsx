"use client";
import { ICardCreatedArea } from "@/app/types";
import { Button, Card, CardBody, CardHeader, Popover, PopoverTrigger } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import StarIcon from "@/public/icons/Star";

const CardCreatedArea = ({
    card
}: {
    card: ICardCreatedArea
}) => {
    const translation = useTranslations('AreasCreated')

    return (
        <div>
            <Card className="border-4 w-96 h-100 bg-white border-[#e6e6e6] size-lg" shadow="lg" aria-label="Created area card">
                <CardHeader className="flex justify-center pt-5">
                    <StarIcon/>
                </CardHeader>
                <CardBody className="pl-5 pr-5 py-14">
                    <div className="flex justify-center gap-14" aria-label="Action and reaction logos">
                        <Image
                            src={card.actionLogo}
                            alt={`Logo of the action's service: ${card.actionTitle}`}
                            width={100}
                            height={90}
                        />
                        <Image
                            src={card.reactionLogo}
                            alt={`Logo the reaction's service: ${card.reactionTitle}`}
                            width={100}
                            height={90}
                        />
                    </div>
                    <div className="mt-10">
                        <p className="font-murecho-bold text-[#1E3A8A] text-3xl" aria-label="If condition">
                            {translation('if')} :
                        </p>
                        <p className="font-murecho-bold text-black text-xl" aria-label={`Action: ${card.actionTitle}`}>
                            {card.actionTitle}
                        </p>
                        <p className="mt-5 font-murecho-bold text-[#1E3A8A] text-3xl" aria-label="Then condition">
                            {translation('then')} :
                        </p>
                        <p className="font-murecho-bold text-black text-xl" aria-label={`Reaction: ${card.reactionTitle}`}>
                            {card.reactionTitle}
                        </p>
                    </div>
                </CardBody>
            </Card >
        </div >
    )
}

export default CardCreatedArea;