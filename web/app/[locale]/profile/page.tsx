"use client"

import { NavBarRegistered } from "@/app/components/NavBar";
import { Avatar, Button, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CookieValueTypes, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { getInfoByUserId } from "@/app/api/user";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const ProfilePage = () => {
    const translation = useTranslations("Profile");
    const router: AppRouterInstance = useRouter();
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const userId: CookieValueTypes = getCookie("userId");

        if (userId) {
            const fetchData = async () => {
                await getInfoByUserId(userId)
                    .then((res) => {
                        setEmail(res.data.email);
                        setName(res.data.username);
                        setPassword(res.data.password);
                    })
                    .catch((err) => {
                        console.log("error: ", err);
                    });
            };
            fetchData();
        }
    }, []);

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <>
            <NavBarRegistered />
            <div className="flex mt-24">
                <div className="pl-40 basis-1/3 place-content-end">
                    <Button
                        className="px-14 py-8 rounded-3xl text-2xl font-murecho-bold text-white bg-[#1E3A8A]"
                        onClick={() => { router.back(); }}
                        aria-label="Back to previous page"
                    >
                        {useTranslations('ButtonBack')('title')}
                    </Button>
                </div>

                <div className="flex justify-center basis-1/3 pt-8">
                    <p className="font-murecho-bold text-[#1E3A8A] text-6xl text-center">
                        {translation('title')}
                    </p>
                </div>
            </div>
            <div className="flex justify-center w-full mt-12">
                <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-10 space-y-8">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar
                            src="https://i.pravatar.cc/300"
                            size="lg"
                            alt="User avatar"
                            className=" border-2 border-gray-300 shadow-md"
                        />
                        <Button
                            as="a"
                            size="lg"
                            className="bg-[#1E3A8A] text-white font-murecho-bold rounded-full px-6 py-2 hover:bg-[#1E3A8A] flex items-center gap-2 transition-all"
                            onClick={toggleEditMode}
                            aria-label={isEditing ? "Save profile changes" : "Edit profile"}
                        >
                            {isEditing ? "Save" : "Edit"}
                        </Button>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-xl text-[#1E3A8A] font-murecho-bold">Name:</label>
                            <Input
                                isReadOnly={!isEditing}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="font-murecho-bold text-black text-lg bg-gray-100 rounded-lg"
                                aria-label="Username"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xl text-[#1E3A8A] font-murecho-bold">Email:</label>
                            <Input
                                isReadOnly={!isEditing}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="font-murecho-bold text-black text-lg bg-gray-100 rounded-lg"
                                aria-label="User email address"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xl text-[#1E3A8A] font-murecho-bold">Password:</label>
                            <Input
                                isReadOnly={!isEditing}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="font-murecho-bold text-black text-lg bg-gray-100 rounded-lg"
                                aria-label="User password"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
