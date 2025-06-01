'use client'
import { ProductType } from "@/type";
import { IoMdHeartEmpty } from "@react-icons/all-files/io/IoMdHeartEmpty";
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

            return alert((await response.json()).message)

        } catch (error) {
            alert((error as Error).message)
        }
    }

    return (
        <button className="cursor-pointer" onClick={handleOnClick}>
            <IoMdHeartEmpty className="h-7 w-7" />
        </button>
    )
}