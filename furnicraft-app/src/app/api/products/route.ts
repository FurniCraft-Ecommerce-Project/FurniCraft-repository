import ProductModel from "@/db/models/ProductModel"
import errorHandler from "@/helpers/errorHandler"
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || "1"
  const name = searchParams.get('name') || ""

  const data = await ProductModel.getProductPagination({ page, name })
  return Response.json(data)
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, image3dUrl } = body

    const product = await ProductModel.updateProductById(id, image3dUrl)
    if (!product) throw { status: 404, message: 'Data Not Found' }
    return Response.json({ message: 'Product updated successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}