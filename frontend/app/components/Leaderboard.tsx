import {
    TbRosetteNumber1,
    TbRosetteNumber2,
    TbRosetteNumber3,
} from "react-icons/tb";

export default function Leaderboard(props: {
    data: [];
    handlePaginaLeader: Function;
    leaderPageNum: number;
    totalLeaderRows: number;
}) {
    const maxPage = Math.ceil(props.totalLeaderRows / 10 - 1);
    // pagination rows show
    let start = 0,
        mid = 0;
    if (props.totalLeaderRows > 0) {
        start = props.leaderPageNum * 10 + 1;
        mid = props.leaderPageNum * 10 + 10;
        mid = mid > props.totalLeaderRows ? props.totalLeaderRows : mid;
    }
    return (
        <section className="bg-white py-6 px-4 mid:p-6 rounded-2xl">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-xl">User Leaderboard</h1>
                <h2 className="text-sm mid:text-base font-medium">
                    {props.totalLeaderRows} Users
                </h2>
            </div>
            {/* leaderboard table */}
            <div className="font-medium mt-4">
                <article className="grid grid-cols-5 gap-2 border-y font-semibold bg-gray-50">
                    <div className="col-span-3 py-2">Name</div>
                    <div className="col-span-2 py-2">Expenditure</div>
                </article>
                <div>
                    {props.data.map((item: any, index) => {
                        let rankIcon, highlight;
                        if (index === 0) {
                            rankIcon = (
                                <TbRosetteNumber1 className="text-xl text-sky-800 w-5 h-5 mr-2 rounded-full" />
                            );
                            highlight = "bg-sky-50 font-medium text-sky-700";
                        } else if (index === 1) {
                            rankIcon = (
                                <TbRosetteNumber2 className="text-xl text-sky-800 w-5 h-5 mr-2 rounded-full" />
                            );
                            highlight = "bg-sky-50 font-medium text-sky-700";
                        } else if (index === 2) {
                            rankIcon = (
                                <TbRosetteNumber3 className="text-xl text-sky-800 w-5 h-5 mr-2 rounded-full" />
                            );
                            highlight = "bg-sky-50 font-medium text-sky-700";
                        } else {
                            rankIcon = "";
                            // highlight = "bg-sky-50 text-sky-700";
                        }
                        return (
                            <article
                                className="grid grid-cols-5 gap-2 border-b"
                                key={index}
                            >
                                <div className="col-span-3 py-2 mid:p-2">
                                    <span
                                        className={`${highlight} py-1 px-4 rounded-xl flex items-center`}
                                    >
                                        {rankIcon}
                                        {item.name}
                                    </span>
                                </div>
                                <div className="col-span-2 py-2 mid:p-2">
                                    <span
                                        className={`${highlight} py-1 px-4 rounded-xl flex items-center`}
                                    >
                                        {"₹" + item.totalExpense}
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
            {/* pagination section */}
            <div className="flex justify-between items-center mt-3 text-sm mid:text-base">
                <button
                    className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl"
                    disabled={props.leaderPageNum === 0}
                    onClick={() =>
                        props.leaderPageNum > 0 &&
                        props.handlePaginaLeader(props.leaderPageNum - 1)
                    }
                >
                    Prev
                </button>
                <span className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl">
                    {Number(start) +
                        " - " +
                        Number(mid) +
                        " out of " +
                        props.totalLeaderRows}
                </span>
                <button
                    className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl"
                    disabled={props.leaderPageNum === maxPage}
                    onClick={() =>
                        props.leaderPageNum < maxPage &&
                        props.handlePaginaLeader(props.leaderPageNum + 1)
                    }
                >
                    Next
                </button>
            </div>
        </section>
    );
}
