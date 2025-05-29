import formatRupiah from "@/helpers/formatRupiah";
import { ProductType } from "@/type";
import ButtonAddToCart from "./ButtonAddToCart";
import ButtonAddToWishlist from "./ButtonAddToWishlist";
import Link from "next/link";

export default function Card ({product} : {product : ProductType}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow p-4 text-left">
              <Link
                href={`/products/${product.name+'-'+product._id}`}
              >
                <img src={product.thumbnail} alt={product.name} className="w-full h-40 object-contain mb-4" />
              </Link>
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-800 font-medium mb-2">{formatRupiah(product.price)}</p>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">{product.description}</span>
              <div className="text-right space-x-2">
                <ButtonAddToWishlist />
                <ButtonAddToCart />
              </div>
            </div>
        </>
    )
}