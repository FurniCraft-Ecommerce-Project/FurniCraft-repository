'use client'
import formatRupiah from "@/helpers/formatRupiah";
import { ProductType } from "@/type";
import ButtonAddToCart from "./ButtonAddToCart";
import ButtonAddToWishlist from "./ButtonAddToWishlist";
import Link from "next/link";
import { useState } from "react";

export default function Card({ product }: { product: ProductType }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4 text-left relative">
        {product.image3dUrl && (
          <div className="absolute top-2 right-2 z-10">
            <button
              style={{ position: 'relative', cursor: 'pointer' }}
              className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-blue-600 focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                setShowTooltip(!showTooltip);
                window.location.href = `/products/3d-view/${product._id}`;
                // window.open(`/products/3d-view/${product.name + '-' + product._id}`, '_blank');
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              3D
            </button>
            {showTooltip && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-xs text-gray-700 z-20">
                This product has 3D model
              </div>
            )}
          </div>
        )}
        <Link
          href={`/products/${product.name + '-' + product._id}`}
        >
          <img src={product.thumbnail} alt={product.name} className="w-full h-40 object-contain mb-4" />
        </Link>
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-800 font-medium mb-2">{formatRupiah(product.price)}</p>
        <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">{product.description}</span>
        <div className="text-right space-x-2">
          <ButtonAddToWishlist product={product} />
          <ButtonAddToCart product={product} page={"products"} />
        </div>
      </div>
    </>
  )
}