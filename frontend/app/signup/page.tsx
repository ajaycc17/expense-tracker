"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Warning from "../components/Warning";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [visible, setVisible] = useState(false);
    const [warning, setWarning] = useState("");
    const baseUrl = "http://localhost:3000";
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // validation
        if (password !== password2) {
            setWarning("Passwords do not match!");
            setVisible(true);
            setTimeout(() => {
                setWarning("");
                setVisible(false);
            }, 3000);
        } else {
            // signup process
            let myUser = {
                name: name,
                email: email,
                password: password,
            };

            // for server
            let url = baseUrl + "/user/signup";
            try {
                const res = await axios.post(url, myUser);
                if (res.status !== 201) {
                    setWarning(res.data.message);
                    setVisible(true);
                    setTimeout(() => {
                        setWarning("");
                        setVisible(false);
                    }, 3000);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className="min-h-[calc(100vh-116px)] flex items-center px-2 md:px-4">
            <section className="w-full md:max-w-md mx-auto my-8 bg-white p-6 rounded-2xl">
                <h1 className="font-head font-semibold mb-1 text-center text-2xl md:text-3xl">
                    Create your account
                </h1>
                <p className="text-center pb-3 text-lg border-b">
                    Get smarter with a personalized insights
                </p>

                {visible && <Warning message={warning} />}

                <form className="mt-3 font-medium" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="bg-gray-50 border rounded-xl block w-full p-2.5 focus:outline-none"
                            required
                            placeholder="Your name"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setName(event.target.value);
                            }}
                        />
                    </div>
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
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <input
                                type="password"
                                id="password1"
                                name="password1"
                                className="bg-gray-50 border rounded-xl block w-full p-2.5 focus:outline-none"
                                required
                                placeholder="Password"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setPassword(event.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                id="password2"
                                name="password2"
                                className="bg-gray-50 border rounded-xl block w-full p-2.5 focus:outline-none"
                                placeholder="Confirm password"
                                required
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setPassword2(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-gray-700 focus:outline-none font-medium w-full px-5 py-2.5 text-center mb-3 rounded-xl"
                    >
                        Sign up
                    </button>
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-700">
                            Log in
                        </Link>
                        .
                    </p>
                </form>
            </section>
        </div>
    );
}
