import errorHandler from '@/helpers/errorHandler';
import waitForModel from '@/helpers/waitForModel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      throw { message: 'Image URL is required', status: 400 };
    }

    const payload = {
      image_url: imageUrl,
      enable_pbr: true,
      should_remesh: true,
      should_texture: true,
    };

    const response = await fetch('https://api.meshy.ai/openapi/v1/image-to-3d', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { message: errorData.message || 'Failed to initiate 3D model generation', status: response.status };
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return errorHandler(error)
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    throw { message: 'Missing taskId', status: 400 };
  }

  try {
     const data = await waitForModel(taskId);
    return NextResponse.json(data);
  } catch (error) {
    return errorHandler(error);
  }
}
