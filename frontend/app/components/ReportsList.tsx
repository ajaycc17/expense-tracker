import Link from "next/link";

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

export default function ReportsList(props: {
    data: [];
    handlePaginaFiles: Function;
    filesPageNum: number;
    totalFileRows: number;
}) {
    const maxPage = Math.ceil(props.totalFileRows / 10 - 1);
    // pagination rows show
    let start = 0,
        mid = 0;
    if (props.totalFileRows > 0) {
        start = props.filesPageNum * 10 + 1;
        mid = props.filesPageNum * 10 + 10;
        mid = mid > props.totalFileRows ? props.totalFileRows : mid;
    }
    return (
        <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-xl">Generated Reports</h1>
                <h2 className="font-medium text-sm mid:text-base">
                    {props.totalFileRows} Records
                </h2>
            </div>
            {/* reports table */}
            <div className="mt-4 font-medium">
                <article className="grid grid-cols-3 gap-2 border-y font-semibold bg-gray-50">
                    <div className="py-2">Name</div>
                    <div className="py-2">Generated On</div>
                    <div className="py-2">Report Files</div>
                </article>
                <div>
                    {props.data.map((item: any, index) => {
                        let date = item.createdAt;
                        date = new Date(date);
                        return (
                            <article
                                className="border-b grid grid-cols-3 gap-2"
                                key={index}
                            >
                                <div className="py-2">Report - {index + 1}</div>
                                <div className="py-2">
                                    {months[date.getMonth()] +
                                        " " +
                                        date.getDate() +
                                        ", " +
                                        date.getFullYear()}
                                </div>
                                <div className="py-2">
                                    <Link href={item.filesUrl}>
                                        <span className="py-1 cursor-pointer px-4 rounded-xl font-medium bg-[#edf9e7] text-green-700 text-sm mid:text-base">
                                            Download
                                        </span>
                                    </Link>
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
                    disabled={props.filesPageNum === 0}
                    onClick={() =>
                        props.filesPageNum > 0 &&
                        props.handlePaginaFiles(props.filesPageNum - 1)
                    }
                >
                    Prev
                </button>
                <span className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl">
                    {Number(start) +
                        " - " +
                        Number(mid) +
                        " out of " +
                        props.totalFileRows}
                </span>
                <button
                    className="px-4 py-1 bg-gray-200 text-gray-700 font-medium rounded-xl"
                    disabled={props.filesPageNum === maxPage}
                    onClick={() =>
                        props.filesPageNum < maxPage &&
                        props.handlePaginaFiles(props.filesPageNum + 1)
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
}
