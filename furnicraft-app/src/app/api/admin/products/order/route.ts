import OrderModel from "@/db/models/OrderModel";
import errorHandler from "@/helpers/errorHandler";
import { type NextRequest } from "next/server";

//buat get untuk order yang sudah paid
export async function GET(request: NextRequest) {
  try {
    //ambil semua order yang sudah paid
    const data = await OrderModel.getAllPaidOrders();
    return Response.json({
      message: "Orders retrieved successfully",
      status: 200,
      data,
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    //buat body dari request, bodynya dari order id
    const { orderId, deliveryStatus } = await request.json();
    //update status order
    const data = await OrderModel.updateOrderStatus({
      orderId,
      deliveryStatus,
    });
    return Response.json({
      status: 200,
      data,
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
