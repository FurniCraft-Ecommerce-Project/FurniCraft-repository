import { ObjectId } from "mongodb";
import { db } from "../config/mongodb";

class CartModel {
    static collection () {
        return db.collection('Carts')
    }

    static async addCart({UserId, ProductId, quantity} : {UserId : string, ProductId : string, quantity : number}) {
        return await this.collection().insertOne({UserId : new ObjectId(UserId), ProductId : new ObjectId(ProductId), quantity});
    }

    static async getCartByUserIdProductId (UserId : string, ProductId : string) {
        return await this.collection().findOne({
            $and : [
                {
                    UserId : new ObjectId(UserId)
                },
                {
                    ProductId : new ObjectId(ProductId)
                }
            ]
        })
    }

    static async getCart() {
        return await this.collection().aggregate(
            [
                {
                    '$lookup': {
                    'from': 'Products', 
                    'localField': 'ProductId', 
                    'foreignField': '_id', 
                    'as': 'DetailProduct'
                    }
                }, {
                    '$unwind': {
                    'path': '$DetailProduct', 
                    'preserveNullAndEmptyArrays': true
                    }
                }
            ]
        ).toArray()
    }

    static async getCartByUserId (UserId : string) {
        return await this.collection().aggregate(
            [
                {
                    '$match' : {
                        'UserId' : new ObjectId(UserId)
                    }
                },
                {
                    '$lookup': {
                    'from': 'Products', 
                    'localField': 'ProductId', 
                    'foreignField': '_id', 
                    'as': 'DetailProduct'
                    }
                }, {
                    '$unwind': {
                    'path': '$DetailProduct', 
                    'preserveNullAndEmptyArrays': true
                    }
                }
            ]
        ).toArray()
    }

    static async delCart(id : string) {
        return this.collection().deleteOne({_id : new ObjectId(id)})
    }

    static async deleteCart(UserId : string) {
        return this.collection().deleteMany({UserId : new ObjectId(UserId)})
    }

    static async incrementCartQuantity(id : string) {
        return this.collection().updateOne(
            {_id : new ObjectId(id)},
            {$inc : {quantity: 1}}
        )
    }

    static async decrementCartQuantity(id : string) {
        return this.collection().updateOne(
            {_id : new ObjectId(id)},
            {$inc : {quantity: -1}}
        )
    }

}

export default CartModel