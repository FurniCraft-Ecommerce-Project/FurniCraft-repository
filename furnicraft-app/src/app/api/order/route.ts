import OrderModel from "@/db/models/OrderModel";
import errorHandler from "@/helpers/errorHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')
        
        if (!userId) throw { message: "User ID is required", status: 400 };

        const orders = await OrderModel.findByUserId(userId);

        return Response.json(orders);
    } catch (error) {
        return errorHandler(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;
        if (!orderId) throw { message: "Order ID is required", status: 400 };
        const order = await OrderModel.findByOrderId(orderId);
        if (!order) throw { message: "Order not found", status: 404 };
        if (order.status === "paid") throw { message: "Order is already paid", status: 400 };

        return Response.json(order);
    } catch (error) {
        return errorHandler(error);
    }
}

        