'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import formatRupiah from "@/helpers/formatRupiah";
import ButtonRepayment from "@/components/ButtonRepayment";
import { useEffect, useState } from "react";
import { OrderType } from "@/type";
import { ShoppingBag } from "lucide-react";
import MyModal from "@/components/ModalProducts";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])

  const fetchOrders = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order`);
    const data = await response.json();
    setOrders(data);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        {orders.length === 0 || !Array.isArray(orders) ? (
          <div className="bg-base-100 shadow-lg rounded-lg p-8 text-center">
            <p className="text-lg">You don't have any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const total = order.items.reduce((sum, item) => sum + item.subtotal, 0);
              const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                  {/* Header */}
                  <div className="p-3 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="text-primary" />
                      <span className="font-medium">Belanja</span>
                      <span className="text-gray-500">{formattedDate}</span>
                      <span className={`px-2 py-1 text-xs rounded-md font-bold ${getStatusBgColor(order.status)}`}>
                        {order.status === "paid" ? "Success" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    {order.status.toLowerCase() === "pending" && (
                      <ButtonRepayment token={order.token} userId={order.userId} />
                    )}
                  </div>

                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Hello!</h3>
                      <p className="py-4">Press ESC key or click outside to close</p>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>

                  < div className="p-4 flex justify-between items-center" >
                    {order.items.length > 0 && (
                      <div className="flex justify-between">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                            <img
                              src={order.items[0].thumbnail}
                              alt={order.items[0].name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{order.items[0].name}</h3>
                            <p className="text-sm text-gray-500">
                              {order.items[0].quantity} item x {formatRupiah(order.items[0].price)}
                            </p>
                            {order.items.length > 1 && (
                              <MyModal order={order} />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                    }
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total Belanja</div>
                      <div className="font-bold text-lg">{formatRupiah(total)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div >
        )
        }
      </div >
      <Footer />
    </>
  );
}

function getStatusBgColor(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}