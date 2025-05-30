import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import formatRupiah from "@/helpers/formatRupiah";
// import { OrderType } from "@/type";

export default async function OrdersPage() {
//   const response = await fetch(`http://localhost:3000/api/orders`, { cache: 'no-store' });
//   const orders: OrderType[] = await response.json();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="overflow-x-auto bg-base-100 shadow-lg rounded-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            {/* <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6">No orders found.</td>
                </tr>
              )}
              {orders.map((order, index) => (
                <tr key={index}>
                  <td className="font-semibold">{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items.length}</td>
                  <td>{formatRupiah(order.total)}</td>
                  <td>
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Optional helper
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
