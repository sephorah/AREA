"use client";

import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    ButtonGroup,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import HomeIcon from "@/public/icons/Home";
import QuestionMarkIcon from "@/public/icons/QuestionMark";
import Image from "next/image";
import AreaLogo from '@/public/(assets)/Area.png'
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ILanguage } from "../types";
import LogOutIcon from "@/public/icons/LogOut";
import deleteAllCookies from "./DeleteAllCookies";
import { logout } from "../api/user";
import { useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const NavBarUnregistered = ({
    page
}: {
    page: string;
}) => {
    const router: AppRouterInstance = useRouter();
    const translate = useTranslations('Navbar');
    const locale: string = useLocale();
    const countryFlags: ILanguage = {
        'en': 'https://flagsapi.com/GB/flat/64.png',
        'fr': 'https://flagsapi.com/FR/flat/64.png'
    }
    const languages: string[] = [translate('english'), translate('french')]
    const langValue: string[] = ["en", "fr"];

    return (
        <Navbar className="w-full bg-white shadow-md fixed top-0 z-10 py-3 px-4">
            <div className="container mx-auto flex items-center justify-between px-6 max-w-[1400px]">
                <NavbarBrand className="flex items-center gap-4" aria-label="AREA Logo and Title">
                    <Image src={AreaLogo} width={60} height={60} alt="AREA Logo" />
                    <p className="text-3xl font-murecho-bold text-[#1E3A8A]">AREA</p>
                </NavbarBrand>

                <NavbarContent className="flex items-center gap-6">
                    <NavbarItem aria-label="Language Selector">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="w-10 h-10 p-0 bg-transparent hover:bg-gray-100 rounded-full flex items-center justify-center">
                                    <Avatar
                                        src={countryFlags[locale]}
                                        alt={`Flag for ${locale} language`}
                                        className="w-full h-full rounded-full"
                                    />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Language Selection">
                                {languages.map((lang, i) => (
                                    <DropdownItem
                                        key={lang}
                                        onClick={() => router.push(`/${langValue[i]}/${window.location.href.substring(25)}`)}
                                        className="font-murecho-bold"
                                        aria-label={`Switch to ${lang} language`}
                                    >
                                        {lang}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>

                    <NavbarItem>
                        <Button
                            as="a"
                            className="bg-transparent border-3 border-[#1E3A8A] text-[#1E3A8A] font-murecho-bold font-semibold rounded-full px-6 py-2 hover:bg-[#1E3A8A] hover:text-white transition-all"
                            size="lg"
                            onClick={() => {
                                if (page === "login") {
                                    router.push(`/${locale}/register`);
                                } else {
                                    router.push(`/${locale}/login`);
                                }
                            }}
                            aria-label={page === 'login' ? "Go to Create Account page" : "Go to Login page"}
                        >
                            {page === 'login' ? translate('pageLogin') : translate('pageRegister')}
                        </Button>
                    </NavbarItem>

                    <NavbarItem>
                        <Button
                            as="a"
                            size="lg"
                            href="/api/download"
                            className="bg-[#1E3A8A] text-white font-murecho-bold rounded-full px-6 py-2 hover:bg-[#1E3A8A] flex items-center gap-2 transition-all"
                            aria-label="Download Android App"
                        >
                            {translate("download")}
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </div>
        </Navbar>
    );
};

const NavBarRegistered = () => {
    const translate = useTranslations("Navbar")
    const isAdmin: boolean = false;
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();
    const countryFlags: ILanguage = {
        'en': 'https://flagsapi.com/GB/flat/64.png',
        'fr': 'https://flagsapi.com/FR/flat/64.png'
    }
    const languages: string[] = [translate('english'), translate('french')]
    const langValue: string[] = ["en", "fr"];
    const [helpOpen, setHelpOpen] = useState(false);


    return (
        <Navbar shouldHideOnScroll className="w-full flex items-center bg-white shadow-md fixed top-0 z-10 py-4">
            <NavbarBrand className="flex items-center gap-4" aria-label="AREA Logo and Title">
                <Image src={AreaLogo} width={70} height={70} alt="AREA Logo" />
                <p className="text-3xl font-murecho-bold text-[#1E3A8A]">AREA</p>
            </NavbarBrand>
            {isAdmin && (
                <NavbarContent className="flex justify-center">
                    <Button
                        className="border-2 border-[#1E3A8A] font-murecho-bold text-[#1E3A8A] rounded-full px-8 py-2 hover:bg-[#1E3A8A] hover:text-white transition-all"
                        onClick={() => router.push(`/${locale}/admin-actions`)}
                    >
                        {translate('buttonAdmin')}
                    </Button>
                </NavbarContent>
            )}
            <NavbarContent className="flex items-center gap-2">
                <NavbarItem aria-label="All Applets">
                    <Button
                        as="a"
                        size="lg"
                        onClick={() => router.push(`/${locale}/areas-created`)}
                        className="border-3 border-[#1E3A8A] text-[#1E3A8A] bg-transparent font-murecho-bold rounded-full px-8 py-3 hover:bg-[#1E3A8A] hover:text-white transition-all"
                        aria-label="All Applets"
                    >
                        {translate("areas-created")}
                    </Button>
                </NavbarItem>
                <NavbarItem aria-label="Create AREA">
                    <Button
                        as="a"
                        size="lg"
                        onClick={() => router.push(`/${locale}/create-area`)}
                        className="border-3 border-[#1E3A8A] text-[#1E3A8A] bg-transparent font-murecho-bold rounded-full px-8 py-3 hover:bg-[#1E3A8A] hover:text-white transition-all"
                        aria-label="Create AREA"
                    >
                        {translate("create")}
                    </Button>
                </NavbarItem>
                <NavbarItem aria-label="Download Android App">
                    <Button
                        as="a"
                        size="lg"
                        href="/api/download"
                        className="border-3 border-[#1E3A8A] text-[#1E3A8A] bg-transparent font-murecho-bold rounded-full px-8 py-3 hover:bg-[#1E3A8A] hover:text-white transition-all"
                        aria-label="Download Android App"
                    >
                        {translate("download")}
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <ButtonGroup size="sm" className="flex" aria-label="Navigation Options">
                        <Button onClick={() => router.push(`/${locale}?about=true`)} className="bg-transparent hover:bg-gray-200 ml-5" aria-label="Home">
                            <HomeIcon aria-label="Home Icon" />
                        </Button>
                        <Button onClick={() => router.push(`/${locale}/profile`)} className="bg-transparent hover:bg-gray-200 -ml-5" aria-label="Profile">
                            <Avatar size="sm" showFallback src="" alt="User Profile Avatar" />
                        </Button>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="bg-transparent hover:bg-gray-200 rounded-full -ml-5" aria-label="Language Selector">
                                    <Avatar size="sm" src={countryFlags[locale]} alt={`${locale} flag`} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Language Selection">
                                {languages.map((lang, i) => (
                                    <DropdownItem
                                        key={lang}
                                        onClick={() => router.push(`/${langValue[i]}/${window.location.href.substring(25)}`)}
                                        className="font-murecho-bold"
                                        aria-label={`Switch to ${lang} language`}
                                    >
                                        {lang}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Popover isOpen={helpOpen} onOpenChange={setHelpOpen} placement="bottom">
                            <PopoverTrigger>
                                <Button className="bg-transparent hover:bg-gray-200 -ml-5">
                                    <QuestionMarkIcon aria-label="Help" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto border border-[#1E3A8A]">
                                <div className="flex flex-col items-center text-center">
                                    <p className="font-murecho-bold text-gray-700 text-lg leading-relaxed mb-4" aria-label="Help Information">
                                        {translate("helpText")}
                                    </p>
                                    <Button
                                        className="font-murecho-bold text-white bg-[#1E3A8A] px-6 py-2 rounded-full hover:bg-[#365a83] transition-colors"
                                        onClick={() => setHelpOpen(false)}
                                        aria-label="Close Help"
                                    >
                                        {translate("closeText")}
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button onClick={() => {
                            logout()
                                .then()
                                .catch((err) => {
                                    console.log("error: ", err)
                                })
                            deleteAllCookies();
                            router.push('/');
                        }} className="bg-transparent hover:bg-gray-200 -ml-5" aria-label="Logout">
                            <LogOutIcon />
                        </Button>
                    </ButtonGroup>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};


const NavBarLanding = () => {
    const router: AppRouterInstance = useRouter();
    const translate = useTranslations('Navbar');
    const locale: string = useLocale();
    const countryFlags: ILanguage = {
        'en': 'https://flagsapi.com/GB/flat/64.png',
        'fr': 'https://flagsapi.com/FR/flat/64.png'
    }
    const languages: string[] = [translate('english'), translate('french')]
    const langValue: string[] = ["en", "fr"];

    return (
        <Navbar className="w-full bg-white shadow-md fixed top-0 z-10 py-3 px-4" aria-label="Navigation bar">
            <div className="container mx-auto flex items-center justify-between px-6 max-w-[1400px]">
                <NavbarBrand className="flex items-center gap-4" aria-label="AREA brand logo and title">
                    <Image src={AreaLogo} width={60} height={60} alt="AREA Logo" />
                    <p className="text-3xl font-murecho-bold text-[#1E3A8A]">AREA</p>
                </NavbarBrand>

                <NavbarContent className="flex items-center gap-6" aria-label="Navigation menu">
                    <NavbarItem aria-label="Language selection">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="w-10 h-10 p-0 bg-transparent hover:bg-gray-100 rounded-full flex items-center justify-center" aria-label={`Current language: ${locale}`}>
                                    <Avatar
                                        src={countryFlags[locale]}
                                        alt={`${locale} flag`}
                                        className="w-full h-full rounded-full"
                                    />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Language selection menu">
                                {languages.map((lang, i) => (
                                    <DropdownItem
                                        key={lang}
                                        onClick={() => router.push(`/${langValue[i]}/${window.location.href.substring(25)}`)}
                                        className="font-murecho-bold"
                                        aria-label={`Switch to ${lang} language`}
                                    >
                                        {lang}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>

                    <NavbarItem>
                        <Button
                            onClick={() => router.push(`/${locale}/login`)}
                            className="bg-transparent border-3 border-[#1E3A8A] text-[#1E3A8A] font-murecho-bold rounded-full px-6 py-2 hover:bg-[#1E3A8A] hover:text-white transition-all"
                            aria-label="Log in"
                        >
                            {translate('login')}
                        </Button>
                    </NavbarItem>

                    <NavbarItem>
                        <Button
                            onClick={() => router.push(`/${locale}/register`)}
                            className="bg-transparent border-3 border-[#1E3A8A] text-[#1E3A8A] font-murecho-bold rounded-full px-6 py-2 hover:bg-[#1E3A8A] hover:text-white transition-all"
                            aria-label="Sign up"
                        >
                            {translate('register')}
                        </Button>
                    </NavbarItem>

                    <NavbarItem>
                        <Button
                            as="a"
                            size="lg"
                            href="/api/download"
                            className="bg-[#1E3A8A] text-white font-murecho-bold rounded-full px-6 py-2 flex items-center gap-2 hover:bg-[#1E3A8A] transition-all"
                            aria-label="Download the Android app"
                        >
                            {translate("download")}
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </div>
        </Navbar>
    );
};

export { NavBarUnregistered, NavBarRegistered, NavBarLanding };
