'use client'
import errorHandler from "@/helpers/errorHandler";
import { ProductType } from "@/type";
import { IoCartOutline } from "@react-icons/all-files/io5/IoCartOutline";
import toast from "react-hot-toast";
export default function ButtonAddToCart({ product, page }: { product: ProductType, page: string }) {

    const handleOnClick = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ProductId: product._id, quantity: 1 }),
            });
            if (!response.ok) {
                throw (await response.json())
            }

            const data = await response.json();
            toast.success(data.message)

        } catch (error) {
            toast.error((error as Error).message)
            errorHandler(error as Error);
        }
    }

    return (
        page === 'detail' ?
            <button className="flex-1 border border-gray py-2 rounded-full hover:bg-gray-500 hover:text-white" onClick={handleOnClick} style={{cursor: "pointer"}}>
                Add to Cart
            </button>
            :
            <button className="cursor-pointer" onClick={handleOnClick} style={{cursor: "pointer"}}>
                <IoCartOutline className="h-7 w-7" />
            </button>
    )
}