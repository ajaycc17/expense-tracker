export default function Footer() {
    return (
        <footer className="py-5 bg-black/90 text-white">
            <div className="max-w-6xl px-2 md:px-4 mx-auto text-sm text-center">
                Developed by Ajay Choudhury - {new Date().getFullYear()}
            </div>
        </footer>
    );
}
