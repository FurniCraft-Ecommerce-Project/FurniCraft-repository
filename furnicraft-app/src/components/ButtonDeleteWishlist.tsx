'use client'

import { IoMdTrash } from "@react-icons/all-files/io/IoMdTrash";
import toast from "react-hot-toast";

export default function ButtonDeleteWishlist({ wishlistId }: { wishlistId: string }) {

    const handleOnClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ wishlistId }),
            });
            if (!response.ok) {
                throw (await response.json())
            }

            window.location.reload()

        } catch (error) {
            toast.error((error as Error).message)
        }
    }
    return (
        <button className="cursor-pointer" onClick={handleOnClick}>
            <IoMdTrash className="h-7 w-7" />
        </button>
    )
}