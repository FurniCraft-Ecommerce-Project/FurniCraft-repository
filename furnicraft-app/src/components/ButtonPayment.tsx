"use client";
export default function ButtonPayment() {

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
        console.log("Payment request data:", requestData);
    }
    return (
        <button onClick={handlePayment} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
            Proceed to Payment
        </button>
    )
}