"use client";

import { NavBarUnregistered } from "@/app/components/NavBar";
import { useTranslations } from "next-intl";
import { FormRegister } from "./(components)/formRegister";

const Register = () => {
    const translation = useTranslations('CreateAnAccountForm');

    return (
        <>
            <NavBarUnregistered page="register" />
            <div className="flex flex-col justify-center items-center mt-20 gap-6">
                <p className="font-murecho-bold text-[#1E3A8A] text-6xl pt-20" aria-label="Create an Account">{translation('title')}</p>
                <FormRegister />
            </div>
        </>
    )
}

export default Register;
