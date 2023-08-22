export default function Warning(props: { message: string }) {
    return (
        <div
            className="bg-yellow-50 mt-3 p-2 text-center text-yellow-700 font-medium rounded-2xl"
            role="alert"
        >
            {props.message}
        </div>
    );
}
