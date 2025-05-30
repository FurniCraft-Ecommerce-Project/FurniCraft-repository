'use client'

import { IoMdTrash } from "@react-icons/all-files/io/IoMdTrash";

export default function ButtonDeleteWishlist ({wishlistId} : {wishlistId : string}) {

    const handleOnClick = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/wishlist", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({wishlistId}),
            });
            if (!response.ok) {
                throw (await response.json())
            }

            window.location.reload()

        } catch (error) {
            alert((error as Error).message)
        }
    }
    return (
        <button className="cursor-pointer" onClick={handleOnClick}>
            <IoMdTrash className="h-7 w-7" />
        </button>
    )
}