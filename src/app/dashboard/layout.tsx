"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/layout/Header";
import DashboardFooter from "@/components/layout/Footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("smartagro_user");
        const token = localStorage.getItem("smartagro_token");

        if (!userStr || userStr === "undefined" || !token) {
            router.push("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
            <DashboardHeader />
            <div className="flex-1 flex flex-col pt-24">
                {children}
            </div>
            <DashboardFooter />
        </div>
    );
}
