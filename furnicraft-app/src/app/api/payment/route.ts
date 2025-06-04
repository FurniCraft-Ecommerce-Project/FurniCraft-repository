import CartModel from "@/db/models/CartModel";
import OrderModel from "@/db/models/OrderModel";
import UserModel from "@/db/models/UserModel";
import generateOrderId from "@/helpers/createOrderId";
import errorHandler from "@/helpers/errorHandler";
import snap from "@/lib/midtrans";
import { MidtransItems, ProductType } from "@/type";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')
        const body = await request.json();
        const { items } = body;

        if (!items || items.length === 0) {
            throw { status: 400, message: "Your cart is empty" }
        }
        if (!userId) {
            throw { status: 400, message: "User ID is required" }
        }

        const order_id = generateOrderId(userId);


        const totalPrice = items.reduce((total: number, item: { DetailProduct: ProductType; quantity: number }) => {
            return total + (item.DetailProduct.price * item.quantity);
        }, 0);

        const user = await UserModel.findById(userId);
        if (!user) {
            throw { status: 404, message: "User not found" }
        }

        const transformedItems: MidtransItems = items.map((item: { DetailProduct: ProductType; quantity: number }) => ({
            id: item.DetailProduct._id,
            price: item.DetailProduct.price,
            quantity: item.quantity,
            name: item.DetailProduct.name
        }));

        const parameter = {
            "transaction_details": {
                "order_id": order_id,
                "gross_amount": totalPrice
            },
            "credit_card": {
                "secure": true
            },
            "customer_details": {
                "first_name": user.name,
                "email": user.email
            },
            "item_details": transformedItems,
            "shipping_address": {
                "first_name": user.name,
                "email": user.email,
                "phone": "0812345678910",
                "address": "Jl. Sultan Iskandar Muda No.7, RT.5/RW.9, Kby. Lama Sel., Kec. Kby. Lama",
                "city": "Jakarta Selatan",
                "postal_code": "12240",
                "country_code": "IDN"
            },
        };

        const transaction = await snap.createTransaction(parameter)
        const transactionToken = transaction.token;

        await OrderModel.create({
            userId: userId,
            items: items,
            orderId: order_id,
            token: transactionToken
        });

        return Response.json({ message: 'Order created', transactionToken, orderId: order_id }, { status: 201 });
    } catch (error) {
        return errorHandler(error)
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        }

        const order = await OrderModel.findByOrderId(orderId);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        if (order.status === "paid") {
            return NextResponse.json({ message: "Order is already paid" }, { status: 400 });
        }

        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const base64ServerKey = Buffer.from(serverKey + ':').toString('base64');

        const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
            method: 'GET',
            headers: { Authorization: `Basic ${base64ServerKey}` }
        });

        const data = await response.json();

        if (data.status_code !== "200" || data.transaction_status !== "capture") {
            return NextResponse.json({ message: "Payment failed, please contact customer support" }, { status: 400 });
        }

        await OrderModel.collection().updateOne(
            { orderId: orderId },
            {
                $set: {
                    status: "paid",
                    paidDate: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        return NextResponse.json({ message: 'Success, payment received!', _id: order._id });
    } catch (error) {
        return errorHandler(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await CartModel.deleteCart(userId);

        return NextResponse.json({ message: 'Cart deleted successfully' });
    } catch (error) {
        return errorHandler(error);
    }
}