import Link from "next/link"

export default function Footer () { 
    return (
        <>
            <footer className="bg-black-500 text-gray-700 py-10 px-10 mt-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-bold mb-4">FurniCraft</h4>
                    <p>Your go-to destination for stylish, sustainable, and marketable furniture collections that elevate your space.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href={'/'}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={'/products'}
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={'/furni-place'}
                            >
                                FurniPlace
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Contact Us</h4>
                    <p>Email: support@furnicraft.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Address: Jl. Sultan Iskandar Muda No.7, RT.5/RW.9, Kby. Lama Sel., Kec. Kby. Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12240</p>
                </div>
                </div>
            </footer>
        </>
    )
}