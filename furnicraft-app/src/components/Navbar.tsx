import Link from "next/link";

export default function Navbar () { 
    return (
        <>
            {/* Navbar */}
            <header className="flex justify-between items-center px-10 py-6 shadow-md bg-white">
                <div className="text-xl font-bold">FurniCraft</div>
                <nav className="space-x-6 hidden md:flex">
                <Link
                    href="/" className="hover:text-gray-700"
                >
                    Home
                </Link>
                <Link
                    href="/about" className="hover:text-gray-700"
                >
                    About
                </Link>
                <Link
                    href="/products" className="hover:text-gray-700"
                >
                    Products
                </Link>
                </nav>
                <div className="flex space-x-4 items-center">
                <button className="hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                    </svg>
                </button>
                <button className="hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h11l-1.5-7M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                </button>
                <a href="#" className="hover:text-gray-700">Login</a>
                </div>
            </header>
        </>
    )
}