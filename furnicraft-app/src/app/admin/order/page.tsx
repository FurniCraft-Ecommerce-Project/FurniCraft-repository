"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/order`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    deliveryStatus: string
  ) => {
    try {
      const response = await fetch(`/api/admin/products/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, deliveryStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success(
        `Status pesanan berhasil diperbarui menjadi ${deliveryStatus}`
      );
      fetchOrders(); // Refresh data setelah update
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Gagal memperbarui status pesanan");
    }
  };

  // Format currency untuk tampilan harga
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format tanggal
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);

    // Format date in a more readable structure
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("id-ID", { month: "short" });
    const year = date.getFullYear();

    // Format time without seconds
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  // Hitung total amount dari items
  const calculateTotalAmount = (items: Array<{ subtotal: number }>) => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  // Filter orders berdasarkan status yang dipilih
  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) =>
          (order.deliveryStatus || order.status)
            .toLowerCase()
            .includes(selectedStatus.toLowerCase())
        );

  // Get status badge style
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header Admin */}
        <header className="bg-[#F8F8F8] py-4 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#D4A86A] rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  FurniCraft Admin
                </h1>
              </div>

              {/* Menu navigasi admin */}
              <div className="flex space-x-3">
                <a
                  href="/admin"
                  className="bg-white border border-[#D4A86A] text-[#D4A86A] hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                  Produk
                </a>
                <a
                  href="/admin/order"
                  className="bg-[#D4A86A] hover:bg-[#C19556] text-white px-4 py-2 rounded-md font-medium transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                    />
                  </svg>
                  Pesanan
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Filter Status */}
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={fetchOrders}
                  className="bg-[#D4A86A] hover:bg-[#C19556] text-white px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#D4A86A] border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Memuat data pesanan...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Manajemen Pesanan
                    {selectedStatus !== "all" &&
                      ` - Status: ${
                        selectedStatus.charAt(0).toUpperCase() +
                        selectedStatus.slice(1)
                      }`}
                  </h2>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Tidak ada pesanan yang ditemukan dengan status yang dipilih.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Paket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order, index) => (
                        <tr
                          key={order._id || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {formatDate(order.createdAt).split(",")[0]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(order.createdAt).split(",")[1].trim()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {order.items[0] && (
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    src={
                                      order.items[0].thumbnail ||
                                      "/placeholder.png"
                                    }
                                    alt={order.items[0].name}
                                    className="h-10 w-10 rounded-md object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).onerror =
                                        null;
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.png";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.items.length} item(s)
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.items[0]?.name}
                                  {order.items.length > 1 &&
                                    ` +${order.items.length - 1} lainnya`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(calculateTotalAmount(order.items))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                order.deliveryStatus || "pending"
                              )}`}
                            >
                              {(order.deliveryStatus || "pending")
                                .charAt(0)
                                .toUpperCase() +
                                (order.deliveryStatus || "pending").slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                              value={order.deliveryStatus || "pending"}
                              onChange={(e) =>
                                handleUpdateStatus(
                                  order.orderId,
                                  e.target.value
                                )
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="placed">Confirm Order</option>
                              <option value="processed">Processed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
