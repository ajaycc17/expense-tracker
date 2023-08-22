"use client";
import axios from "axios";
import { useState, useEffect } from "react";

import Success from "../components/Success";
import ExpenseTable from "../components/ExpenseTable";
import PremiumTable from "../components/PremiumTable";
import Leaderboard from "../components/Leaderboard";
import ReportsList from "../components/ReportsList";

let itemId = "";

export default function Dashboard() {
    const [amt, setAmt] = useState("");
    const [isPremium, setIsPremium] = useState(false);
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("household");

    const [visibleSuccess, setVisibleSuccess] = useState(false);
    const [success, setSuccess] = useState("");

    const [effectLogic, seteffectLogic] = useState(false);
    const [ExpPageNum, setExpPageNum] = useState(0);
    const [filesPageNum, setFilesPageNum] = useState(0);
    const [leaderPageNum, setLeaderPageNum] = useState(0);
    const [totalFileRows, setTotalFileRows] = useState(0);
    const [totalLeaderRows, setTotalLeaderRows] = useState(0);

    const [totalExpRows, setTotalExpRows] = useState(0);

    const [limitRows, setLimitRows] = useState(10);
    const [dataexp, setDataexp] = useState([] as any);
    const [dayDataexp, setDayDataexp] = useState([] as any);
    const [files, setFiles] = useState([] as any);
    const [leaderData, setLeaderData] = useState([] as any);

    const baseUrl = "http://localhost:3000";

    useEffect(() => {
        const token = localStorage.getItem("token");
        let expRows = localStorage.getItem("expRows");
        expRows = expRows === null ? "10" : expRows;
        setLimitRows(Number(expRows));
        // get expense and downloadeds data together
        let url =
            baseUrl +
            `/expense?page=${ExpPageNum}&filepage=${filesPageNum}&limit=${limitRows}`;
        axios
            .get(url, {
                headers: { Authorization: token },
            })
            .then((res) => res.data)
            .then((res) => {
                setDataexp(res.data);
                setFiles(res.filesDown);
                setIsPremium(res.isPremium);
                setDayDataexp([
                    res.thisYear,
                    res.thisMonth,
                    res.thisDay,
                    res.totalExpense,
                ]);
                setTotalExpRows(res.totalRows);
                setTotalFileRows(res.totalFiles);
            })
            .catch((err) => console.log(err));
        // get leaderboard data
        url = baseUrl + `/premium/get-leaderboard?page=${leaderPageNum}`;
        axios
            .get(url, { headers: { Authorization: token } })
            .then((res) => res.data)
            .then((res) => {
                setLeaderData(res.data);
                setTotalLeaderRows(res.totalUsers);
            })
            .catch((err) => console.log(err));
    }, [effectLogic]);

    const handleReportDown = async () => {
        // get report link
        const token = localStorage.getItem("token");
        let url = baseUrl + "/expense/download";
        const res = await axios.get(url, { headers: { Authorization: token } });

        if (res.status === 200 && typeof window !== undefined) {
            window.open(res.data.fileUrl, "_blank");
            seteffectLogic(!effectLogic);
        }
    };

    const handlePaginaExp = (pageN: number, limit: number) => {
        setExpPageNum(pageN);
        if (limit <= totalExpRows) {
            setLimitRows(limit);
        } else {
            setLimitRows(totalExpRows);
        }
        seteffectLogic(!effectLogic);
    };
    const handlePaginaFiles = (pageN: number) => {
        setFilesPageNum(pageN);
        seteffectLogic(!effectLogic);
    };
    const handlePaginaLeader = (pageN: number) => {
        setLeaderPageNum(pageN);
        seteffectLogic(!effectLogic);
    };

    const handleCallback = async (id: string, action: string) => {
        const token = localStorage.getItem("token");
        if (action === "delete") {
            let url = baseUrl + "/expense/delete-expense/" + id;
            try {
                const res = await axios.post(url, null, {
                    headers: { Authorization: token },
                });
                // show success message
                setSuccess(res.data.message);
                setVisibleSuccess(true);
                setTimeout(() => {
                    setSuccess("");
                    setVisibleSuccess(false);
                }, 3000);
                seteffectLogic(!effectLogic);
            } catch (err) {
                console.log(err);
            }
        } else {
            // get from server
            let url = baseUrl + "/expense/get-expense/" + id;
            itemId = id;
            try {
                const res = await axios.get(url, {
                    headers: { Authorization: token },
                });
                // copy to form
                setAmt(res.data.expense);
                setDesc(res.data.description);
                setCategory(res.data.category);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // store in server
        let myExp = {
            amount: amt,
            desc: desc,
            category: category,
        };
        // for server
        if (itemId === "") {
            let url = baseUrl + "/expense/add-expense";
            const token = localStorage.getItem("token");
            try {
                const res = await axios.post(url, myExp, {
                    headers: { Authorization: token },
                });
                setAmt("");
                setDesc("");
                seteffectLogic(!effectLogic);
                // show success message
                setSuccess(res.data.message);
                setVisibleSuccess(true);
                setTimeout(() => {
                    setSuccess("");
                    setVisibleSuccess(false);
                }, 3000);
            } catch (err) {
                console.log(err);
            }
        } else {
            let url = baseUrl + "/expense/edit-expense/" + itemId;
            const token = localStorage.getItem("token");
            try {
                const res = await axios.post(url, myExp, {
                    headers: { Authorization: token },
                });

                setAmt("");
                setDesc("");
                seteffectLogic(!effectLogic);
                itemId = "";
                // show success message
                setSuccess(res.data.message);
                setVisibleSuccess(true);
                setTimeout(() => {
                    setSuccess("");
                    setVisibleSuccess(false);
                }, 3000);
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className="max-w-6xl mx-auto px-2 md:px-4 py-6">
            <section className="mb-4 mid:mb-6 bg-white py-6 px-4 mid:p-6 rounded-2xl">
                <h1 className="font-head font-semibold pb-2 text-xl">
                    Add New Expense
                </h1>

                {visibleSuccess && <Success message={success} />}

                <form
                    className="mt-3 font-head font-medium grid grid-cols-12 gap-2 mid:gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="col-span-4 mid:col-span-3 lg:col-span-2">
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="rounded-xl bg-gray-50 border block w-full p-2.5 focus:outline-none"
                            value={amt}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setAmt(event.target.value);
                            }}
                            placeholder="Amount in ₹"
                            required
                        />
                    </div>
                    <div className="col-span-8 mid:col-span-4 lg:col-span-5 xl:col-span-6">
                        <input
                            type="text"
                            id="desc"
                            name="desc"
                            className="rounded-xl bg-gray-50 border block w-full p-2.5 focus:outline-none"
                            value={desc}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setDesc(event.target.value);
                            }}
                            placeholder="Description"
                            required
                        />
                    </div>
                    <div className="col-span-6 mid:col-span-2">
                        <select
                            id="category"
                            name="category"
                            className="rounded-xl bg-gray-50 border block w-full p-2.5 focus:outline-none"
                            onChange={(
                                event: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                setCategory(event.target.value);
                            }}
                        >
                            <option value="household" selected>
                                Household
                            </option>
                            <option value="bills">Bills</option>
                            <option value="emi">EMI</option>
                            <option value="food">Food</option>
                            <option value="clothes">Clothes</option>
                            <option value="fuel">Fuel</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-black focus:outline-none font-medium px-6 py-2.5 rounded-xl text-center col-span-6 mid:col-span-3 xl:col-span-2"
                    >
                        Add Expense
                    </button>
                </form>
            </section>
            <section>
                {isPremium ? (
                    <PremiumTable
                        data={dataexp}
                        pageNum={ExpPageNum}
                        parentCallback={handleCallback}
                        ReportGeneratorCallback={handleReportDown}
                        handlePaginaExp={handlePaginaExp}
                        totalRows={totalExpRows}
                        thisData={dayDataexp}
                        limitRows={limitRows}
                    />
                ) : (
                    <ExpenseTable
                        data={dataexp}
                        pageNum={ExpPageNum}
                        parentCallback={handleCallback}
                        handlePaginaExp={handlePaginaExp}
                        totalRows={totalExpRows}
                        totalExp={dayDataexp[3]}
                        limitRows={limitRows}
                    />
                )}
            </section>

            <div className="grid mid:grid-cols-2 gap-4 mid:gap-6 mt-4 mid:mt-6">
                <section>
                    {/* show leaderboard */}
                    {isPremium && (
                        <Leaderboard
                            data={leaderData}
                            handlePaginaLeader={handlePaginaLeader}
                            leaderPageNum={leaderPageNum}
                            totalLeaderRows={totalLeaderRows}
                        />
                    )}
                </section>
                <section>
                    {/* show reports downloaded */}
                    {isPremium && (
                        <ReportsList
                            data={files}
                            handlePaginaFiles={handlePaginaFiles}
                            filesPageNum={filesPageNum}
                            totalFileRows={totalFileRows}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}
