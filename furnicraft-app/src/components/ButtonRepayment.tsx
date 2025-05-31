"use client";

import { CartType } from "@/type";
import { useEffect } from "react";

export default function ButtonRepayment({ token, userId }: { token: string, userId: string }) {

    useEffect(() => {

        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string;

        const script = document.createElement('script')
        script.src = snapScript
        script.setAttribute('data-client-key', clientKey)
        script.async = true

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, []);

    const handlePayment = async () => {

        window.snap.pay(String(token), {
            onSuccess: async function (result) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        orderId: result.order_id
                    })
                });

                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'DELETE',
                    body: JSON.stringify({
                        userId: userId
                    })
                });

                const { message } = await response.json();
                return window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/order/thank-you/${result.order_id}`;
            }
        });
    }

    return (
        <button onClick={handlePayment} className=" px-2 py-2 bg-green-600 text-white rounded-sm shadow hover:bg-green-700 transition">
            Continue Payment
        </button>
    )
}