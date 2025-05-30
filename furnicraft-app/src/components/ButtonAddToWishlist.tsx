'use client'
import { ProductType } from "@/type";
import { IoMdHeartEmpty } from "@react-icons/all-files/io/IoMdHeartEmpty";
export default function ButtonAddToWishlist ({product} : {product : ProductType}) {

    const handleOnClick = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/wishlist", {
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
        <button className="cursor-pointer" onClick={handleOnClick}>
            <IoMdHeartEmpty className="h-7 w-7" />
        </button>
    )
}