'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import formatRupiah from "@/helpers/formatRupiah";
import ButtonPayment from "@/components/ButtonPayment";
import ButtonRepayment from "@/components/ButtonRepayment";
import { use, useEffect, useState } from "react";
import { set } from "zod/v4";
// import { FaShoppingBag } from "react-icons/fa";
// import { BsThreeDotsVertical } from "react-icons/bs";

// Define the proper order type based on your actual data structure
interface OrderDetail {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderType {
  _id?: string;
  orderId: string;
  userId: string;
  status: string;
  paidDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  items: OrderDetail[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])

  const fetchOrders = async () => {
    const response = await fetch(`http://localhost:3000/api/order`);
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
              // Calculate total from items
              const total = order.items.reduce((sum, item) => sum + item.subtotal, 0);
              const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                  {/* Header */}
                  <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      {/* <FaShoppingBag className="text-primary" /> */}
                      <span className="font-medium">Belanja</span>
                      <span className="text-gray-500">{formattedDate}</span>
                      <span className={`px-2 py-1 text-xs rounded-md ${getStatusBgColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    {order.status.toLowerCase() === "pending" && (
                      // buat tombol bayar
                      <ButtonRepayment token={order.token} userId={order.userId} />
                    )}
                  </div>

                  {/* Payment info (if needed) */}
                  <div className="bg-gray-50 p-4 text-sm">
                    <p>Order status: <span className="font-medium">{order.status}</span></p>
                  </div>

                  {/* First item preview */}
                  {order.items.length > 0 && (
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                          <div>
                            <h3 className="font-medium">{order.items[0].name}</h3>
                            <p className="text-sm text-gray-500">
                              {order.items[0].quantity} item × {formatRupiah(order.items[0].price)}
                            </p>
                            {order.items.length > 1 && (
                              <p className="text-sm text-gray-500">+{order.items.length - 1} more item(s)</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer with total */}
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <a href={`/order/${order.orderId}`} className="text-primary hover:underline">
                        View Order Details
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total Belanja</div>
                      <div className="font-bold text-lg">{formatRupiah(total)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

// Helper functions
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

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "badge-success";
    case "shipped":
      return "badge-info";
    case "delivered":
      return "badge-primary";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}