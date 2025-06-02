import CartModel from "@/db/models/CartModel";
import ProductModel from "@/db/models/ProductModel";
import WishlistModel from "@/db/models/WishlistModel";
import errorHandler from "@/helpers/errorHandler";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, thumbnail, stock, category } =
      await request.json();

    // console.log(name, description, price, thumbnail, stock, category);

    const data = await ProductModel.addProduct({
      name,
      description,
      price,
      thumbnail,
      stock,
      category,
    });
    return Response.json({
      message: "Product added successfully",
      status: 201,
      data,
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, name, description, price, thumbnail, stock, category } =
      await request.json();

    const data = await ProductModel.updateProduct({
      productId,
      name,
      description,
      price,
      thumbnail,
      stock,
      category,
    });

    return Response.json({
      message: "Product updated successfully",
      status: 200,
      data,
    });
  } catch (error: unknown) {
    return errorHandler(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { productId } = await request.json();

    const response = await ProductModel.delProduct(productId);

    //delete wishlist associated with the product
    await WishlistModel.deleteWishlistByProductId(productId);

    //delete carts associated with the product
    await CartModel.deleteCartByProductId(productId);

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    return errorHandler(error);
  }
}
