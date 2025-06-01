import { ObjectId } from "mongodb";
import { db } from "../config/mongodb";
import { CartType } from "@/type";

export default class OrderModel {
    static collection() {
        return db.collection('Orders')
    }

    static async create(data: { userId: string, items: CartType[], orderId: string, token: string }) {
        if (!data.items || data.items.length === 0) {
            throw { status: 400, message: "Your cart is empty" }
        }

        if (!data.userId) {
            throw { status: 400, message: "User ID is required" }
        }

        const result = await this.collection().insertOne({
            userId: new ObjectId(data.userId),
            status: "pending",
            paidDate: null,
            orderId: data.orderId,
            token: data.token,
            items: data.items.map(item => ({
                productId: new ObjectId(item.ProductId),
                name: item.DetailProduct.name,
                thumbnail: item.DetailProduct.thumbnail,
                price: item.DetailProduct.price,
                quantity: item.quantity,
                subtotal: item.DetailProduct.price * item.quantity,
            })),
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return result
    }

    static async findByOrderId(id: string) {
        if (!id) {
            throw { status: 400, message: "Order ID is required" }
        }

        const order = await this.collection().findOne({ orderId: id });

        if (!order) {
            throw { status: 404, message: "Order not found" }
        }

        return order;
    }

    static async findByUserId(userId: string) {

        if (!userId) {
            throw { status: 400, message: "User ID is required" }
        }

        const orders = await this.collection().find({userId: new ObjectId(userId)}).toArray();

        if (orders.length === 0) {
            throw { status: 404, message: "No orders found for this user" }
        }

        return orders;
    }
}