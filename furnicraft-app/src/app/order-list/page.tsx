'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import formatRupiah from "@/helpers/formatRupiah";
import ButtonRepayment from "@/components/ButtonRepayment";
import { useEffect, useState, JSX } from "react";
import { OrderType } from "@/type";
import { CheckCircle, Clock, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import MyModal from "@/components/ModalProducts";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const transaction_status = searchParams.get('transaction_status')
  const [orders, setOrders] = useState<OrderType[]>([])

  const fetchOrders = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order`);
    const data = await response.json();
    setOrders(data);
  }

  useEffect(() => {
    if (transaction_status === 'pending') {
      toast.error('Your payment is pending, please continue your transaction.')
    }
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        {orders.length === 0 || !Array.isArray(orders) ? (
          <div className="bg-base-100 shadow-lg rounded-lg p-8 text-center">
            <p className="text-lg">You dont have any orders yet.</p>
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
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {order.status.toLowerCase() === "pending" ? (
                      <ButtonRepayment token={order.token} orderId={order.orderId} />
                    ) : (
                      // Delivery Status Icons with connecting lines
                      <div className="flex items-center space-x-2 ml-4">
                        {["placed", "processed", "shipped", "delivered"].map((step, i, arr) => {
                          const currentStep = order.deliveryStatus || 'placed'; // fallback
                          const orderStepIndex = arr.indexOf(currentStep);
                          const thisStepIndex = i;

                          const isActive = thisStepIndex <= orderStepIndex;
                          const isCurrent = thisStepIndex === orderStepIndex;

                          const getColor = () => {
                            if (!isActive) return 'text-gray-300';
                            if (isCurrent) return 'text-blue-500';
                            return 'text-green-500';
                          };

                          const IconMap: Record<string, { icon: JSX.Element, text: string }> = {
                            placed: { icon: <CheckCircle className={`w-5 h-5 ${getColor()}`} />, text: "Order Placed" },
                            processed: { icon: <Clock className={`w-5 h-5 ${getColor()}`} />, text: "Processed" },
                            shipped: { icon: <Truck className={`w-5 h-5 ${getColor()}`} />, text: "Shipped" },
                            delivered: { icon: <PackageCheck className={`w-5 h-5 ${getColor()}`} />, text: "Delivered" },
                          };

                          return (
                            <div key={step} className="flex items-center">

                              <div className={'justify-center items-center flex flex-col'}>
                                {IconMap[step]?.icon}
                                <span className="text-xs mt-1 text-center">{IconMap[step]?.text}</span>

                              </div>
                              {i < arr.length - 1 && (
                                <div className={`w-6 h-0.5 mx-1 ${orderStepIndex >= i + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
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
    case "canceled":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}