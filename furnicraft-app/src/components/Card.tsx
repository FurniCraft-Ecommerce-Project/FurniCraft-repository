import formatRupiah from "@/helpers/formatRupiah";
import { ProductType } from "@/type";

export default function Card ({product} : {product : ProductType}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow p-4 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">{product.stock}</span>
              </div>
              <img src={product.thumbnail} alt={product.name} className="w-full h-40 object-contain mb-4" />
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-800 font-medium mb-2">{formatRupiah(product.price)}</p>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">{product.description}</span>
              <div className="text-right">
                <button className="text-gray-600 hover:text-black">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h11l-1.5-7M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </button>
              </div>
            </div>
        </>
    )
}