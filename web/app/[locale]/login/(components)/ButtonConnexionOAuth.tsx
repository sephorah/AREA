
import { getUrlToLogin, loginWithService } from "@/app/api/auth";
import { setAccessToken } from "@/app/auth/auth";
import { Button } from "@nextui-org/react";
import { CookieValueTypes, deleteCookie, getCookie, setCookie } from "cookies-next";
import { useLocale } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

export function ButtonConnexionOAuth({
    name,
    logo
}: {
    name: string,
    logo: StaticImageData
}) {
    const router: AppRouterInstance = useRouter();
    const locale: string = useLocale();
    let myWindow: Window | null;

    const handleOnClick = async () => {
        try {
            const provider: string = name.split(" ")[2];
            let authUrl: string;
            let service: string;

            switch (provider) {
                case "Google":
                    service = "google"
                    authUrl = (await getUrlToLogin("google")).data.url;
                    break;
                case "Spotify":
                    service = "spotify"
                    authUrl = (await getUrlToLogin("spotify")).data.url;
                    break;
                case "Discord":
                    service = "discord"
                    authUrl = (await getUrlToLogin("discord")).data.url;
                    break;
                case "Github":
                    service = "github"
                    authUrl = (await getUrlToLogin("github")).data.url;
                    break;
                default:
                    return;
            }

            myWindow = window.open(
                authUrl,
                '_blank',
                'width=600,height=600,top=100,left=100'
            )

            const checkIfClosed: NodeJS.Timeout = setInterval(() => {
                if (myWindow?.closed) {
                    const fetchAccessToken = async () => {
                        const code: CookieValueTypes = getCookie("code");

                        if (code) {
                            await loginWithService(service, code)
                                .then((res) => {
                                    const accessToken: string = res.data.accessToken;
                                    const userId: string = res.data.userId;
                                    const expires: Date = new Date();
                                    const nbrDays: number = 7;
                                    expires.setDate(expires.getDate() + nbrDays);

                                    if (accessToken) {
                                        setAccessToken(accessToken);
                                        setCookie("userId", userId);
                                        router.replace(`/${locale}/areas-created`);
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error fetching access token:", error);

                                });
                            deleteCookie("code");
                        }
                    }

                    fetchAccessToken();
                    clearInterval(checkIfClosed);
                }
            }, 500);
        } catch (error) {
            console.error("Error during OAuth:", error);
        }
    };
    return (
        <Button
            className="bg-white text-[#1E3A8A] font-murecho-bold w-80 mt-6 flex items-center justify-center gap-3 px-6 py-4 rounded-full shadow-md border border-[#1E3A8A] hover:bg-[#f0f4ff] active:bg-[#1E3A8A] transition-colors"
            size="lg"
            radius="full"
            onClick={handleOnClick}
            aria-label={`Log in with ${name}`}
            variant="bordered" >
            <Image src={logo} alt={`${name} logo`} width={28} height={28} />
            <span className="text-lg font-bold">{name}</span>
        </Button>
    )
}
