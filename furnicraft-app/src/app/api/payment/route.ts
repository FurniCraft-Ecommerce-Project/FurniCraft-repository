import OrderModel from "@/db/models/OrderModel";
import errHandler from "@/helpers/errHandler";
import midtransClient from "midtrans-client"
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
        const order_id = String(Math.random());

        const totalPrice = items.reduce((total: number, item: { price: number; quantity: number }) => {
            return total + (item.price * item.quantity);
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

        const order = await OrderModel.create({
            userId: userId.id,
            items: items,
            orderId: order_id
        });

        const transaction = await snap.createTransaction(parameter)
        let transactionToken = transaction.token;
        return Response.json({ message: 'Order created', transactionToken })
    } catch (error) {
        return errHandler(error)
    }

}

export async function PATCH(request: Request) {

}

