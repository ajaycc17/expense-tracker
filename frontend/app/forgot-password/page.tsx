"use client";
import { useState } from "react";
import axios from "axios";
import Warning from "../components/Warning";
import { useRouter } from "next/navigation";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [visible, setVisible] = useState(false);
    const [warning, setWarning] = useState("");
    const baseUrl = "http://localhost:3000";
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let myUser = {
            email: email,
        };
        // for server
        let url = baseUrl + "/password/forgotpassword";
        try {
            await axios.post(url, myUser);
            router.push("/login");
        } catch (err: any) {
            setWarning(err.response.data.message);
            setVisible(true);
            setTimeout(() => {
                setWarning("");
                setVisible(false);
            }, 3000);
        }
    };
    return (
        <div className="min-h-[calc(100vh-116px)] flex items-center px-2 md:px-4">
            <section className="w-full md:max-w-md mx-auto bg-white p-6 rounded-2xl my-8">
                <h1 className="font-head font-semibold mb-1 text-center text-2xl md:text-3xl">
                    Enter you email id
                </h1>
                <p className="text-center pb-3 text-lg border-b">
                    An email will be sent to the email id
                </p>

                {visible && <Warning message={warning} />}

                <form id="email-form" className="mt-3" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="bg-gray-50 border rounded-xl block w-full p-2.5 focus:outline-none"
                            required
                            placeholder="Your email"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setEmail(event.target.value);
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-gray-700 focus:outline-none font-medium w-full px-5 py-2.5 
                        text-center rounded-xl"
                    >
                        Get Reset Link
                    </button>
                </form>
            </section>
        </div>
    );
}
