'use client'

import errorHandler from "@/helpers/errorHandler";

export default function ButtonDeleteCart({ orderId }: { orderId: string }) {

    const handleOnClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });
            if (!response.ok) {
                throw await response.json()
            }

            window.location.reload()

        } catch (error) {
            errorHandler(error)
        }
    }
    return (
        <>
            <button className="btn btn-outline btn-error" onClick={handleOnClick}>Delete</button>
        </>
    )
}