"use client";

import { CartType } from "@/type";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

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
        if (data.length === 0) {
            toast.error("Your cart is empty!");
            return redirect('/cart');
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
            method: 'POST',
            body: JSON.stringify({
                items: data
            })
        });
        const { transactionToken, orderId } = await response.json();

        // @ts-ignore
        window.snap.pay(transactionToken, {
            onSuccess: async function () {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId })
                });
                if (!response.ok) {
                    const { message } = await response.json();
                    toast.error(message);
                }
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'DELETE'
                });
                const { _id } = await response.json();
                window.location.href = '/thank-you/' + _id;
            },
            onPending: async function () {
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'DELETE'
                });
            },
        });
    }

    return (
        <button onClick={handlePayment} className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition" style={{ cursor: "pointer" }}>
            Proceed to Payment
        </button>
    )
}