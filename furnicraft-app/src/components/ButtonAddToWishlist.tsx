'use client'
import errorHandler from "@/helpers/errorHandler";
import { ProductType } from "@/type";
import { IoMdHeartEmpty } from "@react-icons/all-files/io/IoMdHeartEmpty";
import toast from "react-hot-toast";
export default function ButtonAddToWishlist({ product }: { product: ProductType }) {

    const handleOnClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ProductId: product._id }),
            });
            if (!response.ok) {
                throw (await response.json())
            }
            let msg = (await response.json()).message
            toast.success(msg)
            return

        } catch (error) {
            toast.error((error as Error).message)
            return errorHandler(error as Error);
        }
    }

    return (
        <button className="cursor-pointer" onClick={handleOnClick}>
            <IoMdHeartEmpty className="h-7 w-7" />
        </button>
    )
}