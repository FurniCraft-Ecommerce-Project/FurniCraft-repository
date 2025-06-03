import { ObjectId } from "mongodb";
import { db } from "../config/mongodb";

class WishlistModel {
  static collection() {
    return db.collection("Wishlist");
  }
  static async addWishlist({
    UserId,
    ProductId,
  }: {
    UserId: string;
    ProductId: string;
  }) {
    return await this.collection().insertOne({
      UserId: new ObjectId(UserId),
      ProductId: new ObjectId(ProductId),
    });
  }
  static async getWishlist() {
    return await this.collection()
      .aggregate([
        {
          $lookup: {
            from: "Products",
            localField: "ProductId",
            foreignField: "_id",
            as: "DetailProduct",
          },
        },
        {
          $unwind: {
            path: "$DetailProduct",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
  }
  static async getWishlistByUserId(UserId: string) {
    return await this.collection()
      .aggregate([
        {
          $match: {
            UserId: new ObjectId(UserId),
          },
        },
        {
          $lookup: {
            from: "Products",
            localField: "ProductId",
            foreignField: "_id",
            as: "DetailProduct",
          },
        },
        {
          $unwind: {
            path: "$DetailProduct",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
  }
  static async getWishlistByUserIdProductId(UserId: string, ProductId: string) {
    return await this.collection().findOne({
      $and: [
        {
          UserId: new ObjectId(UserId),
        },
        {
          ProductId: new ObjectId(ProductId),
        },
      ],
    });
  }
  static async delWishlist(id: string) {
    return this.collection().deleteOne({ _id: new ObjectId(id) });
  }

  static async deleteWishlistByProductId(ProductId: string) {
    return this.collection().deleteMany({ ProductId: new ObjectId(ProductId) });
  }
}

export default WishlistModel;
