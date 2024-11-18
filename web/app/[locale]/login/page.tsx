"use client";
import { Button, Input, Spacer } from "@nextui-org/react";
import { useTranslations, useLocale } from "next-intl";
import { ButtonConnexionOAuth } from "./(components)/ButtonConnexionOAuth";
import { useState } from "react";
import { useFormik } from "formik";
import { setAccessToken } from "../../auth/auth";
import { login } from "../../api/auth";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { NavBarUnregistered } from "@/app/components/NavBar";
import ButtonToShowPassword from "@/app/components/ButtonToShowPassword";
import GoogleLogo from "@/public/(assets)/Google.png";
import DiscordLogo from "@/public/(assets)/Discord.png";
import SpotifyLogo from "@/public/(assets)/Spotify.png";
import GithubLogo from "@/public/(assets)/Github.png";
import { setCookie } from "cookies-next";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const FormToLogin = () => {
    const translation = useTranslations("LogInForm");
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const validationSchema = Yup.object({
        username: Yup.string().required(translation("usernameRequired")),
        password: Yup.string().required(translation("passwordRequired")),
    });

    const formik = useFormik({
        initialValues: { username: "", password: "" },
        validationSchema,
        onSubmit: (values) => {
            const expires: Date = new Date();
            const nbrDays: number = 7;
            expires.setDate(expires.getDate() + nbrDays);

            login(values)
                .then((res) => {
                    setAccessToken(res.data.accessToken);
                    setCookie("userId", res.data.userId, {
                        expires: expires,
                    });
                    router.replace(`/${locale}?about=true`);
                })
                .catch((err) => console.log("error: ", err));
        },
    });

    return (
        <div className="p-6 font-murecho">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <Input
                    id="username"
                    label={translation("username")}
                    type="text"
                    isRequired
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                    radius="full"
                    className="max-w-xs font-murecho font-bold outline-[#1E3A8A]"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                    errorMessage={
                        formik.touched.username && formik.errors.username
                            ? formik.errors.username
                            : null
                    }
                    aria-label="Username"
                />
                <Spacer y={1.5} />
                <Input
                    id="password"
                    label={translation("password")}
                    type={isVisible ? "text" : "password"}
                    isRequired
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                    radius="full"
                    className="max-w-xs font-murecho font-bold"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    errorMessage={
                        formik.touched.password && formik.errors.password
                            ? formik.errors.password
                            : null
                    }
                    aria-label="Password"
                    endContent={<ButtonToShowPassword isVisible={isVisible} setIsVisible={setIsVisible} />}
                />
                <Spacer y={1.5} />
                <Button
                    type="submit"
                    radius="full"
                    size="lg"
                    variant="solid"
                    className="font-murecho-bold bg-[#1E3A8A] mx-auto mt-6 grid place-content-center text-white w-80 shadow-md"
                    aria-label="Log in"
                >
                    {translation("buttonLogIn")}
                </Button>
            </form>
        </div>
    );
};

const LogInWithOauth = () => {
    const translation = useTranslations("LogInOauth");

    return (
        <div className="grid place-content-center space-y-2 font-murecho">
            <ButtonConnexionOAuth name={translation("google")} logo={GoogleLogo} />
            <ButtonConnexionOAuth name={translation("spotify")} logo={SpotifyLogo} />
            <ButtonConnexionOAuth name={translation("discord")} logo={DiscordLogo} />
            <ButtonConnexionOAuth name={translation("github")} logo={GithubLogo} />
        </div>
    );
};

const CreateAnAccount = () => {
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();
    const translation = useTranslations("CreateAnAccount");

    return (
        <h2 style={{ fontSize: "18px" }} className="font-bold mt-6 text-center font-murecho">
            {translation("question")}
            <Button
                style={{ fontSize: "18px" }} className="font-murecho text-[#1E3A8A] bg-transparent underline font-bold"
                onClick={() => {
                    router.replace(`/${locale}/register`);
                }}
                aria-label="Sign up"
            >
                {translation("signUp")}
            </Button>
        </h2>
    );
};

export default function PageToLogin() {
    const translationTitle = useTranslations("LogInForm");

    return (
        <>
            <NavBarUnregistered page="login" />
            <p className="mt-40 grid place-content-center text-6xl font-murecho-bold text-[#1E3A8A]">
                {translationTitle("title")}
            </p>
            <div className="mt-12 flex items-center justify-center">
                <FormToLogin />
                <div className="mx-12 h-[1px] bg-gray-300"
                    style={{ height: "300px", width: "1px" }}
                />
                <LogInWithOauth />
            </div>
            <div className="my-4 grid place-content-center">
                <CreateAnAccount />
            </div>
        </>
    );
}
