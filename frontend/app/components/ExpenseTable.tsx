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

export default function ExpenseTable(props: {
    data: [];
    parentCallback: Function;
    handlePaginaExp: Function;
    pageNum: number;
    totalRows: number;
    totalExp: number;
    limitRows: number;
}) {
    const maxPage = Math.ceil(props.totalRows / props.limitRows - 1);
    // pagination rows show
    let start = 0,
        mid = 0;
    if (props.totalRows > 0) {
        start = props.pageNum * props.limitRows + 1;
        mid = props.pageNum * props.limitRows + props.limitRows;
        mid = mid > props.totalRows ? props.totalRows : mid;
    }
    return (
        <section className="bg-white px-4 py-6 mid:p-6 rounded-2xl">
            <div className="flex items-center justify-between">
                <h1 className="font-head font-semibold text-xl">
                    Exependiture Report
                </h1>
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
                                props.handlePaginaExp(0, event.target.value);
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
                        return (
                            <article
                                className="grid grid-cols-2 mid:grid-cols-12 border-b"
                                key={item._id}
                            >
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
                    })}
                    {/* total expense till now */}
                    <article className="grid grid-cols-12 text-sm mid:text-base">
                        <div className="col-span-12 py-2 mid:p-2">
                            <span className="bg-yellow-100 py-1.5 px-6 rounded-xl text-yellow-800 float-right">
                                Total Expense: {"₹" + props.totalExp}
                            </span>
                        </div>
                    </article>
                </div>
            </div>
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
