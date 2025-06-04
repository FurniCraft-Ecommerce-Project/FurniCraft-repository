import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file ke buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'uploads', // Optional: organize dalam folder
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Resize jika terlalu besar
            { quality: 'auto' }, // Optimize quality
            { fetch_format: 'auto' } // Format terbaik untuk browser
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Option 1: Return URL biasa (default Cloudinary)
    const standardResponse = {
      success: true,
      url: (result as any).secure_url, // Ini URL biasa, bukan base64
      public_id: (result as any).public_id,
      width: (result as any).width,
      height: (result as any).height,
    };

    // Option 2: Generate base64 setelah upload
    const includeBase64 = request.nextUrl.searchParams.get('base64') === 'true';
    
    if (includeBase64) {
      try {
        // Fetch uploaded image dan convert ke base64
        const imageResponse = await fetch((result as any).secure_url);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64String = Buffer.from(imageBuffer).toString('base64');
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
        const base64DataUri = `data:${mimeType};base64,${base64String}`;

        return NextResponse.json({
          ...standardResponse,
          base64: {
            string: base64String,
            dataUri: base64DataUri,
            size: imageBuffer.byteLength
          }
        });
      } catch (base64Error) {
        console.error('Base64 conversion error:', base64Error);
        // Return standard response jika base64 gagal
        return NextResponse.json(standardResponse);
      }
    }

    return NextResponse.json(standardResponse);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}