import CartModel from "@/db/models/CartModel";
import errorHandler from "@/helpers/errorHandler";

export async function PATCH(request: Request) {
    const { productId, action } = await request.json();
    const UserId = request.headers.get('x-user-id')

    if (!UserId) {
        throw ({ message: "User ID is required", status: 401 });
    }

    if (!["increment", "decrement"].includes(action)) {
        throw ({ message: "Invalid action", status: 400 });
    }

    const cart = await CartModel.getCartByUserIdProductId(UserId, productId);
    
    if (!cart) {
        throw ({ message: "Cart not found", status: 404 });
    }
    try {
        if (action === "increment") {
            await CartModel.incrementCartQuantity(String(cart._id));
        } else if (action === "decrement") {
            if (cart.quantity <= 1) {
                await CartModel.delCart(String(cart._id));
            } else {
                await CartModel.decrementCartQuantity(String(cart._id));
            }
        }
        return Response.json({ message: "Quantity updated successfully" });
    } catch (error) {
        return errorHandler(error)
    }
}