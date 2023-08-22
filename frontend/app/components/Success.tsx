export default function Success(props: { message: string }) {
    return (
        <div
            className="bg-[#edf9e7] mt-3 p-2 text-center text-green-700 font-medium rounded-2xl"
            role="alert"
        >
            {props.message}
        </div>
    );
}
