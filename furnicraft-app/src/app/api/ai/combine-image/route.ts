import errorHandler from "@/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import FormData from 'form-data';
import { v2 as cloudinary,UploadApiResponse } from 'cloudinary';
import { PassThrough } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// Utility: download image from URL and return buffer
async function downloadImageBuffer(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}


export async function POST(request: NextRequest) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const prompt = "Place the furniture from the first image realistically into the room shown in the second image, matching the lighting, shadows, perspective, and style of the room so that the furniture looks naturally integrated.";

    const { urlImageFurniture, urlImageRoom } = await request.json();

    // Download both images as buffers
    const [furnitureBuffer, roomBuffer] = await Promise.all([
      downloadImageBuffer(urlImageFurniture),
      downloadImageBuffer(urlImageRoom),
    ]);

    // Prepare form data using buffers (as streams)
    const form = new FormData();
    const furnitureStream = new PassThrough();
    furnitureStream.end(furnitureBuffer);
    form.append("image[]", furnitureStream, { filename: "furniture.png", contentType: "image/png" });

    const roomStream = new PassThrough();
    roomStream.end(roomBuffer);
    form.append("image[]", roomStream, { filename: "room.png", contentType: "image/png" });

    form.append("prompt", prompt);
    form.append("model", "gpt-image-1");
    form.append("size", "1536x1024");
    form.append("quality", "low");
    form.append("background", "opaque");

    const response = await axios.post("https://api.openai.com/v1/images/edits", form, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
    });

    const base64 = response.data.data[0].b64_json;

    // No need to write to file; pass buffer directly to Cloudinary
    const buffer = Buffer.from(base64, "base64");

    // Upload to Cloudinary using buffer stream
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "uploads",
          transformation: [
            { width: 1000, height: 1000, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        }
      );

      const resultStream = new PassThrough();
      resultStream.end(buffer);
      resultStream.pipe(uploadStream);
    });

    return NextResponse.json(uploadResult.url);

  } catch (error) {
    return errorHandler(error);
  }
}


//! use local directory
// import errorHandler from "@/helpers/errorHandler";
// import { NextRequest, NextResponse } from "next/server";

// import fs from 'fs';
// import path from 'path';
// import axios from 'axios';
// import FormData from 'form-data';
// import { v2 as cloudinary,UploadApiResponse } from 'cloudinary';


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// // Utility: download image from URL and save locally
// async function downloadImage(url: string, outputPath: string): Promise<void> {
//   const response = await axios.get(url, { responseType: 'arraybuffer' });
//   fs.writeFileSync(outputPath, Buffer.from(response.data));
// }

// async function uploadLocalFileToCloudinary(localFilePath: string): Promise<UploadApiResponse> {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: 'image',
//         folder: 'uploads',
//         transformation: [
//           { width: 1000, height: 1000, crop: 'limit' },
//           { quality: 'auto' },
//           { fetch_format: 'auto' }
//         ]
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result as UploadApiResponse);
//       }
//     );

//     // Baca file lokal sebagai stream dan pipe ke Cloudinary
//     const fileStream = fs.createReadStream(localFilePath);
//     fileStream.pipe(uploadStream);
//   });
// }

// export async function POST(request: NextRequest) {
//     try {

//         const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
//         const outputDir = "combined_results";
//         const prompt = "Place the furniture from the first image realistically into the room shown in the second image, matching the lighting, shadows, perspective, and style of the room so that the furniture looks naturally integrated.";

//         const {urlImageFurniture, urlImageRoom} = await request.json()

//         // Image URLs
//         const imageUrls: string[] = [
//             urlImageFurniture, // Replace with actual URL
//             urlImageRoom,      // Replace with actual URL
//         ];

//         // Corresponding local filenames
//         const localImagePaths: string[] = [
//             "furniture_downloaded.png",
//             "room_downloaded.png"
//         ];

//         // Create output directory if not exists
//         if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

//         // Download all images
//         await Promise.all(
//         imageUrls.map((url, i) => downloadImage(url, localImagePaths[i]))
//         );

//         // Prepare form data
//         const form = new FormData();
//         localImagePaths.forEach((imgPath) => {
//         form.append("image[]", fs.createReadStream(imgPath));
//         });

//         form.append("prompt", prompt);
//         form.append("model", "gpt-image-1");
//         form.append("size", "1536x1024");
//         form.append("quality", "low");
//         form.append("background", "opaque");

//         // console.log("🧠 Sending request to OpenAI API...");

//         const response = await axios.post("https://api.openai.com/v1/images/edits", form, {
//         headers: {
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//             ...form.getHeaders(),
//         },
//         });

//         const base64 = response.data.data[0].b64_json;
//         const filename = "furniture-room-scene.png"
//         const outputPath = path.join(outputDir, filename);
//         fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
//         // console.log("✅ Combined image saved as", outputPath);

//         const filePath = path.resolve('combined_results/furniture-room-scene.png');
//         const result = await uploadLocalFileToCloudinary(filePath);
//         // console.log('✅ Upload berhasil:', result);

//         return NextResponse.json(result.url);

//     } catch (error) {
//         return errorHandler(error)
//     }
// }

