'use client'

import CardWishlist from "@/components/CardWishlist";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { WishlistType } from "@/type";
import { useEffect, useState } from "react";

export default function WishlistPage() {

    const [data, setData] = useState<WishlistType[]>([])

    useEffect(() => {
        const fetchDataWishlist = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`);
            const resData: WishlistType[] = await response.json()
            setData(resData)
        }
        fetchDataWishlist()
    }, [])

    return (
        <>
            <Navbar />
            <section className="py-20 px-10 text-center">
                <h2 className="text-3xl font-bold mb-6">Your Wishlist</h2>
                <p className="text-gray-700 max-w-xl mx-auto mb-12">These products are crafted using wood sourced responsibly and with sustainability in mind, perfect for modern homes with a natural touch.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {data.map((el, idx) => (
                        <CardWishlist key={idx} wishlist={el} />
                    ))}
                </div>
            </section>
            <Footer />
        </>
    )
}