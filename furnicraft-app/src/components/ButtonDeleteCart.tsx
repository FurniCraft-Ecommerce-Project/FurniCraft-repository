'use client'

import errorHandler from "@/helpers/errorHandler";
import { MouseEventHandler } from "react";
import toast from "react-hot-toast";

export default function ButtonDeleteCart({ orderId }: { orderId: string }) {

    const handleOnClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {
            e.preventDefault();
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
            toast.success("1 product has been deleted!");

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            errorHandler(error)
        }
    }
    return (
        <button className="btn btn-outline btn-error" onClick={handleOnClick}>Delete</button>
    )
}