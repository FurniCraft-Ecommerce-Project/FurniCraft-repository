import errorHandler from "@/helpers/errorHandler";
import cloudinary from "@/lib/cloudinary";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { productId, glbUrl } = body

        if (!productId || !glbUrl) throw { message: 'Image URL or product ID is required', status: 400 };

        const meshRes = await fetch(glbUrl);
        if (!meshRes.ok) {
            throw { message: 'Failed to fetch GLB file', status: 500 };
        }

        const arrayBuffer = await meshRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        interface CloudinaryResult {
            secure_url: string;
            public_id: string;
        }

        const result = await new Promise<CloudinaryResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    public_id: productId,
                    overwrite: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryResult);
                }
            );
            uploadStream.end(buffer);
        });


        return Response.json({
            message: 'Uploaded successfully',
            deliveryUrl: result.secure_url,
            publicId: result.public_id,
        });


    } catch (error) {
        return errorHandler(error)
    }
}