import { ICardForArea } from "@/app/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { darken } from "polished";

const CardForArea = ({
    page,
    card,
    color,
    nameService
}: {
    page: string,
    card: ICardForArea,
    color: string,
    nameService?: string
}) => {
    const borderColor: string = darken(0.1, color);
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();

    return (
        <div>
            <Card
                className="relative w-72 h-80 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden"
                style={{
                    backgroundColor: color,
                    borderColor: borderColor,
                    borderWidth: "1px"
                }}
                isPressable
                onClick={() => {
                    let nameTriggerAndReaction;
                    const expires: Date = new Date();
                    const minutes = 10;
                    expires.setTime(expires.getTime() + minutes * 60 * 1000);

                    if (nameService == "google") {
                        nameTriggerAndReaction = `gmail.${card.title}`;
                    } else {
                        nameTriggerAndReaction = `${nameService}.${card.title}`;
                    }

                    if (card?.params) {
                        if (page === "Trigger") {
                            setCookie('actionNameForDisplay', card.title.replace(/_/g, ' '), {
                                expires: expires,
                            });
                            setCookie('actionNameForCreateArea', nameTriggerAndReaction, {
                                expires: expires,
                            });
                            router.replace(`/${locale}/set-params?type=Trigger&nameService=${nameService}&nameArea=${card.title}&color=${color}`);
                        } else {
                            setCookie('reactionNameForDisplay', card.title.replace(/_/g, ' '), {
                                expires: expires,
                            });
                            setCookie('reactionNameForCreateArea', nameTriggerAndReaction, {
                                expires: expires,
                            });
                            router.replace(`/${locale}/set-params?type=Reaction&nameService=${nameService}&nameArea=${card.title}&color=${color}`);
                        }
                    } else {
                        if (page === "Trigger") {
                            setCookie('actionNameForDisplay', card.title.replace(/_/g, ' '), {
                                expires: expires,
                            });
                            setCookie('actionNameForCreateArea', nameTriggerAndReaction, {
                                expires: expires,
                            });
                            setCookie('actionParams', "{}", {
                                expires: expires,
                            });
                        } else {
                            setCookie('reactionNameForDisplay', card.title.replace(/_/g, ' '), {
                                expires: expires,
                            });
                            setCookie('reactionNameForCreateArea', nameTriggerAndReaction, {
                                expires: expires,
                            });
                            setCookie('reactionParams', "{}", {
                                expires: expires,
                            });
                        }
                        router.push('create-area');
                    }
                }}
            >
                <CardHeader className="absolute top-0 left-0 w-full h-16 bg-transparent border-b-2 border-white flex items-center justify-center shadow-sm">
                    <p className="font-murecho-bold text-white text-2xl">
                        {card.title.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </p>
                </CardHeader>

                <CardBody className="pl-5 pr-5 pt-20">
                    <p className="font-murecho-normal text-white text-xl mx-auto text-center">
                        {card.description}
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}

export default CardForArea;
