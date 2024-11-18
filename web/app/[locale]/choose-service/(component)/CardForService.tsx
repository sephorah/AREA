import Image from "next/image";
import { Card, CardFooter } from "@nextui-org/react";
import { ICardForService } from "@/app/types";
import { useRouter, useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const CardForService = ({
    card,
}: {
    card: ICardForService,
}) => {
    const router: AppRouterInstance = useRouter();
    const nextPage: string | null | undefined = useSearchParams()?.get('name');

    return (
        <Card
            isFooterBlurred
            className={`border-4 w-80 h-80`}
            style={{ backgroundColor: "#" + card.color, borderColor: "#" + card.color }}
            isPressable
            onClick={() => {
                if (nextPage === 'trigger') {
                    router.push(card.redirectionTrigger)
                } else {
                    router.push(card.redirectionReaction)
                }
            }}
        >
            <CardFooter className="justify-center absolute rounded-large bottom-1 w-[calc(100%_-_8px)] ml-1">
                <p className="text-white font-murecho-bold text-xl">{card.name.toUpperCase()}</p>
            </CardFooter>
            <Image
                src={card.img}
                width={150}
                alt={`Service icon for ${card.name}`}
                className="m-auto"
            />
        </Card>
    )
}

export default CardForService;