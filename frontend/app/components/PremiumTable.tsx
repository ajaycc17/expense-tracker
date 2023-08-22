import { useState } from "react";

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function PremiumTable(props: {
    data: [];
    parentCallback: Function;
    ReportGeneratorCallback: Function;
    handlePaginaExp: Function;
    pageNum: number;
    totalRows: number;
    limitRows: number;
    thisData: any[];
}) {
    let prevdaily: Date, prevmonthly: number, prevyearly: number;
    let dailyExp = 0,
        monthlyExp = 0,
        yearlyExp = 0,
        tillNowExp = 0;
    let flag = 0;
    let yearRow = "",
        yearRowExp = "";
    let monthRowExp = "";
    let dayRow = "",
        dayRowExp = "";
    const maxPage = Math.ceil(props.totalRows / props.limitRows - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let daily: Date = today,
        monthly,
        yearly;
    // pagination rows show
    let start = 0,
        mid = 0;
    if (props.totalRows > 0) {
        start = props.pageNum * props.limitRows + 1;
        mid = props.pageNum * props.limitRows + props.limitRows;
        mid = mid > props.totalRows ? props.totalRows : mid;
    }
    return (
        <section className="bg-white py-6 px-4 mid:p-6 rounded-2xl">
            <div className="flex flex-col mid:flex-row mid:items-center justify-between gap-2">
                <h1 className="font-head font-semibold text-xl border-b mid:border-none pb-2 mid:pb-0">
                    Exependiture Report
                </h1>
                <div className="flex items-center justify-between gap-3 font-head">
                    <form className="font-medium text-sm mid:text-base text-gray-600">
                        <select
                            name="numRows"
                            id="numRows"
                            className="bg-gray-50 p-1 px-2.5 border rounded-xl focus:outline-none"
                            onChange={(
                                event: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                if (event.target.value !== "0") {
                                    localStorage.setItem(
                                        "expRows",
                                        event.target.value
                                    );
                                    props.handlePaginaExp(
                                        0,
                                        event.target.value
                                    );
                                }
                            }}
                        >
                            <option value={0}>Rows</option>
                            <option value={5}>5 Rows</option>
                            <option value={10}>10 Rows</option>
                            <option value={20}>20 Rows</option>
                            <option value={30}>30 Rows</option>
                            <option value={props.totalRows}>All Rows</option>
                        </select>
                    </form>
                    <button
                        className="text-sm mid:text-base py-1 px-4 bg-[#edf9e7] text-green-700 font-medium flex items-center rounded-xl"
                        onClick={() => props.ReportGeneratorCallback()}
                    >
                        Download Report
                    </button>
                </div>
            </div>
            {/* data table */}
            <div className="mt-4 font-medium">
                <article className="hidden mid:grid grid-cols-12 border-y bg-gray-50 font-semibold">
                    <h3 className="col-span-2 p-2">Date</h3>
                    <h3 className="col-span-2 p-2">Exependiture</h3>
                    <h3 className="col-span-3 p-2">Description</h3>
                    <h3 className="col-span-2 p-2">Category</h3>
                    <h3 className="col-span-3 p-2">Actions</h3>
                </article>
                <div className="border-t mid:border-none">
                    {props.data.map((item: any) => {
                        const date = new Date(item.createdAt);
                        date.setHours(0, 0, 0, 0);
                        daily = date;
                        monthly = date.getMonth();
                        yearly = date.getFullYear();
                        flag = 0;
                        // check for day
                        if (
                            prevdaily !== undefined &&
                            daily.toDateString() !== prevdaily.toDateString()
                        ) {
                            dayRow =
                                months[prevmonthly] +
                                " " +
                                prevdaily.getDate() +
                                ", " +
                                prevyearly +
                                ": ";
                            dayRowExp = "₹" + dailyExp;
                            dailyExp = 0;
                            flag = 1;
                        }
                        if (
                            ((monthly !== prevmonthly &&
                                yearly !== prevyearly) ||
                                (monthly !== prevmonthly &&
                                    yearly === prevyearly) ||
                                (monthly === prevmonthly &&
                                    yearly !== prevyearly)) &&
                            prevmonthly !== undefined
                        ) {
                            monthRowExp =
                                months[prevmonthly] +
                                ", " +
                                prevyearly +
                                ": " +
                                "₹" +
                                monthlyExp;

                            flag = 1;
                            monthlyExp = 0;
                        }
                        if (yearly !== prevyearly && prevyearly !== undefined) {
                            yearRow = "Year " + prevyearly + ": ";
                            yearRowExp = "₹" + yearlyExp;
                            flag = 1;
                            yearlyExp = 0;
                        }
                        const insight = (
                            <article className="grid grid-cols-12 gap-2 mid:gap-0 border-b bg-gray-50 text-sm mid:text-base">
                                <div className="col-span-4 py-2 mid:p-2">
                                    {yearlyExp === 0 && (
                                        <span className="flex items-center bg-indigo-50 py-1.5 px-2 mid:px-4 rounded-xl text-indigo-800">
                                            {yearRow + yearRowExp}
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-4 py-2 mid:p-2">
                                    {monthlyExp === 0 && (
                                        <span className="flex items-center bg-[#edf9e7] py-1.5 px-2 mid:px-4 rounded-xl text-green-700">
                                            {monthRowExp}
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-4 py-2 mid:p-2">
                                    {dailyExp === 0 && (
                                        <span className="flex items-center bg-sky-100 py-1.5 px-2 mid:px-4 rounded-xl text-sky-700">
                                            {dayRow + dayRowExp}
                                        </span>
                                    )}
                                </div>
                            </article>
                        );
                        dailyExp += Number(item.expense);
                        monthlyExp += Number(item.expense);
                        yearlyExp += Number(item.expense);
                        tillNowExp += Number(item.expense);
                        const row = (
                            <article className="grid grid-cols-2 mid:grid-cols-12 border-b">
                                <div className="mid:col-span-2 pt-2 mid:p-2 text-xs mid:text-base flex items-end mid:block">
                                    {months[date.getMonth()] +
                                        " " +
                                        date.getDate() +
                                        ", " +
                                        date.getFullYear()}
                                </div>
                                <div className="mid:col-span-2 pt-2 mid:p-2 flex justify-end mid:block text-green-700 font-bold">
                                    {"₹" + item.expense}
                                </div>
                                <div className="mid:col-span-3 mid:p-2 capitalize">
                                    {item.description}
                                </div>
                                <div className="mid:col-span-2 pt-0.5 mid:p-2 flex justify-end mid:block">
                                    <span className="text-sm mid:text-base py-0.5 mid:py-1 px-2 mid:px-4 bg-gray-100 rounded-xl">
                                        {"# " + item.category}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-end mid:block mid:col-span-3 text-sm mid:text-base py-1 mid:p-2">
                                    <span
                                        className="py-0.5 mid:py-1 cursor-pointer px-4 rounded-xl bg-gray-100 text-gray-700 mr-2"
                                        onClick={() =>
                                            props.parentCallback(
                                                item._id,
                                                "edit"
                                            )
                                        }
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className="py-0.5 mid:py-1 cursor-pointer px-4 rounded-xl bg-red-100 text-red-700"
                                        onClick={() =>
                                            props.parentCallback(
                                                item._id,
                                                "delete"
                                            )
                                        }
                                    >
                                        Delete
                                    </span>
                                </div>
                            </article>
                        );
                        prevdaily = daily;
                        prevmonthly = monthly;
                        prevyearly = yearly;
                        return (
                            <>
                                {flag ? insight : ""} {row}
                            </>
                        );
                    })}
                    {/* this day month and year */}
                    {daily.toDateString() !== today.toDateString() && (
                        <article className="grid grid-cols-12 gap-1 mid:gap-0 border-b bg-gray-50 text-sm mid:text-base">
                            <div className="col-span-4 py-2 mid:p-2">
                                {yearlyExp !== 0 &&
                                    yearly !== today.getFullYear() && (
                                        <span className="flex items-center bg-indigo-50 py-1.5 px-2 mid:px-4 rounded-xl text-indigo-800">
                                            {"Year " +
                                                yearly +
                                                ": " +
                                                "₹" +
                                                yearlyExp}
                                        </span>
                                    )}
                            </div>
                            <div className="col-span-4 py-2 mid:p-2">
                                {monthly !== undefined &&
                                    monthlyExp !== 0 &&
                                    ((monthly !== today.getMonth() &&
                                        yearly !== today.getFullYear()) ||
                                        (monthly !== today.getMonth() &&
                                            yearly === today.getFullYear()) ||
                                        (monthly === today.getMonth() &&
                                            yearly !==
                                                today.getFullYear())) && (
                                        <span className="flex items-center bg-[#edf9e7] py-1.5 px-2 mid:px-4 rounded-xl text-green-700">
                                            {months[monthly] +
                                                ", " +
                                                yearly +
                                                ": ₹" +
                                                monthlyExp}
                                        </span>
                                    )}
                            </div>
                            <div className="col-span-4 py-2 mid:p-2">
                                {monthly !== undefined && dailyExp != 0 && (
                                    <span className="flex items-center bg-sky-100 py-1.5 px-2 mid:px-4 rounded-xl text-sky-700">
                                        {months[monthly] +
                                            " " +
                                            daily.getDate() +
                                            ", " +
                                            yearly +
                                            ": " +
                                            "₹" +
                                            dailyExp}
                                    </span>
                                )}
                            </div>
                        </article>
                    )}
                    {/* this day month and year */}
                    <article className="grid grid-cols-12 gap-2 mid:gap-0 border-b text-sm mid:text-base">
                        <div className="col-span-4 py-2 mid:p-2">
                            <span className="flex items-center bg-indigo-50 py-1.5 px-2 md:px-4 rounded-xl text-indigo-800">
                                {"Year " +
                                    today.getFullYear() +
                                    ": " +
                                    "₹" +
                                    props.thisData[0]}
                            </span>
                        </div>
                        <div className="col-span-4 py-2 mid:p-2">
                            <span className="flex items-center bg-[#edf9e7] py-1.5 px-2 md:px-4 rounded-xl text-green-700">
                                {months[today.getMonth()] +
                                    ", " +
                                    today.getFullYear() +
                                    ": ₹" +
                                    props.thisData[1]}
                            </span>
                        </div>
                        <div className="col-span-4 py-2 mid:p-2">
                            <span className="flex items-center bg-sky-100 py-1.5 px-2 md:px-4 rounded-xl text-sky-700">
                                {months[today.getMonth()] +
                                    " " +
                                    today.getDate() +
                                    ", " +
                                    today.getFullYear() +
                                    ": ₹" +
                                    props.thisData[2]}
                            </span>
                        </div>
                    </article>
                    {/* total expense till now */}
                    <article className="grid grid-cols-12 text-sm mid:text-base">
                        <div className="col-span-12 py-2 mid:p-2">
                            <span className="bg-yellow-100 py-1.5 px-6 rounded-xl text-yellow-800 float-right">
                                Total Expense: {"₹" + props.thisData[3]}
                            </span>
                        </div>
                    </article>
                </div>
            </div>
            {/* pagination data */}
            <div className="flex justify-between items-center mt-3 text-sm mid:text-base">
                <button
                    className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl"
                    disabled={props.pageNum === 0}
                    onClick={() =>
                        props.pageNum > 0 &&
                        props.handlePaginaExp(
                            props.pageNum - 1,
                            props.limitRows
                        )
                    }
                >
                    Prev
                </button>
                <span className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl">
                    {Number(start) +
                        " - " +
                        Number(mid) +
                        " out of " +
                        props.totalRows}
                </span>
                <button
                    className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl"
                    disabled={props.pageNum === maxPage}
                    onClick={() =>
                        props.pageNum < maxPage &&
                        props.handlePaginaExp(
                            props.pageNum + 1,
                            props.limitRows
                        )
                    }
                >
                    Next
                </button>
            </div>
        </section>
    );
}
