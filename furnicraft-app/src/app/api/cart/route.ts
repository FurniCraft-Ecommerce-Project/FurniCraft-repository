import CartModel from '@/db/models/CartModel'
import errorHandler from '@/helpers/errorHandler'
import { type NextRequest } from 'next/server'

export async function POST(request : NextRequest) {

  try {
    
    const {UserId, ProductId, quantity} = await request.json()

    const isAdded = await CartModel.getCartByUserIdProductId(UserId,ProductId)

    if (isAdded) throw {status : 400, message : 'You already added this product to cart'}
  
    const data = await CartModel.addCart({UserId, ProductId, quantity})

    return Response.json({message : 'Success Add to Cart'})

  } catch (error : unknown) {
    return errorHandler(error)
  }

}

export async function GET() {

  try {
    const response = await CartModel.getCart()
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