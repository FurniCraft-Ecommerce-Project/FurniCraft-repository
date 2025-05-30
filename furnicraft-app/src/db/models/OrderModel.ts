import { ObjectId } from "mongodb";
import { db } from "../config/mongodb";

interface OrderDetail {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface CartItem {
    _id: string;
    UserId: string;
    ProductId: string;
    quantity: number;
    DetailProduct: {
        _id: string;
        name: string;
        description: string;
        price: number;
        thumbnail: string;
        stock: number;
        category: string;
    }
}

interface NewOrder {
    userId: string;
    status: string;
    paidDate: null;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    items: OrderDetail[];
}

export default class OrderModel {
    static collection() {
        return db.collection('Orders')
    }

    static async create(data: { userId: string, items: CartItem[], orderId: string }) {
        if (!data.items || data.items.length === 0) {
            throw { status: 400, message: "Your cart is empty" }
        }

        if (!data.userId) {
            throw { status: 400, message: "User ID is required" }
        }

        const newOrder: NewOrder = {
            userId: data.userId,
            status: "pending",
            paidDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: data.items.map(item => ({
                productId: item.ProductId,
                name: item.DetailProduct.name,
                price: item.DetailProduct.price,
                quantity: item.quantity,
                subtotal: item.DetailProduct.price * item.quantity
            })),
            orderId: data.orderId
        };

        const result = await this.collection().insertOne(newOrder)

        return "Order created successfully"
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
}