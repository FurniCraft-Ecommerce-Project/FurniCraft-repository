import ButtonDeleteCart from "@/components/ButtonDeleteCart";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import formatRupiah from "@/helpers/formatRupiah";
import { CartType } from "@/type";
export default async function ProductsDetail () {

    const response = await fetch(`http://localhost:3000/api/cart`);
    const data : CartType[] = await response.json()

    return (
        <> 
            <Navbar/>
            
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Quantity Order</th>
                        <th>Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((el,idx) => {
                                return (
                                    <tr key={idx}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img
                                                        src={`${el.DetailProduct?.thumbnail}`}
                                                        alt="" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{el.DetailProduct?.name}</div>
                                                    <div className="text-sm opacity-50">{el.DetailProduct?.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{el.DetailProduct?.description}</td>
                                        <td>{el.quantity}</td>
                                        <td>{formatRupiah(el.quantity*el.DetailProduct?.price)}</td>
                                        <th>
                                            <ButtonDeleteCart orderId={el._id}/>
                                        </th>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Footer/>
        </>
    )
}