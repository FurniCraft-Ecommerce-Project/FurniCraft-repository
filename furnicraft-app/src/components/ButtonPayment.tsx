"use client";

import { CartType } from "@/type";
import { useEffect } from "react";

export default function ButtonPayment({ data }: { data: CartType[] }) {

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
            method: 'POST',
            body: JSON.stringify({
                items: data
            })
        });
        const requestData = await response.json();

        window.snap.pay(requestData.transactionToken, {
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
                        userId: data[0].UserId
                    })
                });

                const { message } = await response.json();
                return window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/order/thank-you/${result.order_id}`;
            }
        });
    }

    return (
        <button onClick={handlePayment} className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
            Proceed to Payment
        </button>
    )
}