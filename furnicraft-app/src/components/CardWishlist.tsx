import formatRupiah from "@/helpers/formatRupiah";
import { WishlistType } from "@/type";
import ButtonAddToCart from "./ButtonAddToCart";
import Link from "next/link";
import ButtonDeleteWishlist from "./ButtonDeleteWishlist";

export default function CardWishlist ({wishlist} : {wishlist : WishlistType}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow p-4 text-left">
              <Link
                href={`/products/${wishlist.DetailProduct.name+'-'+wishlist.DetailProduct._id}`}
              >
                <img src={wishlist.DetailProduct.thumbnail} alt={wishlist.DetailProduct.name} className="w-full h-40 object-contain mb-4" />
              </Link>
              <h3 className="text-lg font-semibold mb-1">{wishlist.DetailProduct.name}</h3>
              <p className="text-gray-800 font-medium mb-2">{formatRupiah(wishlist.DetailProduct.price)}</p>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">{wishlist.DetailProduct.description}</span>
              <div className="text-right space-x-2">
                <ButtonDeleteWishlist wishlistId={wishlist._id}/>
                <ButtonAddToCart product={wishlist.DetailProduct} />
              </div>
            </div>
        </>
    )
}