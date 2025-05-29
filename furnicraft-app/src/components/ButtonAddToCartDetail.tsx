'use client'
import { ProductType } from "@/type";

export default function ButtonAddToCartDetail ({product} : {product : ProductType}) {
    const handleOnClick = async () => {

        try {
            const response = await fetch("http://localhost:3000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({UserId : "683858bc8192fc57db299c85", ProductId: product._id, quantity : 1}),
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
        <button className="flex-1 border border-gray py-2 rounded-full hover:bg-gray-500 hover:text-white" onClick={handleOnClick}>
            Add to Cart
        </button>
    )
}