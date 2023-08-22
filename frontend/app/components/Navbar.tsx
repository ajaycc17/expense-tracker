"use client";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const baseUrl = "http://localhost:3000";

export default function Navbar() {
    const router = useRouter();
    const [isLogged, setIsLogged] = useState(false);
    useEffect(() => {
        if (getCookie("isLoggedIn") === true) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [usePathname(), isLogged]);

    const handleLogout = () => {
        deleteCookie("token");
        deleteCookie("isLoggedIn");
        localStorage.setItem("token", "");
        setIsLogged(false);
        router.push("/login");
    };

    const handlePremium = async function (e: any) {
        const token = localStorage.getItem("token");
        let url = baseUrl + "/purchase/premium";
        const response = await axios.get(url, {
            headers: { Authorization: token },
        });
        var options = {
            key: response.data.key_id,
            order_id: response.data.order.id,
            handler: async function (response: any) {
                url = baseUrl + "/purchase/update-transaction-status";
                const res = await axios.post(
                    url,
                    {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    },
                    { headers: { Authorization: token } }
                );
                localStorage.setItem("token", res.data.token);
                setCookie("token", res.data.token);
            },
        };
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const rzpl = new Razorpay(options);
        rzpl.open();
        e.preventDefault();

        rzpl.on("payment.failed", async function (response: any) {
            url = baseUrl + "/purchase/update-failed-status";
            await axios.post(
                url,
                {
                    order_id: response.error.metadata.order_id,
                    payment_id: response.error.metadata.payment_id,
                },
                { headers: { Authorization: token } }
            );
            alert("Something went wrong");
        });
    };
    return (
        <header className="sticky w-full top-0 z-50 backdrop-blur-md bg-gray-100/50">
            <div className="max-w-6xl mx-auto py-2 px-2 md:px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/logo.svg" width={40} height={40} alt="Logo" />
                    <h1 className="hidden sm:block font-semibold font-head text-lg">
                        Expense Tracker
                    </h1>
                </Link>
                <div className="flex items-center gap-2">
                    <span
                        className="py-1 px-4 rounded-xl font-medium bg-black text-white cursor-pointer text-sm sm:text-base"
                        onClick={handlePremium}
                    >
                        Upgrade
                    </span>
                    {typeof window !== undefined && !isLogged && (
                        <Link
                            href="/login"
                            className="py-1 px-4 rounded-xl font-medium bg-black text-white text-sm sm:text-base"
                        >
                            Log in
                        </Link>
                    )}
                    {typeof window !== undefined && isLogged && (
                        <Link href="/login">
                            <button
                                className="py-1 px-4 rounded-xl font-medium bg-black text-white text-sm sm:text-base"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
