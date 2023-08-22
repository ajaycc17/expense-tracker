import "./globals.css";
import type { Metadata } from "next";
import { Roboto, Space_Grotesk } from "next/font/google";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const roboto = Roboto({
    weight: ["400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});
const spGrot = Space_Grotesk({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-spGrot",
});

export const metadata: Metadata = {
    title: "Expense Tracker App",
    description: "Track your day to day expenses and draw insights.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${roboto.variable} font-sans ${spGrot.variable} bg-[#b5c2ca]`}
            >
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <Navbar />
                <main className="min-h-[calc(100vh-116px)]">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
