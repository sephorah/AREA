"use client"
import { Button } from "@nextui-org/react"
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logos from "@/app/components/Logos";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const EnableDiv = ({
    label,
    nextRoute
}: {
    label: string,
    nextRoute: string
}) => {
    const translation = useTranslations('DivActionReaction');
    const router: AppRouterInstance = useRouter();

    return (
        <Button
            className="p-14 rounded-3xl bg-[#1E3A8A] font-murecho-bold text-white text-7xl"
            onClick={() => { router.push(nextRoute) }}
        >
            {label}
            <Button
                className="ml-10 text-lg bg-white font-murecho-bold text-[#1E3A8A]"
                onClick={() => {
                    router.push(nextRoute)
                }}
            >
                {translation('title')}
            </Button>
        </Button>
    )
}

const DisabledDiv = ({
    label
}: {
    label: string
}) => {

    return (
        <Button
            disabled
            className="p-14 rounded-3xl bg-[#adbfda] font-murecho-bold text-white text-7xl"
        >
            {label}
        </Button>
    )
}

const ChoosedArea = ({
    label,
    service,
    title
}: {
    label: string,
    service: string,
    title: string
}) => {
    return (
        <Button
            disabled
            className="p-14 rounded-3xl bg-[#d9d9d9] font-murecho-bold text-black text-7xl"
        >
            {label}
            <div className="px-10">
                <Image
                    src={Logos[service]}
                    alt={`Logo for ${service} service`}
                    width={100}
                />
            </div>
            <p className="font-murecho-bold text-2xl">{title.replace(/\b\w/g, char => char.toUpperCase())}</p>
        </Button>
    )
}

const DivActionReaction = ({
    isEnable,
    label,
    nextRoute,
    service,
    title,
}: {
    isEnable: boolean,
    label: string,
    nextRoute: string,
    service: string | undefined,
    title: string | undefined
}) => {
    if (service && title)
        return <ChoosedArea label={label} service={service} title={title} />

    if (isEnable)
        return <EnableDiv label={label} nextRoute={nextRoute} />
    else {
        return <DisabledDiv label={label} />
    }
}

export default DivActionReaction;
