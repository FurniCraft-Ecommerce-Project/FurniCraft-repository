'use client'
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ProductType } from "@/type";
import { ChangeEvent, useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebouncedCallback } from "use-debounce";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [name, setName] = useState("")

    const fetchProducts = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?page=${page}&name=${name}`)

        const data = await response.json()

        setProducts((prev) => [...prev, ...data])

        if (data.length === 0) { // if data.length === 0 then stop hasMore
            setHasMore(false)
        }
    }

    const handleSearch = useDebouncedCallback((term: ChangeEvent<HTMLInputElement>) => {
        const valSearch = term.target.value;

        setName(valSearch);
        setProducts([]);

        if (valSearch === "") {
            setHasMore(true);
        }

        setPage(1); // triggers useEffect
    }, 600);

    useEffect(() => {
        fetchProducts();
    }, [page, name]);

    return (
        <>
            <Navbar />

            <InfiniteScroll
                dataLength={products.length} //This is important field to render the next data
                next={() => setPage(page + 1)}
                hasMore={hasMore}
                loader={
                    <div className="text-center pb-10">
                        <h4>Loading Products...</h4>
                    </div>
                }
                endMessage={
                    <p style={{ textAlign: 'center', paddingBottom: 15 }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                <section className="py-20 px-10 text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Collections</h2>
                    <p className="text-gray-700 max-w-xl mx-auto mb-12">These products are crafted using wood sourced responsibly and with sustainability in mind, perfect for modern homes with a natural touch.</p>
                    <div className="mb-20 flex justify-center items-center">
                        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                            <input type="text" className="input join-item" placeholder="Product name" onChange={handleSearch} />
                        </fieldset>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((el, idx) => (
                            <Card key={idx} product={el} />
                        ))}
                    </div>
                </section>
            </InfiniteScroll>
            <Footer />
        </>
    )
}