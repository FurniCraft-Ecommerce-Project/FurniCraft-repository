import ButtonAddToCart from "@/components/ButtonAddToCart";
import ButtonBuy from "@/components/ButtonBuy";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import formatRupiah from "@/helpers/formatRupiah";
import { ProductType } from "@/type";
import Link from "next/link";
export default async function ProductsDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const [nameProductParams, idProductParams] = slug.split('-')

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${idProductParams}`);
    const data: ProductType = await response.json()

    return (
        <>
            <div className="min-h-screen">
                <Navbar />
                <div className=" bg-gray-100 text-gray-900 p-8">

                    <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow">
                        {/* Product Image */}
                        <div className="flex justify-center">
                            <img
                                src={`${data.thumbnail}`}
                                alt="Lounge Chair L10"
                                className="w-full max-w-sm object-contain"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded">
                                    + {data.category}
                                </span>
                                <h2 className="text-3xl font-bold mt-2">{data.name}</h2>
                                <h3 className="text-2xl font-medium mb-4">{data.description}</h3>
                                <h3 className="text-xl font-medium mb-4">{formatRupiah(data.price)}</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Stock : {data.stock}
                                </p>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <ButtonAddToCart product={data} page={"detail"} />
                                <ButtonBuy />
                                <Link href={`/products/3d-view/${data._id}`} className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 0l10 7.5-10 7.5L0 7.5 10 0zM10 3.553L2.562 7.5 10 11.447 17.438 7.5 10 3.553z" clipRule="evenodd" />
                                    </svg>
                                    See 3D Model
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

        </>
    )
}