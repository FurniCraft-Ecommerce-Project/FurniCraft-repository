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

    static async delCart(id : string) {
        return this.collection().deleteOne({_id : new ObjectId(id)})
    }

}

export default CartModel