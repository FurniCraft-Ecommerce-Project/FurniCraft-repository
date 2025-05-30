import { ObjectId } from "mongodb";
import { db } from "../config/mongodb";

class ProductModel {
    static collection() {
        return db.collection('Products')
    }

    static async getProductAll() {
        try {

            const data = await this.collection().find().toArray()

            return data
        } catch (error) {
            throw error
        }
    }

    static async getProductPagination({ page, name }: { page: string, name: string }) {
        try {

            const limit = 9
            const skip = limit * (+page - 1)

            const arrQueryName = name.trim().split(" ").map(el => ({ name: { $regex: el, $options: "i" } }))

            const data = await this.collection()
                .find({
                    $and: arrQueryName
                })
                .skip(skip)
                .limit(limit)
                .toArray()

            return data
        } catch (error) {
            throw error
        }
    }

    static async getProductById(id: string) {
        return await this.collection().findOne({ _id: new ObjectId(id) })
    }

    static async getStockById(id: string) {
        const product = await this.getProductById(id)
        if (!product) {
            throw { status: 404, message: "Product not found" }
        }
        return product.stock
    }

}

export default ProductModel