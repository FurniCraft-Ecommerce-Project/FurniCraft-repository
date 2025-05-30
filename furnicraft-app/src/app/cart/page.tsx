import ButtonDeleteCart from "@/components/ButtonDeleteCart";
import ButtonPayment from "@/components/ButtonPayment";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import formatRupiah from "@/helpers/formatRupiah";
import { CartType } from "@/type";

export default async function ProductsDetail() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`);
  const data: CartType[] = await response.json();

  const total = data.reduce(
    (acc, el) => acc + (el.quantity * (el.DetailProduct?.price || 0)),
    0
  );

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
                    <th>Description</th>
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
                              <img src={el.DetailProduct?.thumbnail} alt="product" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{el.DetailProduct?.name}</div>
                            <div className="text-sm opacity-50">{el.DetailProduct?.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-xs">{el.DetailProduct?.description}</td>
                      <td>{el.quantity}</td>
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
          <div className="w-full lg:w-1/3">
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
