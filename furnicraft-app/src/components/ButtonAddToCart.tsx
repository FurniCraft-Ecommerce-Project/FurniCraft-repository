'use client'
import { ProductType } from "@/type";
import { IoCartOutline } from "@react-icons/all-files/io5/IoCartOutline";
export default function ButtonAddToCart ({product, page} : {product : ProductType, page : string}) {

    const handleOnClick = async () => {

        try {
            const response = await fetch("http://localhost:3000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ProductId: product._id, quantity : 1}),
            });
            if (!response.ok) {
                throw (await response.json())
            }

            return alert((await response.json()).message)

        } catch (error) {
            alert((error as Error).message)
        }
    }

    return (
        page === 'detail' ?
        <button className="flex-1 border border-gray py-2 rounded-full hover:bg-gray-500 hover:text-white" onClick={handleOnClick}>
            Add to Cart
        </button>
        :
        <button className="cursor-pointer" onClick={handleOnClick}>
            <IoCartOutline className="h-7 w-7"/>
        </button>
    )
}