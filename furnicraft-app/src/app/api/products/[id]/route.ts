import ProductModel from "@/db/models/ProductModel"
import errorHandler from "@/helpers/errorHandler"

export async function GET (request : Request, {params} : {params : Promise<{id : string}>}) {
    try {
        const {id} = await params
        const product = await ProductModel.getProductById(id)

        if (!product) throw {status : 404, message : 'Data Not Found'}

        return Response.json(product)

    } catch (error) {
        return errorHandler(error)
    }
}