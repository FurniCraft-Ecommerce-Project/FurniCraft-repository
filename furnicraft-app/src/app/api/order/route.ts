import OrderModel from "@/db/models/OrderModel";
import errorHandler from "@/helpers/errorHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userId = '683858bc8192fc57db299c85' // Replace with actual user ID retrieval logic
        if (!userId) throw { message: "User ID is required", status: 400 };

        const orders = await OrderModel.findByUserId(userId);

        return Response.json(orders);
    } catch (error) {
        return errorHandler(error)
    }
}