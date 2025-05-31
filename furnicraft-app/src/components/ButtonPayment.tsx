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
        const requestData = await response.json();

        window.snap.pay(requestData.transactionToken, {
            onSuccess: async function (result: any) {
                console.log(result, 'result');
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        orderId: result.order_id,
                        status: result.transaction_status,
                    })
                });

                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
                    method: 'DELETE',
                    body: JSON.stringify({
                        userId: data[0].UserId
                    })
                });

                const { message } = await response.json();
                toast.success(message);
                return window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/order-list/thank-you/${result.order_id}`;
            },
            onPending: function (result: any) {
                /* You may add your own implementation here */
                console.log(result);
                alert("wating your payment!"); 
            },
            onError: function (result: any) {
                /* You may add your own implementation here */
                console.log(result);
                alert("payment failed!"); 
            },
            onClose: function () {
                /* You may add your own implementation here */
                alert('you closed the popup without finishing the payment');
            }
        });
    }

    return (
        <button onClick={handlePayment} className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition" style={{ cursor: "pointer" }}>
            Proceed to Payment
        </button>
    )
}