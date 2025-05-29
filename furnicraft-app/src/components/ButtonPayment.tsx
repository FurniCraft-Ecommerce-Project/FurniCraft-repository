"use client";

import { useEffect } from "react";

export default function ButtonPayment() {

    useEffect(() => {

        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';

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
        const data = [
            {
                "productId": "1",
                "name": "Chair",
                "price": 10000,
                "quantity": 2
            },
            {
                "productId": "2",
                "name": "Chair",
                "price": 10000,
                "quantity": 1
            }
        ]
        const user = {
            "id": "1",
            "name": "John Doe",
            "email": "john@mail.com"
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`, {
            method: 'POST',
            body: JSON.stringify({
                userId: user,
                items: data
            })
        });
        const requestData = await response.json();

        window.snap.pay(requestData.transactionToken, {
            onSuccess: function (result) {
                console.log('Payment Success:', result);
                // Handle success logic here
            },
            // onPending: function (result) {
            //     console.log('Payment Pending:', result);
            //     // Handle pending logic here
            // },
            // onError: function (result) {
            //     console.error('Payment Error:', result);
            //     // Handle error logic here
            // },
            // onClose: function () {
            //     console.log('Payment Dialog Closed');
            //     // Handle dialog close logic here
            // }
        });
    }

    return (
        <button onClick={handlePayment} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
            Proceed to Payment
        </button>
    )
}