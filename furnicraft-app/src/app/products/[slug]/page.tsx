import Button3DModel from "@/components/Button3DModel";
import ButtonAddToCart from "@/components/ButtonAddToCart";
import ButtonBuy from "@/components/ButtonBuy";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import formatRupiah from "@/helpers/formatRupiah";
import { ProductType } from "@/type";
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
                                <Button3DModel imageUrl={data.thumbnail} />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

        </>
    )
}