"use client"

import { getAllActionsOfAService, getAllReactionsOfAService } from "@/app/api/service";
import Colors from "@/app/components/Colors";
import { NavBarRegistered } from "@/app/components/NavBar";
import { IArea } from "@/app/types";
import { Button, Input } from "@nextui-org/react";
import { setCookie } from "cookies-next";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const setParamsArea = () => {
    const searchParams: ReadonlyURLSearchParams | null = useSearchParams();
    let nameService: string = "#000000";
    const name: string | null | undefined = searchParams?.get('nameService');
    const nameArea: string | null | undefined = searchParams?.get('nameArea');
    const type: string | null | undefined = searchParams?.get('type');
    const router: AppRouterInstance = useRouter();
    const [area, setArea] = useState<IArea | undefined>();
    const translation = useTranslations("setParams");
    const [errorMessage, setErrorMessage] = useState<string>('');

    const formik = useFormik({
        initialValues: {
        },

        onSubmit: (value) => {
            const expires: Date = new Date();
            const minutes = 10;
            expires.setTime(expires.getTime() + minutes * 60 * 1000);

            if (!value || Object.keys(value).length === 0) {
                setErrorMessage(translation('errorMessage'));
                return;
            } else {
                if (type == "Trigger") {
                    setCookie("actionParams", value, {
                        expires: expires,
                    });
                } else {
                    setCookie("reactionParams", value, {
                        expires: expires,
                    });
                }
                router.push('create-area');
            }
        },
    });

    if (name) {
        nameService = name;
    }

    useEffect(() => {
        if (nameService) {
            if (type == "Trigger") {
                getAllActionsOfAService(nameService)
                    .then((res) => {
                        setArea(res.data.areas.find((area: IArea) => area.name.split(".")[1] == nameArea));
                    })
                    .catch((err) => {
                        console.log("error: ", err);
                    })
            } else {
                getAllReactionsOfAService(nameService)
                    .then((res) => {
                        setArea(res.data.areas.find((area: IArea) => area.name.split(".")[1] == nameArea));
                    })
                    .catch((err) => {
                        console.log("error: ", err);
                    })
            }
        }
    });

    return (
        <div>
            <NavBarRegistered />
            <div className="mt-24 flex w-full h-64" style={{ backgroundColor: '#' + Colors[nameService] }}>
                <div className="pl-40 basis-1/3 place-content-end h-1/3">
                    <Button
                        className="outline outline-4 px-14 py-8 rounded-3xl text-2xl font-murecho-bold text-white"
                        variant="light"
                        aria-label="Go back to previous page"
                        onClick={() => { router.back() }}
                    >
                        {useTranslations('ButtonBack')('title')}
                    </Button>
                </div>
                <div className="basis-1/3">
                    <div className="flex justify-center place-items-center pt-20">
                        <p className=" font-murecho-bold text-white text-5xl" aria-label={`Service name: ${nameService?.replace(/_/g, ' ')}`}>
                            {nameService?.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            </div>

            < div className="flex justify-center pt-10">
                {area &&
                    <form onSubmit={formik.handleSubmit} aria-label="Parameters form">
                        {area.params?.map((param: string, idx: number) => {
                            return (
                                <div key={idx}>
                                    <Input
                                        key={idx}
                                        id={param}
                                        label={param}
                                        type="text"
                                        isRequired
                                        labelPlacement="outside"
                                        variant="bordered"
                                        size="lg"
                                        className="font-murecho w-64"
                                        onChange={formik.handleChange}
                                        aria-label={param}
                                    />
                                    {errorMessage && <div className="text-red-500 font-murecho text-sm">{errorMessage}</div>}
                                </div>
                            )
                        })}
                        <Button type="submit" radius="full" size="lg" variant="solid"
                            className="font-murecho bg-[#adbfda] hover:bg-[#6789ba] mx-auto mt-6 grid place-content-center text-white w-28" aria-label="Finish setting parameters">
                            {translation('buttonFinish')}
                        </Button>
                    </form>
                }
            </div>

        </div >
    )
}

export default setParamsArea;