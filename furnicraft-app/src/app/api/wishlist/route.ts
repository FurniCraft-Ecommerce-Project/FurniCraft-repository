import WishlistModel from '@/db/models/WishlistModel'
import errorHandler from '@/helpers/errorHandler'
import { type NextRequest } from 'next/server'

export async function POST(request : NextRequest) {
    try {
    
    const {ProductId} = await request.json()

    const UserId = request.headers.get('x-user-id')

    if (!UserId) throw {status : 400, message : 'User ID not found'}

    const isAdded = await WishlistModel.getWishlistByUserIdProductId(UserId,ProductId)

    if (isAdded) throw {status : 400, message : 'You already added this product to wishlist'}
  
    await WishlistModel.addWishlist({UserId, ProductId})

    return Response.json({message : 'Success Add to Wishlist', status : 201})

  } catch (error : unknown) {
    return errorHandler(error)
  }

}

export async function GET(request : NextRequest) {

  try {
    const UserId = request.headers.get('x-user-id') || ""
    
    if (!UserId) throw {status : 400, message : 'User ID not found'}

    const response = await WishlistModel.getWishlistByUserId(UserId)
    return Response.json(response)
  } catch (error) {
    return errorHandler(error)
  }

}

export async function DELETE(request : NextRequest) {
  try {
    const {wishlistId} = await request.json()

    await WishlistModel.delWishlist(wishlistId)

    return Response.json({message : 'Deleted Success', status : 200})

  } catch (error) {
    return errorHandler(error)
  }
}