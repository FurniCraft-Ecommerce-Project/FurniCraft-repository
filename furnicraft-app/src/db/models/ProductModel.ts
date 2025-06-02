import { ObjectId } from "mongodb";
import { db } from "../config/mongodb";

class ProductModel {
  static collection() {
    return db.collection("Products");
  }

  static async getProductAll() {
    try {
      const data = await this.collection().find().toArray();

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getProductPagination({
    page,
    name,
  }: {
    page: string;
    name: string;
  }) {
    try {
      const limit = 9;
      const skip = limit * (+page - 1);

      const arrQueryName = name
        .trim()
        .split(" ")
        .map((el) => ({ name: { $regex: el, $options: "i" } }));

      const data = await this.collection()
        .find({
          $and: arrQueryName,
        })
        .skip(skip)
        .limit(limit)
        .toArray();

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(id: string) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async addProduct({
    name,
    description,
    price,
    thumbnail,
    stock,
    category,
  }: {
    name: string;
    description: string;
    price: number;
    thumbnail: string;
    stock: number;
    category: string;
  }) {
    //buat validasi untuk memastikan semua field tidak kosong
    if (
      !name ||
      !description ||
      !price ||
      !thumbnail ||
      stock === undefined ||
      !category
    ) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    return await this.collection().insertOne({
      name,
      description,
      price,
      thumbnail,
      stock,
      category,
    });
  }

  //buat untuk update produk
  static async updateProduct({
    productId,
    name,
    description,
    price,
    thumbnail,
    stock,
    category,
  }: {
    productId: string;
    name: string;
    description: string;
    price: number;
    thumbnail: string;
    stock: number;
    category: string;
  }) {
    // console.log(productId)
    //buat validasi untuk memastikan semua field tidak kosong
    if (
      !productId ||
      !name ||
      !description ||
      !price ||
      !thumbnail ||
      stock === undefined ||
      !category
    ) {
      throw {
        status: 400,
        message: "All fields are required",
      };
    }

    //1. cari dulu produk berdasarkan id
    const product = await this.getProductById(productId);

    //2. jika produk tidak ditemukan, lempar error
    if (!product) {
      throw {
        status: 404,
        message: "Product not found",
      };
    }

    //3. update produk
    return this.collection().updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          name,
          description,
          price,
          thumbnail,
          stock,
          category,
        },
      }
    );
  }

  static async delProduct(id: string) {
    //1. cari dulu produk berdasarkan id
    const product = await this.getProductById(id);

    //2. jika produk tidak ditemukan, lempar error
    if (!product) {
      throw {
        status: 404,
        message: "Product not found",
      };
    }

    return this.collection().deleteOne({ _id: new ObjectId(id) });
  }

  static async getStockById(id: string) {
    const product = await this.getProductById(id);
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }
    return product.stock;
  }

  // buat function yang menerima array of product IDs dan quantity beli lalu mengecek jumlah stok untuk setiap produk, jika stok tidak mencukupi, lempar error
  static async checkStockByIds(ids: string[], quantities: number[]) {
    if (ids.length !== quantities.length) {
      throw {
        status: 400,
        message: "Product IDs and quantities must have the same length",
      };
    }

    const products = await this.collection()
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (product.stock < quantities[i]) {
        throw {
          status: 400,
          message: `Stock for product ${product.name} is not sufficient, stock is ${product.stock}`,
        };
      }
    }

    return true;
  }
}

export default ProductModel;
