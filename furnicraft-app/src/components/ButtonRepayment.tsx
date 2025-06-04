"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ButtonRepayment({ token }: { token: string }) {

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
        // @ts-ignore
        window.snap.pay(token, {
            onSuccess: async function () {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId })
                });
                if (!response.ok) {
                    const { message } = await response.json();
                    toast.error(message);
                    return;
                }
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'DELETE'
                });
                const { message, _id } = await response.json();
            }
        });
    }

    return (
        <button onClick={handlePayment} className=" px-2 py-2 bg-green-600 text-white rounded-sm shadow hover:bg-green-700 transition" style={{cursor: "pointer"}}>
            Continue Payment
        </button>
    )
}