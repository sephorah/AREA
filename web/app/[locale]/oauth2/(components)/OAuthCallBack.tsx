"use client";

import { useEffect, useRef } from "react";
import { setCookie } from "cookies-next";

const OAuthCallBack = () => {
    const isFirstCall = useRef(true);

    const code: string | null = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("code")
        : null;

    useEffect(() => {
        if (!code || !isFirstCall.current) return;

        isFirstCall.current = false;
        const expires: Date = new Date();
        const minutes = 5;
        expires.setTime(expires.getTime() + minutes * 60 * 1000);

        setCookie("code", code, {
            expires: expires,
        });
        if (window.opener) {
            window.close();
        } else {
            console.warn("No opener detected, window will not close.");
        }
    }, [code]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-2xl font-bold text-[#1E3A8A] font-murecho">
                    {code ? "Authentication successful! Redirecting..." : "Loading..."}
                </p>
                {!code && (
                    <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
                )}
            </div>
        </div>
    );
}

export default OAuthCallBack;