import Link from "next/link";
import { IoMdHeartEmpty } from "@react-icons/all-files/io/IoMdHeartEmpty";
import { IoCartOutline } from "@react-icons/all-files/io5/IoCartOutline";
import { Toaster } from "react-hot-toast";

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
                        href="/products" className="hover:text-gray-700"
                    >
                        Products
                    </Link>
                    <Link
                        href="/furni-place" className="hover:text-gray-700"
                    >
                        FurniPlace
                    </Link>
                </nav>
                <div className="flex space-x-4 items-center">
                
                <Link
                    href={'/order'}
                >
                    Order
                </Link>
                <Link
                    href={'/wishlist'}
                >
                    <IoMdHeartEmpty className="h-5 w-5"/>
                </Link>
                <Link
                    href={'/cart'}
                >
                    <IoCartOutline className="h-5 w-5"/>
                </Link>

                <Link
                    href={'/login'}
                >
                    Login
                </Link>

                </div>
            </header>
            <Toaster position="top-center" />
        </>
    )
}