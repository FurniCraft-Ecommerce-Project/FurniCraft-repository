import ButtonPayment from "@/components/ButtonPayment"

export default function PaymentTest() {

    // contoh data untuk payment
    const paymentData = [{
        "id": "1",
        "name": "ÄLVSTA",
        "description": "kursi, buatan tangan rotan/Sefast hitam",
        "price": 1195000,
        "thumbnail": "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/157/1115700_PE872218_S3.webp",
        "stock": 100,
        "category": "Kursi"
    },
    {
        "id": "2",
        "name": "ÄLVSTA",
        "description": "kursi, buatan tangan rotan/Sefast putih",
        "price": 1195000,
        "thumbnail": "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/157/1115725_PE872233_S3.webp",
        "stock": 100,
        "category": "Kursi"
    }]
    // contoh user untuk payment
    const userData = {
        "id": "1",
        "name": "John Doe",
        "email": "johndoe@mail.com",
        "address": "123 Main St, City, Country",
        "phone": "+1234567890"
    }

    return (
        // bagi 2 div kiri dan kanan full screen
        <div className="flex h-screen">
            {/* Left side */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Payment Page</h1>
                    <p className="text-lg text-gray-700">This is a test page for payment integration.</p>
                    {/* // buat tombol untuk payment */}
                    <ButtonPayment />
                </div>
            </div>
            {/* Right side */}
            <div className="w-1/2 bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Payment Form</h1>
                    <p className="text-lg text-gray-700">Here you can implement your payment form.</p>
                </div>
            </div>
        </div>
    )
}