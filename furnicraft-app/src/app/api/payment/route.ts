import CartModel from "@/db/models/CartModel";
import OrderModel from "@/db/models/OrderModel";
import errorHandler from "@/helpers/errorHandler";
import { ProductType } from "@/type";
import midtransClient from "midtrans-client"
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, items } = body;
        if (!items || items.length === 0) {
            throw { status: 400, message: "Your cart is empty" }
        }
        if (!userId) {
            throw { status: 400, message: "User ID is required" }
        }
        const order_id = "TRX-" + nanoid()

        const totalPrice = items.reduce((total: number, item: { DetailProduct: ProductType; quantity: number }) => {
            return total + (item.DetailProduct.price * item.quantity);
        }, 0);

        const gross_amount = totalPrice;

        let parameter = {
            "transaction_details": {
                "order_id": order_id,
                "gross_amount": gross_amount
            },
            "credit_card": {
                "secure": true
            },
            "customer_details": {
                "first_name": userId.name,
                "email": userId.email,
                "phone": "08111222333"
            }
        };

        const transaction = await snap.createTransaction(parameter)
        let transactionToken = transaction.token;

        const order = await OrderModel.create({
            userId: userId.id,
            items: items,
            orderId: order_id,
            token: transactionToken
        });

        return Response.json({ message: 'Order created', transactionToken })
    } catch (error) {
        return errorHandler(error)
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            throw { status: 400, message: "Order ID is required" }
        }

        const order = await OrderModel.findByOrderId(orderId);
        if (!order) {
            throw { status: 404, message: "Order not found" }
        }
        if (order.status === "paid") {
            throw { status: 400, message: "Order is already paid" }
        }

        const updatedOrder = await OrderModel.findByOrderId(orderId);

        console.log("updatedOrder", updatedOrder);
        if (!updatedOrder) {
            throw { status: 404, message: "Order not found" }
        }

        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const base64ServerKey = Buffer.from(serverKey + ':').toString('base64');

        const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${base64ServerKey}`,
            }
        })
        const data = await response.json();

        if (data.status_code !== "200" && data.transaction_status !== "capture") {
            throw { status: 400, message: "Payment failed, please call our costumer support" }
        }

        updatedOrder.status = "paid";
        updatedOrder.paidDate = new Date();
        updatedOrder.updatedAt = new Date();
        await OrderModel.collection().updateOne(
            { orderId: orderId },
            { $set: updatedOrder }
        );

        return Response.json({ message: 'Success, payment received!' });
    } catch (error) {
        return errorHandler(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {

        const body = await request.json();
        const { userId } = body;
        if (!userId) {
            throw { status: 400, message: "User ID is required" }
        }

        await CartModel.deleteCart(userId);
        return Response.json({ message: 'All orders deleted successfully' });
    } catch (error) {
        return errorHandler(error);
    }
}

