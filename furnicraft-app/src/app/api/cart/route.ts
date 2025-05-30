import CartModel from '@/db/models/CartModel'
import ProductModel from '@/db/models/ProductModel'
import errorHandler from '@/helpers/errorHandler'
import { type NextRequest } from 'next/server'

export async function POST(request : NextRequest) {

  try {
    
    const {ProductId, quantity} = await request.json()
    
    const UserId = request.headers.get('x-user-id')
    if (!UserId) throw {status : 400, message : 'User ID is required'}

    // ceck stock product
    const stock = await ProductModel.getStockById(ProductId)

    if (stock === 0) throw {status : 400, message : 'Product is out of stock'}

    if (!ProductId) throw {status : 400, message : 'Product ID not found'}

    const isAdded = await CartModel.getCartByUserIdProductId(UserId,ProductId)

    if (isAdded) {
      await CartModel.incrementCartQuantity(String(isAdded._id))
      return Response.json({message : 'Success Add to Cart'})
    }

    await CartModel.addCart({UserId, ProductId, quantity})

    return Response.json({message : 'Success Add to Cart'})

  } catch (error : unknown) {
    return errorHandler(error)
  }

}

export async function GET(request : NextRequest) {

  try {
    const UserId = request.headers.get('x-user-id') || ""
    if (!UserId) throw {status : 400, message : 'User ID not found'}

    const response = await CartModel.getCartByUserId(UserId)
    return Response.json(response)
  } catch (error) {
    return errorHandler(error)
  }

}

export async function DELETE(request : NextRequest) {
  try {
    const {orderId} = await request.json()

    const response = await CartModel.delCart(orderId)

    return Response.json({message : 'Deleted Success'})

  } catch (error) {
    return errorHandler(error)
  }
}