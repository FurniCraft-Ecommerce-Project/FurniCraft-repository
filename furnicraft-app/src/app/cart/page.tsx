'use client'

import ButtonDeleteCart from "@/components/ButtonDeleteCart";
import ButtonPayment from "@/components/ButtonPayment";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import errorHandler from "@/helpers/errorHandler";
import formatRupiah from "@/helpers/formatRupiah";
import { CartType } from "@/type";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsDetail() {

  const [data, setData] = useState<CartType[]>([])
  const [total, setTotal] = useState(0);

  const fetchDataWishlist = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, { cache: 'no-store' });
    const resData: CartType[] = await response.json()
    setData(resData)
  }
  useEffect(() => {
    fetchDataWishlist()
  }, [])

  useEffect(() => {
    const totalPrice = data.reduce(
      (acc, el) => acc + el.quantity * (el.DetailProduct?.price ?? 0),
      0
    );
    setTotal(totalPrice);
  }, [data]);

  return (
    <>
      <Navbar />

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Side - Cart Table */}
          <div className="w-full lg:w-2/3 overflow-x-auto">
            <div className="bg-base-100 shadow-lg rounded-xl p-4">
              <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((el, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Link
                                href={`/products/${el.DetailProduct?.name + '-' + el.DetailProduct?._id}`}
                              >
                                <img src={el.DetailProduct?.thumbnail} alt="product" />
                              </Link>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              <Link
                                href={`/products/${el.DetailProduct?.name + '-' + el.DetailProduct?._id}`}
                              >
                                {el.DetailProduct?.name}
                              </Link>
                            </div>
                            <div className="text-sm opacity-50">{el.DetailProduct?.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>{formatRupiah(el.DetailProduct?.price || 0)}</td>
                      <td>
                        <div className="flex items-center">
                          {/* Decrement Button */}
                          <button
                            className="btn btn-circle btn-sm bg-base-200 hover:bg-primary hover:text-white border-none transition-colors duration-200"
                            onClick={async () => {
                              try {
                                const currentQuantity = el.quantity;

                                // Only make API call if quantity > 0
                                if (currentQuantity > 0) {
                                  const response = await fetch('/api/cart/update-quantity', {
                                    method: 'PATCH',
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                      productId: el.ProductId,
                                      action: 'decrement'
                                    })
                                  });

                                  if (!response.ok) throw ({ message: "Failed to update quantity", status: response.status });

                                  // If current quantity is 1, this will remove the item from cart
                                  if (currentQuantity <= 1) {
                                    fetchDataWishlist(); // Refresh entire cart
                                  } else {
                                    // Otherwise just decrease the quantity
                                    setData(prevData =>
                                      prevData.map(item =>
                                        item._id === el._id ? { ...item, quantity: item.quantity - 1 } : item
                                      )
                                    );
                                  }
                                }
                              } catch (error) {
                                errorHandler(error);
                              }
                            }}
                            disabled={el.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                          </button>

                          <div className="px-4 font-medium text-center w-12">{el.quantity}</div>

                          {/* Increment Button */}
                          <button
                            className="btn btn-circle btn-sm bg-base-200 hover:bg-primary hover:text-white border-none transition-colors duration-200"
                            onClick={async () => {
                              try {
                                // Check if product has available stock before incrementing
                                const stock = el.DetailProduct?.stock || 0;

                                if (el.quantity >= stock) {
                                  // Show an error or toast notification that stock is insufficient
                                  alert(`Sorry, only ${stock} items available in stock`);
                                  return;
                                }

                                const response = await fetch('/api/cart/update-quantity', {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                    productId: el.ProductId,
                                    action: 'increment'
                                  })
                                });

                                if (!response.ok) throw new Error('Failed to update quantity');

                                // Update local state using functional update to avoid stale state issues
                                setData(prevData =>
                                  prevData.map(item =>
                                    item._id === el._id ? { ...item, quantity: item.quantity + 1 } : item
                                  )
                                );
                              } catch (error) {
                                errorHandler(error);
                              }
                            }}
                            disabled={el.quantity >= (el.DetailProduct?.stock || 0)}
                            aria-label="Increase quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td>{formatRupiah(el.quantity * (el.DetailProduct?.price || 0))}</td>
                      <td>
                        <ButtonDeleteCart orderId={el._id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="w-full lg:w-1/3 ">
            <div className="bg-base-100 shadow-lg rounded-xl p-6 sticky top-28">
              <h2 className="text-xl font-bold mb-2">Total Price</h2>
              <p className="text-3xl font-extrabold mb-6">
                {formatRupiah(total)}
              </p>
              <ButtonPayment data={data} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
