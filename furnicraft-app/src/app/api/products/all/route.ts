import ProductModel from "@/db/models/ProductModel"

export async function GET() {
  const data = await ProductModel.getProductAll()
  return Response.json(data)
}